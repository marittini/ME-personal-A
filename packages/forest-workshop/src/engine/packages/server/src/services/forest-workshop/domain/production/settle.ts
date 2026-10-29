// Brings a world up to "now": credits workshop time under the 72-hour rule (activity.ts), runs production for that
// time (simulation.ts) and files a 작업 보고 entry when something happened. Pure. Every command runs it first with
// active = true (a command means the player is here); a state read or a heartbeat runs it on its own.
import { REPORT_LIMIT, type ProductionReport } from "../model/production";
import type { WorldState } from "../world-model";
import { creditTime } from "./activity";
import { crewBonuses } from "./crew";
import { settleExpedition } from "../stories/expedition";
import { settleActivities } from "../activities";
import { advanceProduction } from "./simulation";

export function settleWorld(state: WorldState, now: string, options: { active: boolean }): WorldState {
  const credit = creditTime(state.production.activity, now, options);
  const simFrom = state.production.simMs;
  const settledAt = state.production.activity.settledAt;
  // Nothing credited and nobody here (a background read after the 72-hour budget ran out, or a repeat read): the
  // workshop is frozen. No sale, no new run, no new day — only the bookkeeping moves (mid-review defect 2). A
  // command or a return (active) still re-evaluates at once, at the present real time.
  if (!options.active && credit.creditedMs === 0 && settledAt !== null) {
    return { ...state, production: { ...state.production, activity: credit.activity } };
  }
  const crew = crewBonuses(state);
  const { production, inventory, summary } = advanceProduction(
    { ...state.production, activity: credit.activity },
    state.inventory,
    credit.creditedMs,
    // Credited time is one contiguous stretch starting at the last settlement; with nothing credited (a command right
    // after another, a return) the only real time is now.
    { crew, realStart: settledAt === null || credit.creditedMs === 0 ? Date.parse(now) : Date.parse(settledAt) },
  );
  if (summary.runs > 0 || summary.gold > 0) {
    const report: ProductionReport = {
      reportId: production.nextReportId,
      at: now,
      simFrom,
      simTo: production.simMs,
      produced: summary.produced,
      consumed: summary.consumed,
      runs: summary.runs,
      sold: summary.sold,
      gold: summary.gold,
      offlineMs: credit.offlineMs,
    };
    production.nextReportId += 1;
    production.reports = [report, ...production.reports].slice(0, REPORT_LIMIT);
  }
  const wallet = summary.gold > 0 ? { ...state.wallet, gold: state.wallet.gold + summary.gold } : state.wallet;
  // The expedition timer runs on the same workshop time, after production (it does not touch materials).
  return settleActivities(settleExpedition({ ...state, production, inventory, wallet }, now), now);
}
