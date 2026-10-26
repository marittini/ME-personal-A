// Brings a world up to "now": credits workshop time under the 72-hour rule (activity.ts), runs production for that
// time (simulation.ts) and files a 작업 보고 entry when something happened. Pure. Every command runs it first with
// active = true (a command means the player is here); a state read or a heartbeat runs it on its own.
import { REPORT_LIMIT, type ProductionReport } from "../model/production";
import type { WorldState } from "../world-model";
import { creditTime } from "./activity";
import { advanceProduction } from "./simulation";

export function settleWorld(state: WorldState, now: string, options: { active: boolean }): WorldState {
  const credit = creditTime(state.production.activity, now, options);
  const simFrom = state.production.simMs;
  const { production, inventory, summary } = advanceProduction(
    { ...state.production, activity: credit.activity },
    state.inventory,
    credit.creditedMs,
  );
  if (summary.runs > 0) {
    const report: ProductionReport = {
      reportId: production.nextReportId,
      at: now,
      simFrom,
      simTo: production.simMs,
      produced: summary.produced,
      consumed: summary.consumed,
      runs: summary.runs,
      offlineMs: credit.offlineMs,
    };
    production.nextReportId += 1;
    production.reports = [report, ...production.reports].slice(0, REPORT_LIMIT);
  }
  return { ...state, production, inventory };
}
