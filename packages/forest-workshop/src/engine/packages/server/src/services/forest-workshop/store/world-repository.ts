// Reads and writes `fw-world` documents. Knows document IDs, revisions and migration; knows no game rules.
// Every write is compare-and-swap on the host revision: `update` returns null when another writer got there first.
import { PACKAGE_ID, type HostDocumentRecord, type HostDocumentStore } from "../host/engine-adapter";
import { FwError } from "../domain/errors";
import { DOCUMENT_KIND, documentId } from "../domain/ids";
import { migrateWorld } from "../domain/migrations";
import type { WorldState } from "../domain/world-model";

export interface StoredWorld {
  state: WorldState;
  /** Host document revision this state was read at; the next write must name it. */
  revision: number;
  updatedAt: string;
  record: HostDocumentRecord;
}

export interface WorldSummary {
  worldId: string;
  worldName: string;
  updatedAt: string;
  /** False when the stored world cannot be read by this version; the summary still lists it so it is not lost. */
  readable: boolean;
}

function toStored(record: HostDocumentRecord): StoredWorld {
  return { state: migrateWorld(record.data), revision: record.revision, updatedAt: record.updatedAt, record };
}

export async function findWorld(documents: HostDocumentStore, worldId: string): Promise<StoredWorld | null> {
  const record = await documents.getById(PACKAGE_ID, documentId.world(worldId));
  return record ? toStored(record) : null;
}

export async function loadWorld(documents: HostDocumentStore, worldId: string): Promise<StoredWorld> {
  const world = await findWorld(documents, worldId);
  if (!world) throw new FwError("world_not_found");
  return world;
}

export async function listWorlds(documents: HostDocumentStore): Promise<WorldSummary[]> {
  const records = await documents.list(PACKAGE_ID, DOCUMENT_KIND.world);
  return records.map((record) => {
    try {
      const state = migrateWorld(record.data);
      return {
        worldId: state.worldId,
        worldName: state.settings.worldName,
        updatedAt: record.updatedAt,
        readable: true,
      };
    } catch {
      return {
        worldId: record.id.replace(/^fw-world-/u, ""),
        worldName: record.name,
        updatedAt: record.updatedAt,
        readable: false,
      };
    }
  });
}

export async function createWorldDocument(
  documents: HostDocumentStore,
  state: WorldState,
  now: string,
  description: string,
): Promise<StoredWorld> {
  const record = await documents.create({
    id: documentId.world(state.worldId),
    packageId: PACKAGE_ID,
    kind: DOCUMENT_KIND.world,
    name: state.settings.worldName,
    description,
    data: state,
    createdAt: now,
    updatedAt: now,
  });
  return { state, revision: record.revision, updatedAt: record.updatedAt, record };
}

/** Compare-and-swap write. Null means the world changed since `current` was read. */
export async function updateWorldDocument(
  documents: HostDocumentStore,
  current: StoredWorld,
  next: WorldState,
  now: string,
): Promise<StoredWorld | null> {
  const record = await documents.update({
    id: current.record.id,
    packageId: PACKAGE_ID,
    expectedRevision: current.revision,
    name: next.settings.worldName,
    description: current.record.description,
    data: next,
    updatedAt: now,
  });
  return record ? { state: next, revision: record.revision, updatedAt: record.updatedAt, record } : null;
}
