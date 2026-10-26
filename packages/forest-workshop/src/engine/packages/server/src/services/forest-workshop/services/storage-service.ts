// 저장 공간 사용량 (mockup 05 · 저장·백업): how much this world stores, by kind. Measured, never estimated:
// records are the world's own package documents as stored JSON; resident pictures are the WebP files the world
// references (current and history, each file once), as stored. Backgrounds arrive with P5 and are truly 0 until then.
import { assertWorldId, documentId, DOCUMENT_KIND } from "../domain/ids";
import { residentImageReferences } from "../domain/model/residents";
import { PACKAGE_ID, type HostPersistence } from "../host/engine-adapter";
import { loadWorld } from "../store/world-repository";

export interface StorageUsage {
  residentImagesBytes: number;
  backgroundsBytes: number;
  recordsBytes: number;
}

function jsonBytes(value: unknown): number {
  return Buffer.byteLength(JSON.stringify(value ?? null), "utf8");
}

export function createStorageService(persistence: HostPersistence) {
  const documents = persistence.documents;
  return {
    async usage(worldId: unknown): Promise<StorageUsage> {
      const id = assertWorldId(worldId);
      const world = await loadWorld(documents, id);
      const commandPrefix = documentId.command(id, "");
      const commands = (await documents.list(PACKAGE_ID, DOCUMENT_KIND.command)).filter((record) =>
        record.id.startsWith(commandPrefix),
      );
      const recordsBytes =
        jsonBytes(world.record.data) + commands.reduce((total, record) => total + jsonBytes(record.data), 0);
      const pictures = new Map<string, number>();
      for (const resident of Object.values(world.state.residents)) {
        for (const image of residentImageReferences(resident)) pictures.set(image.reference, image.bytes);
      }
      const residentImagesBytes = [...pictures.values()].reduce((total, bytes) => total + bytes, 0);
      return { residentImagesBytes, backgroundsBytes: 0, recordsBytes };
    },
  };
}

export type StorageService = ReturnType<typeof createStorageService>;
