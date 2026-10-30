// 자동 판매 (board 01-3): off by default, per item. The player sets 판매 후 남길 수량 and 하루 최대 판매량; the server
// sells after runs complete and never below max(남길 수량, the highest active production target, protected stock),
// within the UTC day's limit (plan §7.2-C). Each row shows that floor and what was sold today.
import type { AppState, Controller } from "../../app/controller";
import { button, h } from "../../app/dom";
import type { GameContent, WorldView } from "../../app/types";
import { amountPicker, sheetDialog } from "../chrome/sheet";
import { itemTile } from "./production-view";

/** The floor the server uses (domain/production/simulation.ts autoSellFloor). */
function floorOf(world: WorldView, content: GameContent, itemId: string, keep: number, continuous: boolean) {
  let target = 0;
  for (const facility of Object.values(world.state.production.facilities)) {
    if (!facility.unlocked || facility.mode !== "auto") continue;
    for (const rule of facility.rules) {
      const recipe = content.recipes.find((candidate) => candidate.id === rule.recipeId);
      if (rule.enabled && recipe && Object.keys(recipe.outputs)[0] === itemId)
        target = Math.max(target, rule.targetStock);
    }
  }
  return { floor: Math.max(keep, continuous ? 0 : target, world.state.production.protectedStock[itemId] ?? 0), target };
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
    const continuous = h("input", { attrs: { type: "checkbox", id: `fw-continuous-${item.id}` } });
    continuous.checked = Boolean(setting.continuous);
    const { floor, target } = floorOf(
      world,
      content,
      item.id,
      setting.keep,
      Boolean(setting.continuous && setting.enabled),
    );
    const soldToday = sales.day === today ? (sales.sold[item.id] ?? 0) : 0;
    const busy = Boolean(state.busy[`auto-sell:${item.id}`]);
    const save = (enabled: boolean) =>
      void controller.setAutoSell(item.id, {
        enabled,
        keep: keep.read(),
        dailyMax: daily.read(),
        continuous: continuous.checked,
      });
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
      h("label", { attrs: { for: `fw-continuous-${item.id}` } }, [continuous, " 판매할 만큼 계속 생산하기"]),
      h("p", {
        className: "hint",
        text:
          setting.enabled && setting.continuous
            ? `현재 판매 시 ${floor}개 이상 남겨요. 판매 한도에 도달하면 일반 생산 목표 ${target}개를 따릅니다.`
            : `현재 ${floor}개 이상 남겨요 (보관량 · 생산 목표 ${target} · 보호 재고 중 가장 큰 값).`,
      }),
      h("div", { className: "row-actions" }, [
        button(busy ? "저장 중…" : setting.enabled ? "설정 저장" : "켜기", () => save(true), { disabled: busy }),
        setting.enabled ? button("끄기", () => save(false), { variant: "secondary", disabled: busy }) : null,
      ]),
    ]);
  });
  let page = Math.max(0, Math.min(items.length - 1, state.sheet?.kind === "auto-sell" ? (state.sheet.page ?? 0) : 0));
  const selector = h(
    "select",
    {
      className: "input",
      attrs: { "aria-label": "자동 판매할 품목" },
      on: { change: () => showPage(Number(selector.value)) },
    },
    items.map((item, index) => h("option", { text: item.name, attrs: { value: String(index) } })),
  );
  function showPage(next: number) {
    page = next;
    rows.forEach((row, index) => (row.hidden = index !== page));
    selector.value = String(page);
    controller.rememberAutoSellPage(page);
  }
  showPage(page);
  return sheetDialog("fw-auto-sell", "자동 판매", [
    rows.length ? selector : null,
    rows.length
      ? h("ul", { className: "protect-list" }, rows)
      : h("p", { className: "empty", text: "창고가 비어 있어요." }),
    h("details", { className: "detail-help" }, [
      h("summary", { text: "자동 판매 규칙 · 하루 한도 안내" }),
      h("p", {
        className: "muted",
        text: "켠 품목을 하루(UTC 기준) 판매 한도까지 팔아요. 계속 생산을 선택하면 남길 수량과 보호 재고를 지키며 판매할 만큼 만들어요.",
      }),
    ]),
    button("닫기", () => controller.closeSheet(), { variant: "secondary", attrs: { "data-wide": "" } }),
  ]);
}
