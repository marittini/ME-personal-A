// Backup and restore (plan §6, §8.1). A backup is one JSON file: the world (settings, wallet, inventory, residents
// with their source snapshots, settings and change logs, pairs) and `assets`, the WebP files of every resident
// picture the world references (current and history), with their placement kept in the world. No PNG originals,
// secrets, connection keys or command records.
//
// Restoring always creates a NEW world. Everything is validated first (envelope, world schema after migration,
// every picture reference covered by a matching asset, each asset's hash). Then the pictures go to the gallery,
// which gives them new IDs; the world is rewritten to the new references and saved. If the save fails, the
// pictures stored for it are removed again, so a failed restore leaves nothing behind.
//
// Format versions: 1 (P1, no pictures, assets must be empty) is still read; 2 adds assets.
import { z } from "zod";
import { FwError } from "../domain/errors";
import { assertWorldId, sha256Hex } from "../domain/ids";
import { migrateWorld } from "../domain/migrations";
import { presentActivity } from "../domain/production/activity";
import { GALLERY_REFERENCE, residentImageReferences, type ResidentImage } from "../domain/model/residents";
import { worldStateSchema, type WorldState } from "../domain/world-model";
import type { HostPersistence } from "../host/engine-adapter";
import { createWorldDocument, findWorld, loadWorld } from "../store/world-repository";
import type { WorldView } from "./world-service";

export const BACKUP_FORMAT = "forest-workshop-backup";
export const BACKUP_FORMAT_VERSION = 2;
/** 100 residents × (current + 3 history pictures). */
export const MAX_BACKUP_ASSETS = 400;

const assetSchema = z
  .object({
    reference: z.string().regex(GALLERY_REFERENCE),
    mime: z.literal("image/webp"),
    bytes: z.number().int().min(1),
    sha256: z.string().regex(/^[0-9a-f]{64}$/u),
    data: z.string().min(1),
  })
  .strict();
export type BackupAsset = z.infer<typeof assetSchema>;

const backupEnvelopeSchema = z.discriminatedUnion("formatVersion", [
  z
    .object({
      format: z.literal(BACKUP_FORMAT),
      formatVersion: z.literal(1),
      packageVersion: z.string().max(32),
      exportedAt: z.string().datetime(),
      world: z.unknown(),
      assets: z.array(z.unknown()).max(0),
    })
    .strict(),
  z
    .object({
      format: z.literal(BACKUP_FORMAT),
      formatVersion: z.literal(2),
      packageVersion: z.string().max(32),
      exportedAt: z.string().datetime(),
      world: z.unknown(),
      assets: z.array(assetSchema).max(MAX_BACKUP_ASSETS),
    })
    .strict(),
]);

export interface BackupDocument {
  format: typeof BACKUP_FORMAT;
  formatVersion: typeof BACKUP_FORMAT_VERSION;
  packageVersion: string;
  exportedAt: string;
  world: WorldState;
  assets: BackupAsset[];
}

/** Reads a stored picture's bytes (the gallery in production, a map in tests). */
export type AssetReader = (image: ResidentImage) => Promise<Buffer>;
/** Stores a picture from a backup and answers its new reference; removes one again when the restore fails. */
export interface AssetStore {
  store(bytes: Buffer, original: BackupAsset): Promise<{ reference: string; url: string }>;
  remove(reference: string): Promise<void>;
}

/** Each picture once, even when it is current for one resident and in another's history. */
function uniqueImages(state: WorldState): ResidentImage[] {
  const byReference = new Map<string, ResidentImage>();
  for (const resident of Object.values(state.residents)) {
    for (const image of residentImageReferences(resident)) byReference.set(image.reference, image);
  }
  return [...byReference.values()];
}

/** The world with every picture reference (and display URL) replaced by the restored one. */
function remapImages(state: WorldState, mapping: Map<string, { reference: string; url: string }>): WorldState {
  const remap = (image: ResidentImage): ResidentImage => {
    const target = mapping.get(image.reference);
    if (!target) throw new FwError("invalid_backup", { details: { missingAsset: image.reference } });
    return { ...image, reference: target.reference, url: target.url };
  };
  const residents = Object.fromEntries(
    Object.entries(state.residents).map(([id, resident]) => [
      id,
      {
        ...resident,
        image: {
          ...resident.image,
          current: resident.image.current ? remap(resident.image.current) : null,
          history: resident.image.history.map(remap),
        },
      },
    ]),
  );
  return worldStateSchema.parse({ ...state, residents });
}

