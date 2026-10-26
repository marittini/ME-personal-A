// The production simulation (plan §7.2-B/C/D). Pure and event-driven: it jumps from one completion to the next, never
// ticks per minute, and gives the same result whether a stretch of time is settled at once or in pieces (the
// online/offline equivalence the plan requires; tests/forest-workshop-p3.regression.ts checks it).
//
// At each event time, in this order (plan §7.2-D):
//   1. every run that has ended puts its output into the storeroom
//   2. (scheduled player changes — commands apply immediately in this build)
//   3. (auto-selling — P3b)
//   4. (designated-count runs — P3b)
//   5. each idle facility, in the global facility order, picks its first startable rule
// A rule starts only while its output (stock + running output) is below its target; it takes one run's inputs from
// what is usable (stock − protected) at the start. Nothing is taken in advance, nothing goes negative, and a future
// output is never spent before it exists.
import { FACILITY_ORDER, recipeDefinition, runDurationMs } from "../../content/production";
import type { FacilityState, Job, ProductionState, Rule, Waiting } from "../model/production";
import { protectedAmount, stockWithPending, usableAmount } from "./stock";

type Inventory = Record<string, number>;

export interface AdvanceSummary {
  produced: Record<string, number>;
  /** Inputs of the runs that completed (taken from the storeroom when each run started). */
  consumed: Record<string, number>;
  runs: number;
}

/** Hard ceiling on events per call. ponytail: 72 h of the shortest run on every facility is far below it; when content
 *  makes runs shorter or facilities many, settle in cursor chunks (plan §7.2-D) instead of raising this. */
const MAX_EVENTS = 50_000;

function add(target: Record<string, number>, items: Readonly<Record<string, number>>, sign = 1) {
  for (const [itemId, amount] of Object.entries(items)) target[itemId] = (target[itemId] ?? 0) + sign * amount;
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

interface Attempt {
  job: Job | null;
  waiting: Waiting | null;
}

function tryStart(
  facility: FacilityState,
  production: ProductionState,
  inventory: Inventory,
  now: number,
  nextJobId: number,
): Attempt {
  const rules = orderedRules(facility.rules);
  if (rules.length === 0) return { job: null, waiting: { reason: "no_rules" } };
  let shortage: Waiting | null = null;
  for (const rule of rules) {
    const recipe = recipeDefinition(rule.recipeId);
    if (!recipe) continue;
    const item = targetItem(recipe.id);
    if (item && stockWithPending(inventory, production, item) >= rule.targetStock) continue;
    const missing = Object.entries(recipe.inputs).find(
      ([itemId, need]) => usableAmount(inventory, production, itemId) < need,
    );
    if (missing) {
      const [itemId, needed] = missing;
      shortage ??= {
        reason: "materials",
        itemId,
        needed,
        usable: usableAmount(inventory, production, itemId),
        protectedAmount: protectedAmount(production, itemId),
      };
      continue;
    }
    const duration = runDurationMs(recipe, facility.level);
    return {
      job: {
        jobId: nextJobId,
        recipeId: recipe.id,
        policyId: rule.policyId,
        startedSim: now,
        endsSim: now + duration,
        consumed: { ...recipe.inputs },
        outputs: { ...recipe.outputs },
      },
      waiting: null,
    };
  }
  return { job: null, waiting: shortage ?? { reason: "target_reached" } };
}

/**
 * Runs the workshop for `creditedMs` of workshop time. Returns new production and inventory objects (inputs are not
 * mutated) and what happened, for the 작업 보고.
 */
export function advanceProduction(
  input: ProductionState,
  inventoryIn: Readonly<Inventory>,
  creditedMs: number,
): { production: ProductionState; inventory: Inventory; summary: AdvanceSummary } {
  const production: ProductionState = structuredClone(input);
  const inventory: Inventory = { ...inventoryIn };
  const summary: AdvanceSummary = { produced: {}, consumed: {}, runs: 0 };
  const end = production.simMs + Math.max(0, Math.floor(creditedMs));
  let now = production.simMs;

  const completeUpTo = (time: number) => {
    for (const facilityId of FACILITY_ORDER) {
      const facility = production.facilities[facilityId];
      if (!facility?.job || facility.job.endsSim > time) continue;
      add(inventory, facility.job.outputs);
      add(summary.produced, facility.job.outputs);
      // A run's inputs are reported with the run that used them, when it completes.
      add(summary.consumed, facility.job.consumed);
      summary.runs += 1;
      facility.job = null;
    }
  };
  const startIdle = (time: number) => {
    for (const facilityId of FACILITY_ORDER) {
      const facility = production.facilities[facilityId];
      if (!facility || facility.job) continue;
      const attempt = tryStart(facility, production, inventory, time, production.nextJobId);
      facility.waiting = attempt.waiting;
      if (attempt.job) {
        add(inventory, attempt.job.consumed, -1);
        facility.job = attempt.job;
        production.nextJobId += 1;
      }
    }
  };

  completeUpTo(now);
  startIdle(now);
  for (let events = 0; events < MAX_EVENTS; events += 1) {
    const next = Math.min(
      ...Object.values(production.facilities).map((facility) => facility.job?.endsSim ?? Number.POSITIVE_INFINITY),
    );
    if (!Number.isFinite(next) || next > end) break;
    now = next;
    completeUpTo(now);
    startIdle(now);
  }
  production.simMs = end;
  for (const [itemId, amount] of Object.entries(inventory)) {
    if (amount < 0) throw new Error(`Inventory for ${itemId} went negative`);
    if (amount === 0) delete inventory[itemId];
  }
  return { production, inventory, summary };
}
