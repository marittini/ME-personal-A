import { pagePicker } from "../chrome/page-picker";
// 주민 (board 03-1): sign + ribbon, 이름으로 찾기 with the filter button, 전체 · 캐릭터 · 페르소나 tabs, the card grid
// (picture, name, kind tag, field tag, 영입 완료), the selected resident's detail (picture, name, tags, 패시브 · 돌파,
// 주민 그림 · 프로필 · 관계) and 주민 불러오기.
// The field tag opens 전문 분야 고르기; 패시브 shows the placed passive (기본 → 현재, by 돌파) and the 돌파 leaves; a
// resident waiting for an invitation links to 초대.
import type { AppState, Controller } from "../../app/controller";
import { h, statusLine } from "../../app/dom";
import { visibleResidents, type ResidentsView } from "../../app/resident-actions";
import type { GameContent, Resident, WorldView } from "../../app/types";
import { card, renderFrame } from "../chrome/frame";
import { ICONS, type IconFactory } from "../chrome/icons";
import { FIELD_ICONS, FIELD_LABELS, passiveOf, percent, talentOf } from "../work/production-view";
import { searchField } from "../chrome/search-field";
import { kindTag, residentFigure } from "./resident-figure";
import { renderFieldSheet } from "./field-sheet";
import { renderProfileSheet } from "./profile-sheet";

const TABS: ReadonlyArray<{ id: ResidentsView["tab"]; label: string }> = [
  { id: "all", label: "전체" },
  { id: "character", label: "캐릭터" },
  { id: "persona", label: "페르소나" },
];

const FILTERS: ReadonlyArray<{ id: ResidentsView["filter"]; label: string }> = [
  { id: "all", label: "모두" },
  { id: "recruited", label: "영입한 주민" },
  { id: "waiting", label: "초대 대기" },
];

function searchBar(view: ResidentsView, controller: Controller) {
  const nextFilter = FILTERS[(FILTERS.findIndex((filter) => filter.id === view.filter) + 1) % FILTERS.length]!;
  const current = FILTERS.find((filter) => filter.id === view.filter)!;
  return h("div", { className: "search-bar" }, [
    searchField({
      id: "fw-resident-search",
      value: view.query,
      placeholder: "이름으로 찾기",
      onSearch: (query) => controller.setResidentsQuery(query),
    }),
    h(
      "button",
      {
        className: `icon-button filter${view.filter === "all" ? "" : " active"}`,
        attrs: { type: "button", "aria-label": `보기: ${current.label} (누르면 ${nextFilter.label})` },
        on: { click: () => controller.setResidentsFilter(nextFilter.id) },
      },
      [ICONS.filter()],
    ),
    view.filter === "all" ? null : h("span", { className: "filter-chip", text: current.label }),
  ]);
}

function tabs(view: ResidentsView, controller: Controller) {
  return h(
    "div",
    { className: "pill-tabs", attrs: { role: "tablist", "aria-label": "주민 종류" } },
    TABS.map((tab) =>
      h("button", {
        className: `pill-tab${view.tab === tab.id ? " current" : ""}`,
        text: tab.label,
        attrs: { type: "button", role: "tab", "aria-selected": view.tab === tab.id ? "true" : "false" },
        on: { click: () => controller.setResidentsTab(tab.id) },
      }),
    ),
  );
}

function fieldTag(resident: Resident, controller: Controller) {
  const label = FIELD_LABELS[resident.field];
  return h(
    "button",
    {
      className: "tag field",
      attrs: { type: "button", "aria-label": `${resident.displayName} 전문 분야 ${label} — 특기 보기` },
      on: { click: () => controller.openSheet({ kind: "field", residentId: resident.residentId }) },
    },
    [FIELD_ICONS[resident.field]("icon tiny"), h("span", { text: label })],
  );
}

function residentCard(resident: Resident, controller: Controller, selected: boolean) {
  return h("li", { className: `resident-card${selected ? " selected" : ""}` }, [
    h(
      "button",
      {
        className: "resident-card-main",
        attrs: {
          type: "button",
          "aria-label": `${resident.displayName} 자세히 보기`,
          "aria-pressed": String(selected),
        },
        on: { click: () => controller.selectResident(resident.residentId) },
      },
      [
        h("span", { className: "card-stage" }, [residentFigure(resident)]),
        h("strong", { className: "resident-name", text: resident.displayName }),
        h("span", { className: "tag-row" }, [
          h("span", {
            className: "resident-field-label",
            text: `${resident.kind === "character" ? "캐릭터" : "페르소나"} · ${FIELD_LABELS[resident.field]}`,
          }),
        ]),
        h("span", {
          className: `status-pill ${resident.recruited ? "done" : "waiting"}`,
          text: resident.recruited ? "영입 완료" : "초대 대기",
        }),
      ],
    ),
  ]);
}

function actionButton(icon: IconFactory, label: string, onClick: () => void) {
  return h("button", { className: "detail-action", attrs: { type: "button" }, on: { click: onClick } }, [
    icon("icon"),
    h("span", { text: label }),
  ]);
}

