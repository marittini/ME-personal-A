// Residents at work (plan §7.2-A, §7.2-F). Every facility works without a resident; a placed resident whose 전문 분야
// matches the facility's field helps with a passive speed bonus that grows with 돌파, and a pair whose two residents
// are both placed adds a small set bonus to every facility. No grades, no fatigue, no wages. Play-test values.
export const PASSIVE_BASE = 0.05;
export const PASSIVE_PER_BREAKTHROUGH = 0.01;
export const MAX_BREAKTHROUGH = 5;
export const SET_BONUS_PER_PAIR = 0.01;
export const SET_BONUS_MAX = 0.03;
/** Residents one facility can hold. */
export const RESIDENTS_PER_FACILITY = 1;

/** The passive of a resident with this many 돌파 (5% → 10% at 돌파 5). */
export function passiveBonus(breakthrough: number): number {
  const steps = Math.min(MAX_BREAKTHROUGH, Math.max(0, breakthrough));
  return Math.round((PASSIVE_BASE + PASSIVE_PER_BREAKTHROUGH * steps) * 1000) / 1000;
}

/** The set bonus for this many pairs whose two residents are both placed (1% each, at most 3%). */
export function setBonus(placedPairs: number): number {
  return Math.min(SET_BONUS_MAX, Math.round(SET_BONUS_PER_PAIR * Math.max(0, placedPairs) * 1000) / 1000);
}
