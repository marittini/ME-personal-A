// Forest Workshop P3b regressions: the rest of automatic management and invitations (plan §7.2-B/C/F, §7.6, §11).
//   - 해금: closed facilities never run, open once by their condition
//   - 지정 횟수: exactly N runs, inputs one run at a time, waiting without skipping, slots, mode switch keeps the run
//   - 자동 판매: off by default, never below max(남길 수량, target, protected), UTC daily limit, new day, equivalence,
//     no missed days beyond the 72-hour credit
//   - 배치 · 패시브 · 세트: field match only, 돌파 raises it, one place per resident, running runs keep their speed
//   - 초대: tickets, ten sequential draws, new → 돌파 → 종표, the guarantee, wish weights, 종표 교환, replay
//   - 납품: today's list, tickets, once per day, protected stock untouched, another day's list
//   - migration v4 → v5
// Run: npx tsx tests/forest-workshop-p3b.regression.ts
import assert from "node:assert/strict";
import { FakeHost } from "./support/forest-workshop-fake-host";

import { talentDefinition } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/content/talents";
import { assignTalent } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/residents/talent-assign";
import { passiveBonus } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/content/crew";
import { INVITE_RULES } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/content/invite";
import {
  queueSlots,
  recipeDefinition,
  runDurationMs,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/content/production";
import {
  getCommandDefinition,
  applyCommand,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/commands/registry";
import { todaysOrders } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/economy/deliveries";
import { FwError } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/errors";
import { drawChances } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/invite/draw";
import { migrateWorld } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/migrations";
import {
  DEFAULT_PLACEMENT,
  type Resident,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/model/residents";
import { presentActivity } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/production/activity";
import { crewBonuses } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/production/crew";
import { settleWorld } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/production/settle";
import {
  createWorldState,
  worldStateSchema,
  type WorldState,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/world-model";
import { createCommandService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/command-service";
import { createWorldService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/world-service";

const WORLD = "22222222-2222-4222-8222-222222222222";
const T0 = Date.UTC(2026, 9, 27, 20, 0, 0); // 20:00 UTC: a UTC midnight comes 4 hours in
const HOUR = 3_600_000;
const MIN = 60_000;
const iso = (ms: number) => new Date(ms).toISOString();
const uuid = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;

function resident(n: number, recruited: boolean, extra: Partial<Resident> = {}): Resident {
  return {
    residentId: uuid(n),
    kind: n % 2 ? "character" : "persona",
    sourceId: `src-${n}`,
    source: {
      name: `주민${n}`,
      description: "",
      personality: "",
      scenario: "",
      sourceHash: "0".repeat(64),
      takenAt: iso(T0),
    },
    displayName: `주민${n}`,
    worldSetting: "숲의 이웃",
    recruited,
    field: "gather",
    talentId: "berry-eye",
    breakthrough: 0,
    registeredAt: iso(T0),
    image: { current: null, history: [], placement: DEFAULT_PLACEMENT },
    changes: [],
    ...extra,
  };
}

/** A world present at T0 with the given storeroom and residents (the first, if recruited, is the starter). */
function world(inventory: Record<string, number> = {}, residents: Resident[] = []): WorldState {
  const base = createWorldState({ worldId: WORLD, worldName: "숲", playerNickname: "공방지기", now: iso(T0) });
  return worldStateSchema.parse({
    ...base,
    inventory,
    residents: Object.fromEntries(residents.map((r) => [r.residentId, r])),
    progress: { starterKitClaimed: true, starterResidentId: residents[0]?.recruited ? residents[0].residentId : null },
    production: { ...base.production, activity: presentActivity(iso(T0)) },
  });
}

let seq = 0;
function cmd(state: WorldState, type: string, payload: unknown, at = T0, seed = "seed") {
  return applyCommand(settleWorld(state, iso(at), { active: true }), getCommandDefinition(type), payload, {
    now: iso(at),
    commandId: `cmd-${seq++}`,
    seed,
  });
}

function refuses(run: () => unknown, code: string, label: string) {
  try {
    run();
  } catch (error) {
    assert.ok(error instanceof FwError, `${label}: expected FwError, got ${String(error)}`);
    assert.equal(error.code, code, label);
    return;
  }
  assert.fail(`${label}: expected ${code}`);
}

/** Present (heartbeat every minute) from `from` to `to`: settles in one-minute steps. */
function presentFor(state: WorldState, from: number, to: number, stepMs = MIN): WorldState {
  let s = state;
  for (let t = from + stepMs; t <= to; t += stepMs) s = settleWorld(s, iso(t), { active: true });
  return s;
}

function noRules(state: WorldState, facilityId: string): WorldState {
  const facilities = { ...state.production.facilities };
  facilities[facilityId] = { ...facilities[facilityId]!, rules: [] };
  return { ...state, production: { ...state.production, facilities } };
}

async function main() {
  // 해금: a closed facility never runs and refuses settings; it opens once its condition holds.
  {
    let s = world({ "wild-berry": 40 });
    assert.equal(s.production.facilities["grow-plot"]!.unlocked, false);
    s = presentFor(s, T0, T0 + 2 * HOUR, 10 * MIN);
    assert.equal(s.production.facilities["grow-plot"]!.job, null, "closed facility does not run");
    assert.equal(s.production.facilities["grow-plot"]!.waiting?.reason, "locked");
    assert.equal(s.inventory.wheat, undefined);
    refuses(
      () => cmd(world(), "production.unlockFacility", { facilityId: "grow-plot" }),
      "unlock_not_met",
      "condition not met",
    );
    refuses(
      () => cmd(world(), "production.setMode", { facilityId: "grow-plot", mode: "count" }),
      "facility_locked",
      "settings on a closed facility",
    );
    assert.ok((s.production.made["berry-jam"] ?? 0) >= 3, "jam was made");
    const opened = cmd(s, "production.unlockFacility", { facilityId: "grow-plot" }, T0 + 2 * HOUR);
    assert.equal(opened.state.production.facilities["grow-plot"]!.unlocked, true);
    assert.equal(opened.state.production.facilities["grow-plot"]!.job?.recipeId, "grow-wheat", "starts at once");
    const again = cmd(opened.state, "production.unlockFacility", { facilityId: "grow-plot" }, T0 + 2 * HOUR);
    assert.equal(again.result.alreadyOpen, true);
  }

  // 지정 횟수: exactly N runs, one run's inputs at a time, waits for materials without skipping.
  {
    let s = noRules(world({ "wild-berry": 10 }), "gather-yard");
    s = cmd(s, "production.setMode", { facilityId: "process-bench", mode: "count" }).state;
    // The auto rule had already started a jam at T0 (it keeps going); the queue starts after it.
    const running = s.production.facilities["process-bench"]!.job;
    assert.equal(running?.source, "rule", "the running run finishes as it is");
    s = cmd(s, "production.queueAdd", {
      facilityId: "process-bench",
      entryId: uuid(901),
      recipeId: "berry-jam",
      count: 3,
    }).state;
    const jam = runDurationMs(recipeDefinition("berry-jam")!, 1);
    s = presentFor(s, T0, T0 + 4 * jam + MIN);
    // 10 berries: the rule run took 4 at T0; the queue can take 4 once more, then 2 left < 4 → waits on run 2 of 3.
    assert.equal(s.inventory["berry-jam"], 2, "1 rule run + 1 queue run");
    assert.equal(s.inventory["wild-berry"], 2);
    const bench = s.production.facilities["process-bench"]!;
    assert.equal(bench.waiting?.reason, "materials", "waits without skipping");
    assert.deepEqual(
      bench.queue.map((entry) => [entry.started, entry.total]),
      [[1, 3]],
    );
    // Materials arrive → resumes; target (5) is ignored in this mode; exactly 3 queue runs in all.
    s = { ...s, inventory: { ...s.inventory, "wild-berry": 40 } };
    s = presentFor(s, T0 + 4 * jam + MIN, T0 + 10 * jam);
    assert.equal(s.inventory["berry-jam"], 4, "3 queue runs + the rule run");
    assert.equal(s.production.facilities["process-bench"]!.queue.length, 0);
    assert.equal(s.production.facilities["process-bench"]!.waiting?.reason, "queue_empty");
    assert.deepEqual(
      s.production.facilities["process-bench"]!.rules,
      world().production.facilities["process-bench"]!.rules,
      "rules wait unchanged",
    );
    // Slots: 3 at level 1.
    assert.equal(queueSlots(1), 3);
    assert.equal(queueSlots(8), 4);
    assert.equal(queueSlots(20), 5);
    let q = cmd(world(), "production.setMode", { facilityId: "gather-yard", mode: "count" }).state;
    for (let i = 0; i < 3; i += 1) {
      q = cmd(q, "production.queueAdd", {
        facilityId: "gather-yard",
        entryId: uuid(910 + i),
        recipeId: "gather-herb",
        count: 2,
      }).state;
    }
    refuses(
      () =>
        cmd(q, "production.queueAdd", {
          facilityId: "gather-yard",
          entryId: uuid(920),
          recipeId: "gather-herb",
          count: 1,
        }),
      "queue_full",
      "slots",
    );
    refuses(
      () =>
        cmd(q, "production.queueAdd", {
          facilityId: "gather-yard",
          entryId: uuid(921),
          recipeId: "berry-jam",
          count: 1,
        }),
      "invalid_payload",
      "recipe of another facility",
    );
    const removed = cmd(q, "production.queueRemove", { facilityId: "gather-yard", entryId: uuid(912) });
    assert.equal(removed.state.production.facilities["gather-yard"]!.queue.length, 2);
    // Back to 자동 운영: the queue waits (paused), unchanged.
    const back = cmd(removed.state, "production.setMode", { facilityId: "gather-yard", mode: "auto" });
    assert.equal(back.state.production.facilities["gather-yard"]!.queue.length, 2);
  }

  // 자동 판매.
  {
    const base = noRules(noRules(world({ "berry-jam": 30 }), "gather-yard"), "process-bench");
    // Off by default: nothing is sold.
    const off = presentFor(base, T0, T0 + 30 * MIN, 10 * MIN);
    assert.equal(off.inventory["berry-jam"], 30);
    assert.equal(off.wallet.gold, 0);
    // On: keep 5, at most 8 a day; protected 12 → the floor is 12.
    let s = cmd(base, "production.setProtected", { itemId: "berry-jam", amount: 12 }).state;
    s = cmd(s, "economy.setAutoSell", { itemId: "berry-jam", setting: { enabled: true, keep: 5, dailyMax: 8 } }).state;
    assert.equal(s.inventory["berry-jam"], 22, "sold 8 at once (the day's limit)");
    assert.equal(s.wallet.gold, 8 * 14);
    s = presentFor(s, T0, T0 + 3 * HOUR, 10 * MIN);
    assert.equal(s.inventory["berry-jam"], 22, "the limit holds for the rest of the UTC day");
    // A new UTC day (00:00) allows more, down to the floor (12).
    s = presentFor(s, T0 + 3 * HOUR, T0 + 5 * HOUR, 10 * MIN);
    assert.equal(s.inventory["berry-jam"], 14);
    assert.equal(s.production.sales.day, "2026-10-28");
    // An active production target above the floor raises it.
    let t = cmd(base, "economy.setAutoSell", {
      itemId: "berry-jam",
      setting: { enabled: true, keep: 0, dailyMax: 99 },
    }).state;
    assert.equal(t.inventory["berry-jam"] ?? 0, 0, "no floor: all sold");
    const withTarget = world({ "berry-jam": 30 });
    t = cmd(noRules(withTarget, "gather-yard"), "economy.setAutoSell", {
      itemId: "berry-jam",
      setting: { enabled: true, keep: 0, dailyMax: 99 },
    }).state;
    assert.equal(t.inventory["berry-jam"], 5, "kept at the jam rule's target (5)");
    // Equivalence: one settlement across midnight = many.
    const start = cmd(base, "economy.setAutoSell", {
      itemId: "berry-jam",
      setting: { enabled: true, keep: 0, dailyMax: 10 },
    }).state;
    const one = settleWorld(start, iso(T0 + 6 * HOUR), { active: true });
    const many = presentFor(start, T0, T0 + 6 * HOUR, 7 * MIN);
    const manyEnd = settleWorld(many, iso(T0 + 6 * HOUR), { active: true });
    assert.deepEqual(one.inventory, manyEnd.inventory);
    assert.equal(one.wallet.gold, manyEnd.wallet.gold);
    assert.equal(one.inventory["berry-jam"], 10, "10 on day 1, 10 on day 2");
    // Away for a week: only the credited 72 hours count — 4 UTC days touched, not 7.
    const away = settleWorld(
      { ...start, production: { ...start.production, activity: presentActivity(iso(T0)) } },
      iso(T0 + 7 * 24 * HOUR),
      { active: false },
    );
    assert.equal(30 - (away.inventory["berry-jam"] ?? 0), 30, "30 sold over the 4 credited days (10/day)");
    const awayLong = settleWorld(
      cmd(world({ "berry-jam": 90 }), "economy.setAutoSell", {
        itemId: "berry-jam",
        setting: { enabled: true, keep: 0, dailyMax: 10 },
      }).state,
      iso(T0 + 7 * 24 * HOUR),
      { active: false },
    );
    // 20:00 day 1 → +72 h = 20:00 day 4: days 27, 28, 29, 30 (UTC) → at most 40, never 70 or more.
    const sold = 90 - (awayLong.inventory["berry-jam"] ?? 0) + (awayLong.production.made["berry-jam"] ?? 0);
    assert.equal(sold, 40, "missed days are not collected: 4 days × 10, not 8");
  }

  // 배치 · 패시브 · 세트.
  {
    const a = resident(1, true, { field: "process", talentId: "fine-mill", breakthrough: 0 });
    const b = resident(2, true, { field: "gather", talentId: "herb-nose", breakthrough: 5 });
    const c = resident(3, false);
    let s = world({}, [a, b, c]);
    refuses(
      () => cmd(s, "production.assignResident", { facilityId: "process-bench", residentId: c.residentId }),
      "resident_not_recruited",
      "only residents who came",
    );
    s = cmd(s, "production.assignResident", { facilityId: "process-bench", residentId: a.residentId }).state;
    let bonuses = crewBonuses(s);
    assert.equal(bonuses["process-bench"]!.passive, passiveBonus(0));
    assert.equal(passiveBonus(0), 0.05);
    assert.equal(passiveBonus(5), 0.1);
    // Moving a resident takes them out of the other facility.
    const moved = cmd(s, "production.assignResident", { facilityId: "gather-yard", residentId: a.residentId }).state;
    assert.equal(moved.production.facilities["process-bench"]!.residentId, null);
    assert.equal(crewBonuses(moved)["gather-yard"]!.passive, 0, "a different field gives no passive");
    // Both residents of a pair placed: the set bonus applies everywhere.
    s = cmd(s, "production.assignResident", { facilityId: "gather-yard", residentId: b.residentId }).state;
    s = {
      ...s,
      pairs: {
        [uuid(700)]: {
          pairId: uuid(700),
          residentIds: [a.residentId, b.residentId],
          createdAt: iso(T0),
          familiarity: 0,
          ease: 0,
          lastEvent: null,
          archived: false,
          archivedAt: null,
        } as never,
      },
    };
    s = worldStateSchema.parse(s);
    bonuses = crewBonuses(s);
    assert.equal(bonuses["survey-desk"]!.set, 0.01);
    assert.equal(bonuses["gather-yard"]!.total, 0.11);
    // A run started now uses the bonus; one already running keeps its speed.
    const started = settleWorld(noRules(s, "gather-yard"), iso(T0 + MIN), { active: true });
    const fresh = cmd(
      { ...started, inventory: { "wild-berry": 8 } },
      "production.setRules",
      { facilityId: "process-bench", rules: started.production.facilities["process-bench"]!.rules },
      T0 + MIN,
    ).state;
    const job = fresh.production.facilities["process-bench"]!.job!;
    assert.equal(job.endsSim - job.startedSim, runDurationMs(recipeDefinition("berry-jam")!, 1, 0.06));
    const unplaced = cmd(
      fresh,
      "production.assignResident",
      { facilityId: "process-bench", residentId: null },
      T0 + MIN,
    );
    assert.equal(unplaced.state.production.facilities["process-bench"]!.job!.endsSim, job.endsSim, "keeps its speed");
    // 전문 분야 and 특기 are decided at registration: there is no command to change them.
    refuses(() => getCommandDefinition("residents.setField"), "unknown_command", "fields are not picked afterwards");
  }

  // 특기: a matching resident's talent acts on its one recipe (speed or one input less).
  {
    const thrifty = resident(1, true, { field: "process", talentId: "jam-thrift" });
    let s = settleWorld(noRules(world({ "wild-berry": 3 }, [thrifty]), "gather-yard"), iso(T0), { active: true });
    assert.equal(s.production.facilities["process-bench"]!.waiting?.reason, "materials", "3 berries: not enough alone");
    s = cmd(s, "production.assignResident", { facilityId: "process-bench", residentId: thrifty.residentId }).state;
    const jam = s.production.facilities["process-bench"]!.job;
    assert.deepEqual(jam?.consumed, { "wild-berry": 3 }, "알뜰한 잼 솥: one berry less");
    assert.equal(s.inventory["wild-berry"] ?? 0, 0);
    const picker = resident(1, true, { field: "gather", talentId: "berry-eye" });
    let g = world({}, [picker]);
    g = cmd(g, "production.assignResident", { facilityId: "gather-yard", residentId: picker.residentId }, T0).state;
    // The berry run started at T0 before placement keeps its speed; the next one uses passive 5% + talent 15%.
    g = presentFor(g, T0, T0 + 11 * MIN);
    const run = g.production.facilities["gather-yard"]!.job!;
    assert.equal(run.recipeId, "gather-berry");
    assert.equal(run.endsSim - run.startedSim, runDurationMs(recipeDefinition("gather-berry")!, 1, 0.2));
    // The same talent elsewhere (a field that does not match) does nothing.
    const away = cmd(g, "production.assignResident", { facilityId: "process-bench", residentId: picker.residentId });
    assert.equal(crewBonuses(away.state)["process-bench"]!.talent, null);
    // Assignment from the source text: a baker leans to 제작; no hint → the same field every time.
    const baker = assignTalent(WORLD, "character", "b1", {
      name: "마을 제빵사",
      description: "새벽마다 빵을 굽는 제빵 장인.",
      personality: "",
      scenario: "",
    });
    assert.equal(baker.field, "craft");
    assert.equal(talentDefinition(baker.talentId)?.field, "craft");
    const plain = { name: "이름", description: "", personality: "", scenario: "" };
    assert.deepEqual(assignTalent(WORLD, "persona", "p1", plain), assignTalent(WORLD, "persona", "p1", plain));
  }

  // 초대.
  {
    const residents = [resident(1, true), resident(2, false), resident(3, false)];
    const noStarter = worldStateSchema.parse({
      ...world({}, residents.slice(1)),
      progress: { starterKitClaimed: true, starterResidentId: null },
    });
    refuses(() => cmd(noStarter, "invite.draw", { count: 1 }), "starter_needed", "starter first");
    let s = { ...world({}, residents), wallet: { gold: 0, tickets: 12, tokens: 0 } };
    refuses(
      () => cmd({ ...s, wallet: { ...s.wallet, tickets: 9 } }, "invite.draw", { count: 10 }),
      "not_enough_tickets",
      "10 tickets",
    );
    refuses(() => cmd(s, "invite.draw", { count: 3 }), "invalid_payload", "1 or 10 only");
    const ten = cmd(s, "invite.draw", { count: 10 }, T0, "fixed-seed");
    const draws = ten.result.draws as Array<{ residentId: string; outcome: string; via: string }>;
    assert.equal(draws.length, 10);
    assert.equal(ten.state.wallet.tickets, 2);
    // Sequential: a resident's first draw is "new", later ones are 돌파 (never "new" twice).
    const seen = new Set<string>([residents[0]!.residentId]);
    for (const draw of draws) {
      assert.equal(draw.outcome, seen.has(draw.residentId) ? "breakthrough" : "new", "each draw sees the last");
      seen.add(draw.residentId);
    }
    const total = Object.values(ten.state.residents).reduce((sum, r) => sum + r.breakthrough, 0);
    assert.equal(total + draws.filter((d) => d.outcome === "new").length, 10, "every draw counted once");
    assert.equal(ten.state.invite.log.length, 10);
    // Same seed → same result (the server's seed decides, not the client's commandId).
    const tenAgain = cmd(s, "invite.draw", { count: 10 }, T0, "fixed-seed");
    assert.deepEqual(tenAgain.result.draws, ten.result.draws);
    // Guarantee: after 9 draws without a new resident, the next brings a waiting one — the wished one first.
    s = {
      ...s,
      invite: { ...s.invite, sinceNew: INVITE_RULES.guaranteeAfter, wishResidentId: residents[2]!.residentId },
    };
    for (const seed of ["a", "b", "c", "d"]) {
      const g = cmd(s, "invite.draw", { count: 1 }, T0, seed);
      const draw = (g.result.draws as Array<{ residentId: string; via: string; outcome: string }>)[0]!;
      assert.equal(draw.via, "guarantee");
      assert.equal(draw.residentId, residents[2]!.residentId);
      assert.equal(draw.outcome, "new");
      assert.equal(g.state.invite.sinceNew, 0);
    }
    // Wish weight in the chances 확률 보기 shows.
    const chances = drawChances(s);
    assert.equal(Math.round(chances[residents[2]!.residentId]! * 100) / 100, 50);
    assert.equal(Math.round(chances[residents[0]!.residentId]! * 100) / 100, 25);
    // Past the last 돌파: 종표; 5 종표 → the chosen resident.
    const maxed = {
      ...world({}, [resident(1, true, { breakthrough: 5 })]),
      wallet: { gold: 0, tickets: 5, tokens: 0 },
    };
    const tokens = cmd(maxed, "invite.draw", { count: 1 }, T0, "x");
    assert.equal((tokens.result.draws as Array<{ outcome: string }>)[0]!.outcome, "token");
    assert.equal(tokens.state.wallet.tokens, 1);
    refuses(() => cmd(tokens.state, "invite.exchange", { residentId: uuid(1) }), "max_breakthrough", "maxed");
    const rich = { ...world({}, residents), wallet: { gold: 0, tickets: 0, tokens: 6 } };
    const exchanged = cmd(rich, "invite.exchange", { residentId: residents[1]!.residentId });
    assert.equal(exchanged.state.residents[residents[1]!.residentId]!.recruited, true);
    assert.equal(exchanged.state.wallet.tokens, 1);
    refuses(
      () => cmd(exchanged.state, "invite.exchange", { residentId: residents[2]!.residentId }),
      "not_enough_tokens",
      "5 tokens",
    );
    const wished = cmd(rich, "invite.setWish", { residentId: residents[2]!.residentId });
    assert.equal(wished.state.invite.wishResidentId, residents[2]!.residentId);
  }

  // Invite through the service: a retried command replays its result; tickets are spent once.
  {
    const host = new FakeHost();
    let now = T0;
    const clock = () => new Date(now);
    const worlds = createWorldService(host.persistence, clock);
    const commands = createCommandService(host.persistence, clock, {
      readSource: async (kind, id, at) => ({
        name: `${kind}-${id}`,
        description: "",
        personality: "",
        scenario: "",
        sourceHash: "1".repeat(64),
        takenAt: at,
      }),
    });
    await worlds.create({ worldId: WORLD, worldName: "숲", playerNickname: "공방지기" });
    let n = 0;
    const run = async (type: string, payload: unknown, commandId = `svc-${n++}`) =>
      commands.execute({
        worldId: WORLD,
        commandId,
        expectedRevision: (await worlds.get(WORLD)).revision,
        type,
        payload,
      });
    const kit = await run("onboarding.claimStarterKit", {});
    assert.equal(kit.state.wallet.tickets, 3, "the starter kit brings 초대권");
    for (const [i, kind] of [
      [1, "character"],
      [2, "persona"],
      [3, "character"],
    ] as const) {
      await run("residents.register", {
        residentId: uuid(i),
        source: { kind, id: `s${i}` },
        worldSetting: "숲의 이웃",
      });
    }
    await run("residents.chooseStarter", { residentId: uuid(1) });
    const first = await run("invite.draw", { count: 1 }, "draw-once");
    const replay = await run("invite.draw", { count: 1 }, "draw-once");
    assert.equal(replay.duplicate, true);
    assert.deepEqual(replay.result, first.result, "the stored result, not a new roll");
    assert.equal(replay.state.wallet.tickets, 2, "one ticket spent");
    now += MIN;
  }

  // 납품.
  {
    const day1 = todaysOrders(WORLD, "2026-10-27");
    assert.equal(day1.length, 3);
    assert.deepEqual(todaysOrders(WORLD, "2026-10-27"), day1, "the same list every time that day");
    assert.ok(["jam-jars", "berry-basket", "herb-bundle"].includes(day1[0]!.id), "one a new workshop can fill");
    const order = day1[0]!;
    const need = Object.fromEntries(Object.entries(order.items).map(([item, amount]) => [item, amount + 5]));
    let s = noRules(noRules(world(need), "gather-yard"), "process-bench");
    // Protected stock is never delivered.
    const [item, amount] = Object.entries(order.items)[0]!;
    const guarded = cmd(s, "production.setProtected", { itemId: item, amount: 6 }).state;
    refuses(() => cmd(guarded, "economy.deliver", { orderId: order.id }), "not_enough_stock", "protected stock");
    const delivered = cmd(s, "economy.deliver", { orderId: order.id });
    assert.equal(delivered.state.wallet.tickets, order.reward.tickets);
    assert.equal(delivered.state.inventory[item], 5);
    assert.equal(delivered.state.deliveries.done.length, 1);
    refuses(() => cmd(delivered.state, "economy.deliver", { orderId: order.id }), "order_done", "once a day");
    const other = [
      "jam-jars",
      "berry-basket",
      "herb-bundle",
      "dried-herbs",
      "flour-sack",
      "honey-jar",
      "pie-order",
    ].find((id) => !day1.some((o) => o.id === id))!;
    refuses(() => cmd(s, "economy.deliver", { orderId: other }), "order_not_found", "not today's");
    // Another UTC day: a new list; yesterday's done list does not carry over.
    s = delivered.state;
    const nextDay = T0 + 5 * HOUR;
    const day2 = todaysOrders(WORLD, "2026-10-28");
    const filled = { ...s, inventory: Object.fromEntries(Object.entries(day2[0]!.items).map(([i, a]) => [i, a])) };
    const d2 = cmd(filled, "economy.deliver", { orderId: day2[0]!.id }, nextDay);
    assert.equal(d2.state.deliveries.day, "2026-10-28");
    assert.deepEqual(d2.state.deliveries.done, [day2[0]!.id]);
    void amount;
  }

  // Migration v4 → v5 → v6 keeps a running job and the rules; new facilities closed; residents get a field and talent.
  {
    const v5 = settleWorld(world({ "wild-berry": 20 }, [resident(1, true)]), iso(T0 + MIN), { active: true });
    const v4: Record<string, unknown> = structuredClone(v5) as never;
    v4.schemaVersion = 4;
    v4.wallet = { gold: 5 };
    delete v4.invite;
    delete v4.deliveries;
    const production = v4.production as Record<string, unknown>;
    const facilities = production.facilities as Record<string, Record<string, unknown>>;
    for (const id of ["grow-plot", "survey-desk", "craft-bench"]) delete facilities[id];
    for (const facility of Object.values(facilities)) {
      delete facility.unlocked;
      delete facility.queue;
      delete facility.residentId;
      if (facility.job) delete (facility.job as Record<string, unknown>).source;
    }
    delete production.autoSell;
    delete production.sales;
    delete production.made;
    for (const r of Object.values(v4.residents as Record<string, Record<string, unknown>>)) {
      delete r.field;
      delete r.talentId;
      delete r.breakthrough;
    }
    const migrated = migrateWorld(v4);
    assert.equal(migrated.schemaVersion, 6);
    assert.equal(migrated.wallet.tickets, 3);
    assert.equal(migrated.production.facilities["process-bench"]!.job?.source, "rule");
    assert.deepEqual(
      migrated.production.facilities["process-bench"]!.rules,
      v5.production.facilities["process-bench"]!.rules,
    );
    assert.equal(migrated.production.facilities["craft-bench"]!.unlocked, false);
    const migratedResident = migrated.residents[uuid(1)]!;
    assert.equal(talentDefinition(migratedResident.talentId)?.field, migratedResident.field, "field and talent agree");
    assert.equal(migratedResident.source.name, "주민1", "the source snapshot is only read");
  }

  console.log("forest-workshop P3b regressions: OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
