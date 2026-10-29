// 설정 (board 04-1): 내 공방 (닉네임 + 수정, 현실 날씨 + 변경), 표시 (글자 크기 + 미리보기, 날씨 효과, 자동 읽기),
// 관리 (주민 그림 관리 · AI 지침 관리 · 기억 관리 · 저장 · 백업), the 72-hour note and the automation footnote.
// Real now: nickname, text size and 저장 · 백업. The rest keeps its place, locked until its phase.
import type { StoredSeasonChoice } from "../../app/preferences";
import { SEASON_LABELS, seasonForDate } from "../../app/season";
import type { AppState, Controller } from "../../app/controller";
import { h, statusLine } from "../../app/dom";
import { normalizeWeatherEffects, WEATHER_KINDS, WEATHER_LABELS } from "../../app/preferences";
import { MANAGEMENT_ART, WEATHER_ART, assetImage } from "../../app/assets";
import { FONT_SIZE } from "../../app/preferences";
import type { WorldView } from "../../app/types";
import { card, renderFrame } from "../chrome/frame";
import { ICONS } from "../chrome/icons";
import { featureButton } from "../chrome/locked";

function nicknameRow(view: WorldView, state: AppState, controller: Controller) {
  const busy = Boolean(state.busy["rename-nickname"]);
  const current = view.state.settings.playerNickname;
  const input = h("input", {
    className: "input",
    attrs: {
      id: "fw-set-nick",
      maxlength: "24",
      autocomplete: "off",
      value: state.settingsNicknameDraft?.worldId === view.worldId ? state.settingsNicknameDraft.value : current,
    },
    on: { input: () => controller.rememberSettingsNickname(view.worldId, input.value) },
  });
  return h(
    "form",
    {
      className: "setting-row",
      on: {
        submit: (event) => {
          event.preventDefault();
          const next = input.value.trim();
          if (next && next !== current) void controller.saveSettingsNickname(view.worldId, input.value);
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

function groundEditor(_view: WorldView, _state: AppState, controller: Controller) {
  return h("div", { className: "setting-row" }, [
    h("span", { className: "setting-label", text: "지면 설정" }),
    h("button", {
      className: "button small",
      text: "홈에서 영역 편집",
      attrs: { type: "button" },
      on: { click: () => controller.openGroundEditor() },
    }),
  ]);
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

/** 계절: which season's workshop the screens draw. Visual only; daily limits follow the server's UTC day. */
function seasonRow(state: AppState, controller: Controller) {
  const choices: Array<{ id: StoredSeasonChoice; label: string }> = [
    { id: "auto", label: `자동 (${SEASON_LABELS[seasonForDate(new Date())]})` },
    { id: "spring", label: "봄" },
    { id: "summer", label: "여름" },
    { id: "autumn", label: "가을" },
    { id: "winter", label: "겨울" },
  ];
  return h("div", { className: "setting-block" }, [
    h("div", { className: "setting-row" }, [
      ICONS.leaf("icon row-leaf"),
      h("span", { className: "setting-label", text: "계절", attrs: { id: "fw-season-label" } }),
    ]),
    h(
      "div",
      { className: "chip-row season-chips", attrs: { role: "group", "aria-labelledby": "fw-season-label" } },
      choices.map((choice) =>
        h("button", {
          className: `pill-tab${state.seasonChoice === choice.id ? " current" : ""}`,
          text: choice.label,
          attrs: { type: "button", "aria-pressed": state.seasonChoice === choice.id ? "true" : "false" },
          on: { click: () => controller.setSeasonChoice(choice.id) },
        }),
      ),
    ),
    h("p", {
      className: "hint",
      text: "자동은 오늘 날짜(북반구)를 따라요. 도시를 선택하는 현실 날씨는 준비 중이에요. 계절은 그림만 바꾸고 생산 · 판매 · 선물에는 영향이 없어요.",
    }),
  ]);
}

function autoReadingRow(state: AppState, controller: Controller) {
  const preference = state.autoReading ?? { enabled: false, seconds: 4 };
  const interval = h(
    "select",
    {
      className: "input",
      attrs: { "aria-label": "이야기 자동 넘기기 간격" },
      on: { change: () => controller.setAutoReading({ ...preference, seconds: Number(interval.value) }) },
    },
    Array.from({ length: 9 }, (_, index) =>
      h("option", { text: `${index + 2}초`, attrs: { value: String(index + 2) } }),
    ),
  );
  interval.value = String(preference.seconds);
  return h("div", { className: "setting-block" }, [
    h(
      "button",
      {
        className: "toggle-row",
        attrs: {
          type: "button",
          role: "switch",
          "aria-checked": String(preference.enabled),
          "aria-label": "이야기 자동 넘기기",
        },
        on: { click: () => controller.setAutoReading({ ...preference, enabled: !preference.enabled }) },
      },
      [
        h("span", { className: "toggle-text" }, [
          h("strong", { text: "이야기 자동 넘기기" }),
          h("span", { text: preference.enabled ? "새 이야기를 자동으로 넘겨요" : "직접 눌러 넘겨요" }),
        ]),
        h("span", { className: `switch ${preference.enabled ? "on" : "off"}` }, [h("span", { className: "knob" })]),
      ],
    ),
    interval,
    h("p", {
      className: "muted",
      text: "질문·기록·화면을 벗어날 때 멈춰요. 다시 시작하려면 이야기의 자동 버튼을 눌러 주세요. 보관은 직접 눌러요.",
    }),
  ]);
}

function weatherEffectsControls(state: AppState, controller: Controller) {
  const preference = normalizeWeatherEffects(state.weatherEffects);
  return h("div", { className: "setting-block weather-settings" }, [
    h(
      "button",
      {
        className: "toggle-row",
        attrs: {
          type: "button",
          role: "switch",
          "aria-label": "날씨 효과",
          "aria-checked": String(preference.enabled),
        },
        on: { click: () => controller.setWeatherEffects({ ...preference, enabled: !preference.enabled }) },
      },
      [
        h("span", { className: "toggle-text" }, [
          h("strong", { text: "날씨 효과" }),
          h("span", { text: preference.enabled ? "공방 배경에 은은하게 표시해요" : "배경 효과를 쉬어요" }),
        ]),
        h("span", { className: `switch ${preference.enabled ? "on" : "off"}`, attrs: { "aria-hidden": "true" } }, [
          h("span", { className: "knob" }),
        ]),
      ],
    ),
    h(
      "div",
      { className: "weather-choices", attrs: { role: "group", "aria-label": "날씨 연출 선택" } },
      WEATHER_KINDS.map((kind) =>
        h(
          "button",
          {
            className: `weather-choice${preference.kind === kind ? " current" : ""}`,
            attrs: { type: "button", "aria-pressed": String(preference.kind === kind) },
            on: { click: () => controller.setWeatherEffects({ ...preference, kind }) },
          },
          [
            assetImage(WEATHER_ART[kind === "clear" ? "sun" : kind === "cloudy" ? "cloud" : kind], {
              className: "weather-choice-art",
              fallback: () => ICONS.weather("icon"),
            }),
            h("span", { text: WEATHER_LABELS[kind] }),
          ],
        ),
      ),
    ),
    h("p", {
      className: "muted",
      text: "직접 고르는 배경 연출이에요. 현실 날씨·생산에는 영향을 주지 않아요. 동작 줄이기 설정에서는 움직이지 않아요.",
    }),
  ]);
}

function manageRow(icon: keyof typeof MANAGEMENT_ART, label: string, onClick: () => void) {
  return h("button", { className: "manage-row", attrs: { type: "button" }, on: { click: onClick } }, [
    assetImage(MANAGEMENT_ART[icon], { className: "manage-art", fallback: () => ICONS.document("icon") }),
    h("span", { className: "manage-title", text: label }),
    h("span", { className: "menu-chevron" }, [ICONS.chevron()]),
  ]);
}

export function renderSettingsScreen(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  const section = state.settingsSection ?? "workshop";
  const choices = [
    ["workshop", "내 공방"],
    ["display", "표시"],
    ["manage", "관리"],
  ] as const;
  const body = world
    ? [
        h(
          "div",
          { className: "pill-tabs", attrs: { role: "group", "aria-label": "설정 항목" } },
          choices.map(([id, label]) =>
            h("button", {
              className: `pill-tab${section === id ? " current" : ""}`,
              text: label,
              attrs: { type: "button", "aria-pressed": section === id ? "true" : "false" },
              on: { click: () => controller.setSettingsSection(id) },
            }),
          ),
        ),
        section === "workshop"
          ? card(
              "내 공방",
              [nicknameRow(world, state, controller), groundEditor(world, state, controller), weatherRow(controller)],
              { id: "fw-mine" },
            )
          : null,
        section === "display"
          ? card(
              "표시",
              [
                fontSizeRow(state, controller),
                seasonRow(state, controller),
                weatherEffectsControls(state, controller),
                autoReadingRow(state, controller),
              ],
              { id: "fw-display" },
            )
          : null,
        section === "manage"
          ? card(
              "관리",
              [
                manageRow("portrait", "주민 그림 관리", () => controller.navigate("residents")),
                manageRow("guidelines", "AI 지침 관리", () => controller.openGuidelines()),
                manageRow("memory", "기억 관리", () => controller.openMemory()),
                manageRow("backup", "저장 · 백업", () => controller.navigate("backup")),
                h("div", { className: "note-box" }, [
                  ICONS.clock("icon"),
                  h("span", {}, [
                    h("strong", { text: "미접속 누적 상한 72시간" }),
                    h("span", { text: "72시간이 지나면 일부 자동 진행이 멈춰요." }),
                  ]),
                ]),
              ],
              { id: "fw-manage" },
            )
          : null,
        section === "manage"
          ? h("p", { className: "footnote", text: "자동화 규칙은 작업 화면에서 바꿀 수 있어요." })
          : null,
      ]
    : [statusLine("세계를 불러오는 중…")];
  return renderFrame(state, controller, {
    top: { kind: "sub", title: "설정", back: { route: "home", label: "홈" }, resources: false },
    backdrop: "wood",
    body,
    nav: true,
  });
}
