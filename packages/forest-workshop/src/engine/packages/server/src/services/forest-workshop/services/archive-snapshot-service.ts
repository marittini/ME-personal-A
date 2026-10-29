// Stage a complete, verifiable snapshot before any future migration removes records from the world document.
// This service never deletes or alters the active world. The archive is not a player-visible storage backend yet.
import { assertWorldId, stableStringify } from "../domain/ids";
import type { HostPersistence } from "../host/engine-adapter";
import { appendArchive, listArchive, type ArchiveRecord } from "../store/archive-repository";
import { loadWorld } from "../store/world-repository";

export async function snapshotWorldHistory(persistence: HostPersistence, rawWorldId: string, now: string) {
  const worldId = assertWorldId(rawWorldId);
  return persistence.transaction(async ({ documents }) => {
    const world = await loadWorld(documents, worldId);
    const wanted: ArchiveRecord[] = [
      ...world.state.activities.completed.map((value) => ({
        version: 1 as const,
        worldId,
        type: "activity" as const,
        value,
      })),
      ...world.state.mailbox.letters.map((value) => ({ version: 1 as const, worldId, type: "letter" as const, value })),
    ];
    for (const record of wanted) await appendArchive(documents, record, now);
    const stored = await listArchive(documents, worldId);
    const storedValues = new Set(stored.map(stableStringify));
    if (!wanted.every((record) => storedValues.has(stableStringify(record))))
      throw new Error("Archive snapshot incomplete");
    return {
      worldId,
      revision: world.revision,
      activities: world.state.activities.completed.length,
      letters: world.state.mailbox.letters.length,
    };
  });
}
