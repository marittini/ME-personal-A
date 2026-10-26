// Reads and stores the WebP files a backup carries (plan §6: 백업은 변환된 WebP·배치 설정·참조 이력을 포함).
// Both go through the Engine's own gallery routes in process, with the caller's credentials (see image-adapter.ts).
// A file arriving from a backup is checked like an upload: real WebP, static, within the size rules.
import type { FastifyInstance, FastifyRequest } from "fastify";
import sharp from "sharp";
import type { AssetStore, AssetReader } from "../services/backup-service";
import {
  ResidentImageError,
  callerHeaders,
  galleryReference,
  removeUnreferencedGalleryImage,
  uploadToGlobalGallery,
} from "./image-adapter";
import { MAX_DIMENSION, MAX_INPUT_BYTES, MAX_PIXELS } from "./image-input";

const GALLERY_FILE_PATH = /^\/api\/global-gallery\/file\/[A-Za-z0-9._-]+$/u;

export function galleryAssetReader(app: FastifyInstance, request: FastifyRequest): AssetReader {
  return async (image) => {
    const path = image.url.split("?")[0] ?? "";
    // Only the Engine's own gallery file route; a stored URL can never send this request anywhere else.
    if (!GALLERY_FILE_PATH.test(path)) throw new Error(`Unexpected gallery URL for ${image.reference}`);
    const response = await app.inject({
      method: "GET",
      url: path,
      remoteAddress: request.ip,
      headers: callerHeaders(request),
    });
    if (response.statusCode !== 200) throw new Error(`Gallery file ${image.reference} answered ${response.statusCode}`);
    return response.rawPayload;
  };
}

export function galleryAssetStore(app: FastifyInstance, request: FastifyRequest): AssetStore {
  return {
    async store(bytes) {
      if (bytes.byteLength === 0 || bytes.byteLength > MAX_INPUT_BYTES) throw new Error("asset size");
      let metadata;
      try {
        metadata = await sharp(bytes, { limitInputPixels: MAX_PIXELS, failOn: "error", animated: true }).metadata();
      } catch {
        throw new Error("asset is not a readable picture");
      }
      const width = metadata.width ?? 0;
      const height = metadata.height ?? 0;
      if (metadata.format !== "webp" || (metadata.pages ?? 1) > 1) throw new Error("asset is not a static WebP");
      if (!width || !height || width > MAX_DIMENSION || height > MAX_DIMENSION) throw new Error("asset dimensions");
      try {
        const gallery = await uploadToGlobalGallery(app, request, {
          webp: bytes,
          width,
          height,
          hasTransparency: Boolean(metadata.hasAlpha),
          inputBytes: bytes.byteLength,
          outputBytes: bytes.byteLength,
        });
        return { reference: galleryReference(gallery.id), url: gallery.url };
      } catch (error) {
        if (error instanceof ResidentImageError) throw new Error(error.message);
        throw error;
      }
    },
    async remove(reference) {
      await removeUnreferencedGalleryImage(app, request, reference.slice("global-gallery:".length));
    },
  };
}
