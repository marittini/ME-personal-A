// Forest Workshop server entry (P0 connection proof). Registers the package's own routes under /api/forest-workshop
// and nothing else: no agent runtime, prompt context, tools or chat writes. The game itself starts in P1.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
// Types only: the Engine registers @fastify/multipart on its root app, which gives requests `file()`.
import type {} from "@fastify/multipart";
import {
  API_PREFIX,
  PACKAGE_ID,
  describeHost,
  missingRequiredHostMembers,
  type HostDocumentRecord,
  type HostRuntime,
} from "./engine-adapter";
import {
  ResidentImageError,
  WEBP_QUALITY,
  convertResidentImage,
  galleryReference,
  removeUnreferencedGalleryImage,
  uploadToGlobalGallery,
} from "./image-adapter";
import { MAX_INPUT_BYTES, RESIDENT_IMAGE_INPUT_MESSAGES, inspectResidentImageInput } from "./image-input";
import { runP0Probe } from "./p0-probe";

const PACKAGE_VERSION = "0.1.0";
const IMAGE_SLOT_ID = "fw-p0-image-slot";
const IMAGE_SLOT_KIND = "fw-p0";
const IMAGE_HISTORY_LIMIT = 3;
const SAVE_ATTEMPTS = 3;
const UPLOAD_KEY_PATTERN = /^[A-Za-z0-9-]{8,64}$/u;

interface StoredImage {
  reference: string;
  url: string;
  width: number;
  height: number;
  hasTransparency: boolean;
  inputBytes: number;
  outputBytes: number;
  quality: number;
  imageVersion: number;
  uploadKey: string;
  uploadedAt: string;
}

interface ImageSlotData {
  schemaVersion: 1;
  current: StoredImage | null;
  /** Earlier pictures, newest first. Their references stay in the document so the gallery keeps the files. */
  history: StoredImage[];
}

interface ActivationContext {
  app: FastifyInstance;
  api: {
    runtime: HostRuntime;
    registerPrivilegedRoutes(
      routes: (router: FastifyInstance) => Promise<void>,
      options: { prefix: string },
    ): Promise<() => void>;
  };
}

function sendError(reply: FastifyReply, status: number, code: string, message: string) {
  return reply.status(status).send({ error: code, message });
}

function readSlot(record: HostDocumentRecord | null): ImageSlotData {
  const data = record?.data as Partial<ImageSlotData> | undefined;
  return {
    schemaVersion: 1,
    current: data?.current ?? null,
    history: Array.isArray(data?.history) ? data.history : [],
  };
}

type SaveResult =
  { kind: "saved"; image: StoredImage } | { kind: "duplicate"; image: StoredImage } | { kind: "conflict" };

/** Writes the new picture with compare-and-swap. The previous picture moves to history; nothing is deleted. */
async function saveImage(runtime: HostRuntime, image: StoredImage): Promise<SaveResult> {
  const documents = runtime.persistence!.documents;
  for (let attempt = 0; attempt < SAVE_ATTEMPTS; attempt += 1) {
    const record = await documents.getById(PACKAGE_ID, IMAGE_SLOT_ID);
    const slot = readSlot(record);
    if (slot.current?.uploadKey === image.uploadKey) return { kind: "duplicate", image: slot.current };
    const next: ImageSlotData = {
      schemaVersion: 1,
      current: { ...image, imageVersion: (slot.current?.imageVersion ?? 0) + 1 },
      history: [...(slot.current ? [slot.current] : []), ...slot.history].slice(0, IMAGE_HISTORY_LIMIT),
    };
    const now = new Date().toISOString();
    if (!record) {
      try {
        await documents.create({
          id: IMAGE_SLOT_ID,
          packageId: PACKAGE_ID,
          kind: IMAGE_SLOT_KIND,
          name: "Forest Workshop P0 resident image check",
          description: "Resident picture stored by the P0 upload check.",
          data: next,
          createdAt: now,
          updatedAt: now,
        });
        return { kind: "saved", image: next.current! };
      } catch {
        continue; // Another tab created the slot first; read it again.
      }
    }
    const updated = await documents.update({
      id: IMAGE_SLOT_ID,
      packageId: PACKAGE_ID,
      expectedRevision: record.revision,
      name: record.name,
      description: record.description,
      data: next,
      updatedAt: now,
    });
    if (updated) return { kind: "saved", image: next.current! };
  }
  return { kind: "conflict" };
}

