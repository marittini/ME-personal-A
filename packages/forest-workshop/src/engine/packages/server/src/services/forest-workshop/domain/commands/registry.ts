// Every command the package accepts, and the one function that runs one. Adding a command = one module + one line
// here. The final world is validated against the schema before anything can store it, so a buggy rule surfaces as
// an error instead of a saved, broken world.
import { FwError } from "../errors";
import { worldStateSchema, type WorldState } from "../world-model";
import type { CommandContext, CommandDefinition, CommandOutcome } from "./command";
import { claimStarterKit } from "./onboarding";
import { updateSettings } from "./settings";

const DEFINITIONS: ReadonlyArray<CommandDefinition<never>> = [
  updateSettings as CommandDefinition<never>,
  claimStarterKit as CommandDefinition<never>,
];

const REGISTRY = new Map(DEFINITIONS.map((definition) => [definition.type, definition]));

export function getCommandDefinition(type: unknown): CommandDefinition<never> {
  const definition = typeof type === "string" ? REGISTRY.get(type) : undefined;
  if (!definition) throw new FwError("unknown_command", { details: { type: String(type).slice(0, 64) } });
  return definition;
}

export function listCommandTypes(): string[] {
  return [...REGISTRY.keys()];
}

/** Validates the payload, applies the rule and checks the resulting world. Pure: no clock, storage or I/O. */
export function applyCommand(
  state: WorldState,
  definition: CommandDefinition<never>,
  rawPayload: unknown,
  context: CommandContext,
): CommandOutcome {
  const parsed = definition.payloadSchema.safeParse(rawPayload ?? {});
  if (!parsed.success) {
    throw new FwError("invalid_payload", {
      details: { issues: parsed.error.issues.slice(0, 5).map((issue) => issue.path.join(".") || issue.message) },
    });
  }
  const outcome = definition.apply(state, parsed.data, context);
  const checked = worldStateSchema.safeParse(outcome.state);
  if (!checked.success) {
    throw new Error(`Command ${definition.type} produced an invalid world: ${checked.error.issues[0]?.path.join(".")}`);
  }
  return { state: checked.data, result: outcome.result };
}
