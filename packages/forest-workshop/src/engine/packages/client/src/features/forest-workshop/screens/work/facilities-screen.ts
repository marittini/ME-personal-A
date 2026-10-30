// 시설과 창고 (board 01-3): 시설 · 창고 tabs. [시설] the facility card (picture, name, Lv → Lv, 처리 속도 now → next,
// 작업 방식, description, gold 강화), then 재고 보호 with 편집하기 and its table (아이템 · 보유 수량 · 보호 재고 ·
// 예약 재고 · 사용 가능) and 자동 판매. [창고] the whole storeroom, each item with 팔기.
// 예약 재고 arrives with expeditions (P4) and shows "–". 자동 판매 opens its sheet (auto-sell-sheet.ts); the switch
// shows 켜짐 while any item sells automatically.
import type { AppState, Controller } from "../../app/controller";
import { button, h, statusLine } from "../../app/dom";
import type { GameContent, WorldView } from "../../app/types";
import { card, renderFrame } from "../chrome/frame";
import { ICONS } from "../chrome/icons";
import { pagePicker } from "../chrome/page-picker";
import { amountPicker, sheetDialog } from "../chrome/sheet";
import { renderAutoSellSheet } from "./auto-sell-sheet";
import { crewBonus, facilityOf, facilityPicture, itemName, itemTile, percent, speedPercent } from "./production-view";

function holdings(view: WorldView, content: GameContent | null) {
  const order = new Map(content?.items.map((item, index) => [item.id, index]));
  return Object.entries(view.state.inventory)
    .filter(([, amount]) => amount > 0)
    .sort(([a], [b]) => (order.get(a) ?? 999) - (order.get(b) ?? 999))
    .map(([itemId, amount]) => ({ itemId, amount, name: itemName(content, itemId) }));
}

function tabs(state: AppState, controller: Controller) {
  const tab = (id: AppState["facilitiesTab"], label: string, icon: SVGSVGElement) =>
    h(
      "button",
      {
        className: `big-tab${(state.facilitiesTab === "protection" ? "facilities" : state.facilitiesTab) === id ? " current" : ""}`,
        attrs: {
          type: "button",
          role: "tab",
          "aria-selected":
            (state.facilitiesTab === "protection" ? "facilities" : state.facilitiesTab) === id ? "true" : "false",
        },
        on: { click: () => controller.setFacilitiesTab(id) },
      },
      [icon, h("span", { text: label })],
    );
  return h("div", { className: "big-tabs", attrs: { role: "tablist", "aria-label": "시설과 창고" } }, [
    tab("facilities", "시설", ICONS.house("icon big")),
    tab("storage", "창고", ICONS.box("icon big")),
  ]);
}

function facilityCard(state: AppState, content: GameContent, world: WorldView, controller: Controller) {
  const facilityId = state.work.facilityId;
  const facility = world.state.production.facilities[facilityId]!;
  const definition = facilityOf(content, facilityId);
  const max = content.production.maxLevel;
  const atMax = facility.level >= max;
  const cost = atMax ? null : content.production.upgradeCosts[facility.level - 1]!;
  const busy = Boolean(state.busy[`upgrade:${facilityId}:${facility.level}`]);
  const short = cost !== null && world.state.wallet.gold < cost;
  const closed = !facility.unlocked;
  const bonus = crewBonus(content, world.state, facilityId);
  return card(
    null,
    [
      h(
        "div",
        { className: "chip-row", attrs: { role: "group", "aria-label": "시설 고르기" } },
        content.facilities.map((candidate) =>
          h(
            "button",
            {
              className: `pill-tab${candidate.id === facilityId ? " current" : ""}`,
              attrs: {
                type: "button",
                "aria-pressed": candidate.id === facilityId ? "true" : "false",
                "aria-label": world.state.production.facilities[candidate.id]?.unlocked
                  ? candidate.name
                  : `${candidate.name} (해금 전)`,
              },
              on: { click: () => controller.selectFacility(candidate.id) },
            },
            [
              h("span", { text: candidate.name }),
              world.state.production.facilities[candidate.id]?.unlocked ? null : ICONS.lock("icon tiny"),
            ],
          ),
        ),
      ),
      h("div", { className: "facility" }, [
        h("span", { className: `facility-picture${closed ? " closed" : ""}` }, [facilityPicture(facilityId, "huge")]),
        h("div", { className: "facility-info" }, [
          h("strong", { className: "facility-name", text: definition?.name ?? facilityId }),
          h("span", { className: "facility-level" }, [
            `Lv. ${facility.level}`,
            atMax ? null : h("span", { className: "level-next", text: ` → Lv. ${facility.level + 1}` }),
          ]),
          h("div", { className: "effect-row" }, [
            h("span", { text: "처리 속도" }),
            h("span", {}, [
              `+${speedPercent(content, facility.level)}%`,
              atMax
                ? null
                : h("span", { className: "level-next", text: ` → +${speedPercent(content, facility.level + 1)}%` }),
            ]),
          ]),
          h("div", { className: "effect-row" }, [
            h("span", { text: "작업 방식" }),
            h("span", { text: closed ? "해금 전" : facility.mode === "auto" ? "자동 운영" : "지정 횟수" }),
          ]),
          h("div", { className: "effect-row" }, [
            h("span", { text: "주민 효과" }),
            h("span", { text: `+${percent(bonus.total)}${bonus.resident ? ` (${bonus.resident.displayName})` : ""}` }),
          ]),
          h("p", { className: "muted", text: definition?.description ?? "" }),
          closed
            ? h("p", { className: "hint", text: "공방 작업에서 해금 조건을 채우고 시설을 열면 강화할 수 있어요." })
            : null,
          h(
            "button",
            {
              className: "gold-button",
              attrs: { type: "button" },
              disabled: closed || atMax || busy || short,
              on: { click: () => void controller.upgradeFacility(facilityId, facility.level) },
            },
            atMax
              ? [h("span", { text: "최고 단계" })]
              : [
                  h("span", { className: "coin" }),
                  h("span", { text: busy ? "강화하는 중…" : `${cost!.toLocaleString("ko-KR")} G · 강화` }),
                ],
          ),
          short
            ? h("p", {
                className: "hint",
                text: `골드가 ${(cost! - world.state.wallet.gold).toLocaleString("ko-KR")} G 부족해요.`,
              })
            : null,
        ]),
      ]),
    ],
    { className: "facility-card" },
  );
}

