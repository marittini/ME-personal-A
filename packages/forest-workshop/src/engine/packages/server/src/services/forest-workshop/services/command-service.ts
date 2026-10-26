// Runs one player command against stored data (plan §5):
//   input  { commandId, worldId, expectedRevision, type, payload }
//   - the same commandId with the same request returns the original result and changes nothing again;
//   - the same commandId with a different request is refused (command_id_reused);
//   - the world change and the command record are written in one transaction, so a failed save leaves neither;
//   - a concurrent write is detected by revision and the command is re-evaluated, at most 3 times, then 409;
//   - nothing is answered as success before the write is confirmed.
// A command with prepare() (residents.register reads its source) does that host read once, on the first attempt
// and outside the transaction; the pure rule then runs against each fresh world with the same prepared input.
import { randomBytes } from "node:crypto";
import type { CommandHost } from "../domain/commands/command";
import { FwError } from "../domain/errors";
import { applyCommand, getCommandDefinition, parseCommandPayload } from "../domain/commands/registry";
import { settleWorld } from "../domain/production/settle";
import { assertRequestId, assertWorldId, sha256Hex, stableStringify } from "../domain/ids";
import type { WorldState } from "../domain/world-model";
import type { HostPersistence } from "../host/engine-adapter";
import { createCommandRecord, findCommandRecord, type CommandRecord } from "../store/command-log";
import { loadWorld, updateWorldDocument } from "../store/world-repository";

export const MAX_COMMAND_ATTEMPTS = 3;

export interface CommandRequest {
  worldId: string;
  commandId: string;
  expectedRevision: number;
  type: string;
  payload: unknown;
}

export interface CommandResponse {
  /** True when this answer replays an already-applied command. */
  duplicate: boolean;
  type: string;
  result: Record<string, unknown>;
  revision: number;
  state: WorldState;
}

/** Signals a lost compare-and-swap inside the transaction, so the transaction rolls back and the command retries. */
class RevisionConflict extends Error {}

export function parseCommandRequest(body: unknown): CommandRequest {
  const raw = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const expectedRevision = raw.expectedRevision;
  if (typeof expectedRevision !== "number" || !Number.isInteger(expectedRevision) || expectedRevision < 1) {
    throw new FwError("invalid_request", { message: "expectedRevision가 필요합니다." });
  }
  if (typeof raw.type !== "string") throw new FwError("invalid_request", { message: "명령 종류가 필요합니다." });
  return {
    worldId: assertWorldId(raw.worldId),
    commandId: assertRequestId(raw.commandId),
    expectedRevision,
    type: raw.type,
    payload: raw.payload ?? {},
  };
}

export function commandPayloadHash(request: Pick<CommandRequest, "worldId" | "type" | "payload">): string {
  return sha256Hex(stableStringify({ worldId: request.worldId, type: request.type, payload: request.payload }));
}

export interface ExecuteOptions {
  /** Set only by server code that prepared the payload itself (resident picture upload). */
  internal?: boolean;
  /**
   * What identifies "the same request" for idempotency when the payload holds server-made values that differ on a
   * retry (a fresh gallery ID for the same upload key). Defaults to the payload.
   */
  identity?: unknown;
}

export interface CommandService {
  execute(request: CommandRequest, options?: ExecuteOptions): Promise<CommandResponse>;
}

export function createCommandService(
  persistence: HostPersistence,
  clock: () => Date = () => new Date(),
  host?: CommandHost,
): CommandService {
  const documents = persistence.documents;

  async function replay(request: CommandRequest, record: CommandRecord, payloadHash: string): Promise<CommandResponse> {
    if (record.payloadHash !== payloadHash || record.type !== request.type) throw new FwError("command_id_reused");
    const current = await loadWorld(documents, request.worldId);
    return {
      duplicate: true,
      type: record.type,
      result: record.result,
      revision: current.revision,
      state: current.state,
    };
  }

  return {
    async execute(request, options = {}) {
      const definition = getCommandDefinition(request.type);
      if (definition.internal && !options.internal) throw new FwError("unknown_command");
      const payloadHash = commandPayloadHash({
        ...request,
        payload: options.identity === undefined ? request.payload : options.identity,
      });
      let prepared: unknown;
      let preparedOnce = false;

      for (let attempt = 1; attempt <= MAX_COMMAND_ATTEMPTS; attempt += 1) {
        const existing = await findCommandRecord(documents, request.worldId, request.commandId);
        if (existing) return replay(request, existing, payloadHash);

        const current = await loadWorld(documents, request.worldId);
        if (definition.prepare && !preparedOnce) {
          if (!host) throw new FwError("sources_unavailable");
          const payload = parseCommandPayload(definition, request.payload);
          prepared = await definition.prepare(payload, host, clock().toISOString());
          preparedOnce = true;
        }
        if (definition.requiresFreshView && current.revision !== request.expectedRevision) {
          throw new FwError("stale_view", { details: { revision: current.revision } });
        }
        const now = clock().toISOString();
        let outcome;
        try {
          // A command means the player is here: the workshop is first brought up to now (production, 72-hour rule),
          // so the rule sees the present storeroom, and the settlement is saved together with the command.
          const present = settleWorld(current.state, now, { active: true });
          outcome = applyCommand(present, definition, request.payload, {
            now,
            commandId: request.commandId,
            prepared,
            seed: randomBytes(16).toString("hex"),
          });
        } catch (error) {
          // A rule may refuse because another tab is applying this very command right now (the world already shows
          // its effect). The command's own record, once visible, is the answer, not the refusal.
          const raced = await findCommandRecord(documents, request.worldId, request.commandId).catch(() => null);
          if (raced) return replay(request, raced, payloadHash);
          throw error;
        }

        try {
          // The record goes first, so any reader that can see the new world can also see what produced it.
          const saved = await persistence.transaction(async (session) => {
            await createCommandRecord(session.documents, {
              schemaVersion: 1,
              worldId: request.worldId,
              commandId: request.commandId,
              type: request.type,
              payloadHash,
              revision: current.revision + 1,
              result: outcome.result,
              acceptedAt: now,
            });
            const written = await updateWorldDocument(session.documents, current, outcome.state, now);
            if (!written) throw new RevisionConflict();
            if (written.revision !== current.revision + 1) throw new Error("World revision did not advance by one");
            return written;
          });
          return {
            duplicate: false,
            type: request.type,
            result: outcome.result,
            revision: saved.revision,
            state: saved.state,
          };
        } catch (error) {
          if (error instanceof RevisionConflict) continue;
          // Another tab may have stored this very command between our read and our write; its record wins.
          const raced = await findCommandRecord(documents, request.worldId, request.commandId).catch(() => null);
          if (raced) return replay(request, raced, payloadHash);
          throw error;
        }
      }
      throw new FwError("save_conflict");
    },
  };
}
