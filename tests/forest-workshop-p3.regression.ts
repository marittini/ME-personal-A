// Forest Workshop P3a regressions: automatic production (plan §7.2, §7.6, §11 핵심 시험).
//   - content validation refuses recipe cycles
//   - the 72-hour absence rule: 71:59:59 / 72:00:00 / 72:00:01 / 7 days, background settlements, return, clock reversal
//   - a run paused at the 72-hour edge keeps its remaining time
//   - online/offline equivalence: one settlement or many give the same workshop
//   - targets (stock + running output), at most one batch over, protected stock never used, resume after use
//   - rule order: priority, then list order
//   - commands: rules, protection, upgrade (once, server cost), selling, 작업 보고 grants nothing
// Run: npx tsx tests/forest-workshop-p3.regression.ts
import assert from "node:assert/strict";
import { FakeHost } from "./support/forest-workshop-fake-host";

import {
  RECIPES,
  runDurationMs,
  upgradeCost,
  validateProductionContent,
  FACILITIES,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/content/production";
import { FwError } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/errors";
import {
  ABSENCE_LIMIT_MS,
  LEASE_MS,
  type Activity,
  type ProductionState,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/model/production";
import {
  creditTime,
  presentActivity,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/production/activity";
import { initialProduction } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/production/initial";
import { advanceProduction } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/production/simulation";
import { settleWorld } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/production/settle";
import {
  createWorldState,
  worldStateSchema,
  type WorldState,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/world-model";
import { createCommandService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/command-service";
import { createSettlementService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/settlement-service";
import { createWorldService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/world-service";

const WORLD = "11111111-1111-4111-8111-111111111111";
const T0 = Date.UTC(2026, 9, 27, 0, 0, 0);
const HOUR = 3_600_000;
const MIN = 60_000;
const iso = (ms: number) => new Date(ms).toISOString();

async function rejects(promise: Promise<unknown>, code: string, label: string) {
  try {
    await promise;
  } catch (error) {
    assert.ok(error instanceof FwError, `${label}: expected FwError, got ${String(error)}`);
    assert.equal(error.code, code, label);
    return;
  }
  assert.fail(`${label}: expected ${code}`);
}

/** A world present at T0 with the given storeroom, checked against the schema. */
function world(inventory: Record<string, number> = {}): WorldState {
  const base = createWorldState({ worldId: WORLD, worldName: "숲", playerNickname: "공방지기", now: iso(T0) });
  return worldStateSchema.parse({
    ...base,
    inventory,
    production: { ...base.production, activity: presentActivity(iso(T0)) },
  });
}

/** Production as a comparable value: everything except report bookkeeping. */
function essence(state: WorldState) {
  const { reports: _reports, nextReportId: _next, activity: _activity, ...rest } = state.production;
  return { inventory: state.inventory, production: rest };
}

async function main() {
  // Content: the shipped data is valid; a cycle or a self-feeding recipe is refused.
  {
    validateProductionContent();
    const facilities = [{ id: "f", name: "f", field: "process" as const, order: 1, description: "" }];
    assert.throws(
      () =>
        validateProductionContent(facilities, [
          {
            id: "a",
            name: "a",
            facilityId: "f",
            description: "",
            inputs: { herb: 1 },
            outputs: { "berry-jam": 1 },
            minutes: 1,
          },
          {
            id: "b",
            name: "b",
            facilityId: "f",
            description: "",
            inputs: { "berry-jam": 1 },
            outputs: { herb: 1 },
            minutes: 1,
          },
        ]),
      /cycle/u,
    );
    assert.throws(
      () =>
        validateProductionContent(facilities, [
          {
            id: "a",
            name: "a",
            facilityId: "f",
            description: "",
            inputs: { herb: 1 },
            outputs: { herb: 2 },
            minutes: 1,
          },
        ]),
      /cycle/u,
    );
    assert.equal(FACILITIES.length, 2);
    assert.equal(RECIPES.length, 3);
  }

  // The 72-hour rule.
  {
    const present: Activity = presentActivity(iso(T0));
    const leaseEnd = T0 + LEASE_MS;
    // Present the whole time (heartbeats renew the lease): everything counts.
    let a = present;
    let credited = 0;
    for (let t = T0 + MIN; t <= T0 + 10 * MIN; t += MIN) {
      const c = creditTime(a, iso(t), { active: true });
      credited += c.creditedMs;
      a = c.activity;
    }
    assert.equal(credited, 10 * MIN, "online time counts fully");

    const away = (ms: number) => creditTime(present, iso(leaseEnd + ms), { active: true });
    assert.equal(away(72 * HOUR - 1000).creditedMs, LEASE_MS + 72 * HOUR - 1000, "71:59:59");
    assert.equal(away(72 * HOUR).creditedMs, LEASE_MS + ABSENCE_LIMIT_MS, "72:00:00");
    assert.equal(away(72 * HOUR + 1000).creditedMs, LEASE_MS + ABSENCE_LIMIT_MS, "72:00:01 adds nothing");
    assert.equal(away(7 * 24 * HOUR).creditedMs, LEASE_MS + ABSENCE_LIMIT_MS, "7 days = 72 hours");
    const back = away(7 * 24 * HOUR);
    assert.equal(back.activity.absenceUsedMs, 0, "returning closes the absence");
    assert.deepEqual(back.activity.lastAbsence, { creditedMs: ABSENCE_LIMIT_MS, totalMs: 7 * 24 * HOUR });

    // Background settlements during one absence (reads, other services) never exceed the 72 hours in total.
    let b = present;
    let total = 0;
    for (const hours of [10, 30, 50, 71, 72, 100, 168]) {
      const c = creditTime(b, iso(leaseEnd + hours * HOUR), { active: false });
      total += c.creditedMs;
      b = c.activity;
    }
    assert.equal(total, LEASE_MS + ABSENCE_LIMIT_MS, "piecewise settlement keeps the one 72-hour budget");
    const returned = creditTime(b, iso(leaseEnd + 200 * HOUR), { active: true });
    assert.equal(returned.creditedMs, 0, "a refresh after the cap credits nothing more");
    // The next absence gets a new budget.
    const nextAbsence = creditTime(returned.activity, iso(leaseEnd + 200 * HOUR + LEASE_MS + 5 * HOUR), {
      active: false,
    });
    assert.equal(nextAbsence.creditedMs, LEASE_MS + 5 * HOUR, "a new absence has its own 72 hours");

    // A clock that runs backwards credits nothing and never moves the cursor back.
    const ahead = creditTime(present, iso(T0 + 5 * MIN), { active: true }).activity;
    const reversed = creditTime(ahead, iso(T0 + MIN), { active: false });
    assert.equal(reversed.creditedMs, 0);
    assert.equal(reversed.activity.settledAt, ahead.settledAt);
  }

  // Production basics: gathering runs by itself; jam waits for berries, then follows.
  {
    const start = world({});
    const after = settleWorld(start, iso(T0 + 30 * MIN), { active: true });
    const berryMs = runDurationMs(
      RECIPES.find((r) => r.id === "gather-berry")!,
      1,
    );
    assert.equal(berryMs, 10 * MIN);
    // 30 min of gathering: berries at 10, 20, 30 → jam starts at 20 (4 berries), stock = 9 − 4 = 5 at minute 30.
    assert.equal(after.inventory["wild-berry"], 5, "berries after 30 min");
    assert.equal(after.production.facilities["process-bench"]!.job?.recipeId, "berry-jam", "jam in progress");
    assert.equal(after.production.reports.length, 1, "one 작업 보고 entry");
    assert.deepEqual(after.production.reports[0]!.produced, { "wild-berry": 9 });
  }

  // Online/offline equivalence: one settlement or many give the same workshop.
  {
    const start = world({ "wild-berry": 7, herb: 3 });
    const once = settleWorld(start, iso(T0 + 9 * HOUR + 7 * MIN), { active: true });
    let pieces = start;
    for (const t of [3 * MIN, 17 * MIN, 61 * MIN, 2 * HOUR, 2 * HOUR + 1, 5 * HOUR + 33 * MIN, 9 * HOUR + 7 * MIN]) {
      pieces = settleWorld(pieces, iso(T0 + t), { active: true });
    }
    assert.deepEqual(essence(pieces), essence(once), "many settlements = one settlement");
    // Same with absence in the middle (no heartbeats): the result follows the credited time only.
    const awayOnce = settleWorld(start, iso(T0 + 100 * HOUR), { active: false });
    let awayPieces = start;
    for (const t of [HOUR, 20 * HOUR, 71 * HOUR, 80 * HOUR, 100 * HOUR]) {
      awayPieces = settleWorld(awayPieces, iso(T0 + t), { active: false });
    }
    assert.deepEqual(essence(awayPieces), essence(awayOnce), "background settlements during absence");
    assert.equal(awayOnce.production.simMs, LEASE_MS + ABSENCE_LIMIT_MS, "credited 72 hours (+ the lease grace)");
    const sevenDays = settleWorld(start, iso(T0 + 7 * 24 * HOUR), { active: false });
    assert.deepEqual(essence(sevenDays), essence(awayOnce), "7 days away = 72 hours away");
  }

  // A run paused at the 72-hour edge keeps its remaining time until the return.
  {
    const base = world({});
    const yard = base.production.facilities["gather-yard"]!;
    // A target the gatherers never reach, so a run is always in progress.
    const start: WorldState = {
      ...base,
      production: {
        ...base.production,
        facilities: {
          ...base.production.facilities,
          "gather-yard": { ...yard, rules: [{ ...yard.rules[1]!, targetStock: 999 }] },
        },
      },
    };
    const away = settleWorld(start, iso(T0 + 7 * 24 * HOUR), { active: false });
    const job = away.production.facilities["gather-yard"]!.job!;
    const remaining = job.endsSim - away.production.simMs;
    assert.ok(remaining > 0 && remaining <= 12 * MIN, "a run is mid-way at the edge");
    const back = settleWorld(away, iso(T0 + 7 * 24 * HOUR + MIN), { active: true });
    assert.equal(back.production.simMs, away.production.simMs, "returning credits nothing for the gap");
    const later = settleWorld(back, iso(T0 + 7 * 24 * HOUR + MIN + remaining - 1), { active: true });
    assert.equal(later.production.facilities["gather-yard"]!.job?.jobId, job.jobId, "same run, one ms before its end");
  }

  // Targets, overproduction by at most one batch, protection, resume after use.
  {
    // Berry target 30: stock 29 + 3 from one run = 32 (one batch over), then the yard turns to herbs.
    let state = world({ "wild-berry": 29, herb: 10 });
    state = {
      ...state,
      production: {
        ...state.production,
        facilities: {
          ...state.production.facilities,
          "process-bench": { ...state.production.facilities["process-bench"]!, rules: [] },
        },
      },
    };
    state = settleWorld(state, iso(T0 + 10 * MIN), { active: true });
    assert.equal(state.inventory["wild-berry"], 32, "at most one batch over the target");
    state = settleWorld(state, iso(T0 + 11 * MIN), { active: true });
    assert.equal(
      state.production.facilities["gather-yard"]!.waiting?.reason,
      "target_reached",
      "herbs at target 10 too",
    );

    // Protection: 20 of 22 berries protected → jam waits, naming the protected amount.
    let protectedWorld = world({ "wild-berry": 22 });
    protectedWorld = {
      ...protectedWorld,
      production: {
        ...protectedWorld.production,
        protectedStock: { "wild-berry": 20 },
        facilities: {
          ...protectedWorld.production.facilities,
          "gather-yard": { ...protectedWorld.production.facilities["gather-yard"]!, rules: [] },
        },
      },
    };
    const waited = settleWorld(protectedWorld, iso(T0 + 5 * HOUR), { active: true });
    assert.equal(waited.inventory["wild-berry"], 22, "protected stock is never used");
    assert.deepEqual(waited.production.facilities["process-bench"]!.waiting, {
      reason: "materials",
      itemId: "wild-berry",
      needed: 4,
      usable: 2,
      protectedAmount: 20,
    });
  }

  // Rule order: smaller priority first; ties keep the list order.
  {
    const base = world({});
    const yard = base.production.facilities["gather-yard"]!;
    const [berry, herb] = yard.rules;
    const tie: ProductionState = {
      ...base.production,
      facilities: {
        ...base.production.facilities,
        "gather-yard": {
          ...yard,
          rules: [
            { ...herb!, priority: 1 },
            { ...berry!, priority: 1 },
          ],
        },
      },
    };
    const run = advanceProduction(tie, {}, 0);
    assert.equal(run.production.facilities["gather-yard"]!.job?.recipeId, "gather-herb", "tie → list order");
    const ordered: ProductionState = {
      ...base.production,
      facilities: {
        ...base.production.facilities,
        "gather-yard": {
          ...yard,
          rules: [
            { ...herb!, priority: 2 },
            { ...berry!, priority: 1 },
          ],
        },
      },
    };
    assert.equal(advanceProduction(ordered, {}, 0).production.facilities["gather-yard"]!.job?.recipeId, "gather-berry");
  }

  // Commands through the service: rules, protection, upgrade, sell, 작업 보고.
  {
    const host = new FakeHost();
    let now = T0;
    const clock = () => new Date(now);
    const worlds = createWorldService(host.persistence, clock);
    const commands = createCommandService(host.persistence, clock);
    const settlement = createSettlementService(host.persistence, clock);
    await worlds.create({ worldId: WORLD, worldName: "숲", playerNickname: "공방지기" });
    let seq = 0;
    const run = async (type: string, payload: unknown, commandId = `cmd-p3-${seq++}`) =>
      commands.execute({
        worldId: WORLD,
        commandId,
        expectedRevision: (await worlds.get(WORLD)).revision,
        type,
        payload,
      });

    const yardRules = (await worlds.get(WORLD)).state.production.facilities["gather-yard"]!.rules;
    await rejects(
      run("production.setRules", { facilityId: "gather-yard", rules: [{ ...yardRules[0]!, recipeId: "berry-jam" }] }),
      "invalid_rules",
      "recipe of another facility",
    );
    await rejects(
      run("production.setRules", {
        facilityId: "gather-yard",
        rules: [yardRules[0], { ...yardRules[0]!, policyId: yardRules[1]!.policyId }],
      }),
      "invalid_rules",
      "same recipe twice",
    );
    await rejects(
      run("production.setRules", { facilityId: "gather-yard", rules: [{ ...yardRules[0]!, targetStock: 1000 }] }),
      "invalid_payload",
      "target 1–999",
    );
    const changed = await run("production.setRules", {
      facilityId: "gather-yard",
      rules: [{ ...yardRules[0]!, targetStock: 12 }],
    });
    assert.equal(changed.state.production.facilities["gather-yard"]!.rules.length, 1);

    // Upgrade: the server's cost, once even if the same tap is sent twice.
    await run("onboarding.claimStarterKit", {});
    const before = (await worlds.get(WORLD)).state.wallet.gold;
    const up = await run("production.upgradeFacility", { facilityId: "process-bench", fromLevel: 1 }, "cmd-upgrade-1");
    assert.equal(up.state.wallet.gold, before - upgradeCost(1));
    assert.equal(up.state.production.facilities["process-bench"]!.level, 2);
    const replay = await run(
      "production.upgradeFacility",
      { facilityId: "process-bench", fromLevel: 1 },
      "cmd-upgrade-1",
    );
    assert.equal(replay.duplicate, true);
    await rejects(
      run("production.upgradeFacility", { facilityId: "process-bench", fromLevel: 1 }),
      "stale_view",
      "second tap from the old screen",
    );
    assert.equal((await worlds.get(WORLD)).state.production.facilities["process-bench"]!.level, 2, "upgraded once");
    assert.ok(runDurationMs(RECIPES[2]!, 2) < runDurationMs(RECIPES[2]!, 1), "level 2 is faster");

    // Protection and selling: protected stock cannot be sold.
    const herb = (await worlds.get(WORLD)).state.inventory.herb ?? 0;
    await run("production.setProtected", { itemId: "herb", amount: herb - 2 });
    await rejects(run("economy.sell", { itemId: "herb", amount: 3 }), "not_enough_stock", "selling protected stock");
    const sold = await run("economy.sell", { itemId: "herb", amount: 2 });
    assert.equal(sold.result.gold, 4);
    await rejects(run("production.setProtected", { itemId: "gold-bar", amount: 1 }), "invalid_payload", "unknown item");

    // A read settles and saves; 작업 보고 reading grants nothing.
    now = T0 + 2 * HOUR;
    const read = await settlement.settle(WORLD, { active: false });
    assert.ok(read.state.production.reports.length > 0, "a read files the report");
    const stored = await worlds.get(WORLD);
    assert.deepEqual(stored.state.inventory, read.state.inventory, "what was shown was saved");
    const latest = read.state.production.reports[0]!.reportId;
    const marked = await run("production.markReportsRead", { throughReportId: latest });
    assert.equal(marked.state.production.reportsReadThrough, latest);
    const again = await run("production.markReportsRead", { throughReportId: latest });
    assert.deepEqual(again.state.inventory, marked.state.inventory, "reading again changes nothing");
    assert.deepEqual(again.state.wallet, marked.state.wallet);
  }

  // A new world starts with the recommended rules and initial production valid against the schema.
  {
    const production = initialProduction(WORLD);
    assert.deepEqual(Object.keys(production.facilities).sort(), ["gather-yard", "process-bench"]);
    assert.deepEqual(initialProduction(WORLD), production, "the same rules on a retried creation");
  }

  console.log("forest-workshop P3 regressions: OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