function autoSellRow(world: WorldView, controller: Controller) {
  const on = Object.values(world.state.production.autoSell).filter((setting) => setting.enabled).length;
  return h(
    "button",
    {
      className: "toggle-row",
      attrs: { type: "button", "aria-label": `자동 판매 ${on ? `켜짐 (${on}개 품목)` : "꺼짐"} — 설정 열기` },
      on: { click: () => controller.openSheet({ kind: "auto-sell" }) },
    },
    [
      h("span", { className: "toggle-icon" }, [ICONS.gear("icon")]),
      h("span", { className: "toggle-text" }, [
        h("strong", { text: on ? `자동 판매 · ${on}개 품목` : "자동 판매" }),
        h("span", { text: "보호 재고와 남길 수량을 지켜요." }),
      ]),
      h("span", { className: `switch ${on ? "on" : "off"}` }, [
        h("span", { className: "knob" }),
        h("span", { className: "switch-label", text: on ? "켜짐" : "꺼짐" }),
      ]),
    ],
  );
}

function inventoryPages(page: number, rows: Array<{ name: string }>, controller: Controller) {
  const groups = Array.from({ length: Math.ceil(rows.length / 3) }, (_, index) => {
    const group = rows.slice(index * 3, index * 3 + 3);
    return `${index + 1} · ${group.map((row) => row.name).join(" · ")}`;
  });
  return pagePicker("재고 목록 고르기", page, groups, (value) => controller.setInventoryPage(value));
}

/** Keep item identity and stock quantities readable at the player's chosen text size. */
function stockCards(
  rows: ReturnType<typeof holdings>,
  page: number,
  world: WorldView,
  controller: Controller,
  selling = false,
) {
  return h(
    "ul",
    { className: "stock-cards" },
    rows.slice(page * 3, page * 3 + 3).map((row) => {
      const protectedAmount = world.state.production.protectedStock[row.itemId] ?? 0;
      return h("li", { className: "stock-card" }, [
        h("div", { className: "stock-card-head" }, [itemTile(row.itemId), h("strong", { text: row.name })]),
        h(
          "dl",
          { className: "stock-values" },
          [
            ["보유", row.amount],
            ["보호", protectedAmount],
            ["사용 가능", Math.max(0, row.amount - protectedAmount)],
          ].map(([label, amount]) =>
            h("div", {}, [h("dt", { text: String(label) }), h("dd", { text: Number(amount).toLocaleString("ko-KR") })]),
          ),
        ),
        selling
          ? button("팔기", () => controller.openSheet({ kind: "sell", itemId: row.itemId }), {
              variant: "secondary",
              attrs: { "aria-label": `${row.name} 팔기` },
            })
          : null,
      ]);
    }),
  );
}

function protectionCard(state: AppState, world: WorldView, content: GameContent, controller: Controller) {
  const rows = holdings(world, content);
  const page = Math.min(state.work.inventoryPage ?? 0, Math.max(0, Math.ceil(rows.length / 3) - 1));
  return card(
    null,
    [
      h("div", { className: "card-head" }, [
        h("div", {}, [
          h("h2", { className: "section-title", text: "재고 보호", attrs: { id: "fw-protect" } }),
          h("p", { className: "muted", text: "지정한 수량은 제작과 판매에 사용하지 않아요." }),
        ]),
        h(
          "button",
          {
            className: "outline-button",
            attrs: { type: "button" },
            on: { click: () => controller.openSheet({ kind: "protect-edit" }) },
          },
          [ICONS.pencil("icon"), h("span", { text: "편집하기" })],
        ),
      ]),
      rows.length === 0
        ? h("p", { className: "empty", text: "창고가 비어 있어요." })
        : stockCards(rows, page, world, controller),
      inventoryPages(page, rows, controller),
      autoSellRow(world, controller),
    ],
    { id: "fw-protect" },
  );
}

