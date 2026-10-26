// Byte-level checks for a resident picture the user uploads (plan §8.1). They run before any decoder sees the
// file, so a renamed SVG, a truncated PNG, an APNG or an animated WebP is refused by what the bytes are, not by the
// extension or the MIME type the browser claims. The decoder check in image-adapter.ts runs afterwards.

export const MAX_INPUT_BYTES = 20 * 1024 * 1024;
export const MAX_DIMENSION = 4096;
export const MAX_PIXELS = 16_777_216;

export type ResidentImageInputError =
  "empty" | "too_large" | "unsupported_format" | "corrupt" | "animated" | "dimensions_too_large";

export interface ResidentImageInput {
  format: "png" | "webp";
  width: number;
  height: number;
}

export type ResidentImageInputResult =
  { ok: true; image: ResidentImageInput } | { ok: false; error: ResidentImageInputError };

/** Korean messages shown to the player; the code stays stable for tests and logs. */
export const RESIDENT_IMAGE_INPUT_MESSAGES: Record<ResidentImageInputError, string> = {
  empty: "빈 파일입니다. 다른 그림을 골라 주세요.",
  too_large: "파일이 20MiB를 넘습니다. 기존 그림은 그대로 유지됩니다.",
  unsupported_format: "PNG 또는 정적 WebP 그림만 올릴 수 있습니다.",
  corrupt: "그림 파일을 읽을 수 없습니다. 파일이 손상되었거나 확장자만 바뀐 파일일 수 있습니다.",
  animated: "움직이는 그림(APNG·애니메이션 WebP)은 지원하지 않습니다. 정지 그림을 골라 주세요.",
  dimensions_too_large: "그림 크기가 4096×4096 또는 16,777,216픽셀을 넘습니다.",
};

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function ascii(buffer: Uint8Array, start: number, length: number): string {
  let value = "";
  for (let index = start; index < start + length; index += 1) value += String.fromCharCode(buffer[index] ?? 0);
  return value;
}

function readUInt32BE(buffer: Uint8Array, offset: number): number {
  return (
    ((buffer[offset]! << 24) | (buffer[offset + 1]! << 16) | (buffer[offset + 2]! << 8) | buffer[offset + 3]!) >>> 0
  );
}

function readUInt32LE(buffer: Uint8Array, offset: number): number {
  return (
    (buffer[offset]! | (buffer[offset + 1]! << 8) | (buffer[offset + 2]! << 16) | (buffer[offset + 3]! << 24)) >>> 0
  );
}

function readUInt24LE(buffer: Uint8Array, offset: number): number {
  return buffer[offset]! | (buffer[offset + 1]! << 8) | (buffer[offset + 2]! << 16);
}

function inspectPng(buffer: Uint8Array): ResidentImageInputResult {
  let offset = 8;
  let width = 0;
  let height = 0;
  let sawImageData = false;
  let sawEnd = false;
  while (offset + 12 <= buffer.length) {
    const length = readUInt32BE(buffer, offset);
    const type = ascii(buffer, offset + 4, 4);
    const next = offset + 12 + length;
    if (next > buffer.length) return { ok: false, error: "corrupt" };
    if (offset === 8) {
      if (type !== "IHDR" || length !== 13) return { ok: false, error: "corrupt" };
      width = readUInt32BE(buffer, offset + 8);
      height = readUInt32BE(buffer, offset + 12);
    }
    // acTL announces an animated PNG. Reading only its first frame would drop the animation silently.
    if (type === "acTL" || type === "fcTL" || type === "fdAT") return { ok: false, error: "animated" };
    if (type === "IDAT") sawImageData = true;
    if (type === "IEND") {
      sawEnd = true;
      break;
    }
    offset = next;
  }
  if (!sawImageData || !sawEnd || width === 0 || height === 0) return { ok: false, error: "corrupt" };
  return { ok: true, image: { format: "png", width, height } };
}

function inspectWebp(buffer: Uint8Array): ResidentImageInputResult {
  const riffSize = readUInt32LE(buffer, 4);
  if (riffSize + 8 > buffer.length || riffSize < 12) return { ok: false, error: "corrupt" };
  const end = riffSize + 8;
  let offset = 12;
  let width = 0;
  let height = 0;
  while (offset + 8 <= end) {
    const type = ascii(buffer, offset, 4);
    const size = readUInt32LE(buffer, offset + 4);
    const data = offset + 8;
    if (data + size > end) return { ok: false, error: "corrupt" };
    if (type === "ANIM" || type === "ANMF") return { ok: false, error: "animated" };
    if (type === "VP8X") {
      if (size < 10) return { ok: false, error: "corrupt" };
      if ((buffer[data]! & 0x02) !== 0) return { ok: false, error: "animated" };
      width = readUInt24LE(buffer, data + 4) + 1;
      height = readUInt24LE(buffer, data + 7) + 1;
    } else if (type === "VP8 " && width === 0) {
      if (size < 10 || buffer[data + 3] !== 0x9d || buffer[data + 4] !== 0x01 || buffer[data + 5] !== 0x2a) {
        return { ok: false, error: "corrupt" };
      }
      width = (buffer[data + 6]! | (buffer[data + 7]! << 8)) & 0x3fff;
      height = (buffer[data + 8]! | (buffer[data + 9]! << 8)) & 0x3fff;
    } else if (type === "VP8L" && width === 0) {
      if (size < 5 || buffer[data] !== 0x2f) return { ok: false, error: "corrupt" };
      const bits = readUInt32LE(buffer, data + 1);
      width = (bits & 0x3fff) + 1;
      height = ((bits >>> 14) & 0x3fff) + 1;
    }
    offset = data + size + (size % 2);
  }
  if (width === 0 || height === 0) return { ok: false, error: "corrupt" };
  return { ok: true, image: { format: "webp", width, height } };
}

/** Decides from the bytes alone whether a file may become a resident picture. */
export function inspectResidentImageInput(buffer: Uint8Array): ResidentImageInputResult {
  if (buffer.length === 0) return { ok: false, error: "empty" };
  if (buffer.length > MAX_INPUT_BYTES) return { ok: false, error: "too_large" };
  let result: ResidentImageInputResult;
  if (buffer.length >= 8 && PNG_SIGNATURE.every((byte, index) => buffer[index] === byte)) {
    result = inspectPng(buffer);
  } else if (buffer.length >= 16 && ascii(buffer, 0, 4) === "RIFF" && ascii(buffer, 8, 4) === "WEBP") {
    result = inspectWebp(buffer);
  } else {
    return { ok: false, error: "unsupported_format" };
  }
  if (!result.ok) return result;
  const { width, height } = result.image;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION || width * height > MAX_PIXELS) {
    return { ok: false, error: "dimensions_too_large" };
  }
  return result;
}
