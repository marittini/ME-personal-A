// economy.sell — 창고에서 팔기: sells usable stock (never protected stock) for the server's price (content/items.ts).
// Auto-selling with daily limits arrives in P3b; this is the player's own sale, one confirmation at a time.
import { z } from "zod";
import { itemDefinition } from "../../content/items";
import { FwError } from "../errors";
import { usableAmount } from "../production/stock";
import { defineCommand } from "./command";

export const sellItems = defineCommand({
  type: "economy.sell",
  payloadSchema: z.object({ itemId: z.string().max(64), amount: z.number().int().min(1).max(9999) }).strict(),
  requiresFreshView: false,
  apply(state, payload) {
    const item = itemDefinition(payload.itemId);
    if (!item) throw new FwError("invalid_payload");
    if (usableAmount(state.inventory, state.production, payload.itemId) < payload.amount) {
      throw new FwError("not_enough_stock");
    }
    const inventory = { ...state.inventory, [payload.itemId]: (state.inventory[payload.itemId] ?? 0) - payload.amount };
    if (inventory[payload.itemId] === 0) delete inventory[payload.itemId];
    const gold = item.sellPrice * payload.amount;
    return {
      state: { ...state, inventory, wallet: { ...state.wallet, gold: state.wallet.gold + gold } },
      result: { itemId: payload.itemId, amount: payload.amount, gold },
    };
  },
});
