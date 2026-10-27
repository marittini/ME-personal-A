// Brings a world up to "now": credits workshop time under the 72-hour rule (activity.ts), runs production for that
// time (simulation.ts) and files a 작업 보고 entry when something happened. Pure. Every command runs it first with
// active = true (a command means the player is here); a state read or a heartbeat runs it on its own.
import { REPORT_LIMIT, type ProductionReport } from "../model/production";
import type { WorldState } from "../world-model";
import { creditTime } from "./activity";
import { crewBonuses } from "./crew";
import { settleExpedition } from "../stories/expedition";
import { advanceProduction } from "./simulation";

export function settleWorld(state: WorldState, now: string, options: { active: boolean }): WorldState {
  const credit = creditTime(state.production.activity, now, options);
  const simFrom = state.production.simMs;
  const settledAt = state.production.activity.settledAt;
  const crew = crewBonuses(state);
  const { production, inventory, summary } = advanceProduction(
    { ...state.production, activity: credit.activity },
    state.inventory,
    credit.creditedMs,
    { crew, realStart: settledAt === null ? Date.parse(now) : Date.parse(settledAt) },
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
  return settleExpedition({ ...state, production, inventory, wallet }, now);
}
