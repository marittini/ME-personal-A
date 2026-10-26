// 설정 (mockup 04, left): "내 공방" with the nickname and world name, then the "관리" list. Rows appear as their
// screens are built: 현실 날씨 and 표시 (P5), 주민 그림 관리 (P2), AI 지침 관리 · 기억 관리 (P4).
import type { AppState, Controller, Route } from "../app/controller";
import { h, statusLine } from "../app/dom";
import type { WorldView } from "../app/types";
import { ICONS } from "./icons";
import { renderLayout } from "./layout";

function nameRow(
  label: string,
  inputId: string,
  value: string,
  maxLength: number,
  busy: boolean,
  onSave: (value: string) => void,
) {
  const input = h("input", {
    className: "input",
    attrs: { id: inputId, maxlength: String(maxLength), autocomplete: "off", value },
  });
  return h(
    "form",
    {
      className: "field-row",
      on: {
        submit: (event) => {
          event.preventDefault();
          const next = input.value.trim();
          if (next && next !== value) onSave(input.value);
        },
      },
    },
    [
      h("label", { className: "field-row-label", text: label, attrs: { for: inputId } }),
      input,
      h("button", {
        className: "button small",
        text: busy ? "저장 중…" : "수정",
        attrs: { type: "submit" },
        disabled: busy,
      }),
    ],
  );
}

function myWorkshop(view: WorldView, state: AppState, controller: Controller) {
  const { settings } = view.state;
  return h("section", { className: "card", attrs: { "aria-labelledby": "fw-mine" } }, [
    h("h2", { className: "section-title", text: "내 공방", attrs: { id: "fw-mine" } }),
    nameRow(
      "닉네임",
      "fw-set-nick",
      settings.playerNickname,
      24,
      Boolean(state.busy["rename-nickname"]),
      (value) => void controller.runCommand("rename-nickname", "settings.update", { playerNickname: value }),
    ),
    nameRow(
      "세계 이름",
      "fw-set-world",
      settings.worldName,
      40,
      Boolean(state.busy["rename-world"]),
      (value) => void controller.runCommand("rename-world", "settings.update", { worldName: value }),
    ),
  ]);
}

function menuRow(controller: Controller, route: Route, title: string, detail: string) {
  return h(
    "button",
    { className: "menu-row", attrs: { type: "button" }, on: { click: () => controller.navigate(route) } },
    [
      h("span", { className: "menu-text" }, [
        h("span", { className: "menu-title", text: title }),
        h("span", { className: "menu-detail", text: detail }),
      ]),
      h("span", { className: "menu-chevron" }, [ICONS.chevron()]),
    ],
  );
}

export function renderSettingsScreen(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  const body = world
    ? [
        myWorkshop(world, state, controller),
        h("section", { className: "card menu", attrs: { "aria-labelledby": "fw-manage" } }, [
          h("h2", { className: "section-title", text: "관리", attrs: { id: "fw-manage" } }),
          menuRow(controller, "backup", "저장 · 백업", "백업 내보내기 · 새 세계로 복원"),
          menuRow(controller, "worlds", "다른 세계", "세계 고르기 · 새로 만들기"),
          menuRow(controller, "diagnostics", "연결 점검", "엔진 연결과 주민 그림 저장 경로 확인"),
        ]),
      ]
    : [statusLine("세계를 불러오는 중…")];
  return renderLayout(state, controller, {
    title: "설정",
    back: { route: "home", label: "홈" },
    showWorldBar: true,
    body,
  });
}
