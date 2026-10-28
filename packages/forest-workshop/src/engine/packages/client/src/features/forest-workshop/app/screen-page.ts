import type { AppState } from "./controller";

/** Preserve scrolling on refresh, but start at the top when a different screen section is opened. */
export function screenPageKey(state: Pick<AppState, "route" | "residentsView" | "work">): string {
  if (state.route === "residents") {
    return state.residentsView.detailOpen
      ? `residents:detail:${state.residentsView.selectedId}`
      : `residents:list:${state.residentsView.page ?? 0}`;
  }
  if (state.route === "work") return `work:${state.work.facilityId}:${state.work.section ?? "status"}`;
  return state.route;
}
