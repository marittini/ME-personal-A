// The bottom bar of the mockups: 홈 · 작업 · 탐사 · 주민 · 초대. A tab whose screen is not built yet stays in place
// with a lock and says which phase opens it. Settings and its sub-screens keep 홈 selected, as board 04 shows.
import type { AppState, Controller, Route } from "../../app/controller";
import { h } from "../../app/dom";
import { NAV_ART, assetImage } from "../../app/assets";
import { isLocked, type LockedFeature } from "../../app/features";
import { ICONS, type IconFactory } from "./icons";
import { lockTag } from "./locked";

interface Tab {
  label: string;
  icon: IconFactory;
  art: string;
  /** Routes that show this tab as selected; the first is where the tab goes. */
  routes: Route[];
  feature?: LockedFeature;
}

const TABS: readonly Tab[] = [
  { label: "홈", icon: ICONS.home, art: NAV_ART.home, routes: ["home", "settings", "backup", "diagnostics"] },
  { label: "작업", icon: ICONS.hammer, art: NAV_ART.work, routes: ["work", "facilities"] },
  { label: "탐사", icon: ICONS.compass, art: NAV_ART.explore, routes: ["explore", "story"] },
  {
    label: "주민",
    icon: ICONS.residents,
    art: NAV_ART.residents,
    routes: ["residents", "relations", "resident-image"],
  },
  { label: "초대", icon: ICONS.ticket, art: NAV_ART.invite, routes: ["invite"] },
];

export function renderBottomNav(state: AppState, controller: Controller) {
  return h(
    "nav",
    { className: "tabbar", attrs: { "aria-label": "공방 메뉴" } },
    TABS.map((tab) => {
      const locked = tab.feature ? isLocked(tab.feature) : false;
      const current = tab.routes.includes(state.route);
      return h(
        "button",
        {
          className: `tab${current ? " current" : ""}${locked ? " is-locked" : ""}`,
          attrs: {
            type: "button",
            "aria-current": current ? "page" : undefined,
            "aria-label": locked ? `${tab.label} (준비 중)` : tab.label,
          },
          on: {
            click: () => {
              if (locked && tab.feature) controller.notifyLocked(tab.feature);
              else if (tab.routes[0] === "residents") controller.openResidents();
              else if (tab.routes[0]) controller.navigate(tab.routes[0]);
            },
          },
        },
        [
          h("span", { className: "tab-icon" }, [
            assetImage(tab.art, { className: "tab-glyph tab-art", fallback: () => tab.icon("icon tab-glyph") }),
            locked && tab.feature ? lockTag(tab.feature) : null,
          ]),
          h("span", { className: "tab-label", text: tab.label }),
        ],
      );
    }),
  );
}
