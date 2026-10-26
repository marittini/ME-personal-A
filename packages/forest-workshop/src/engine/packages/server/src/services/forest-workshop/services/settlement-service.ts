// Settles a world without a command: a state read (GET /state, not the player's presence) or a heartbeat from the
// active game screen (POST /heartbeat, the player's presence). The result is saved with compare-and-swap before it is
// shown, so the player never sees production that was not stored (plan §7.2-D).
import { FwError } from "../domain/errors";
import { assertWorldId } from "../domain/ids";
import { settleWorld } from "../domain/production/settle";
import type { HostPersistence } from "../host/engine-adapter";
import { loadWorld, updateWorldDocument } from "../store/world-repository";
import type { WorldView } from "./world-service";

const ATTEMPTS = 3;

export function createSettlementService(persistence: HostPersistence, clock: () => Date = () => new Date()) {
  const documents = persistence.documents;
  return {
    async settle(worldId: unknown, options: { active: boolean }): Promise<WorldView> {
      const id = assertWorldId(worldId);
      for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
        const current = await loadWorld(documents, id);
        const now = clock().toISOString();
        const next = settleWorld(current.state, now, options);
        const saved = await updateWorldDocument(documents, current, next, now);
        if (saved) return { worldId: id, revision: saved.revision, updatedAt: saved.updatedAt, state: saved.state };
      }
      throw new FwError("save_conflict");
    },
  };
}

export type SettlementService = ReturnType<typeof createSettlementService>;
