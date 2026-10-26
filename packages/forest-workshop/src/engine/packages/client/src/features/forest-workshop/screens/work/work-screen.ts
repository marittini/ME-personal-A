// 공방 작업 (board 01-2): field tabs (채집 · 재배 · 조사 · 가공 · 제작), 자동 운영 / 지정 횟수, the facility card with
// 배치 변경, the recipe, 목표 재고 with 현재 / 목표, 재료 사용 설정 (보유 · 보호 · 사용 가능), 제작 우선순위, 현재 작업
// with its countdown, the waiting hint, and 운영 규칙 적용 · 추천 설정.
// Real now: 채집 and 가공 (the two facilities of the first play test), 자동 운영, every part of the plan, 적용 and 추천
// 설정 (a preview the player applies). Locked in place: 재배 · 조사 · 제작 (their facilities), 지정 횟수 and 배치 변경
// (resident placement) — P3b.
import type { AppState, Controller } from "../../app/controller";
import { h, statusLine } from "../../app/dom";
import { draftRules, isDraftDirty } from "../../app/production-actions";
import type { FacilityState, GameContent, Rule, WorldView } from "../../app/types";
import { card, renderFrame } from "../chrome/frame";
import { ICONS, type IconFactory } from "../chrome/icons";
import { featureButton } from "../chrome/locked";
import {
  facilityOf,
  formatDuration,
  itemName,
  itemTile,
  jobProgress,
  recipeOf,
  runMs,
  speedPercent,
  waitingText,
} from "./production-view";

const FIELDS: ReadonlyArray<{ field: string; label: string; icon: IconFactory }> = [
  { field: "gather", label: "채집", icon: ICONS.leaf },
  { field: "grow", label: "재배", icon: ICONS.sprout },
  { field: "survey", label: "조사", icon: ICONS.search },
  { field: "process", label: "가공", icon: ICONS.jar },
  { field: "craft", label: "제작", icon: ICONS.hammer },
];

function fieldTabs(content: GameContent, facilityId: string, controller: Controller) {
  return h(
    "div",
    { className: "field-tabs", attrs: { role: "tablist", "aria-label": "작업 분야" } },
    FIELDS.map((field) => {
      const facility = content.facilities.find((candidate) => candidate.field === field.field);
      if (!facility) {
        return featureButton(controller, "work-fields", {
          className: "field-tab",
          label: field.label,
          children: [field.icon("icon field-glyph"), h("span", { text: field.label })],
        });
      }
      const current = facility.id === facilityId;
      return h(
        "button",
        {
          className: `field-tab${current ? " current" : ""}`,
          attrs: { type: "button", role: "tab", "aria-selected": current ? "true" : "false" },
          on: { click: () => controller.selectFacility(facility.id) },
        },
        [field.icon("icon field-glyph"), h("span", { text: field.label })],
      );
    }),
  );
}

function modeToggle(controller: Controller) {
  return h("div", { className: "segmented", attrs: { role: "group", "aria-label": "작업 방식" } }, [
    h("span", { className: "segment selected", text: "자동 운영", attrs: { "aria-current": "true" } }),
    featureButton(controller, "work-mode", {
      className: "segment",
      label: "지정 횟수",
      children: [h("span", { text: "지정 횟수" })],
    }),
  ]);
}

function facilityCard(content: GameContent, facilityId: string, facility: FacilityState, controller: Controller) {
  const definition = facilityOf(content, facilityId);
  return h("div", { className: "facility-entry" }, [
    h(
      "button",
      {
        className: "facility-open",
        attrs: { type: "button", "aria-label": `${definition?.name ?? "시설"} — 시설과 창고 열기` },
        on: { click: () => controller.navigate("facilities") },
      },
      [
        h("span", { className: "facility-art" }, [ICONS.house("icon big")]),
        h("span", { className: "facility-text" }, [
          h("strong", { text: `${definition?.name ?? facilityId} Lv. ${facility.level}` }),
          h("span", { text: `${definition?.description ?? ""} 처리 속도 +${speedPercent(content, facility.level)}%` }),
        ]),
      ],
    ),
    featureButton(controller, "assign-residents", {
      className: "outline-button",
      label: "배치 변경",
      children: [ICONS.swap("icon"), h("span", { text: "배치 변경" })],
    }),
  ]);
}

function recipeCard(content: GameContent, rule: Rule | undefined, level: number) {
  const recipe = rule ? recipeOf(content, rule.recipeId) : null;
  if (!recipe) {
    return h("div", { className: "recipe" }, [
      h("span", { className: "recipe-art" }, [ICONS.jar("icon big")]),
      h("span", { className: "recipe-text" }, [
        h("strong", { text: "제작법" }),
        h("span", { text: "아래 우선순위에서 제작법을 추가해 주세요." }),
      ]),
    ]);
  }
  const output = Object.keys(recipe.outputs)[0]!;
  const oneRun = runMs(content, recipe, level);
  const flow = [...Object.entries(recipe.inputs).map(([item, amount]) => `${itemName(content, item)} ${amount}`)];
  return h("div", { className: "recipe" }, [
    h("span", { className: "recipe-art" }, [itemTile(output, "big")]),
    h("span", { className: "recipe-text" }, [
      h("strong", { text: recipe.name }),
      h("span", { text: recipe.description }),
      h("span", {
        className: "recipe-flow",
        text: `${flow.length ? `${flow.join(" · ")} → ` : ""}${Object.entries(recipe.outputs)
          .map(([item, amount]) => `${itemName(content, item)} ${amount}`)
          .join(" · ")} · 1회 ${formatDuration(oneRun)}`,
      }),
    ]),
  ]);
}

