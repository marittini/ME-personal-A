// Today's 납품 의뢰 (content/deliveries.ts). Pure: the list is derived from the world and the UTC day, so every tab and
// every retry sees the same requests without storing them; only which ones are done is stored.
import { ALL_ORDERS, ORDERS_PER_DAY, STARTER_ORDERS, type DeliveryOrder } from "../../content/deliveries";
import { sha256Hex } from "../ids";

function rank(seed: string, id: string) {
  return sha256Hex(`${seed}:${id}`);
}

export function todaysOrders(worldId: string, day: string): DeliveryOrder[] {
  const seed = `${worldId}:delivery:${day}`;
  const byRank = (orders: readonly DeliveryOrder[]) =>
    [...orders].sort((a, b) => (rank(seed, a.id) < rank(seed, b.id) ? -1 : 1));
  // One request a new workshop can always fill, then the rest from everything.
  const first = byRank(STARTER_ORDERS)[0]!;
  const rest = byRank(ALL_ORDERS.filter((order) => order.id !== first.id)).slice(0, ORDERS_PER_DAY - 1);
  return [first, ...rest];
}
