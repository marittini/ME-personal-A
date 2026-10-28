import type { AppState } from "./controller";

/** Preserve scrolling on refresh, but start at the top when a different screen section is opened. */
export function screenPageKey(
  state: Pick<AppState, "route" | "residentsView" | "work" | "facilitiesTab" | "settingsSection">,
): string {
  if (state.route === "residents") {
    return state.residentsView.detailOpen
      ? `residents:detail:${state.residentsView.selectedId}`
      : `residents:list:${state.residentsView.page ?? 0}`;
  }
  if (state.route === "work") return `work:${state.work.facilityId}:${state.work.section ?? "status"}`;
  if (state.route === "facilities") return `facilities:${state.facilitiesTab}:${state.work.inventoryPage ?? 0}`;
  if (state.route === "settings") return `settings:${state.settingsSection ?? "workshop"}`;
  return state.route;
}
