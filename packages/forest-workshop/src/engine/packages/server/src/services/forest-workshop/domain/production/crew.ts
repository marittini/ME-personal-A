// Speed from residents at work (plan §7.2-A, §7.2-F; numbers in content/crew.ts). Pure. A placed resident whose 전문
// 분야 matches the facility adds its passive there; each active pair whose two residents are both placed adds the
// set bonus to every facility (capped). A run keeps the speed it started with (plan §7.2-C).
import { passiveBonus, setBonus } from "../../content/crew";
import { facilityDefinition } from "../../content/production";
import type { WorldState } from "../world-model";

export interface CrewBonus {
  /** Passive of the placed resident (0 when none, or when the field differs). */
  passive: number;
  /** Set bonus shared by every facility. */
  set: number;
  total: number;
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
    bonuses[facilityId] = { passive, set, total: Math.round((passive + set) * 1000) / 1000 };
  }
  return bonuses;
}
