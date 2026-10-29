import type { AppState } from "./controller";

/** Preserve scrolling on refresh, but start at the top when a different screen section is opened. */
export function screenPageKey(
  state: Pick<AppState, "route" | "residentsView" | "work" | "facilitiesTab" | "settingsSection"> &
    Partial<Pick<AppState, "explore" | "inviteTab" | "invitePage" | "register" | "worldsPage">>,
): string {
  if (state.route === "residents") return `residents:list:${state.residentsView.page ?? 0}`;
  if (state.route === "work")
    return `work:${state.work.facilityId}:${state.work.section ?? "status"}:${state.work.queueView ?? ""}:${state.work.queuePage ?? 0}:${state.work.priorityPage ?? 0}`;
  if (state.route === "facilities") return `facilities:${state.facilitiesTab}:${state.work.inventoryPage ?? 0}`;
  if (state.route === "settings") return `settings:${state.settingsSection ?? "workshop"}`;
  if (state.route === "explore")
    return `explore:${state.explore?.pairId ?? ""}:${state.explore?.section ?? "episode"}:${state.explore?.historyPage ?? 0}`;
  if (state.route === "invite") return `invite:${state.inviteTab ?? "invite"}:${state.invitePage ?? 0}`;
  if (state.route === "register")
    return `register:${state.register?.step ?? 1}:${state.register?.panel ?? "source"}:${state.register?.sourcePage ?? 0}:${state.register?.starterPage ?? 0}`;
  if (state.route === "worlds") return `worlds:${state.worldsPage ?? 0}`;
  return state.route;
}
