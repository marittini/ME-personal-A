// 초대권 받기 (the ticket counter's sheet): today's 납품 의뢰 (UTC day). Each request shows what it takes, what is
// usable (protected stock is never delivered) and its reward; 납품하기 is the player's confirmed action.
import type { AppState, Controller } from "../../app/controller";
import { button, errorLine, h, statusLine } from "../../app/dom";
import type { DeliveryOrder, WorldView } from "../../app/types";
import { ICONS } from "../chrome/icons";
import { sheetDialog } from "../chrome/sheet";
import { itemName, itemTile } from "../work/production-view";

function orderCard(state: AppState, world: WorldView, order: DeliveryOrder, done: boolean, controller: Controller) {
  const content = state.content;
  const usable = (itemId: string) =>
    Math.max(0, (world.state.inventory[itemId] ?? 0) - (world.state.production.protectedStock[itemId] ?? 0));
  const ready = Object.entries(order.items).every(([itemId, amount]) => usable(itemId) >= amount);
  const busy = Boolean(state.busy[`deliver:${order.id}`]);
  return h("div", { className: `order${done ? " done" : ""}` }, [
    h("strong", { className: "order-title", text: order.title }),
    h(
      "ul",
      { className: "order-items" },
      Object.entries(order.items).map(([itemId, amount]) => {
        const held = world.state.inventory[itemId] ?? 0;
        const protectedAmount = world.state.production.protectedStock[itemId] ?? 0;
        return h("li", { className: usable(itemId) >= amount ? "enough" : "short" }, [
          itemTile(itemId),
          h("span", { text: `${itemName(content, itemId)} ${usable(itemId)}/${amount}` }),
          protectedAmount ? h("small", { className: "muted", text: `보유 ${held} · 보호 ${protectedAmount}` }) : null,
        ]);
      }),
    ),
    h("p", { className: "order-reward" }, [
      ICONS.ticket("icon tiny"),
      ` 초대권 ${order.reward.tickets}장 · ${order.reward.gold} G`,
    ]),
    done
      ? h("span", { className: "status-pill done", text: "납품 완료" })
      : button(
          busy ? "납품하는 중…" : ready ? "납품하기" : "재료가 부족해요",
          () => void controller.deliver(order.id),
          { disabled: busy || !ready, variant: ready ? undefined : "secondary" },
        ),
  ]);
}

function orderPicker(
  state: AppState,
  world: WorldView,
  orders: DeliveryOrder[],
  done: string[],
  controller: Controller,
) {
  const selectedId = state.sheet?.kind === "deliveries" ? state.sheet.selectedOrderId : undefined;
  const selected =
    orders.find((order) => order.id === selectedId) ?? orders.find((order) => !done.includes(order.id)) ?? orders[0];
  if (!selected) return h("p", { className: "empty", text: "오늘의 의뢰가 없어요." });
  return h("div", { className: "delivery-board" }, [
    h(
      "div",
      { className: "delivery-choices", attrs: { role: "group", "aria-label": "납품 의뢰 선택" } },
      orders.map((order) => {
        const first = Object.keys(order.items)[0] ?? "";
        return h(
          "button",
          {
            className: `delivery-choice${order.id === selected.id ? " selected" : ""}`,
            attrs: {
              type: "button",
              "aria-pressed": order.id === selected.id ? "true" : "false",
              "aria-label": `${order.title}${done.includes(order.id) ? " 납품 완료" : ""}`,
            },
            on: { click: () => controller.selectDelivery(order.id) },
          },
          [
            itemTile(first),
            h("span", { text: order.title }),
            h("small", {
              text: done.includes(order.id) ? "완료" : `초대권 ${order.reward.tickets} · ${order.reward.gold} G`,
            }),
          ],
        );
      }),
    ),
    orderCard(state, world, selected, done.includes(selected.id), controller),
  ]);
}

export function renderDeliveriesSheet(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  const list = state.deliveries;
  const body =
    !world || !list || list.state === "loading"
      ? [statusLine("오늘의 납품 의뢰를 불러오는 중…")]
      : list.state === "error"
        ? [errorLine(list.message)]
        : [
            h("p", {
              className: "muted",
              text: "의뢰는 하루(UTC 기준)마다 바뀌어요. 지난 날의 의뢰는 모아 두지 않아요. 보호한 재고는 납품하지 않아요.",
            }),
            orderPicker(state, world, list.value.orders, list.value.done, controller),
          ];
  return sheetDialog("fw-deliveries", "초대권 받기 · 오늘의 납품", [
    ...body,
    button("닫기", () => controller.closeSheet(), { variant: "secondary", attrs: { "data-wide": "" } }),
  ]);
}
