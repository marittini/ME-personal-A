// 주민 (board 03-1): sign + ribbon, 이름으로 찾기 with the filter button, 전체 · 캐릭터 · 페르소나 tabs, the card grid
// (picture, name, kind tag, field tag, 영입 완료), the selected resident's detail (picture, name, tags, 패시브 · 돌파,
// 주민 그림 · 프로필 · 관계) and 주민 불러오기.
// Real now: search, filter, tabs, cards, selection, 주민 그림, 프로필, 관계, 주민 불러오기. Fields, passives and 돌파
// arrive with production (P3) and stay in place, locked; a resident waiting for an invitation says so (초대, P3).
import type { AppState, Controller } from "../../app/controller";
import { h, statusLine } from "../../app/dom";
import { visibleResidents, type ResidentsView } from "../../app/resident-actions";
import type { Resident, WorldView } from "../../app/types";
import { card, renderFrame } from "../chrome/frame";
import { ICONS, type IconFactory } from "../chrome/icons";
import { featureButton, lockedBlock } from "../chrome/locked";
import { searchField } from "../chrome/search-field";
import { kindTag, residentFigure } from "./resident-figure";
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

function fieldTag(controller: Controller) {
  return featureButton(controller, "specialty", {
    className: "tag field",
    label: "전문 분야",
    children: [ICONS.leaf("icon tiny"), h("span", { text: "분야" })],
  });
}

function residentCard(resident: Resident, selected: boolean, controller: Controller) {
  return h("li", { className: `resident-card${selected ? " selected" : ""}` }, [
    h(
      "button",
      {
        className: "resident-card-main",
        attrs: {
          type: "button",
          "aria-pressed": selected ? "true" : "false",
          "aria-label": `${resident.displayName} 보기`,
        },
        on: { click: () => controller.selectResident(resident.residentId) },
      },
      [
        h("span", { className: "card-stage" }, [residentFigure(resident)]),
        h("strong", { className: "resident-name", text: resident.displayName }),
      ],
    ),
    h("span", { className: "tag-row" }, [kindTag(resident), fieldTag(controller)]),
    resident.recruited
      ? h("span", { className: "status-pill done", text: "영입 완료" })
      : featureButton(controller, "invite", {
          className: "status-pill waiting",
          label: "초대하기",
          children: [h("span", { text: "초대 대기" })],
        }),
  ]);
}

function actionButton(icon: IconFactory, label: string, onClick: () => void) {
  return h("button", { className: "detail-action", attrs: { type: "button" }, on: { click: onClick } }, [
    icon("icon"),
    h("span", { text: label }),
  ]);
}

function detail(resident: Resident, controller: Controller) {
  return card(
    null,
    [
      h("div", { className: "resident-detail" }, [
        h("span", { className: "detail-stage" }, [residentFigure(resident)]),
        h("div", { className: "detail-info" }, [
          h("strong", { className: "detail-name", text: resident.displayName }),
          h("span", { className: "tag-row" }, [kindTag(resident), fieldTag(controller)]),
          lockedBlock(
            controller,
            "breakthrough",
            [
              h("p", { className: "passive" }, [ICONS.leaf("icon tiny"), h("strong", { text: "패시브" }), " –"]),
              h("p", { className: "muted", text: "기본 효과 – → 현재 –" }),
              h("p", { className: "breakthrough" }, [
                h("span", { text: "돌파 –/–" }),
                h(
                  "span",
                  { className: "leaf-pips" },
                  [1, 2, 3, 4, 5].map(() => h("span", { className: "pip" })),
                ),
              ]),
            ],
            "detail-locked",
          ),
        ]),
      ]),
      h("div", { className: "detail-actions" }, [
        actionButton(ICONS.image, "주민 그림", () => controller.openResidentImage(resident.residentId)),
        actionButton(ICONS.document, "프로필", () =>
          controller.openSheet({ kind: "profile", residentId: resident.residentId }),
        ),
        actionButton(ICONS.heart, "관계", () => controller.openRelations(resident.residentId)),
      ]),
    ],
    { className: "detail-card" },
  );
}

function body(world: WorldView, state: AppState, controller: Controller) {
  const view = state.residentsView;
  const all = Object.values(world.state.residents);
  const shown = visibleResidents(world.state, view);
  const selected = world.state.residents[view.selectedId ?? ""] ?? shown[0] ?? null;
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
            shown.map((resident) => residentCard(resident, resident.residentId === selected?.residentId, controller)),
          );
  return [
    searchBar(view, controller),
    h("section", { className: "card resident-board", attrs: { "aria-label": "주민 목록" } }, [
      tabs(view, controller),
      grid,
    ]),
    selected ? detail(selected, controller) : null,
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
      : null;
  return renderFrame(state, controller, {
    top: { kind: "sub", title: "주민", subtitle: "숲을 함께하는 소중한 이웃들", resources: false },
    backdrop: "forest",
    body: world ? body(world, state, controller) : [statusLine("세계를 불러오는 중…")],
    nav: true,
    sheet,
  });
}
