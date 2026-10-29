// The top of every screen, in the two forms the mockups use:
//   home  — the 숲결 공방 sign at top left, gold · invitation tickets · gear on the right; below it the weather chip
//           and the mail button (board 01-1)
//   sub   — a back button, the screen's sign, and (on 작업 · 시설과 창고) gold · tickets · gear (boards 01-2/3, 04, 05);
//           주민 and 관계 add a ribbon under the sign (board 03)
import { currentSeason } from "../../app/controller";
import { SEASON_LABELS } from "../../app/season";
import type { AppState, Controller, Route } from "../../app/controller";
import { h, type Child } from "../../app/dom";
import { normalizeWeatherEffects, WEATHER_LABELS } from "../../app/preferences";
import { ICONS } from "./icons";

/** 초대권: the count, and a tap opens 초대권 받기 (today's 납품 의뢰). */
export function ticketCounter(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  const tickets = world?.state.wallet.tickets ?? 0;
  return h(
    "button",
    {
      className: "counter ticket",
      attrs: { type: "button", "aria-label": `초대권 ${tickets}장 — 초대권 받기` },
      on: { click: () => controller.openDeliveries() },
    },
    [
      h("span", { className: "ticket-mark" }, [ICONS.ticket("icon")]),
      h("span", { className: "counter-value", text: String(tickets) }),
    ],
  );
}

export type TopBar =
  | { kind: "home" }
  | {
      kind: "sub";
      title: string;
      back?: { route: Route; label: string };
      resources: boolean;
      /** The ribbon under the sign (boards 03-1 주민, 03-2 관계, 03-3 초대). */
      subtitle?: string;
      /** The screen's own counters in place of gold · tickets · gear (board 03-3: 초대권 · 종표). */
      counters?: Child;
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
    ticketCounter(state, controller),
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
    const hasNewMail =
      state.world?.state === "ready" &&
      (state.world.value.state.mailbox?.letters.some((letter) => !letter.readAt && !letter.archived) ?? false);
    const weather = normalizeWeatherEffects(state.weatherEffects);
    return h("header", { className: "top top-home" }, [
      h("div", { className: "top-row" }, [
        h("h1", { className: "sign sign-home", attrs: { id: "fw-screen-title" } }, [
          h("span", { className: "sign-title", text: "숲결 공방" }),
        ]),
        resources(state, controller),
      ]),
      h("div", { className: "top-row second" }, [
        h("div", { className: "season-weather" }, [
          h("span", {
            className: "season-badge",
            text: SEASON_LABELS[currentSeason(state)],
            attrs: { "aria-label": `현재 계절 ${SEASON_LABELS[currentSeason(state)]}` },
          }),
          h(
            "button",
            {
              className: "chip-button weather",
              attrs: {
                type: "button",
                "aria-label": `날씨 연출 ${weather.enabled ? WEATHER_LABELS[weather.kind] : "꺼짐"} — 설정`,
              },
              on: {
                click: () => {
                  controller.setSettingsSection("display");
                  controller.navigate("settings");
                },
              },
            },
            [ICONS.weather(), h("span", { text: weather.enabled ? WEATHER_LABELS[weather.kind] : "효과 꺼짐" })],
          ),
        ]),
        h(
          "button",
          {
            className: "icon-button mail",
            attrs: {
              type: "button",
              "aria-label": hasNewMail ? "우편함 · 새 편지 있음" : "우편함",
            },
            on: { click: () => controller.openMailbox() },
          },
          [
            ICONS.mail(),
            hasNewMail
              ? h("span", { className: "mail-new", attrs: { "aria-hidden": "true" } }, [ICONS.sparkle("icon tiny")])
              : null,
          ],
        ),
      ]),
    ]);
  }
  const back = bar.back;
  return h("header", { className: `top top-sub${bar.resources || bar.counters ? " with-resources" : ""}` }, [
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
      h("h1", { className: "sign", attrs: { id: "fw-screen-title" } }, [
        h("span", { className: "sign-title", text: bar.title }),
      ]),
      bar.resources ? resources(state, controller) : (bar.counters ?? null),
    ]),
    bar.subtitle ? h("p", { className: "ribbon", text: bar.subtitle }) : null,
  ]);
}
