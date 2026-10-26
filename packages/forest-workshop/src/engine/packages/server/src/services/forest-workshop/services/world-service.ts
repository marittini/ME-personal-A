// Creating, listing and reading worlds. Creation is idempotent on the client-made world ID: a retried request that
// already succeeded returns the stored world instead of a second one.
import { z } from "zod";
import { FwError } from "../domain/errors";
import { assertWorldId } from "../domain/ids";
import { presentActivity } from "../domain/production/activity";
import { createWorldState, nicknameSchema, worldNameSchema, type WorldState } from "../domain/world-model";
import type { HostPersistence } from "../host/engine-adapter";
import { createWorldDocument, findWorld, listWorlds, loadWorld, type WorldSummary } from "../store/world-repository";

const createWorldSchema = z
  .object({ worldId: z.string(), worldName: worldNameSchema, playerNickname: nicknameSchema })
  .strict();

export interface WorldView {
  worldId: string;
  revision: number;
  updatedAt: string;
  state: WorldState;
}

export interface WorldService {
  list(): Promise<WorldSummary[]>;
  get(worldId: string): Promise<WorldView>;
  create(body: unknown): Promise<WorldView & { created: boolean }>;
}

export function createWorldService(persistence: HostPersistence, clock: () => Date = () => new Date()): WorldService {
  const documents = persistence.documents;
  return {
    list: () => listWorlds(documents),

    async get(worldId) {
      const world = await loadWorld(documents, assertWorldId(worldId));
      return { worldId: world.state.worldId, revision: world.revision, updatedAt: world.updatedAt, state: world.state };
    },

    async create(body) {
      const parsed = createWorldSchema.safeParse(body);
      if (!parsed.success) {
        throw new FwError("invalid_payload", { details: { issues: parsed.error.issues.map((i) => i.path.join(".")) } });
      }
      const worldId = assertWorldId(parsed.data.worldId);
      const existing = await findWorld(documents, worldId);
      if (existing) {
        const sameRequest =
          existing.state.settings.worldName === parsed.data.worldName &&
          existing.state.settings.playerNickname === parsed.data.playerNickname;
        if (!sameRequest) throw new FwError("world_exists");
        return {
          worldId,
          revision: existing.revision,
          updatedAt: existing.updatedAt,
          state: existing.state,
          created: false,
        };
      }
      const now = clock().toISOString();
      const { worldName, playerNickname } = parsed.data;
      const created = createWorldState({ worldId, worldName, playerNickname, now });
      // The player is creating it right now: time starts counting from here.
      const state = { ...created, production: { ...created.production, activity: presentActivity(now) } };
      try {
        const stored = await createWorldDocument(documents, state, now, "Forest Workshop world");
        return { worldId, revision: stored.revision, updatedAt: stored.updatedAt, state, created: true };
      } catch (error) {
        // A parallel retry of this same request may have created it first.
        const raced = await findWorld(documents, worldId).catch(() => null);
        if (raced)
          return { worldId, revision: raced.revision, updatedAt: raced.updatedAt, state: raced.state, created: false };
        throw error;
      }
    },
  };
}
