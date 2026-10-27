// 자동 판매 (board 01-3): off by default, per item. The player sets 판매 후 남길 수량 and 하루 최대 판매량; the server
// sells after runs complete and never below max(남길 수량, the highest active production target, protected stock),
// within the UTC day's limit (plan §7.2-C). Each row shows that floor and what was sold today.
import type { AppState, Controller } from "../../app/controller";
import { button, h } from "../../app/dom";
import type { GameContent, WorldView } from "../../app/types";
import { amountPicker, sheetDialog } from "../chrome/sheet";
import { itemTile } from "./production-view";

/** The floor the server uses (domain/production/simulation.ts autoSellFloor). */
function floorOf(world: WorldView, content: GameContent, itemId: string, keep: number) {
  let target = 0;
  for (const facility of Object.values(world.state.production.facilities)) {
    if (!facility.unlocked || facility.mode !== "auto") continue;
    for (const rule of facility.rules) {
      const recipe = content.recipes.find((candidate) => candidate.id === rule.recipeId);
      if (rule.enabled && recipe && Object.keys(recipe.outputs)[0] === itemId)
        target = Math.max(target, rule.targetStock);
    }
  }
  return { floor: Math.max(keep, target, world.state.production.protectedStock[itemId] ?? 0), target };
}

export function renderAutoSellSheet(state: AppState, world: WorldView, content: GameContent, controller: Controller) {
  const today = new Date().toISOString().slice(0, 10);
  const sales = world.state.production.sales;
  // Items in the storeroom or already selling; the rest have nothing to sell yet.
  const items = content.items.filter(
    (item) => (world.state.inventory[item.id] ?? 0) > 0 || world.state.production.autoSell[item.id]?.enabled,
  );
  const rows = items.map((item) => {
    const setting = world.state.production.autoSell[item.id] ?? { enabled: false, keep: 0, dailyMax: 10 };
    const keep = amountPicker(`fw-keep-${item.id}`, setting.keep, 0, 999, { label: `${item.name} 남길 수량` });
    const daily = amountPicker(`fw-daily-${item.id}`, setting.dailyMax, 1, 999, { label: `${item.name} 하루 최대` });
    const { floor, target } = floorOf(world, content, item.id, setting.keep);
    const soldToday = sales.day === today ? (sales.sold[item.id] ?? 0) : 0;
    const busy = Boolean(state.busy[`auto-sell:${item.id}`]);
    const save = (enabled: boolean) =>
      void controller.setAutoSell(item.id, { enabled, keep: keep.read(), dailyMax: daily.read() });
    return h("li", { className: `auto-sell-row${setting.enabled ? " on" : ""}` }, [
      h("div", { className: "auto-sell-head" }, [
        itemTile(item.id),
        h("span", { className: "protect-name" }, [
          h("strong", { text: item.name }),
          h("small", {
            className: "muted",
            text: `보유 ${world.state.inventory[item.id] ?? 0} · 1개 ${item.sellPrice} G · 오늘 판매 ${soldToday}`,
          }),
        ]),
        h("span", { className: `switch ${setting.enabled ? "on" : "off"}` }, [
          h("span", { className: "knob" }),
          h("span", { className: "switch-label", text: setting.enabled ? "켜짐" : "꺼짐" }),
        ]),
      ]),
      h("div", { className: "auto-sell-fields" }, [
        h("label", { className: "field-label", text: "판매 후 남길 수량", attrs: { for: `fw-keep-${item.id}` } }),
        keep.node,
        h("label", { className: "field-label", text: "하루 최대 판매량", attrs: { for: `fw-daily-${item.id}` } }),
        daily.node,
      ]),
      h("p", {
        className: "hint",
        text: `실제로 남기는 양: ${floor}개 이상 (남길 수량 · 생산 목표 ${target} · 보호 ${world.state.production.protectedStock[item.id] ?? 0} 중 가장 큰 값). 목표와 같으면 팔지 않을 수 있어요.`,
      }),
      h("div", { className: "row-actions" }, [
        button(busy ? "저장 중…" : setting.enabled ? "설정 저장" : "켜기", () => save(true), { disabled: busy }),
        setting.enabled ? button("끄기", () => save(false), { variant: "secondary", disabled: busy }) : null,
      ]),
    ]);
  });
  return sheetDialog("fw-auto-sell", "자동 판매", [
    h("p", {
      className: "muted",
      text: "켠 품목만 회차가 끝날 때마다 팔아요. 하루(UTC 기준) 최대 판매량을 넘지 않고, 보호 · 예약 재고와 생산 목표만큼은 남겨요.",
    }),
    rows.length
      ? h("ul", { className: "protect-list" }, rows)
      : h("p", { className: "empty", text: "창고가 비어 있어요." }),
    button("닫기", () => controller.closeSheet(), { variant: "secondary", attrs: { "data-wide": "" } }),
  ]);
}
