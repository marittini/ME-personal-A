// 공방 작업 (board 01-2): field tabs (채집 · 재배 · 조사 · 가공 · 제작), 자동 운영 / 지정 횟수, the facility card,
// the recipe, 목표 재고, 재료 사용 설정, 제작 우선순위, 현재 작업, and 운영 규칙 적용 · 추천 설정. Production arrives in P3;
// until then every part keeps its place locked, except the facility card, which already opens 시설과 창고.
import type { AppState, Controller } from "../../app/controller";
import { h } from "../../app/dom";
import { card, renderFrame } from "../chrome/frame";
import { ICONS, type IconFactory } from "../chrome/icons";
import { featureButton, lockedBlock } from "../chrome/locked";

const FIELDS: ReadonlyArray<{ label: string; icon: IconFactory }> = [
  { label: "채집", icon: ICONS.leaf },
  { label: "재배", icon: ICONS.sprout },
  { label: "조사", icon: ICONS.search },
  { label: "가공", icon: ICONS.jar },
  { label: "제작", icon: ICONS.hammer },
];

function fieldTabs(controller: Controller) {
  return h(
    "div",
    { className: "field-tabs", attrs: { role: "group", "aria-label": "작업 분야" } },
    FIELDS.map((field) =>
      featureButton(controller, "work-fields", {
        className: "field-tab",
        label: field.label,
        children: [field.icon("icon field-glyph"), h("span", { text: field.label })],
      }),
    ),
  );
}

function modeToggle(controller: Controller) {
  return lockedBlock(
    controller,
    "work-mode",
    [
      h("div", { className: "segmented", attrs: { "aria-hidden": "true" } }, [
        h("span", { className: "segment selected", text: "자동 운영" }),
        h("span", { className: "segment", text: "지정 횟수" }),
      ]),
    ],
    "slim",
  );
}

// The board draws the field's facility with "배치 변경" (P3). The facility itself opens 시설과 창고 (board 01-3).
function facilityCard(controller: Controller) {
  return h("div", { className: "facility-entry" }, [
    h(
      "button",
      {
        className: "facility-open",
        attrs: { type: "button", "aria-label": "시설과 창고 열기" },
        on: { click: () => controller.navigate("facilities") },
      },
      [
        h("span", { className: "facility-art" }, [ICONS.box("icon big")]),
        h("span", { className: "facility-text" }, [
          h("strong", { text: "시설과 창고" }),
          h("span", { text: "창고의 재료와 재고 보호를 확인해요." }),
        ]),
      ],
    ),
    featureButton(controller, "work-fields", {
      className: "outline-button",
      label: "배치 변경",
      children: [ICONS.swap("icon"), h("span", { text: "배치 변경" })],
    }),
  ]);
}

function productionPlan(controller: Controller) {
  return lockedBlock(controller, "work-rules", [
    h("div", { className: "recipe" }, [
      h("span", { className: "recipe-art" }, [ICONS.jar("icon big")]),
      h("span", { className: "recipe-text" }, [
        h("strong", { text: "제작법" }),
        h("span", { text: "분야를 고르면 만들 아이템이 여기에 보여요." }),
      ]),
    ]),
    h("div", { className: "plan-row" }, [
      h("span", { className: "plan-label", text: "목표 재고" }),
      h("span", { className: "stepper" }, [
        h("span", { className: "step" }, [ICONS.minus("icon")]),
        h("span", { className: "step-value", text: "–" }),
        h("span", { className: "step plus" }, [ICONS.plus("icon")]),
      ]),
      h("span", { className: "plan-progress" }, [
        h("span", { className: "muted", text: "현재 – / 목표 –" }),
        h("span", { className: "bar" }),
      ]),
    ]),
    h("div", { className: "plan-block" }, [
      h("span", { className: "plan-label", text: "재료 사용 설정" }),
      h("div", { className: "usage" }, [
        h("span", { className: "usage-item", text: "재료" }),
        ...["보유", "보호", "사용 가능"].map((label) =>
          h("span", { className: "usage-cell" }, [h("small", { text: label }), h("strong", { text: "–" })]),
        ),
      ]),
    ]),
    h("div", { className: "plan-block" }, [
      h("span", { className: "plan-label" }, [
        "제작 우선순위 ",
        h("small", { text: "(위의 아이템부터 순서대로 제작해요)" }),
      ]),
      ...[1, 2].map((rank) =>
        h("div", { className: "priority-row" }, [
          ICONS.grip("icon muted-icon"),
          h("span", { className: "rank", text: String(rank) }),
          h("span", { className: "priority-name", text: "–" }),
          ICONS.menu("icon muted-icon"),
        ]),
      ),
    ]),
    h("div", { className: "plan-row" }, [
      h("span", { className: "plan-label", text: "현재 작업" }),
      h("span", { className: "plan-progress wide" }, [
        h("span", { className: "muted", text: "진행 중인 작업 없음" }),
        h("span", { className: "bar teal" }),
      ]),
    ]),
    h("p", { className: "hint" }, [ICONS.info("icon"), "재료가 부족하면 기다렸다 다시 시작해요."]),
  ]);
}

function ruleButtons(controller: Controller) {
  return h("div", { className: "rule-actions" }, [
    featureButton(controller, "work-rules", {
      className: "button wide-main",
      label: "운영 규칙 적용",
      children: [h("span", { text: "운영 규칙 적용" })],
    }),
    featureButton(controller, "work-rules", {
      className: "button secondary",
      label: "추천 설정",
      children: [ICONS.gear("icon"), h("span", { text: "추천 설정" })],
    }),
  ]);
}

export function renderWorkScreen(state: AppState, controller: Controller) {
  return renderFrame(state, controller, {
    top: { kind: "sub", title: "공방 작업", back: { route: "home", label: "홈" }, resources: true },
    backdrop: "forest",
    body: [
      fieldTabs(controller),
      card(null, [modeToggle(controller), facilityCard(controller), productionPlan(controller)], {
        className: "work-card",
      }),
      ruleButtons(controller),
    ],
    nav: true,
  });
}
