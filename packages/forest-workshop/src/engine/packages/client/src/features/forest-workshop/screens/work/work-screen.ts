// 공방 작업 (board 01-2): field tabs (채집 · 재배 · 조사 · 가공 · 제작), 자동 운영 / 지정 횟수, the facility card with
// 배치 변경, the recipe, 목표 재고 with 현재 / 목표, 재료 사용 설정 (보유 · 보호 · 사용 가능), 제작 우선순위, 현재 작업
// with its countdown, the waiting hint, and 운영 규칙 적용 · 추천 설정.
// A facility not open yet shows its 해금 condition in place of the plan. 지정 횟수 swaps the rule plan for the queue
// (queue-panel.ts); 배치 변경 opens the placement sheet (assign-sheet.ts).
import type { AppState, Controller } from "../../app/controller";
import { h, statusLine } from "../../app/dom";
import { draftRules, isDraftDirty } from "../../app/production-actions";
import type { FacilityState, GameContent, Rule, WorldView } from "../../app/types";
import { card, renderFrame } from "../chrome/frame";
import { ICONS, type IconFactory } from "../chrome/icons";
import { residentAvatar } from "../residents/resident-figure";
import { renderAssignSheet } from "./assign-sheet";
import { queuePanel } from "./queue-panel";
import {
  crewBonus,
  crewRun,
  facilityPicture,
  facilityOf,
  percent,
  unlockParts,
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

function fieldTabs(content: GameContent, world: WorldView, facilityId: string, controller: Controller) {
  return h(
    "div",
    { className: "field-tabs", attrs: { role: "tablist", "aria-label": "작업 분야" } },
    FIELDS.map((field) => {
      const facility = content.facilities.find((candidate) => candidate.field === field.field);
      if (!facility) return null;
      const current = facility.id === facilityId;
      const open = world.state.production.facilities[facility.id]?.unlocked ?? false;
      return h(
        "button",
        {
          className: `field-tab${current ? " current" : ""}${open ? "" : " closed"}`,
          attrs: {
            type: "button",
            role: "tab",
            "aria-selected": current ? "true" : "false",
            "aria-label": open ? field.label : `${field.label} (해금 전)`,
          },
          on: { click: () => controller.selectFacility(facility.id) },
        },
        [
          field.icon("icon field-glyph"),
          h("span", { text: field.label }),
          open ? null : h("span", { className: "lock-tag" }, [ICONS.lock("icon tiny")]),
        ],
      );
    }),
  );
}

function modeToggle(state: AppState, facilityId: string, facility: FacilityState, controller: Controller) {
  const busy = Boolean(state.busy[`mode:${facilityId}`]);
  const segment = (mode: FacilityState["mode"], label: string) =>
    h("button", {
      className: `segment${facility.mode === mode ? " selected" : ""}`,
      text: label,
      attrs: { type: "button", "aria-pressed": facility.mode === mode ? "true" : "false" },
      disabled: busy,
      on: { click: () => (facility.mode === mode ? undefined : void controller.setMode(facilityId, mode)) },
    });
  return h("div", { className: "segmented", attrs: { role: "group", "aria-label": "작업 방식" } }, [
    segment("auto", "자동 운영"),
    segment("count", "지정 횟수"),
  ]);
}

/** 해금 전: the facility, its condition with progress, and 해금 once every part holds (plan §7.2-F). */
function unlockCard(
  state: AppState,
  content: GameContent,
  world: WorldView,
  facilityId: string,
  controller: Controller,
) {
  const definition = facilityOf(content, facilityId);
  const parts = unlockParts(content, world.state, facilityId);
  const ready = parts.every((part) => part.met);
  const busy = Boolean(state.busy[`unlock:${facilityId}`]);
  return card(
    null,
    [
      h("div", { className: "facility-entry" }, [
        h("span", { className: "facility-open closed" }, [
          h("span", { className: "facility-art closed" }, [
            facilityPicture(facilityId),
            h("span", { className: "facility-lock" }, [ICONS.lock("icon")]),
          ]),
          h("span", { className: "facility-text" }, [
            h("strong", { text: `${definition?.name ?? facilityId} · 해금 전` }),
            h("span", { text: definition?.description ?? "" }),
          ]),
        ]),
      ]),
      h("div", { className: "plan-block" }, [
        h("span", { className: "plan-label", text: "해금 조건" }),
        h(
          "ul",
          { className: "unlock-list" },
          parts.map((part) =>
            h("li", { className: part.met ? "met" : "" }, [
              (part.met ? ICONS.check : ICONS.hourglass)("icon"),
              h("span", { text: part.text }),
              h("strong", { text: `${Math.min(part.have, part.need)} / ${part.need}` }),
            ]),
          ),
        ),
      ]),
      h(
        "button",
        {
          className: "button",
          attrs: { type: "button", "data-wide": "" },
          disabled: !ready || busy,
          on: { click: () => void controller.unlockFacility(facilityId) },
        },
        [h("span", { text: busy ? "여는 중…" : ready ? "시설 열기" : "조건을 채우면 열 수 있어요" })],
      ),
    ],
    { className: "work-card" },
  );
}

function facilityCard(
  content: GameContent,
  world: WorldView,
  facilityId: string,
  facility: FacilityState,
  controller: Controller,
) {
  const definition = facilityOf(content, facilityId);
  const bonus = crewBonus(content, world.state, facilityId);
  return h("div", { className: "facility-entry" }, [
    h(
      "button",
      {
        className: "facility-open",
        attrs: { type: "button", "aria-label": `${definition?.name ?? "시설"} — 시설과 창고 열기` },
        on: { click: () => controller.navigate("facilities") },
      },
      [
        h("span", { className: "facility-art" }, [facilityPicture(facilityId)]),
        h("span", { className: "facility-text" }, [
          h("strong", { text: `${definition?.name ?? facilityId} Lv. ${facility.level}` }),
          h("span", { text: `${definition?.description ?? ""} 처리 속도 +${speedPercent(content, facility.level)}%` }),
          h("span", { className: "crew-line" }, [
            bonus.resident ? residentAvatar(bonus.resident) : null,
            bonus.resident
              ? `${bonus.resident.displayName} · ${bonus.matches ? `+${percent(bonus.passive)}${bonus.talent ? ` · 특기 ${bonus.talent.name}` : ""}` : "분야가 달라 효과 없음"}`
              : "배치한 주민 없음",
            bonus.set ? ` · 세트 +${percent(bonus.set)}` : "",
          ]),
        ]),
      ],
    ),
    h(
      "button",
      {
        className: "outline-button",
        attrs: { type: "button", "aria-label": `${definition?.name ?? "시설"} 배치 변경` },
        on: { click: () => controller.openSheet({ kind: "assign", facilityId }) },
      },
      [ICONS.swap("icon"), h("span", { text: "배치 변경" })],
    ),
  ]);
}

function recipeCard(content: GameContent, rule: Rule | undefined, level: number, crew: ReturnType<typeof crewBonus>) {
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
  const run = crewRun(recipe, crew);
  const oneRun = runMs(content, recipe, level, run.extraBonus);
  const flow = Object.entries(run.inputs).map(([item, amount]) => `${itemName(content, item)} ${amount}`);
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
      run.talentApplies && crew.talent
        ? h("span", { className: "talent-note" }, [
            ICONS.sparkle("icon tiny"),
            ` 특기 ${crew.talent.name}: ${crew.talent.description}`,
          ])
        : null,
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
              on: {
                click: () => {
                  controller.selectRule(facilityId, rule.policyId);
                  controller.setWorkSection("recipe");
                },
              },
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
  if (!facility.unlocked) {
    return [
      fieldTabs(content, world, facilityId, controller),
      unlockCard(state, content, world, facilityId, controller),
    ];
  }
  const rules = draftRules(state, world.state.production, facilityId);
  const selected = rules.find((rule) => rule.policyId === state.work.selected[facilityId]) ?? rules[0];
  const dirty = isDraftDirty(state, world.state.production, facilityId);
  const applying = Boolean(state.busy[`rules:${facilityId}`]);
  const auto = facility.mode === "auto";
  const crew = crewBonus(content, world.state, facilityId);
  const section = !auto && state.work.section === "priority" ? "recipe" : (state.work.section ?? "status");
  const sections = auto
    ? ([
        ["status", "현재 작업"],
        ["recipe", "제작 설정"],
        ["priority", "순서·적용"],
      ] as const)
    : ([
        ["status", "현재 작업"],
        ["recipe", "대기열"],
      ] as const);
  return [
    fieldTabs(content, world, facilityId, controller),
    h(
      "div",
      { className: "work-sections", attrs: { role: "group", "aria-label": "작업 화면" } },
      sections.map(([id, label]) =>
        h("button", {
          className: "pill-tab",
          text: label,
          attrs: { type: "button", "aria-pressed": section === id ? "true" : "false" },
          on: { click: () => controller.setWorkSection(id) },
        }),
      ),
    ),
    card(
      null,
      [
        ...(section === "status"
          ? [
              modeToggle(state, facilityId, facility, controller),
              facilityCard(content, world, facilityId, facility, controller),
              currentWork(state, content, world, facility),
              h("p", { className: "hint center" }, [
                ICONS.info("icon"),
                facility.waiting ? waitingText(content, facility.waiting) : "재료가 부족하면 기다렸다 다시 시작해요.",
              ]),
            ]
          : []),
        ...(section === "recipe" && auto
          ? [
              recipeCard(content, selected, facility.level, crew),
              selected ? targetRow(content, world, facilityId, selected, controller) : null,
              materialsBlock(content, world, selected),
            ]
          : section === "recipe"
            ? [queuePanel(state, content, world, facilityId, controller)]
            : []),
        section === "priority" && auto
          ? priorityList(content, facilityId, rules, selected?.policyId, controller)
          : null,
        section === "status" && auto && facility.queue.length
          ? h("p", {
              className: "hint center",
              text: `지정 횟수 대기열 ${facility.queue.length}개는 멈춘 채 그대로 남아 있어요.`,
            })
          : null,
        auto && dirty
          ? h("p", { className: "draft-note" }, [
              section === "priority"
                ? "바꾼 규칙은 아직 적용 전이에요. "
                : "바꾼 규칙은 아직 적용 전이에요. ‘순서·적용’에서 적용해 주세요. ",
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
    auto && section === "priority"
      ? h("div", { className: "rule-actions" }, [
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
        ])
      : null,
  ];
}

export function renderWorkScreen(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  const sheet =
    world && state.content && state.sheet?.kind === "assign"
      ? renderAssignSheet(state, world, state.content, controller, state.sheet.facilityId)
      : null;
  return renderFrame(state, controller, {
    top: { kind: "sub", title: "공방 작업", back: { route: "home", label: "홈" }, resources: true },
    backdrop: "forest",
    body: world && state.content ? body(state, state.content, world, controller) : [statusLine("세계를 불러오는 중…")],
    nav: true,
    sheet,
  });
}