/** Where the resident works now, and the passive it gives there. */
function passiveBlock(resident: Resident, world: WorldView, content: GameContent | null) {
  const max = content?.crew.maxBreakthrough ?? 5;
  const base = content ? passiveOf(content, 0) : 0;
  const now = content ? passiveOf(content, resident.breakthrough) : 0;
  const talent = talentOf(content, resident.talentId);
  const placedAt = Object.entries(world.state.production.facilities).find(
    ([, facility]) => facility.residentId === resident.residentId,
  )?.[0];
  const facility = content?.facilities.find((candidate) => candidate.id === placedAt);
  const where = !resident.recruited
    ? "초대하면 시설에 배치할 수 있어요."
    : !facility
      ? "아직 배치하지 않았어요. 공방 작업 → 배치 변경."
      : facility.field === resident.field
        ? `${facility.name}에서 처리 속도 +${percent(now)}`
        : `${facility.name}에 있지만 분야가 달라 효과가 없어요.`;
  return h("div", { className: "passive-block" }, [
    h("p", { className: "passive" }, [
      ICONS.leaf("icon tiny"),
      h("strong", { text: "패시브" }),
      ` ${FIELD_LABELS[resident.field]} 시설 처리 속도`,
    ]),
    talent
      ? h("p", { className: "talent-line" }, [
          ICONS.sparkle("icon tiny"),
          h("strong", { text: `특기 ${talent.name}` }),
          ` ${talent.description}`,
        ])
      : null,
    h("p", { className: "muted", text: `기본 효과 ${percent(base)} → 현재 ${percent(now)} · ${where}` }),
    h("p", { className: "breakthrough" }, [
      h("span", { text: `돌파 ${resident.breakthrough}/${max}` }),
      h(
        "span",
        { className: "leaf-pips", attrs: { "aria-hidden": "true" } },
        Array.from({ length: max }, (_, index) =>
          h("span", { className: `pip${index < resident.breakthrough ? " on" : ""}` }),
        ),
      ),
    ]),
  ]);
}

function detail(resident: Resident, world: WorldView, content: GameContent | null, controller: Controller) {
  return card(
    null,
    [
      h("div", { className: "resident-detail" }, [
        h("span", { className: "detail-stage" }, [residentFigure(resident)]),
        h("div", { className: "detail-info" }, [
          h("strong", { className: "detail-name", text: resident.displayName }),
          h("span", { className: "tag-row" }, [kindTag(resident), fieldTag(resident, controller)]),
          passiveBlock(resident, world, content),
        ]),
      ]),
      h("div", { className: "detail-actions" }, [
        actionButton(ICONS.image, "주민 그림", () => controller.openResidentImage(resident.residentId)),
        actionButton(ICONS.document, "프로필", () =>
          controller.openSheet({ kind: "profile", residentId: resident.residentId }),
        ),
        actionButton(ICONS.heart, "관계", () => controller.openRelations(resident.residentId)),
      ]),
      resident.recruited
        ? null
        : h("button", {
            className: "button",
            text: "초대하러 가기",
            attrs: { type: "button" },
            on: { click: () => controller.navigate("invite") },
          }),
    ],
    { className: "detail-card" },
  );
}

function body(world: WorldView, state: AppState, controller: Controller) {
  const view = state.residentsView;
  const all = Object.values(world.state.residents);
  const shown = visibleResidents(world.state, view);
  const pageSize = 2;
  const pageCount = Math.max(1, Math.ceil(shown.length / pageSize));
  const page = Math.min(view.page ?? 0, pageCount - 1);
  const visible = shown.slice(page * pageSize, (page + 1) * pageSize);
  const selected = visible.find((resident) => resident.residentId === view.selectedId) ?? visible[0] ?? null;
  const grid =
    all.length === 0
      ? h("div", { className: "empty-state" }, [
          h("p", { text: "아직 주민이 없어요." }),
          h("p", { className: "muted", text: "캐릭터나 페르소나를 불러와 이 세계의 주민으로 맞이해 보세요." }),
        ])
      : shown.length === 0
        ? h("p", { className: "empty", text: "조건에 맞는 주민이 없어요." })
        : h(
            "ul",
            { className: "resident-grid" },
            visible.map((resident) => residentCard(resident, controller, resident.residentId === selected?.residentId)),
          );
  return [
    searchBar(view, controller),
    h("section", { className: "card resident-board", attrs: { "aria-label": "주민 목록" } }, [
      tabs(view, controller),
      grid,
      pagePicker(
        "주민 목록 고르기",
        page,
        Array.from(
          { length: pageCount },
          (_, index) =>
            `${index + 1} · ${shown
              .slice(index * pageSize, (index + 1) * pageSize)
              .map((resident) => resident.displayName)
              .join(" · ")}`,
        ),
        (value) => controller.setResidentsPage(value),
      ),
    ]),
    selected ? detail(selected, world, state.content, controller) : null,
    h(
      "button",
      {
        className: "button big-action",
        attrs: { type: "button", "data-wide": "" },
        on: { click: () => controller.openRegister(1) },
      },
      [ICONS.people("icon"), h("span", { text: "주민 불러오기" })],
    ),
  ];
}

export function renderResidentsScreen(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  const sheet =
    state.sheet?.kind === "profile" && world
      ? renderProfileSheet(world, state, controller, state.sheet.residentId)
      : state.sheet?.kind === "field" && world
        ? renderFieldSheet(state, world, controller, state.sheet.residentId)
        : null;
  return renderFrame(state, controller, {
    top: { kind: "sub", title: "주민", resources: false },
    backdrop: "forest",
    body: world ? body(world, state, controller) : [statusLine("세계를 불러오는 중…")],
    nav: true,
    sheet,
  });
}
