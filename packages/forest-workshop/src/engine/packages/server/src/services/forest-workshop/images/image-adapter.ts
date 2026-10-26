// Turns a picture the user picked into a stored resident image (plan §6, §8.1):
// validated bytes → decoder check → static WebP at quality 95 with alpha kept → Global Gallery → `global-gallery:<id>`.
//
// The input PNG/WebP lives only in memory for this request; nothing writes it to disk, so no PNG original is kept.
// No image is generated: this file never calls avatar generation or integrations.images.*.
//
// The gallery is reached with app.inject, in process, carrying the caller's own credentials, origin and address.
// The gallery route therefore applies exactly the authentication, CSRF and rate rules it would apply to the
// browser itself. No localhost URL, admin secret or internal-route token is used to widen access.
import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyRequest } from "fastify";
import sharp from "sharp";
import { MAX_PIXELS, type ResidentImageInput, type ResidentImageInputError } from "./image-input";

export const WEBP_QUALITY = 95;

type SharpImage = ReturnType<typeof sharp>;
type SharpMetadata = Awaited<ReturnType<SharpImage["metadata"]>>;

export class ResidentImageError extends Error {
  readonly code: ResidentImageInputError | "alpha_lost" | "gallery_upload_failed";
  readonly status: number;

  constructor(code: ResidentImageError["code"], message: string, status = 400) {
    super(message);
    this.name = "ResidentImageError";
    this.code = code;
    this.status = status;
  }
}

export interface ConvertedResidentImage {
  webp: Buffer;
  width: number;
  height: number;
  hasTransparency: boolean;
  inputBytes: number;
  outputBytes: number;
}

async function hasTransparentPixel(image: SharpImage): Promise<boolean> {
  const { channels } = await image.stats();
  const alpha = channels[3];
  return Boolean(alpha && alpha.min < 255);
}

/** Decodes the checked input once more with the real decoder, then encodes the WebP and verifies what came out. */
export async function convertResidentImage(buffer: Buffer, input: ResidentImageInput): Promise<ConvertedResidentImage> {
  const decoderOptions = { limitInputPixels: MAX_PIXELS, failOn: "error" as const };
  let metadata: SharpMetadata;
  try {
    metadata = await sharp(buffer, { ...decoderOptions, animated: true }).metadata();
  } catch {
    throw new ResidentImageError("corrupt", "그림 파일을 해석하지 못했습니다.");
  }
  if (metadata.format !== input.format || metadata.width !== input.width || metadata.height !== input.height) {
    throw new ResidentImageError("corrupt", "파일 머리 정보와 실제 그림 내용이 일치하지 않습니다.");
  }
  if ((metadata.pages ?? 1) > 1) {
    throw new ResidentImageError("animated", "움직이는 그림은 지원하지 않습니다.");
  }

  let webp: Buffer;
  let transparentInput: boolean;
  try {
    transparentInput = metadata.hasAlpha ? await hasTransparentPixel(sharp(buffer, decoderOptions)) : false;
    webp = await sharp(buffer, decoderOptions).webp({ quality: WEBP_QUALITY, alphaQuality: 100 }).toBuffer();
  } catch {
    throw new ResidentImageError("corrupt", "그림을 WebP로 변환하지 못했습니다.");
  }

  const output = await sharp(webp).metadata();
  if (output.format !== "webp" || output.width !== input.width || output.height !== input.height) {
    throw new ResidentImageError("corrupt", "변환된 WebP를 다시 확인하지 못했습니다.", 500);
  }
  // A transparent resident must stay transparent: losing alpha would paint a box behind them on every scene.
  if (transparentInput && !(output.hasAlpha && (await hasTransparentPixel(sharp(webp))))) {
    throw new ResidentImageError("alpha_lost", "변환 중 투명도가 사라져 저장하지 않았습니다.", 500);
  }
  return {
    webp,
    width: input.width,
    height: input.height,
    hasTransparency: transparentInput,
    inputBytes: buffer.byteLength,
    outputBytes: webp.byteLength,
  };
}

/** Request headers that carry the caller's identity, origin and authentication. Nothing else is forwarded. */
const FORWARDED_HEADERS = [
  "authorization",
  "cookie",
  "host",
  "origin",
  "referer",
  "sec-fetch-site",
  "user-agent",
  "x-admin-secret",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-marinara-csrf",
] as const;

export function callerHeaders(request: FastifyRequest): Record<string, string> {
  const headers: Record<string, string> = {};
  for (const name of FORWARDED_HEADERS) {
    const value = request.headers[name];
    const first = Array.isArray(value) ? value[0] : value;
    if (typeof first === "string" && first.length > 0) headers[name] = first;
  }
  return headers;
}

function multipartBody(boundary: string, fields: Record<string, string>, file: Buffer, filename: string) {
  const parts: Buffer[] = [];
  for (const [name, value] of Object.entries(fields)) {
    parts.push(
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`, "utf8"),
    );
  }
  parts.push(
    Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: image/webp\r\n\r\n`,
      "utf8",
    ),
    file,
    Buffer.from(`\r\n--${boundary}--\r\n`, "utf8"),
  );
  return Buffer.concat(parts);
}

export interface GalleryImage {
  id: string;
  url: string;
}

export async function uploadToGlobalGallery(
  app: FastifyInstance,
  request: FastifyRequest,
  image: ConvertedResidentImage,
): Promise<GalleryImage> {
  const boundary = `forest-workshop-${randomUUID()}`;
  const response = await app.inject({
    method: "POST",
    url: "/api/global-gallery/upload",
    remoteAddress: request.ip,
    headers: { ...callerHeaders(request), "content-type": `multipart/form-data; boundary=${boundary}` },
    payload: multipartBody(
      boundary,
      { provider: "forest-workshop-upload", width: String(image.width), height: String(image.height) },
      image.webp,
      `forest-workshop-${randomUUID()}.webp`,
    ),
  });
  let body: unknown = null;
  try {
    body = response.json();
  } catch {
    body = null;
  }
  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  if (response.statusCode < 200 || response.statusCode >= 300) {
    const reason = typeof record.error === "string" ? record.error : `HTTP ${response.statusCode}`;
    throw new ResidentImageError("gallery_upload_failed", `전역 갤러리 저장에 실패했습니다: ${reason}`, 502);
  }
  const id = typeof record.id === "string" ? record.id.trim() : "";
  const url = typeof record.url === "string" ? record.url.trim() : "";
  if (!id || !url) {
    throw new ResidentImageError("gallery_upload_failed", "전역 갤러리가 그림 ID를 돌려주지 않았습니다.", 502);
  }
  return { id, url };
}

/** Removes a gallery image this request uploaded but could not reference. Reports instead of throwing, because the
 *  caller is already handling a failure; an image it cannot remove is returned to the caller as an orphan. */
export async function removeUnreferencedGalleryImage(
  app: FastifyInstance,
  request: FastifyRequest,
  imageId: string,
): Promise<boolean> {
  try {
    const response = await app.inject({
      method: "DELETE",
      url: `/api/global-gallery/${encodeURIComponent(imageId)}`,
      remoteAddress: request.ip,
      headers: callerHeaders(request),
    });
    return response.statusCode >= 200 && response.statusCode < 300;
  } catch {
    return false;
  }
}

export function galleryReference(imageId: string): string {
  return `global-gallery:${imageId}`;
}