function targetRow(content: GameContent, world: WorldView, facilityId: string, rule: Rule, controller: Controller) {
  const recipe = recipeOf(content, rule.recipeId);
  const output = recipe ? Object.keys(recipe.outputs)[0]! : "";
  const production = world.state.production;
  const stock = world.state.inventory[output] ?? 0;
  const pending = Object.values(production.facilities).reduce(
    (total, facility) => total + (facility.job?.outputs[output] ?? 0),
    0,
  );
  const fill = h("span", { className: "bar-fill red" });
  fill.style.width = `${Math.min(100, Math.round(((stock + pending) / Math.max(1, rule.targetStock)) * 100))}%`;
  const step = (delta: number, icon: IconFactory, label: string, plus = false) =>
    h(
      "button",
      {
        className: `step${plus ? " plus" : ""}`,
        attrs: { type: "button", "aria-label": label },
        on: { click: () => controller.changeTarget(facilityId, rule.policyId, delta) },
      },
      [icon("icon")],
    );
  return h("div", { className: "plan-row" }, [
    h("span", { className: "plan-label", text: "목표 재고" }),
    h("span", { className: "stepper" }, [
      step(-1, ICONS.minus, "목표 1 줄이기"),
      h("span", { className: "step-value", text: String(rule.targetStock), attrs: { "aria-live": "polite" } }),
      step(1, ICONS.plus, "목표 1 늘리기", true),
    ]),
    h("span", { className: "plan-progress" }, [
      h("span", { className: "muted" }, [
        `현재 ${itemName(content, output)} `,
        h("strong", { text: String(stock) }),
        pending ? ` (+${pending} 진행 중)` : "",
        " / 목표 ",
        h("strong", { text: String(rule.targetStock) }),
      ]),
      h("span", { className: "bar" }, [fill]),
    ]),
  ]);
}

function materialsBlock(content: GameContent, world: WorldView, rule: Rule | undefined) {
  const recipe = rule ? recipeOf(content, rule.recipeId) : null;
  const inputs = recipe ? Object.entries(recipe.inputs) : [];
  const production = world.state.production;
  return h("div", { className: "plan-block" }, [
    h("span", { className: "plan-label", text: "재료 사용 설정" }),
    inputs.length === 0
      ? h("p", { className: "muted", text: "이 제작법은 재료 없이 숲에서 바로 모아요." })
      : h(
          "div",
          { className: "usage-list" },
          inputs.map(([itemId]) => {
            const held = world.state.inventory[itemId] ?? 0;
            const guarded = production.protectedStock[itemId] ?? 0;
            return h("div", { className: "usage" }, [
              h("span", { className: "usage-item" }, [
                itemTile(itemId),
                h("span", { text: itemName(content, itemId) }),
              ]),
              h("span", { className: "usage-cell" }, [
                h("small", { text: "보유" }),
                h("strong", { text: String(held) }),
              ]),
              h("span", { className: "usage-cell" }, [
                h("small", { text: "보호" }),
                h("strong", { text: String(guarded) }),
              ]),
              h("span", { className: "usage-cell available" }, [
                h("small", { text: "사용 가능" }),
                h("strong", { text: String(Math.max(0, held - guarded)) }),
              ]),
            ]);
          }),
        ),
  ]);
}

