// 해금 조건 (plan §7.2-F: 조건 충족 퀘스트 1회). Pure: which parts of a facility's condition hold now.
import { facilityDefinition } from "../../content/production";
import type { ProductionState } from "../model/production";

export interface UnlockPart {
  kind: "facilityLevel" | "made";
  /** facility or item */
  id: string;
  need: number;
  have: number;
  met: boolean;
}

export function unlockParts(production: ProductionState, facilityId: string): UnlockPart[] {
  const condition = facilityDefinition(facilityId)?.unlock;
  if (!condition) return [];
  const parts: UnlockPart[] = [];
  if (condition.facilityLevel) {
    const other = production.facilities[condition.facilityLevel.facilityId];
    const have = other?.unlocked ? other.level : 0;
    parts.push({
      kind: "facilityLevel",
      id: condition.facilityLevel.facilityId,
      need: condition.facilityLevel.level,
      have,
      met: have >= condition.facilityLevel.level,
    });
  }
  if (condition.made) {
    const have = production.made[condition.made.itemId] ?? 0;
    parts.push({
      kind: "made",
      id: condition.made.itemId,
      need: condition.made.amount,
      have,
      met: have >= condition.made.amount,
    });
  }
  return parts;
}
