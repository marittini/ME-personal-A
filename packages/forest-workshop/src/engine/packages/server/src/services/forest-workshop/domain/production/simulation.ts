// The production simulation (plan §7.2-B/C/D). Pure and event-driven: it jumps from one event to the next (a run
// ends, a UTC day starts for 자동 판매), never ticks per minute, and gives the same result whether a stretch of time is
// settled at once or in pieces (the online/offline equivalence the plan requires; the P3 regression tests check it).
//
// At each event time, in this order (plan §7.2-D):
//   1. every run that has ended puts its output into the storeroom
//   2. (scheduled player changes — commands apply immediately, before the settlement that follows them)
//   3. 자동 판매: items set to sell, above their floor, within the UTC day's limit
//   4. 지정 횟수 facilities, in the global facility order, start their queue's next run
//   5. 자동 운영 facilities, in the global facility order, pick their first startable rule
// A rule starts only while its output (stock + running output) is below its target; any run takes one run's inputs
// from what is usable (stock − protected) at the start. Nothing is taken in advance, nothing goes negative, and a
// future output is never spent before it exists. A closed facility (해금 전) never runs.
import { itemDefinition } from "../../content/items";
import { FACILITY_ORDER, recipeDefinition, runDurationMs, type RecipeDefinition } from "../../content/production";
import type { FacilityState, Job, ProductionState, Rule, Waiting } from "../model/production";
import { crewRecipe, type CrewBonus } from "./crew";
import { protectedAmount, stockWithPending, usableAmount } from "./stock";

type Inventory = Record<string, number>;

export interface AdvanceSummary {
  produced: Record<string, number>;
  /** Inputs of the runs that completed (taken from the storeroom when each run started). */
  consumed: Record<string, number>;
  runs: number;
  /** 자동 판매. */
  sold: Record<string, number>;
  gold: number;
}