function priorityList(
  content: GameContent,
  facilityId: string,
  rules: Rule[],
  selectedId: string | undefined,
  controller: Controller,
) {
  const used = new Set(rules.map((rule) => rule.recipeId));
  const addable = content.recipes.filter((recipe) => recipe.facilityId === facilityId && !used.has(recipe.id));
  return h("div", { className: "plan-block" }, [
    h("span", { className: "plan-label" }, [
      "제작 우선순위 ",
      h("small", { text: "(위의 아이템부터 순서대로 제작해요)" }),
    ]),
    ...rules.map((rule, index) => {
      const recipe = recipeOf(content, rule.recipeId);
      const output = recipe ? Object.keys(recipe.outputs)[0]! : "";
      return h(
        "div",
        { className: `priority-row${rule.policyId === selectedId ? " selected" : ""}${rule.enabled ? "" : " off"}` },
        [
          h("span", { className: "rank", text: String(index + 1) }),
          h(
            "button",
            {
              className: "priority-main",
              attrs: { type: "button", "aria-pressed": rule.policyId === selectedId ? "true" : "false" },
              on: { click: () => controller.selectRule(facilityId, rule.policyId) },
            },
            [
              itemTile(output),
              h("span", { className: "priority-name", text: recipe?.name ?? rule.recipeId }),
              h("small", { className: "muted", text: `목표 ${rule.targetStock}` }),
            ],
          ),
          h("button", {
            className: `chip-toggle${rule.enabled ? " on" : ""}`,
            text: rule.enabled ? "켜짐" : "꺼짐",
            attrs: {
              type: "button",
              "aria-pressed": rule.enabled ? "true" : "false",
              "aria-label": `${recipe?.name ?? ""} ${rule.enabled ? "끄기" : "켜기"}`,
            },
            on: { click: () => controller.toggleRule(facilityId, rule.policyId) },
          }),
          h("span", { className: "order-buttons" }, [
            h(
              "button",
              {
                className: "mini",
                attrs: { type: "button", "aria-label": "위로" },
                disabled: index === 0,
                on: { click: () => controller.moveRule(facilityId, rule.policyId, -1) },
              },
              [ICONS.up("icon")],
            ),
            h(
              "button",
              {
                className: "mini",
                attrs: { type: "button", "aria-label": "아래로" },
                disabled: index === rules.length - 1,
                on: { click: () => controller.moveRule(facilityId, rule.policyId, 1) },
              },
              [ICONS.down("icon")],
            ),
          ]),
        ],
      );
    }),
    addable.length
      ? h(
          "div",
          { className: "add-rules" },
          addable.map((recipe) =>
            h(
              "button",
              {
                className: "outline-button small",
                attrs: { type: "button" },
                on: { click: () => controller.addRule(facilityId, recipe.id) },
              },
              [ICONS.plus("icon"), h("span", { text: recipe.name })],
            ),
          ),
        )
      : null,
  ]);
}

function currentWork(state: AppState, content: GameContent, world: WorldView, facility: FacilityState) {
  if (!facility.job) {
    return h("div", { className: "plan-row" }, [
      h("span", { className: "plan-label", text: "현재 작업" }),
      h("span", { className: "plan-progress wide" }, [
        h("span", { className: "muted", text: "쉬는 중" }),
        h("span", { className: "bar" }),
      ]),
    ]);
  }
  const recipe = recipeOf(content, facility.job.recipeId);
  const output = Object.keys(facility.job.outputs)[0]!;
  const progress = jobProgress(state, world, facility.job);
  return h("div", { className: "plan-row current-work" }, [
    h("span", { className: "plan-label", text: "현재 작업" }),
    itemTile(output),
    h("span", { className: "plan-progress" }, [
      h("span", { className: "muted", text: `${recipe?.name ?? ""} 만드는 중…` }),
      progress.bar,
    ]),
    progress.countdown,
  ]);
}

function body(state: AppState, content: GameContent, world: WorldView, controller: Controller) {
  const facilityId = state.work.facilityId;
  const facility = world.state.production.facilities[facilityId];
  if (!facility) return [statusLine("시설을 불러오는 중…")];
  const rules = draftRules(state, world.state.production, facilityId);
  const selected = rules.find((rule) => rule.policyId === state.work.selected[facilityId]) ?? rules[0];
  const dirty = isDraftDirty(state, world.state.production, facilityId);
  const applying = Boolean(state.busy[`rules:${facilityId}`]);
  return [
    fieldTabs(content, facilityId, controller),
    card(
      null,
      [
        modeToggle(controller),
        facilityCard(content, facilityId, facility, controller),
        recipeCard(content, selected, facility.level),
        selected ? targetRow(content, world, facilityId, selected, controller) : null,
        materialsBlock(content, world, selected),
        priorityList(content, facilityId, rules, selected?.policyId, controller),
        currentWork(state, content, world, facility),
        h("p", { className: "hint center" }, [
          ICONS.info("icon"),
          facility.waiting ? waitingText(content, facility.waiting) : "재료가 부족하면 기다렸다 다시 시작해요.",
        ]),
        dirty
          ? h("p", { className: "draft-note" }, [
              "바꾼 규칙은 아직 적용 전이에요. ",
              h("button", {
                className: "link-button",
                text: "되돌리기",
                attrs: { type: "button" },
                on: { click: () => controller.discardDraft(facilityId) },
              }),
            ])
          : null,
      ],
      { className: "work-card" },
    ),
    h("div", { className: "rule-actions" }, [
      h(
        "button",
        {
          className: "button wide-main",
          attrs: { type: "button" },
          disabled: !dirty || applying,
          on: { click: () => void controller.applyRules(facilityId) },
        },
        [h("span", { text: applying ? "적용하는 중…" : dirty ? "운영 규칙 적용" : "적용됨" })],
      ),
      h(
        "button",
        {
          className: "button secondary",
          attrs: { type: "button" },
          on: { click: () => controller.recommendRules(facilityId) },
        },
        [ICONS.gear("icon"), h("span", { text: "추천 설정" })],
      ),
    ]),
  ];
}

export function renderWorkScreen(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  return renderFrame(state, controller, {
    top: { kind: "sub", title: "공방 작업", back: { route: "home", label: "홈" }, resources: true },
    backdrop: "forest",
    body: world && state.content ? body(state, state.content, world, controller) : [statusLine("세계를 불러오는 중…")],
    nav: true,
  });
}
