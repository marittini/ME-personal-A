// 시설과 창고 (board 01-3): 시설 · 창고 tabs. [시설] the facility card with level, effects and the gold upgrade, then
// 재고 보호 with its table (아이템 · 보유 수량 · 보호 재고 · 예약 재고 · 사용 가능) and 자동 판매. [창고] the full storeroom.
// Real now: the holdings in both tables. Protection and reservation are 0 until P3, shown as "–" like the mockup,
// so 사용 가능 equals 보유 수량. Facility upgrades, protection editing and auto-selling are locked until P3.
import type { AppState, Controller } from "../../app/controller";
import { h } from "../../app/dom";
import type { GameContent, WorldView } from "../../app/types";
import { card, renderFrame } from "../chrome/frame";
import { ICONS } from "../chrome/icons";
import { featureButton, lockedBlock } from "../chrome/locked";

function holdings(view: WorldView, content: GameContent | null) {
  const order = new Map(content?.items.map((item, index) => [item.id, index]));
  return Object.entries(view.state.inventory)
    .filter(([, amount]) => amount > 0)
    .sort(([a], [b]) => (order.get(a) ?? 999) - (order.get(b) ?? 999))
    .map(([itemId, amount]) => ({
      itemId,
      amount,
      name: content?.items.find((item) => item.id === itemId)?.name ?? itemId,
    }));
}

function tabs(state: AppState, controller: Controller) {
  const tab = (id: AppState["facilitiesTab"], label: string, icon: ReturnType<typeof ICONS.house>) =>
    h(
      "button",
      {
        className: `big-tab${state.facilitiesTab === id ? " current" : ""}`,
        attrs: { type: "button", role: "tab", "aria-selected": state.facilitiesTab === id ? "true" : "false" },
        on: { click: () => controller.setFacilitiesTab(id) },
      },
      [icon, h("span", { text: label })],
    );
  return h("div", { className: "big-tabs", attrs: { role: "tablist", "aria-label": "시설과 창고" } }, [
    tab("facilities", "시설", ICONS.house("icon big")),
    tab("storage", "창고", ICONS.box("icon big")),
  ]);
}

function facilityCard(controller: Controller) {
  return lockedBlock(controller, "facility-upgrade", [
    h("div", { className: "facility" }, [
      h("span", { className: "facility-picture" }, [ICONS.house("icon huge")]),
      h("div", { className: "facility-info" }, [
        h("strong", { className: "facility-name", text: "시설" }),
        h("span", { className: "facility-level" }, ["Lv. –", h("span", { className: "level-next", text: " → Lv. –" })]),
        h("div", { className: "effect-row" }, [h("span", { text: "효과" }), h("span", { text: "–" })]),
        h("div", { className: "effect-row" }, [h("span", { text: "대기열" }), h("span", { text: "–" })]),
        h("p", { className: "muted", text: "분야별 시설을 강화하면 효과가 올라가요." }),
        h("span", { className: "gold-button" }, [h("span", { className: "coin" }), "– G · 강화"]),
      ]),
    ]),
  ]);
}

function protectionTable(view: WorldView, content: GameContent | null) {
  const rows = holdings(view, content);
  if (rows.length === 0) return h("p", { className: "empty", text: "창고가 비어 있어요." });
  return h("table", { className: "stock" }, [
    h("thead", {}, [
      h(
        "tr",
        {},
        ["아이템", "보유 수량", "보호 재고", "예약 재고", "사용 가능"].map((label) =>
          h("th", { text: label, attrs: { scope: "col" } }),
        ),
      ),
    ]),
    h(
      "tbody",
      {},
      rows.map((row) =>
        h("tr", {}, [
          h("th", { attrs: { scope: "row" } }, [h("span", { className: "item-dot" }), row.name]),
          h("td", { className: "num", text: row.amount.toLocaleString("ko-KR") }),
          // Colored like the board once P3 fills them; an empty "–" stays neutral, as on the board.
          h("td", { className: "num", text: "–" }),
          h("td", { className: "num", text: "–" }),
          h("td", { className: "num available", text: row.amount.toLocaleString("ko-KR") }),
        ]),
      ),
    ),
  ]);
}

function protectionCard(view: WorldView, content: GameContent | null, controller: Controller) {
  return card(
    null,
    [
      h("div", { className: "card-head" }, [
        h("div", {}, [
          h("h2", { className: "section-title", text: "재고 보호", attrs: { id: "fw-protect" } }),
          h("p", { className: "muted", text: "지정한 수량은 제작에 사용하지 않아요." }),
        ]),
        featureButton(controller, "stock-protection", {
          className: "outline-button",
          label: "편집하기",
          children: [ICONS.pencil("icon"), h("span", { text: "편집하기" })],
        }),
      ]),
      protectionTable(view, content),
      featureButton(controller, "auto-sell", {
        className: "toggle-row",
        label: "자동 판매",
        children: [
          h("span", { className: "toggle-icon" }, [ICONS.gear("icon")]),
          h("span", { className: "toggle-text" }, [
            h("strong", { text: "자동 판매" }),
            h("span", { text: "보호 · 예약 재고는 사용하지 않아요." }),
          ]),
          h("span", { className: "switch off" }, [
            h("span", { className: "knob" }),
            h("span", { className: "switch-label", text: "꺼짐" }),
          ]),
        ],
      }),
    ],
    { id: "fw-protect" },
  );
}

function storageCard(view: WorldView, content: GameContent | null) {
  const rows = holdings(view, content);
  return card(
    "창고",
    [
      rows.length === 0
        ? h("p", { className: "empty", text: "창고가 비어 있어요." })
        : h(
            "ul",
            { className: "storage-grid" },
            rows.map((row) =>
              h("li", { className: "storage-item" }, [
                h("span", { className: "item-dot big" }),
                h("span", { className: "storage-name", text: row.name }),
                h("strong", { text: row.amount.toLocaleString("ko-KR") }),
              ]),
            ),
          ),
    ],
    { id: "fw-storage" },
  );
}

export function renderFacilitiesScreen(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  const body = world
    ? [
        tabs(state, controller),
        ...(state.facilitiesTab === "facilities"
          ? [
              card(null, [facilityCard(controller)], { className: "facility-card" }),
              protectionCard(world, state.content, controller),
            ]
          : [storageCard(world, state.content)]),
      ]
    : [];
  return renderFrame(state, controller, {
    top: { kind: "sub", title: "시설과 창고", back: { route: "work", label: "공방 작업" }, resources: true },
    backdrop: "forest",
    body,
    nav: true,
  });
}
