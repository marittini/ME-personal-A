// Reproducible economy baseline against the checked-out Forest Workshop domain.
// Run: node --import tsx scripts/forest-workshop-baseline.ts
// This deliberately does not model commands, 72h activity credits, upgrades, residents or stories.
import { initialProduction } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/production/initial";
import {
  advanceProduction,
  autoSellFloor,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/production/simulation";
import { todaysOrders } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/economy/deliveries";
import { itemDefinition } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/content/items";
import { STARTER_KIT } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/content/starter-kit";

const worldId = "baseline-2026-10-27";
const start = Date.parse("2026-10-27T00:00:00.000Z");
const hour = 3_600_000;
const days = 30;

function simulate(intervalHours: number, sell: boolean) {
  let production = initialProduction(worldId);
  let inventory: Record<string, number> = { ...STARTER_KIT.items };
  let gold = 0;
  let runs = 0;
  for (let elapsed = 0; elapsed < days * 24; elapsed += intervalHours) {
    const result = advanceProduction(production, inventory, intervalHours * hour, {
      realStart: start + elapsed * hour,
    });
    production = result.production;
    inventory = result.inventory;
    gold += result.summary.gold;
    runs += result.summary.runs;
    if (sell) {
      for (const itemId of ["berry-jam", "dried-herb"]) {
        const amount = inventory[itemId] ?? 0;
        gold += amount * (itemDefinition(itemId)?.sellPrice ?? 0);
        delete inventory[itemId];
      }
    }
  }
  return {
    intervalHours,
    policy: sell ? "sell all jam and dried herb on each visit" : "no actions",
    runs,
    gold,
    inventory,
  };
}

function simulateContinuous(intervalHours: number) {
  let production = initialProduction(worldId);
  production.autoSell["berry-jam"] = { enabled: true, keep: 5, dailyMax: 8, continuous: true };
  let inventory: Record<string, number> = { ...STARTER_KIT.items };
  let gold = 0;
  let runs = 0;
  for (let elapsed = 0; elapsed < days * 24; elapsed += intervalHours) {
    const result = advanceProduction(production, inventory, intervalHours * hour, {
      realStart: start + elapsed * hour,
    });
    production = result.production;
    inventory = result.inventory;
    gold += result.summary.gold;
    runs += result.summary.runs;
  }
  return { intervalHours, policy: "continuous jam, keep 5, daily max 8", runs, gold, inventory };
}

for (const interval of [0.5, 2, 8, 24, 72]) {
  for (const sell of [false, true]) console.log(JSON.stringify(simulate(interval, sell)));
  console.log(JSON.stringify(simulateContinuous(interval)));
}
const production = initialProduction(worldId);
production.autoSell["berry-jam"] = { enabled: true, keep: 0, dailyMax: 999 };
const stalled = advanceProduction(production, { ...STARTER_KIT.items }, 24 * hour, { realStart: start });
console.log(
  JSON.stringify({
    test: "jam auto-sell",
    floor: autoSellFloor(production, "berry-jam"),
    sold: stalled.summary.sold,
    gold: stalled.summary.gold,
    inventory: stalled.inventory,
  }),
);
const base = simulate(24, false).inventory;
let daysWithFeasibleOrder = 0;
for (let day = 0; day < days; day++) {
  const date = new Date(start + day * 24 * hour).toISOString().slice(0, 10);
  if (todaysOrders(worldId, date).some((order) => Object.entries(order.items).every(([id, n]) => (base[id] ?? 0) >= n)))
    daysWithFeasibleOrder++;
}
console.log(
  JSON.stringify({
    test: "static inventory order availability",
    days,
    worldId,
    daysWithFeasibleOrder,
    note: "Does not fulfill orders or consume stock; assumes settled baseline inventory at each date.",
  }),
);
