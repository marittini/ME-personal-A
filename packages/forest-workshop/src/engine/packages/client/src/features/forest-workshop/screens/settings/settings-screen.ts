// 설정 (board 04-1): 내 공방 (닉네임 + 수정, 현실 날씨 + 변경), 표시 (글자 크기 + 미리보기, 날씨 효과, 자동 읽기),
// 관리 (주민 그림 관리 · AI 지침 관리 · 기억 관리 · 저장 · 백업), the 72-hour note and the automation footnote.
// Real now: nickname, text size and 저장 · 백업. The rest keeps its place, locked until its phase.
import type { AppState, Controller, Route } from "../../app/controller";
import { h, statusLine } from "../../app/dom";
import type { LockedFeature } from "../../app/features";
import { FONT_SIZE } from "../../app/preferences";
import type { WorldView } from "../../app/types";
import { card, renderFrame } from "../chrome/frame";
import { ICONS, type IconFactory } from "../chrome/icons";
import { featureButton } from "../chrome/locked";

function nicknameRow(view: WorldView, state: AppState, controller: Controller) {
  const busy = Boolean(state.busy["rename-nickname"]);
  const current = view.state.settings.playerNickname;
  const input = h("input", {
    className: "input",
    attrs: { id: "fw-set-nick", maxlength: "24", autocomplete: "off", value: current },
  });
  return h(
    "form",
    {
      className: "setting-row",
      on: {
        submit: (event) => {
          event.preventDefault();
          const next = input.value.trim();
          if (next && next !== current)
            void controller.runCommand("rename-nickname", "settings.update", { playerNickname: input.value });
        },
      },
    },
    [
      ICONS.leaf("icon row-leaf"),
      h("label", { className: "setting-label", text: "닉네임", attrs: { for: "fw-set-nick" } }),
      h("span", { className: "setting-field" }, [
        input,
        h("button", {
          className: "button small",
          text: busy ? "저장 중…" : "수정",
          attrs: { type: "submit" },
          disabled: busy,
        }),
      ]),
    ],
  );
}

function weatherRow(controller: Controller) {
  return h("div", { className: "setting-row" }, [
    ICONS.leaf("icon row-leaf"),
    h("span", { className: "setting-label", text: "현실 날씨" }),
    h("span", { className: "setting-field" }, [
      h("span", { className: "input readonly" }, [ICONS.weather("icon"), h("span", { text: "도시 미설정" })]),
      featureButton(controller, "weather", {
        className: "button small",
        label: "현실 날씨 변경",
        children: [h("span", { text: "변경" })],
      }),
    ]),
  ]);
}

function fontSizeRow(state: AppState, controller: Controller) {
  const slider = h("input", {
    className: "slider",
    attrs: {
      id: "fw-font-size",
      type: "range",
      min: String(FONT_SIZE.min),
      max: String(FONT_SIZE.max),
      step: String(FONT_SIZE.step),
      value: String(state.fontSize),
      "aria-valuetext": `${state.fontSize}px`,
    },
    on: { change: () => controller.setFontSize(Number(slider.value)) },
  });
  return h("div", { className: "setting-block" }, [
    h("div", { className: "setting-row slider-row" }, [
      ICONS.leaf("icon row-leaf"),
      h("label", { className: "setting-label", text: "글자 크기", attrs: { for: "fw-font-size" } }),
      slider,
      h("span", { className: "slider-value", text: `${state.fontSize}px` }),
    ]),
    h("p", { className: "font-preview", text: "이렇게 표시돼요." }),
  ]);
}

function toggleRow(controller: Controller, feature: LockedFeature, icon: IconFactory, title: string, detail: string) {
  return featureButton(controller, feature, {
    className: "toggle-row",
    label: title,
    children: [
      h("span", { className: "toggle-icon" }, [icon("icon")]),
      h("span", { className: "toggle-text" }, [h("strong", { text: title }), h("span", { text: detail })]),
      h("span", { className: "switch off" }, [h("span", { className: "knob" })]),
    ],
  });
}

function manageRow(
  controller: Controller,
  icon: IconFactory,
  title: string,
  target: { route: Route } | { feature: LockedFeature },
) {
  const children = [
    h("span", { className: "manage-icon" }, [icon("icon")]),
    h("span", { className: "manage-title", text: title }),
    h("span", { className: "menu-chevron" }, [ICONS.chevron()]),
  ];
  if ("route" in target) {
    return h(
      "button",
      { className: "manage-row", attrs: { type: "button" }, on: { click: () => controller.navigate(target.route) } },
      children,
    );
  }
  return featureButton(controller, target.feature, { className: "manage-row", label: title, children });
}

export function renderSettingsScreen(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  const body = world
    ? [
        card("내 공방", [nicknameRow(world, state, controller), weatherRow(controller)], { id: "fw-mine" }),
        card(
          "표시",
          [
            fontSizeRow(state, controller),
            toggleRow(controller, "weather-effects", ICONS.leaf, "날씨 효과", "공방 배경에 현재 날씨를 반영해요."),
            toggleRow(controller, "auto-read", ICONS.book, "자동 읽기", "이야기를 자동으로 넘겨요."),
          ],
          { id: "fw-display" },
        ),
        card(
          "관리",
          [
            manageRow(controller, ICONS.image, "주민 그림 관리", { route: "residents" }),
            manageRow(controller, ICONS.flower, "AI 지침 관리", { feature: "ai-guidelines" }),
            manageRow(controller, ICONS.people, "기억 관리", { feature: "memory" }),
            manageRow(controller, ICONS.folder, "저장 · 백업", { route: "backup" }),
            h("div", { className: "note-box" }, [
              ICONS.clock("icon"),
              h("span", {}, [
                h("strong", { text: "미접속 누적 상한 72시간" }),
                h("span", { text: "72시간이 지나면 일부 자동 진행이 멈춰요." }),
              ]),
            ]),
          ],
          { id: "fw-manage" },
        ),
        h("p", { className: "footnote", text: "자동화 규칙은 작업 화면에서 바꿀 수 있어요." }),
      ]
    : [statusLine("세계를 불러오는 중…")];
  return renderFrame(state, controller, {
    top: { kind: "sub", title: "설정", back: { route: "home", label: "홈" }, resources: false },
    backdrop: "wood",
    body,
    nav: true,
  });
}