function storageCard(state: AppState, world: WorldView, content: GameContent, controller: Controller) {
  const rows = holdings(world, content);
  const page = Math.min(state.work.inventoryPage ?? 0, Math.max(0, Math.ceil(rows.length / 3) - 1));
  return card(
    "창고",
    [
      rows.length === 0
        ? h("p", { className: "empty", text: "창고가 비어 있어요." })
        : stockCards(rows, page, world, controller, true),
      inventoryPages(page, rows, controller),
    ],
    { id: "fw-storage" },
  );
}

function protectSheet(state: AppState, world: WorldView, content: GameContent, controller: Controller) {
  const range = content.production.protectedStock;
  const edit = state.sheet?.kind === "protect-edit" ? state.sheet : null;
  const rows = content.items.map((item) => {
    const picker = amountPicker(
      `fw-protect-${item.id}`,
      edit?.drafts?.[item.id] ?? world.state.production.protectedStock[item.id] ?? 0,
      range.min,
      range.max,
      { onChange: (amount) => controller.rememberProtection({ itemId: item.id, amount }) },
    );
    const busy = Boolean(state.busy[`protect:${item.id}`]);
    return h("li", { className: "protect-row" }, [
      itemTile(item.id),
      h("span", { className: "protect-name" }, [
        h("strong", { text: item.name }),
        h("small", { className: "muted", text: `보유 ${world.state.inventory[item.id] ?? 0}` }),
      ]),
      picker.node,
      button(busy ? "저장 중…" : "저장", () => void controller.setProtected(item.id, picker.read()), {
        disabled: busy,
        attrs: { "aria-label": `${item.name} 보호 수량 저장` },
      }),
    ]);
  });
  let page = Math.max(0, Math.min(rows.length - 1, edit?.page ?? 0));
  const picker = h(
    "select",
    {
      className: "input",
      attrs: { "aria-label": "보호할 아이템" },
      on: { change: () => showPage(Number(picker.value)) },
    },
    content.items.map((item, index) => h("option", { text: item.name, attrs: { value: String(index) } })),
  );
  function showPage(index: number) {
    page = Math.max(0, Math.min(rows.length - 1, index));
    rows.forEach((row, rowIndex) => (row.hidden = rowIndex !== page));
    picker.value = String(page);
    controller.rememberProtection({ page });
  }
  showPage(page);
  return sheetDialog("fw-protect-edit", "재고 보호", [
    picker,
    h("ul", { className: "protect-list" }, rows),
    h("p", { className: "muted", text: "보호한 수량은 자동 제작과 판매에 쓰지 않아요. 0이면 보호하지 않아요." }),
    button("닫기", () => controller.closeSheet(), { variant: "secondary" }),
  ]);
}

function sellSheet(state: AppState, world: WorldView, content: GameContent, controller: Controller, itemId: string) {
  const item = content.items.find((candidate) => candidate.id === itemId);
  const held = world.state.inventory[itemId] ?? 0;
  const usable = Math.max(0, held - (world.state.production.protectedStock[itemId] ?? 0));
  const picker = amountPicker("fw-sell-amount", Math.min(usable, 1), usable ? 1 : 0, usable);
  const busy = Boolean(state.busy[`sell:${itemId}`]);
  return sheetDialog("fw-sell", `${item?.name ?? itemId} 팔기`, [
    h("p", {
      className: "muted",
      text: `1개 ${item?.sellPrice ?? 0} G · 팔 수 있는 양 ${usable}개 (보유 ${held}개, 보호분 제외)`,
    }),
    usable ? picker.node : h("p", { className: "empty", text: "보호분을 빼면 팔 수 있는 양이 없어요." }),
    usable
      ? button(busy ? "파는 중…" : "팔기", () => void controller.sell(itemId, picker.read()), {
          disabled: busy,
          attrs: { "data-wide": "" },
        })
      : null,
    button("닫기", () => controller.closeSheet(), { variant: "secondary", attrs: { "data-wide": "" } }),
  ]);
}

export function renderFacilitiesScreen(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  const content = state.content;
  const ready = world && content;
  const sheet =
    ready && state.sheet?.kind === "protect-edit"
      ? protectSheet(state, world, content, controller)
      : ready && state.sheet?.kind === "sell"
        ? sellSheet(state, world, content, controller, state.sheet.itemId)
        : ready && state.sheet?.kind === "auto-sell"
          ? renderAutoSellSheet(state, world, content, controller)
          : null;
  return renderFrame(state, controller, {
    top: { kind: "sub", title: "시설과 창고", back: { route: "work", label: "공방 작업" }, resources: true },
    backdrop: "forest",
    body: ready
      ? [
          tabs(state, controller),
          ...(state.facilitiesTab !== "storage"
            ? [
                world.state.production.facilities[state.work.facilityId] && content.facilities
                  ? facilityCard(state, content, world, controller)
                  : null,
                protectionCard(state, world, content, controller),
              ]
            : [storageCard(state, world, content, controller)]),
        ]
      : [statusLine("세계를 불러오는 중…")],
    nav: true,
    sheet,
  });
}
