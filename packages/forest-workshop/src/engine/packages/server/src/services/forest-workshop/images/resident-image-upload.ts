// 파일 선택 · 교체 (board 04-2, plan §8.1): one picture for one resident.
//   bytes checked → decoder check → WebP 95 with alpha → Global Gallery → residents.setImage (internal command)
// Order matters: the world references the new picture only after the gallery stored it, and if the world write fails
// the new gallery file is removed again, so the previous picture stays and nothing dangles. The upload key is the
// command ID, so a retried upload that already saved returns that result without storing a second file.
// The PNG never touches disk; only the WebP is kept.
import type { FastifyInstance, FastifyRequest } from "fastify";
import type {} from "@fastify/multipart";
import { FwError } from "../domain/errors";
import { assertRequestId, assertWorldId } from "../domain/ids";
import type { ResidentImage } from "../domain/model/residents";
import type { HostDocumentStore, HostRuntime } from "../host/engine-adapter";
import type { CommandService } from "../services/command-service";
import { findCommandRecord } from "../store/command-log";
import { loadWorld } from "../store/world-repository";
import {
  ResidentImageError,
  convertResidentImage,
  galleryReference,
  removeUnreferencedGalleryImage,
  uploadToGlobalGallery,
} from "./image-adapter";
import { MAX_INPUT_BYTES, RESIDENT_IMAGE_INPUT_MESSAGES, inspectResidentImageInput } from "./image-input";

export const SET_IMAGE_COMMAND = "residents.setImage";

/** A display file name: no path, no control characters, at most 120 characters. */
export function cleanFileName(name: unknown): string {
  if (typeof name !== "string") return "";
  const base = name.split(/[\\/]/u).pop() ?? "";
  return base
    .replace(/[\u0000-\u001f\u007f]/gu, "")
    .trim()
    .slice(0, 120);
}

/** Thrown for a refused upload; the route answers with its status, code and Korean message. */
export class UploadRefused extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

function field(fields: Record<string, unknown>, name: string): unknown {
  const entry = fields[name] as { value?: unknown } | undefined;
  return entry?.value;
}

export interface ResidentImageUploadDeps {
  app: FastifyInstance;
  documents: HostDocumentStore;
  commands: CommandService;
  logger: HostRuntime["logger"];
}

export async function uploadResidentImage(deps: ResidentImageUploadDeps, request: FastifyRequest) {
  let file;
  try {
    file = await request.file({ limits: { fileSize: MAX_INPUT_BYTES, files: 1 } });
  } catch {
    throw new UploadRefused(400, "invalid_upload", "업로드 요청을 읽지 못했습니다.");
  }
  if (!file) throw new UploadRefused(400, "empty", RESIDENT_IMAGE_INPUT_MESSAGES.empty);
  const fields = file.fields as Record<string, unknown>;
  const worldId = assertWorldId(field(fields, "worldId"));
  const uploadKey = assertRequestId(field(fields, "uploadKey"), "업로드 키");
  const residentId = field(fields, "residentId");
  if (typeof residentId !== "string") throw new FwError("invalid_request");
  const identity = { residentId, uploadKey };

  const base = { worldId, commandId: uploadKey, type: SET_IMAGE_COMMAND, expectedRevision: 1 };
  // A retry of an upload that already saved: answer with that result; do not read or store the file again.
  if (await findCommandRecord(deps.documents, worldId, uploadKey)) {
    file.file.resume();
    return deps.commands.execute({ ...base, payload: {} }, { internal: true, identity });
  }
  const world = await loadWorld(deps.documents, worldId);
  if (!world.state.residents[residentId]) throw new FwError("resident_not_found");

  let buffer: Buffer;
  try {
    buffer = await file.toBuffer();
  } catch {
    throw new UploadRefused(413, "too_large", RESIDENT_IMAGE_INPUT_MESSAGES.too_large);
  }
  const inspected = inspectResidentImageInput(buffer);
  if (!inspected.ok) {
    throw new UploadRefused(
      inspected.error === "too_large" ? 413 : 400,
      inspected.error,
      RESIDENT_IMAGE_INPUT_MESSAGES[inspected.error],
    );
  }

  let converted;
  let gallery;
  try {
    converted = await convertResidentImage(buffer, inspected.image);
    gallery = await uploadToGlobalGallery(deps.app, request, converted);
  } catch (error) {
    if (error instanceof ResidentImageError) throw new UploadRefused(error.status, error.code, error.message);
    throw error;
  }

  const image: ResidentImage = {
    reference: galleryReference(gallery.id),
    url: gallery.url,
    width: converted.width,
    height: converted.height,
    bytes: converted.outputBytes,
    hasTransparency: converted.hasTransparency,
    fileName: cleanFileName(file.filename),
    uploadKey,
    uploadedAt: new Date().toISOString(),
  };
  let response;
  try {
    response = await deps.commands.execute(
      { ...base, expectedRevision: world.revision, payload: { residentId, image } },
      { internal: true, identity },
    );
  } catch (error) {
    const removed = await removeUnreferencedGalleryImage(deps.app, request, gallery.id);
    if (!removed) deps.logger?.warn("[forest-workshop] orphan gallery image %s after a failed save", gallery.id);
    throw error;
  }
  // Another request with this key won the race: ours is the spare copy.
  if (response.duplicate) await removeUnreferencedGalleryImage(deps.app, request, gallery.id);
  await releaseGalleryImages(deps, request, response.result.released);
  return { ...response, conversion: { inputBytes: converted.inputBytes, outputBytes: converted.outputBytes } };
}

/**
 * Pictures a command let go of (fell off the 3-picture history, or 그림 이력 정리). Each is removed from the gallery
 * only if the Engine agrees nothing else uses it; the Engine refuses to delete a referenced file, and that refusal
 * simply leaves the file in place. Best effort: a failure here never undoes the saved command.
 */
export async function releaseGalleryImages(
  deps: Pick<ResidentImageUploadDeps, "app" | "logger">,
  request: FastifyRequest,
  released: unknown,
) {
  if (!Array.isArray(released)) return;
  for (const reference of released) {
    if (typeof reference !== "string" || !reference.startsWith("global-gallery:")) continue;
    const removed = await removeUnreferencedGalleryImage(deps.app, request, reference.slice("global-gallery:".length));
    if (!removed) deps.logger?.info("[forest-workshop] kept gallery image %s (still in use or unavailable)", reference);
  }
}
