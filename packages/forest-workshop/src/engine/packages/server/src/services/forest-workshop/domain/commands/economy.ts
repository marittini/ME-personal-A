// Economy commands (plan §7.2-C, boards 01-3 시설과 창고 · 03-3 초대):
//   economy.sell        창고에서 팔기: usable stock (never protected stock) for the server's price (content/items.ts).
//   economy.setAutoSell 자동 판매: per item, off by default; 판매 후 남길 수량 and 하루 최대 판매량. It sells after runs
//                       complete and never below max(남길 수량, active production target, protected stock).
//   economy.deliver     납품: one of today's requests (UTC day), taken from usable stock, for 초대권 and gold. The
//                       player confirms each one; nothing is delivered automatically.
import { z } from "zod";
import { itemDefinition } from "../../content/items";
import { todaysOrders } from "../economy/deliveries";
import { FwError } from "../errors";
import { autoSellSchema } from "../model/production";
import { usableAmount } from "../production/stock";
import { utcDay } from "../production/simulation";
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

export const setAutoSell = defineCommand({
  type: "economy.setAutoSell",
  payloadSchema: z.object({ itemId: z.string().max(64), setting: autoSellSchema }).strict(),
  requiresFreshView: false,
  apply(state, payload) {
    if (!itemDefinition(payload.itemId)) throw new FwError("invalid_payload");
    const autoSell = { ...state.production.autoSell, [payload.itemId]: payload.setting };
    return {
      state: { ...state, production: { ...state.production, autoSell } },
      result: { itemId: payload.itemId, enabled: payload.setting.enabled },
    };
  },
});

export const deliverOrder = defineCommand({
  type: "economy.deliver",
  payloadSchema: z.object({ orderId: z.string().max(64) }).strict(),
  requiresFreshView: false,
  apply(state, payload, context) {
    const day = utcDay(Date.parse(context.now));
    const order = todaysOrders(state.worldId, day).find((candidate) => candidate.id === payload.orderId);
    if (!order) throw new FwError("order_not_found");
    const done = state.deliveries.day === day ? state.deliveries.done : [];
    if (done.includes(order.id)) throw new FwError("order_done");
    const inventory = { ...state.inventory };
    for (const [itemId, amount] of Object.entries(order.items)) {
      if (usableAmount(inventory, state.production, itemId) < amount) {
        throw new FwError("not_enough_stock", { details: { itemId } });
      }
      inventory[itemId] = (inventory[itemId] ?? 0) - amount;
      if (inventory[itemId] === 0) delete inventory[itemId];
    }
    return {
      state: {
        ...state,
        inventory,
        wallet: {
          ...state.wallet,
          gold: state.wallet.gold + order.reward.gold,
          tickets: state.wallet.tickets + order.reward.tickets,
        },
        deliveries: { day, done: [...done, order.id] },
      },
      result: { orderId: order.id, reward: order.reward },
    };
  },
});
