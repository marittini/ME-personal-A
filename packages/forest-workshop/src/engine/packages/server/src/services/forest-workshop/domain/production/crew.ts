// Speed from residents at work (plan §7.2-A, §7.2-F; numbers in content/crew.ts). Pure. A placed resident whose 전문
// 분야 matches the facility adds its passive there; each active pair whose two residents are both placed adds the
// set bonus to every facility (capped). A run keeps the speed it started with (plan §7.2-C).
import { passiveBonus, setBonus } from "../../content/crew";
import { facilityDefinition } from "../../content/production";
import { talentDefinition, type TalentDefinition } from "../../content/talents";
import type { WorldState } from "../world-model";

export interface CrewBonus {
  /** Passive of the placed resident (0 when none, or when the field differs). */
  passive: number;
  /** Set bonus shared by every facility. */
  set: number;
  /** passive + set: the facility-wide extra speed. */
  total: number;
  /** The placed resident's 특기, when their field matches (it acts on one recipe). */
  talent: TalentDefinition | null;
}

export function placedPairCount(state: Pick<WorldState, "pairs" | "production">): number {
  const placed = new Set(
    Object.values(state.production.facilities)
      .map((facility) => facility.residentId)
      .filter((id): id is string => id !== null),
  );
  return Object.values(state.pairs).filter(
    (pair) => !pair.archived && pair.residentIds.every((residentId) => placed.has(residentId)),
  ).length;
}

export function crewBonuses(state: Pick<WorldState, "pairs" | "production" | "residents">): Record<string, CrewBonus> {
  const set = setBonus(placedPairCount(state));
  const bonuses: Record<string, CrewBonus> = {};
  for (const [facilityId, facility] of Object.entries(state.production.facilities)) {
    const resident = facility.residentId ? state.residents[facility.residentId] : undefined;
    const matches = resident !== undefined && resident.field === facilityDefinition(facilityId)?.field;
    const passive = matches ? passiveBonus(resident.breakthrough) : 0;
    const talent = matches ? (talentDefinition(resident.talentId) ?? null) : null;
    bonuses[facilityId] = { passive, set, total: Math.round((passive + set) * 1000) / 1000, talent };
  }
  return bonuses;
}

/** One run of a recipe as a facility's crew makes it: the extra speed and the inputs after a 특기. */
export function crewRecipe(
  recipe: { id: string; inputs: Readonly<Record<string, number>> },
  crew: { total: number; talent: TalentDefinition | null } | undefined,
): { extraBonus: number; inputs: Record<string, number> } {
  const inputs = { ...recipe.inputs };
  let extraBonus = crew?.total ?? 0;
  const effect = crew?.talent?.effect;
  if (effect && effect.recipeId === recipe.id) {
    if (effect.kind === "speed") extraBonus += effect.bonus;
    else if (inputs[effect.itemId] !== undefined)
      inputs[effect.itemId] = Math.max(1, inputs[effect.itemId]! - effect.amount);
  }
  return { extraBonus: Math.round(extraBonus * 1000) / 1000, inputs };
}
