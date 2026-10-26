// How much of an item production may use (plan §7.2-B): 창고 총량 − 보호량 − 목적 예약량. Inputs of a running job left
// the storeroom when it started, so they are not subtracted again. Reservations arrive with expeditions (P4) and are
// 0 until then.
import type { ProductionState } from "../model/production";

export function protectedAmount(production: Pick<ProductionState, "protectedStock">, itemId: string): number {
  return production.protectedStock[itemId] ?? 0;
}

export function usableAmount(
  inventory: Readonly<Record<string, number>>,
  production: Pick<ProductionState, "protectedStock">,
  itemId: string,
): number {
  return Math.max(0, (inventory[itemId] ?? 0) - protectedAmount(production, itemId));
}

/** Stock plus the confirmed output of every running job: what a target is measured against (plan §7.2-B). */
export function stockWithPending(
  inventory: Readonly<Record<string, number>>,
  production: Pick<ProductionState, "facilities">,
  itemId: string,
): number {
  let total = inventory[itemId] ?? 0;
  for (const facility of Object.values(production.facilities)) total += facility.job?.outputs[itemId] ?? 0;
  return total;
}