export interface AdvanceOptions {
  /** Placed residents per facility (domain/production/crew.ts): extra speed and 특기, fixed for this settlement. */
  crew?: Readonly<Record<string, CrewBonus>>;
  /**
   * Real time (epoch ms) at the start of this settlement's credited time. Credited time is one contiguous stretch of
   * real time (online, then up to the 72-hour budget of absence), so workshop time maps to real time by offset; the
   * UTC day of a sale is read from it.
   */
  realStart?: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Hard ceiling on events per call. ponytail: 72 h of the shortest run on every facility is far below it; when content
 *  makes runs shorter or facilities many, settle in cursor chunks (plan §7.2-D) instead of raising this. */
const MAX_EVENTS = 50_000;

function add(target: Record<string, number>, items: Readonly<Record<string, number>>, sign = 1) {
  for (const [itemId, amount] of Object.entries(items)) target[itemId] = (target[itemId] ?? 0) + sign * amount;
}

export function utcDay(epochMs: number): string {
  return new Date(epochMs).toISOString().slice(0, 10);
}

/** Rules in the order a facility tries them: enabled, smaller priority first, ties in list order. */
export function orderedRules(rules: readonly Rule[]): Rule[] {
  return rules
    .map((rule, index) => ({ rule, index }))
    .filter(({ rule }) => rule.enabled)
    .sort((a, b) => a.rule.priority - b.rule.priority || a.index - b.index)
    .map(({ rule }) => rule);
}

/** The item a rule's target counts: the recipe's first output. */
export function targetItem(recipeId: string): string | null {
  const recipe = recipeDefinition(recipeId);
  return recipe ? (Object.keys(recipe.outputs)[0] ?? null) : null;
}

/**
 * The least 자동 판매 leaves of an item (plan §7.2-C): the player's 판매 후 남길 수량, the highest active production
 * target for it, and protected stock — whichever is largest.
 */
export function autoSellFloor(production: ProductionState, itemId: string): number {
  const setting = production.autoSell[itemId];
  let highestTarget = 0;
  for (const facility of Object.values(production.facilities)) {
    if (!facility.unlocked || facility.mode !== "auto") continue;
    for (const rule of facility.rules) {
      if (rule.enabled && targetItem(rule.recipeId) === itemId)
        highestTarget = Math.max(highestTarget, rule.targetStock);
    }
  }
  return Math.max(setting?.keep ?? 0, highestTarget, protectedAmount(production, itemId));
}

function shortageOf(
  inputs: Readonly<Record<string, number>>,
  production: ProductionState,
  inventory: Inventory,
): Waiting | null {
  const missing = Object.entries(inputs).find(([itemId, need]) => usableAmount(inventory, production, itemId) < need);
  if (!missing) return null;
  const [itemId, needed] = missing;
  return {
    reason: "materials",
    itemId,
    needed,
    usable: usableAmount(inventory, production, itemId),
    protectedAmount: protectedAmount(production, itemId),
  };
}

function newJob(
  recipe: RecipeDefinition,
  run: ReturnType<typeof crewRecipe>,
  facility: FacilityState,
  policyId: string,
  source: Job["source"],
  now: number,
  jobId: number,
): Job {
  return {
    jobId,
    recipeId: recipe.id,
    policyId,
    source,
    startedSim: now,
    endsSim: now + runDurationMs(recipe, facility.level, run.extraBonus),
    consumed: run.inputs,
    outputs: { ...recipe.outputs },
  };
}

interface Attempt {
  job: Job | null;
  waiting: Waiting | null;
}

function tryRules(
  facility: FacilityState,
  production: ProductionState,
  inventory: Inventory,
  now: number,
  jobId: number,
  crew: CrewBonus | undefined,
): Attempt {
  const rules = orderedRules(facility.rules);
  if (rules.length === 0) return { job: null, waiting: { reason: "no_rules" } };
  let shortage: Waiting | null = null;
  for (const rule of rules) {
    const recipe = recipeDefinition(rule.recipeId);
    if (!recipe) continue;
    const item = targetItem(recipe.id);
    if (item && stockWithPending(inventory, production, item) >= rule.targetStock) continue;
    const run = crewRecipe(recipe, crew);
    const missing = shortageOf(run.inputs, production, inventory);
    if (missing) {
      shortage ??= missing;
      continue;
    }
    return { job: newJob(recipe, run, facility, rule.policyId, "rule", now, jobId), waiting: null };
  }
  return { job: null, waiting: shortage ?? { reason: "target_reached" } };
}

/** 지정 횟수: the queue's first request runs next; with too few materials the facility waits for them (no skipping). */
function tryQueue(
  facility: FacilityState,
  production: ProductionState,
  inventory: Inventory,
  now: number,
  jobId: number,
  crew: CrewBonus | undefined,
): Attempt {
  const head = facility.queue[0];
  if (!head) return { job: null, waiting: { reason: "queue_empty" } };
  const recipe = recipeDefinition(head.recipeId);
  if (!recipe) return { job: null, waiting: { reason: "queue_empty" } };
  const run = crewRecipe(recipe, crew);
  const missing = shortageOf(run.inputs, production, inventory);
  if (missing) return { job: null, waiting: missing };
  const started = head.started + 1;
  facility.queue = started >= head.total ? facility.queue.slice(1) : [{ ...head, started }, ...facility.queue.slice(1)];
  return { job: newJob(recipe, run, facility, head.entryId, "queue", now, jobId), waiting: null };
}

/**
 * Runs the workshop for `creditedMs` of workshop time. Returns new production and inventory objects (inputs are not
 * mutated) and what happened, for the 작업 보고.
 */
export function advanceProduction(
  input: ProductionState,
  inventoryIn: Readonly<Inventory>,
  creditedMs: number,
  options: AdvanceOptions = {},
): { production: ProductionState; inventory: Inventory; summary: AdvanceSummary } {
  const production: ProductionState = structuredClone(input);
  const inventory: Inventory = { ...inventoryIn };
  const summary: AdvanceSummary = { produced: {}, consumed: {}, runs: 0, sold: {}, gold: 0 };
  const crew = options.crew ?? {};
  const simStart = production.simMs;
  const end = simStart + Math.max(0, Math.floor(creditedMs));
  const realStart = options.realStart;
  const realAt = (sim: number) => (realStart === undefined ? undefined : realStart + (sim - simStart));
  let now = simStart;

  const completeUpTo = (time: number) => {
    for (const facilityId of FACILITY_ORDER) {
      const facility = production.facilities[facilityId];
      if (!facility?.job || facility.job.endsSim > time) continue;
      add(inventory, facility.job.outputs);
      add(summary.produced, facility.job.outputs);
      add(production.made, facility.job.outputs);
      // A run's inputs are reported with the run that used them, when it completes.
      add(summary.consumed, facility.job.consumed);
      summary.runs += 1;
      facility.job = null;
    }
  };

  const autoSell = (time: number) => {
    const real = realAt(time);
    const items = Object.keys(production.autoSell)
      .filter((itemId) => production.autoSell[itemId]!.enabled)
      .sort();
    if (real === undefined || items.length === 0) return;
    const day = utcDay(real);
    if (production.sales.day !== day) production.sales = { day, sold: {} };
    for (const itemId of items) {
      const setting = production.autoSell[itemId]!;
      const price = itemDefinition(itemId)?.sellPrice ?? 0;
      const room = setting.dailyMax - (production.sales.sold[itemId] ?? 0);
      const amount = Math.min(room, (inventory[itemId] ?? 0) - autoSellFloor(production, itemId));
      if (amount <= 0 || price <= 0) continue;
      inventory[itemId] = (inventory[itemId] ?? 0) - amount;
      production.sales.sold[itemId] = (production.sales.sold[itemId] ?? 0) + amount;
      summary.sold[itemId] = (summary.sold[itemId] ?? 0) + amount;
      summary.gold += amount * price;
    }
  };

  const startIdle = (time: number) => {
    for (const pass of ["count", "auto"] as const) {
      for (const facilityId of FACILITY_ORDER) {
        const facility = production.facilities[facilityId];
        if (!facility || facility.job) continue;
        if (!facility.unlocked) {
          facility.waiting = { reason: "locked" };
          continue;
        }
        if (facility.mode !== pass) continue;
        const attempt =
          pass === "count"
            ? tryQueue(facility, production, inventory, time, production.nextJobId, crew[facilityId])
            : tryRules(facility, production, inventory, time, production.nextJobId, crew[facilityId]);
        facility.waiting = attempt.waiting;
        if (attempt.job) {
          add(inventory, attempt.job.consumed, -1);
          facility.job = attempt.job;
          production.nextJobId += 1;
        }
      }
    }
  };

  const step = (time: number) => {
    completeUpTo(time);
    autoSell(time);
    startIdle(time);
  };

  /** The next UTC midnight as workshop time, while 자동 판매 is on (a new day's limit may let more be sold). */
  const nextDayStart = (time: number) => {
    const real = realAt(time);
    if (real === undefined || !Object.values(production.autoSell).some((setting) => setting.enabled)) {
      return Number.POSITIVE_INFINITY;
    }
    return time + (Math.floor(real / DAY_MS) + 1) * DAY_MS - real;
  };

  step(now);
  for (let events = 0; events < MAX_EVENTS; events += 1) {
    const next = Math.min(
      nextDayStart(now),
      ...Object.values(production.facilities).map((facility) => facility.job?.endsSim ?? Number.POSITIVE_INFINITY),
    );
    if (!Number.isFinite(next) || next > end) break;
    now = next;
    step(now);
  }
  production.simMs = end;
  for (const [itemId, amount] of Object.entries(inventory)) {
    if (amount < 0) throw new Error(`Inventory for ${itemId} went negative`);
    if (amount === 0) delete inventory[itemId];
  }
  return { production, inventory, summary };
}
