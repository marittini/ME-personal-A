// The frame every screen shares, after the final mockups (boards 01–05): a back button, the title plaque with an
// optional subtitle ribbon, the gold counter and the settings gear on the right, then the notice and the body.
//
// The mockups' bottom bar (홈 · 작업 · 탐사 · 주민 · 초대) appears once a second of those screens exists (주민, P2);
// until then it would hold one real tab and four that do nothing, which plan §8 forbids. Settings is reached from
// the gear, as in the mockups, never from the bottom bar.
import type { AppState, Controller, Route } from "../app/controller";
import { h, type Child } from "../app/dom";
import { ICONS } from "./icons";

export interface ScreenFrame {
  title: string;
  /** Ribbon under the plaque (mockup: "숲을 함께하는 소중한 이웃들"). */
  subtitle?: string;
  back?: { route: Route; label: string };
  /** Gold counter and gear: only when a world is open. */
  showWorldBar: boolean;
  body: Child[];
}

function worldBar(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  if (!world) return null;
  return h("div", { className: "world-bar" }, [
    h(
      "span",
      { className: "counter", attrs: { "aria-label": `골드 ${world.state.wallet.gold.toLocaleString("ko-KR")}` } },
      [
        h("span", { className: "coin", attrs: { "aria-hidden": "true" } }),
        h("span", { text: world.state.wallet.gold.toLocaleString("ko-KR") }),
      ],
    ),
    state.route === "settings"
      ? null
      : h(
          "button",
          {
            className: "icon-button",
            attrs: { type: "button", "aria-label": "설정" },
            on: { click: () => controller.navigate("settings") },
          },
          [ICONS.gear()],
        ),
  ]);
}

export function renderLayout(state: AppState, controller: Controller, frame: ScreenFrame) {
  const notice = state.notice
    ? h(
        "div",
        {
          className: `notice ${state.notice.kind}`,
          attrs: { role: state.notice.kind === "error" ? "alert" : "status" },
        },
        [
          h("p", { text: state.notice.text }),
          h("button", {
            className: "notice-close",
            text: "닫기",
            attrs: { type: "button", "aria-label": "알림 닫기" },
            on: { click: () => controller.dismissNotice() },
          }),
        ],
      )
    : null;

  const header = h("header", { className: "top" }, [
    h("div", { className: "top-row" }, [
      frame.back
        ? h(
            "button",
            {
              className: "icon-button back",
              attrs: { type: "button", "aria-label": `${frame.back.label}(으)로 돌아가기` },
              on: { click: () => controller.navigate(frame.back!.route) },
            },
            [ICONS.back()],
          )
        : null,
      h("h1", { className: "plaque", text: frame.title, attrs: { id: "fw-screen-title" } }),
      frame.showWorldBar ? worldBar(state, controller) : null,
    ]),
    frame.subtitle ? h("p", { className: "ribbon", text: frame.subtitle }) : null,
  ]);

  return h("div", { className: "shell" }, [
    h("main", { className: "page", attrs: { "aria-labelledby": "fw-screen-title" } }, [header, notice, ...frame.body]),
  ]);
}
