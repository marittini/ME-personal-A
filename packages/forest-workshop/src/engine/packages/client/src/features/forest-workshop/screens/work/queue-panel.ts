// 지정 횟수 (board 01-2's second mode): the facility runs its queue in order, each request a recipe × 1–99 runs.
// Inputs are taken one run at a time when each run starts, so the expected total is a forecast, not a reservation
// (plan §7.2-C). Slots grow with the level (3 → 5).
import type { AppState, Controller } from "../../app/controller";
import { h } from "../../app/dom";
import type { GameContent, WorldView } from "../../app/types";
import { ICONS } from "../chrome/icons";
import { amountPicker } from "../chrome/sheet";
import { crewBonus, crewRun, itemName, itemTile, queueSlotsAt, recipeOf } from "./production-view";

export function queuePanel(
  state: AppState,
  content: GameContent,
  world: WorldView,
  facilityId: string,
  controller: Controller,
) {
  const facility = world.state.production.facilities[facilityId]!;
  const recipes = content.recipes.filter((recipe) => recipe.facilityId === facilityId);
  const slots = queueSlotsAt(content, facility.level);
  const full = facility.queue.length >= slots;
  const chosenId = state.work.queueRecipe[facilityId] ?? recipes[0]?.id ?? "";
  const chosen = recipeOf(content, chosenId);
  const forecast = h("p", { className: "hint" });
  const crew = crewBonus(content, world.state, facilityId);
  const describe = (count: number) => {
    const inputs = chosen ? Object.entries(crewRun(chosen, crew).inputs) : [];
    forecast.textContent = inputs.length
      ? `예상 재료 ${inputs.map(([item, amount]) => `${itemName(content, item)} ${amount * count}`).join(" · ")} — 한 회차씩 시작할 때 꺼내요. 재료 확보를 미리 보장하지 않아요.`
      : "재료 없이 숲에서 바로 모아요.";
  };
  const range = content.production.queueCount;
  const picker = amountPicker(`fw-queue-count-${facilityId}`, 1, range.min, range.max, {
    label: "횟수",
    onChange: describe,
  });
  describe(1);
  const busy = Boolean(state.busy[`queue:${facilityId}`]);
  return h("div", { className: "plan-block queue" }, [
    h("span", { className: "plan-label" }, [
      "지정 횟수 대기열 ",
      h("small", { text: `(${facility.queue.length}/${slots}칸 · 위에서부터 차례로 만들어요)` }),
    ]),
    facility.queue.length === 0
      ? h("p", { className: "empty", text: "대기열이 비어 있어요." })
      : h(
          "ol",
          { className: "queue-list" },
          facility.queue.map((entry, index) => {
            const recipe = recipeOf(content, entry.recipeId);
            const output = recipe ? Object.keys(recipe.outputs)[0]! : "";
            const removing = Boolean(state.busy[`queue-remove:${entry.entryId}`]);
            return h("li", { className: "queue-row" }, [
              h("span", { className: "rank", text: String(index + 1) }),
              itemTile(output),
              h("span", { className: "queue-name" }, [
                h("strong", { text: recipe?.name ?? entry.recipeId }),
                h("small", { className: "muted", text: `시작 ${entry.started} / ${entry.total}회` }),
              ]),
              h(
                "button",
                {
                  className: "outline-button small",
                  attrs: { type: "button", "aria-label": `${recipe?.name ?? ""} 남은 횟수 빼기` },
                  disabled: removing,
                  on: { click: () => void controller.removeQueue(facilityId, entry.entryId) },
                },
                [h("span", { text: "빼기" })],
              ),
            ]);
          }),
        ),
    h("div", { className: "queue-add" }, [
      h(
        "div",
        { className: "chip-row", attrs: { role: "group", "aria-label": "제작법 고르기" } },
        recipes.map((recipe) =>
          h(
            "button",
            {
              className: `pill-tab${recipe.id === chosenId ? " current" : ""}`,
              attrs: { type: "button", "aria-pressed": recipe.id === chosenId ? "true" : "false" },
              on: { click: () => controller.selectQueueRecipe(facilityId, recipe.id) },
            },
            [itemTile(Object.keys(recipe.outputs)[0]!), h("span", { text: recipe.name })],
          ),
        ),
      ),
      picker.node,
      forecast,
      h(
        "button",
        {
          className: "button",
          attrs: { type: "button", "data-wide": "" },
          disabled: busy || full || !chosen,
          on: { click: () => void controller.addQueue(facilityId, chosenId, picker.read()) },
        },
        [
          ICONS.plus("icon"),
          h("span", { text: full ? "대기열이 가득 찼어요" : busy ? "추가하는 중…" : "대기열에 추가" }),
        ],
      ),
    ]),
  ]);
}
