// Every command the package accepts, and the one function that runs one. Adding a command = one module + one line
// here. The final world is validated against the schema before anything can store it, so a buggy rule surfaces as
// an error instead of a saved, broken world.
import { FwError } from "../errors";
import { settleWorld } from "../production/settle";
import { worldStateSchema, type WorldState } from "../world-model";
import type { CommandContext, CommandDefinition, CommandOutcome } from "./command";
import { sellItems } from "./economy";
import { claimStarterKit } from "./onboarding";
import { markReportsRead, setProtected, setRules, upgradeFacility } from "./production";
import { addPair, archivePair, restorePair } from "./pairs";
import {
  clearResidentImageHistory,
  restoreResidentImage,
  setResidentImage,
  setResidentPlacement,
} from "./resident-images";
import { chooseStarter, registerResident, updateResident } from "./residents";
import { updateSettings } from "./settings";

const DEFINITIONS = [
  updateSettings,
  claimStarterKit,
  registerResident,
  updateResident,
  chooseStarter,
  setResidentImage,
  restoreResidentImage,
  setResidentPlacement,
  clearResidentImageHistory,
  addPair,
  archivePair,
  restorePair,
  setRules,
  setProtected,
  upgradeFacility,
  markReportsRead,
  sellItems,
] as unknown as ReadonlyArray<CommandDefinition<never>>;

const REGISTRY = new Map(DEFINITIONS.map((definition) => [definition.type, definition]));

export function getCommandDefinition(type: unknown): CommandDefinition<never> {
  const definition = typeof type === "string" ? REGISTRY.get(type) : undefined;
  if (!definition) throw new FwError("unknown_command", { details: { type: String(type).slice(0, 64) } });
  return definition;
}

export function listCommandTypes(): string[] {
  return [...REGISTRY.keys()];
}

/** Validates a payload against its command; the parsed value is what prepare() and apply() receive. */
export function parseCommandPayload(definition: CommandDefinition<never>, rawPayload: unknown): never {
  const parsed = definition.payloadSchema.safeParse(rawPayload ?? {});
  if (!parsed.success) {
    throw new FwError("invalid_payload", {
      details: { issues: parsed.error.issues.slice(0, 5).map((issue) => issue.path.join(".") || issue.message) },
    });
  }
  return parsed.data;
}

/** Validates the payload, applies the rule and checks the resulting world. Pure: no clock, storage or I/O. */
export function applyCommand(
  state: WorldState,
  definition: CommandDefinition<never>,
  rawPayload: unknown,
  context: CommandContext,
): CommandOutcome {
  const applied = definition.apply(state, parseCommandPayload(definition, rawPayload), context);
  // Idle facilities look again at once (no time passes): a claimed kit, a sale or new rules start work now, not at the
  // next settlement.
  const outcome = { ...applied, state: settleWorld(applied.state, context.now, { active: true }) };
  const checked = worldStateSchema.safeParse(outcome.state);
  if (!checked.success) {
    throw new Error(`Command ${definition.type} produced an invalid world: ${checked.error.issues[0]?.path.join(".")}`);
  }
  return { state: checked.data, result: outcome.result };
}
