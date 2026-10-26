// 저장 공간 사용량 (mockup 05 · 저장·백업): how much this world stores, by kind. Measured, never estimated:
// records are the world's own package documents as stored JSON. Resident pictures and backgrounds are counted from
// the Global Gallery references once those features store pictures (P2, P5); until then they are truly 0.
import { assertWorldId, documentId, DOCUMENT_KIND } from "../domain/ids";
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
      return { residentImagesBytes: 0, backgroundsBytes: 0, recordsBytes };
    },
  };
}

export type StorageService = ReturnType<typeof createStorageService>;