export async function activate({ app, api }: ActivationContext) {
  const runtime = api.runtime;
  const missing = missingRequiredHostMembers(runtime);
  if (missing.length) throw new Error(`Forest Workshop needs a newer Marinara Engine (missing ${missing.join(", ")})`);

  return api.registerPrivilegedRoutes(
    async (router) => {
      router.get("/p0/status", async () => ({
        packageId: PACKAGE_ID,
        version: PACKAGE_VERSION,
        stage: "P0",
        host: describeHost(runtime),
        imageRules: {
          inputFormats: ["image/png", "image/webp"],
          maxInputBytes: MAX_INPUT_BYTES,
          maxDimension: 4096,
          maxPixels: 16_777_216,
          storedFormat: "image/webp",
          quality: WEBP_QUALITY,
        },
      }));

      router.post("/p0/probe", async () => runP0Probe(runtime));

      router.get("/p0/image", async () => {
        const slot = readSlot(await runtime.persistence!.documents.getById(PACKAGE_ID, IMAGE_SLOT_ID));
        return { current: slot.current, historyCount: slot.history.length };
      });

      router.post("/p0/image", async (request: FastifyRequest, reply: FastifyReply) => {
        let file;
        try {
          file = await request.file({ limits: { fileSize: MAX_INPUT_BYTES, files: 1 } });
        } catch {
          return sendError(reply, 400, "invalid_upload", "업로드 요청을 읽지 못했습니다.");
        }
        if (!file) return sendError(reply, 400, "empty", RESIDENT_IMAGE_INPUT_MESSAGES.empty);
        const fields = file.fields as Record<string, { value?: unknown } | undefined>;
        const uploadKey = typeof fields.uploadKey?.value === "string" ? fields.uploadKey.value : "";
        if (!UPLOAD_KEY_PATTERN.test(uploadKey)) {
          return sendError(reply, 400, "invalid_upload_key", "업로드 키가 없거나 형식이 잘못되었습니다.");
        }

        let buffer: Buffer;
        try {
          buffer = await file.toBuffer();
        } catch {
          return sendError(reply, 413, "too_large", RESIDENT_IMAGE_INPUT_MESSAGES.too_large);
        }
        const inspected = inspectResidentImageInput(buffer);
        if (!inspected.ok) {
          const status = inspected.error === "too_large" ? 413 : 400;
          return sendError(reply, status, inspected.error, RESIDENT_IMAGE_INPUT_MESSAGES[inspected.error]);
        }

        // A retried request whose first attempt already saved returns that result instead of uploading again.
        const existing = readSlot(await runtime.persistence!.documents.getById(PACKAGE_ID, IMAGE_SLOT_ID));
        if (existing.current?.uploadKey === uploadKey) return { image: existing.current, duplicate: true };

        let converted;
        let gallery;
        try {
          converted = await convertResidentImage(buffer, inspected.image);
          gallery = await uploadToGlobalGallery(app, request, converted);
        } catch (error) {
          if (error instanceof ResidentImageError) return sendError(reply, error.status, error.code, error.message);
          runtime.logger?.error(error, "[forest-workshop] resident image conversion failed");
          return sendError(reply, 500, "image_failed", "그림을 저장하지 못했습니다. 기존 그림은 그대로입니다.");
        }

        const stored: StoredImage = {
          reference: galleryReference(gallery.id),
          url: gallery.url,
          width: converted.width,
          height: converted.height,
          hasTransparency: converted.hasTransparency,
          inputBytes: converted.inputBytes,
          outputBytes: converted.outputBytes,
          quality: WEBP_QUALITY,
          imageVersion: 0,
          uploadKey,
          uploadedAt: new Date().toISOString(),
        };
        let saved: SaveResult;
        try {
          saved = await saveImage(runtime, stored);
        } catch (error) {
          runtime.logger?.error(error, "[forest-workshop] resident image reference save failed");
          saved = { kind: "conflict" };
        }
        if (saved.kind === "saved") return { image: saved.image, duplicate: false };

        // The new gallery image is referenced by nothing; remove it so it does not linger. If that fails it is
        // reported as an orphan for later cleanup. The previous picture is untouched either way.
        const removed = await removeUnreferencedGalleryImage(app, request, gallery.id);
        if (saved.kind === "duplicate") return { image: saved.image, duplicate: true, orphanRemoved: removed };
        return reply.status(409).send({
          error: "save_conflict",
          message: "다른 화면에서 동시에 그림을 바꿨습니다. 기존 그림은 그대로이며 다시 시도할 수 있습니다.",
          orphanGalleryImageId: removed ? null : gallery.id,
        });
      });
    },
    { prefix: API_PREFIX },
  );
}

export async function selfCheck({ api }: Pick<ActivationContext, "api">) {
  const missing = missingRequiredHostMembers(api.runtime);
  if (missing.length) throw new Error(`Forest Workshop host members are unavailable: ${missing.join(", ")}`);
  await api.runtime.persistence!.documents.getById(PACKAGE_ID, IMAGE_SLOT_ID);
}
