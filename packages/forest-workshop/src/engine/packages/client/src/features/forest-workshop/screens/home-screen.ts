// Home (P1): the workshop's storeroom and the welcome package. Residents, work reports and stories join this screen
// in later phases; nothing here is a placeholder for them.
import type { AppState, Controller } from "../app/controller";
import { button, errorLine, h, statusLine } from "../app/dom";
import type { GameContent, WorldView } from "../app/types";
import { renderLayout } from "./layout";

function itemName(content: GameContent | null, itemId: string) {
  return content?.items.find((item) => item.id === itemId)?.name ?? itemId;
}

function starterKitCard(view: WorldView, content: GameContent | null, state: AppState, controller: Controller) {
  if (view.state.progress.starterKitClaimed || !content) return null;
  const busy = Boolean(state.busy["claim-starter-kit"]);
  const kit = content.starterKit;
  return h("section", { className: "card highlight", attrs: { "aria-labelledby": "fw-starter" } }, [
    h("h2", { className: "section-title", text: "공방 시작 꾸러미", attrs: { id: "fw-starter" } }),
    h("p", { className: "muted", text: "첫 채집과 가공을 시작할 재료입니다. 한 번만 받을 수 있어요." }),
    h("ul", { className: "chips" }, [
      h("li", { className: "chip", text: `골드 ${kit.gold.toLocaleString("ko-KR")}` }),
      ...Object.entries(kit.items).map(([itemId, amount]) =>
        h("li", { className: "chip", text: `${itemName(content, itemId)} ${amount}` }),
      ),
    ]),
    button(
      busy ? "받는 중…" : "받기",
      () => void controller.runCommand("claim-starter-kit", "onboarding.claimStarterKit"),
      {
        disabled: busy,
        attrs: { "data-wide": "" },
      },
    ),
  ]);
}

function storeroom(view: WorldView, content: GameContent | null) {
  const entries = Object.entries(view.state.inventory).filter(([, amount]) => amount > 0);
  const order = new Map(content?.items.map((item, index) => [item.id, index]));
  entries.sort(([a], [b]) => (order.get(a) ?? 999) - (order.get(b) ?? 999));
  // Mockup 01 · 창고: item and 보유 수량. The 보호 · 예약 · 사용 가능 columns arrive with production rules (P3).
  return h("section", { className: "card", attrs: { "aria-labelledby": "fw-storeroom" } }, [
    h("h2", { className: "section-title", text: "창고", attrs: { id: "fw-storeroom" } }),
    entries.length === 0
      ? h("p", { className: "empty", text: "창고가 비어 있습니다." })
      : h("table", { className: "stock" }, [
          h("thead", {}, [
            h("tr", {}, [
              h("th", { text: "아이템", attrs: { scope: "col" } }),
              h("th", { text: "보유 수량", attrs: { scope: "col" } }),
            ]),
          ]),
          h(
            "tbody",
            {},
            entries.map(([itemId, amount]) =>
              h("tr", {}, [
                h("th", { text: itemName(content, itemId), attrs: { scope: "row" } }),
                h("td", { className: "amount", text: amount.toLocaleString("ko-KR") }),
              ]),
            ),
          ),
        ]),
  ]);
}

export function renderHomeScreen(state: AppState, controller: Controller) {
  const world = state.world;
  if (!world || world.state !== "ready") {
    return renderLayout(state, controller, {
      title: "숲결 공방",
      showWorldBar: false,
      body: [
        world?.state === "error"
          ? h("section", { className: "card" }, [
              errorLine(world.message),
              button("세계 목록으로", () => controller.navigate("worlds"), { variant: "secondary" }),
            ])
          : statusLine("세계를 불러오는 중…"),
      ],
    });
  }
  const view = world.value;
  return renderLayout(state, controller, {
    title: "숲결 공방",
    subtitle: `${view.state.settings.worldName} · ${view.state.settings.playerNickname}님의 공방`,
    showWorldBar: true,
    body: [starterKitCard(view, state.content, state, controller), storeroom(view, state.content)],
  });
}
