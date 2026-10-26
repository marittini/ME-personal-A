// Backup and restore (plan §6, §8.1). A backup is one JSON file holding the world (settings, wallet, inventory and,
// from later phases, residents, pairs, ledger and letters) and an `assets` list for the pictures it references.
// It never holds secrets, connection keys or command records. Restoring always creates a NEW world: the backup is
// validated and migrated first, and nothing is written unless all of it is valid.
//
// ponytail: P1 worlds reference no pictures yet, so `assets` is always empty and a backup that carries assets is
// refused. P2 (resident pictures) adds the WebP bytes and the gallery ID remapping on restore.
import { z } from "zod";
import { FwError } from "../domain/errors";
import { assertWorldId } from "../domain/ids";
import { migrateWorld } from "../domain/migrations";
import type { HostPersistence } from "../host/engine-adapter";
import { createWorldDocument, findWorld, loadWorld } from "../store/world-repository";
import type { WorldView } from "./world-service";

export const BACKUP_FORMAT = "forest-workshop-backup";
export const BACKUP_FORMAT_VERSION = 1;

const backupEnvelopeSchema = z
  .object({
    format: z.literal(BACKUP_FORMAT),
    formatVersion: z.literal(BACKUP_FORMAT_VERSION),
    packageVersion: z.string().max(32),
    exportedAt: z.string().datetime(),
    world: z.unknown(),
    assets: z.array(z.unknown()).max(0, { message: "assets are not supported by this version" }),
  })
  .strict();

export interface BackupDocument {
  format: typeof BACKUP_FORMAT;
  formatVersion: typeof BACKUP_FORMAT_VERSION;
  packageVersion: string;
  exportedAt: string;
  world: unknown;
  assets: unknown[];
}

export interface BackupService {
  exportWorld(worldId: string): Promise<{ fileName: string; backup: BackupDocument }>;
  restore(body: unknown): Promise<WorldView & { created: boolean; restoredFrom: string }>;
}

export function createBackupService(
  persistence: HostPersistence,
  packageVersion: string,
  clock: () => Date = () => new Date(),
): BackupService {
  const documents = persistence.documents;
  return {
    async exportWorld(worldId) {
      const world = await loadWorld(documents, assertWorldId(worldId));
      const exportedAt = clock().toISOString();
      const stamp = exportedAt.slice(0, 19).replace(/[:T]/gu, "-");
      return {
        fileName: `forest-workshop-${world.state.worldId.slice(0, 8)}-${stamp}.json`,
        backup: {
          format: BACKUP_FORMAT,
          formatVersion: BACKUP_FORMAT_VERSION,
          packageVersion,
          exportedAt,
          world: world.state,
          assets: [],
        },
      };
    },

    async restore(body) {
      const raw = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
      const newWorldId = assertWorldId(raw.newWorldId);
      const envelope = backupEnvelopeSchema.safeParse(raw.backup);
      if (!envelope.success) {
        throw new FwError("invalid_backup", {
          details: { issues: envelope.error.issues.slice(0, 5).map((i) => i.path.join(".") || i.message) },
        });
      }
      let original;
      try {
        original = migrateWorld(envelope.data.world);
      } catch (error) {
        if (error instanceof FwError && error.code === "unsupported_schema") throw error;
        throw new FwError("invalid_backup");
      }

      // A retried restore that already succeeded returns the world it made.
      const existing = await findWorld(documents, newWorldId);
      if (existing) {
        return {
          worldId: newWorldId,
          revision: existing.revision,
          updatedAt: existing.updatedAt,
          state: existing.state,
          created: false,
          restoredFrom: original.worldId,
        };
      }
      const now = clock().toISOString();
      const state = { ...original, worldId: newWorldId };
      const stored = await createWorldDocument(
        documents,
        state,
        now,
        `Forest Workshop world restored from ${original.worldId} (backup ${envelope.data.exportedAt})`,
      );
      return {
        worldId: newWorldId,
        revision: stored.revision,
        updatedAt: stored.updatedAt,
        state,
        created: true,
        restoredFrom: original.worldId,
      };
    },
  };
}
