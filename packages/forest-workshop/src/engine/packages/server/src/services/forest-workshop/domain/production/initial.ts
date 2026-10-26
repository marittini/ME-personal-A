// The production state a world starts with: every facility at level 1 in automatic mode with the recommended rules,
// so the first session already shows a small gather → process loop running by itself (plan §7.2-E).
import { FACILITIES, RECOMMENDED_RULES } from "../../content/production";
import { seededUuid } from "../ids";
import type { FacilityState, ProductionState, Rule } from "../model/production";

/** Rule IDs are derived from the world and recipe, so a retried world creation makes the same rules. */
export function recommendedRules(worldId: string, facilityId: string): Rule[] {
  return (RECOMMENDED_RULES[facilityId] ?? []).map((template) => ({
    policyId: seededUuid(`${worldId}:rule:${facilityId}:${template.recipeId}`),
    enabled: true,
    recipeId: template.recipeId,
    targetStock: template.targetStock,
    priority: template.priority,
  }));
}

export function initialProduction(worldId: string): ProductionState {
  const facilities: Record<string, FacilityState> = {};
  for (const facility of FACILITIES) {
    facilities[facility.id] = {
      level: 1,
      mode: "auto",
      rules: recommendedRules(worldId, facility.id),
      job: null,
      waiting: null,
    };
  }
  return {
    simMs: 0,
    facilities,
    protectedStock: {},
    reports: [],
    reportsReadThrough: 0,
    nextJobId: 1,
    nextReportId: 1,
    activity: { settledAt: null, lastActiveAt: null, leaseUntil: null, absenceUsedMs: 0, lastAbsence: null },
  };
}
