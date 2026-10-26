// The top of every screen, in the two forms the mockups use:
//   home  — the 숲결 공방 sign at top left, gold · invitation tickets · gear on the right; below it the weather chip
//           and the mail button (board 01-1)
//   sub   — a back button, the screen's sign, and (on 작업 · 시설과 창고) gold · tickets · gear (boards 01-2/3, 04, 05);
//           주민 and 관계 add a ribbon under the sign (board 03)
import type { AppState, Controller, Route } from "../../app/controller";
import { h } from "../../app/dom";
import { featureButton } from "./locked";
import { ICONS } from "./icons";

export type TopBar =
  | { kind: "home" }
  | {
      kind: "sub";
      title: string;
      back?: { route: Route; label: string };
      resources: boolean;
      /** The ribbon under the sign (boards 03-1 주민, 03-2 관계). */
      subtitle?: string;
    };

function resources(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  if (!world) return null;
  const gold = world.state.wallet.gold.toLocaleString("ko-KR");
  return h("div", { className: "resources" }, [
    h("span", { className: "counter gold", attrs: { "aria-label": `골드 ${gold}` } }, [
      h("span", { className: "coin", attrs: { "aria-hidden": "true" } }),
      h("span", { className: "counter-value", text: gold }),
    ]),
    featureButton(controller, "tickets", {
      className: "counter ticket",
      label: "초대권",
      children: [
        h("span", { className: "ticket-mark" }, [ICONS.ticket("icon")]),
        h("span", { className: "counter-value", text: "–" }),
      ],
    }),
    state.route === "settings"
      ? null
      : h(
          "button",
          {
            className: "icon-button gear",
            attrs: { type: "button", "aria-label": "설정" },
            on: { click: () => controller.navigate("settings") },
          },
          [ICONS.gear()],
        ),
  ]);
}

export function renderTopBar(state: AppState, controller: Controller, bar: TopBar) {
  if (bar.kind === "home") {
    return h("header", { className: "top top-home" }, [
      h("div", { className: "top-row" }, [
        h("h1", { className: "sign sign-home", text: "숲결 공방", attrs: { id: "fw-screen-title" } }),
        resources(state, controller),
      ]),
      h("div", { className: "top-row second" }, [
        featureButton(controller, "weather", {
          className: "chip-button weather",
          label: "현실 날씨",
          children: [ICONS.weather(), h("span", { text: "날씨" })],
        }),
        featureButton(controller, "mail", {
          className: "icon-button mail",
          label: "우편함",
          children: [ICONS.mail()],
        }),
      ]),
    ]);
  }
  const back = bar.back;
  return h("header", { className: `top top-sub${bar.resources ? " with-resources" : ""}` }, [
    h("div", { className: "top-row" }, [
      back
        ? h(
            "button",
            {
              className: "back-button",
              attrs: { type: "button", "aria-label": `${back.label}(으)로 돌아가기` },
              on: { click: () => controller.navigate(back.route) },
            },
            [ICONS.back()],
          )
        : h("span", { className: "back-spacer", attrs: { "aria-hidden": "true" } }),
      h("h1", { className: "sign", text: bar.title, attrs: { id: "fw-screen-title" } }),
      bar.resources ? resources(state, controller) : null,
    ]),
    bar.subtitle ? h("p", { className: "ribbon", text: bar.subtitle }) : null,
  ]);
}