export interface BackupService {
  exportWorld(worldId: string, readAsset: AssetReader): Promise<{ fileName: string; backup: BackupDocument }>;
  restore(body: unknown, assets: AssetStore): Promise<WorldView & { created: boolean; restoredFrom: string }>;
}

export function createBackupService(
  persistence: HostPersistence,
  packageVersion: string,
  clock: () => Date = () => new Date(),
): BackupService {
  const documents = persistence.documents;
  return {
    async exportWorld(worldId, readAsset) {
      const world = await loadWorld(documents, assertWorldId(worldId));
      const exportedAt = clock().toISOString();
      const stamp = exportedAt.slice(0, 19).replace(/[:T]/gu, "-");
      const assets: BackupAsset[] = [];
      for (const image of uniqueImages(world.state)) {
        const bytes = await readAsset(image);
        assets.push({
          reference: image.reference,
          mime: "image/webp",
          bytes: bytes.byteLength,
          sha256: sha256Hex(bytes),
          data: bytes.toString("base64"),
        });
      }
      return {
        fileName: `forest-workshop-${world.state.worldId.slice(0, 8)}-${stamp}.json`,
        backup: {
          format: BACKUP_FORMAT,
          formatVersion: BACKUP_FORMAT_VERSION,
          packageVersion,
          exportedAt,
          world: world.state,
          assets,
        },
      };
    },

    async restore(body, store) {
      const raw = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
      const newWorldId = assertWorldId(raw.newWorldId);
      const envelope = backupEnvelopeSchema.safeParse(raw.backup);
      if (!envelope.success) {
        throw new FwError("invalid_backup", {
          details: { issues: envelope.error.issues.slice(0, 5).map((i) => i.path.join(".") || i.message) },
        });
      }
      let original: WorldState;
      try {
        original = migrateWorld(envelope.data.world);
      } catch (error) {
        if (error instanceof FwError && error.code === "unsupported_schema") throw error;
        throw new FwError("invalid_backup");
      }

      // Every referenced picture must be in the file, intact; nothing is stored before this holds for all of them.
      const assets = new Map<string, { asset: BackupAsset; bytes: Buffer }>();
      for (const asset of envelope.data.assets as BackupAsset[]) {
        const bytes = Buffer.from(asset.data, "base64");
        if (bytes.byteLength !== asset.bytes || sha256Hex(bytes) !== asset.sha256) {
          throw new FwError("invalid_backup", { details: { brokenAsset: asset.reference } });
        }
        assets.set(asset.reference, { asset, bytes });
      }
      const needed = uniqueImages(original);
      const missing = needed.find((image) => !assets.has(image.reference));
      if (missing) throw new FwError("invalid_backup", { details: { missingAsset: missing.reference } });

      const view = (world: { revision: number; updatedAt: string; state: WorldState }, created: boolean) => ({
        worldId: newWorldId,
        revision: world.revision,
        updatedAt: world.updatedAt,
        state: world.state,
        created,
        restoredFrom: original.worldId,
      });

      // A retried restore that already succeeded returns the world it made.
      const existing = await findWorld(documents, newWorldId);
      if (existing) return view(existing, false);

      const stored: string[] = [];
      try {
        const mapping = new Map<string, { reference: string; url: string }>();
        for (const image of needed) {
          const { asset, bytes } = assets.get(image.reference)!;
          let target;
          try {
            target = await store.store(bytes, asset);
          } catch (error) {
            throw new FwError("invalid_backup", {
              details: { asset: image.reference, reason: error instanceof Error ? error.message.slice(0, 120) : "" },
            });
          }
          stored.push(target.reference);
          mapping.set(image.reference, target);
        }
        const now = clock().toISOString();
        // The restored world starts its clock now: the time between the backup and the restore is not credited.
        const state = remapImages(
          {
            ...original,
            worldId: newWorldId,
            production: { ...original.production, activity: presentActivity(now) },
          },
          mapping,
        );
        const created = await createWorldDocument(
          documents,
          state,
          now,
          `Forest Workshop world restored from ${original.worldId} (backup ${envelope.data.exportedAt})`,
        );
        return view(created, true);
      } catch (error) {
        for (const reference of stored) await store.remove(reference).catch(() => undefined);
        // A parallel retry of this same restore may have created the world first; that world is the answer.
        const raced = await findWorld(documents, newWorldId).catch(() => null);
        if (raced) return view(raced, false);
        throw error;
      }
    },
  };
}
