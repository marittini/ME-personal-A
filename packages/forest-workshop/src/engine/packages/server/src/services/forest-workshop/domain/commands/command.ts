// What a command is. A command is a pure rule: (current world, validated payload, context) → next world + result.
// It never reads the clock, storage or the network itself, so it is unit-tested without an Engine and the command
// service (services/command-service.ts) can retry it safely against a fresher world.
import type { z } from "zod";
import type { WorldState } from "../world-model";

export interface CommandContext {
  /** Server time for this attempt, ISO 8601. */
  now: string;
  commandId: string;
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
  apply(state: WorldState, payload: Payload, context: CommandContext): CommandOutcome;
}

/** Keeps each command's payload type attached to its own apply() while the registry holds them side by side. */
export function defineCommand<Payload>(definition: CommandDefinition<Payload>): CommandDefinition<Payload> {
  return definition;
}
