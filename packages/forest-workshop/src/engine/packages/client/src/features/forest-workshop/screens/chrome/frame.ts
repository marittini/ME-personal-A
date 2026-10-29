// Puts a screen together the way every mockup board does: backdrop, top bar, the screen's own content and the bottom
// bar, plus two overlays: the notice (a toast just above the bottom bar, so a tap far down the page still shows its
// answer) and an optional sheet above everything (welcome package). Only `.scroll` scrolls; client-entry keeps its
// position across re-renders of the same route.
import { artClasses, currentSeason, type AppState, type Controller } from "../../app/controller";
import { h, type Child } from "../../app/dom";
import { renderMemorySheet } from "../residents/memory-sheet";
import { renderDeliveriesSheet } from "../invite/deliveries-sheet";
import { renderBottomNav } from "./bottom-nav";
import { renderTopBar, type TopBar } from "./top-bar";

export interface Frame {
  top: TopBar;
  /** "forest" for the open-air screens (홈, 작업), "wood" for the framed ones (설정, 저장·백업). */
  backdrop: "forest" | "wood";
  /** Full-width content placed right under the top bar (the home scene). */
  hero?: Child;
  body: Child[];
  nav: boolean;
  /** A viewport-fitted home scene with its compact controls. */
  homeLayout?: boolean;
  /** The story reader gives remaining space to the scene while keeping dialogue and actions visible. */
  storyLayout?: boolean;
  sheet?: Child;
}

function notice(state: AppState, controller: Controller) {
  if (!state.notice) return null;
  return h(
    "div",
    { className: `notice ${state.notice.kind}`, attrs: { role: state.notice.kind === "error" ? "alert" : "status" } },
    [
      h("p", { text: state.notice.text }),
      h("button", {
        className: "notice-close",
        text: "닫기",
        attrs: { type: "button", "aria-label": "알림 닫기" },
        on: { click: () => controller.dismissNotice() },
      }),
    ],
  );
}

export function renderFrame(state: AppState, controller: Controller, frame: Frame) {
  return h(
    "div",
    {
      className: `shell backdrop-${frame.backdrop} season-${currentSeason(state)}${artClasses(state)}${frame.nav ? " has-nav" : ""}${frame.homeLayout ? " home-layout" : ""}${frame.storyLayout ? " story-layout" : ""}${state.notice ? " has-notice" : ""}`,
    },
    [
      h("div", { className: "scroll" }, [
        h("div", { className: "column" }, [
          renderTopBar(state, controller, frame.top),
          frame.hero ?? null,
          h("main", { className: "page", attrs: { "aria-labelledby": "fw-screen-title" } }, frame.body),
        ]),
      ]),
      notice(state, controller),
      frame.nav ? renderBottomNav(state, controller) : null,
      // 초대권 받기 opens from the ticket counter on any screen.
      frame.sheet ??
        (state.sheet?.kind === "memory"
          ? renderMemorySheet(state, controller)
          : state.sheet?.kind === "deliveries"
            ? renderDeliveriesSheet(state, controller)
            : null),
    ],
  );
}

/** A card with the mockup's leaf-marked title. */
export function card(title: string | null, children: Child[], options: { id?: string; className?: string } = {}) {
  return h(
    "section",
    { className: `card ${options.className ?? ""}`.trim(), attrs: options.id ? { "aria-labelledby": options.id } : {} },
    [
      title ? h("h2", { className: "section-title", text: title, attrs: options.id ? { id: options.id } : {} }) : null,
      ...children,
    ],
  );
}
