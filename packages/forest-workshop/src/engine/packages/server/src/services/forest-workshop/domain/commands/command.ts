// What a command is. A command is a pure rule: (current world, validated payload, context) → next world + result.
// It never reads the clock, storage or the network itself, so it is unit-tested without an Engine and the command
// service (services/command-service.ts) can retry it safely against a fresher world.
import type { z } from "zod";
import type { ResidentKind, SourceSnapshot } from "../model/residents";
import type { WorldState } from "../world-model";

export interface CommandContext {
  /** Server time for this attempt, ISO 8601. */
  now: string;
  commandId: string;
  /**
   * Server-made random seed for this attempt (초대 rolls). Never chosen by the client, so a client cannot pick
   * outcomes by choosing a commandId. Tests pass a fixed one; without one, rolls derive from the commandId.
   */
  seed?: string;
  /** What the command's prepare() read from the host before the rule ran; undefined for commands without one. */
  prepared?: unknown;
}

/** Host reads a command may need before its pure rule runs. Implemented in services/, faked in tests. */
export interface CommandHost {
  /** Reads a character or persona and returns the snapshot kept on the resident. Never writes the source. */
  readSource(kind: ResidentKind, sourceId: string, now: string): Promise<SourceSnapshot>;
}

export interface CommandOutcome {
  state: WorldState;
  /** Small JSON shown to the client and stored for idempotent replays. Never secrets or private story text. */
  result: Record<string, unknown>;
}

export interface CommandDefinition<Payload> {
  type: string;
  payloadSchema: z.ZodType<Payload, z.ZodTypeDef, unknown>;
  /**
   * True when the payload edits what the player saw, so a request made from an outdated screen is refused with
   * `stale_view` instead of being applied to newer data. False when the server re-derives everything from the current
   * world (most game actions), so an outdated screen is harmless.
   */
  requiresFreshView: boolean;
  /**
   * True for commands only the server itself issues (a stored picture: the bytes were checked and uploaded first).
   * POST /commands refuses them, so a client cannot attach an arbitrary gallery reference to a resident.
   */
  internal?: boolean;
  /** Host reads done once, before the rule and outside any transaction (plan §6: no I/O inside a transaction). */
  prepare?(payload: Payload, host: CommandHost, now: string): Promise<unknown>;
  apply(state: WorldState, payload: Payload, context: CommandContext): CommandOutcome;
}

/** Keeps each command's payload type attached to its own apply() while the registry holds them side by side. */
export function defineCommand<Payload>(definition: CommandDefinition<Payload>): CommandDefinition<Payload> {
  return definition;
}
