// 지정 횟수 (board 01-2's second mode): the facility runs its queue in order, each request a recipe × 1–99 runs.
// Inputs are taken one run at a time when each run starts, so the expected total is a forecast, not a reservation
// (plan §7.2-C). Slots grow with the level (3 → 5).
import type { AppState, Controller } from "../../app/controller";
import { h } from "../../app/dom";
import type { GameContent, WorldView } from "../../app/types";
import { ICONS } from "../chrome/icons";
import { amountPicker } from "../chrome/sheet";
import { crewBonus, crewRun, itemName, queueSlotsAt, recipeOf } from "./production-view";

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
  const initialCount = state.work.queueCounts?.[facilityId] ?? 1;
  const picker = amountPicker(`fw-queue-count-${facilityId}`, initialCount, range.min, range.max, {
    label: "횟수",
    onChange: (count) => {
      describe(count);
      controller.rememberQueueCount(facilityId, count);
    },
  });
  describe(initialCount);
  const busy = Boolean(state.busy[`queue:${facilityId}`]);
  const view = state.work.queueView ?? (facility.queue.length ? "list" : "add");
  const queueSelect = h(
    "select",
    { className: "input", attrs: { "aria-label": "대기 중인 작업" } },
    facility.queue.map((entry, index) =>
      h("option", {
        text: `${index + 1}. ${recipeOf(content, entry.recipeId)?.name ?? entry.recipeId} · ${entry.started}/${entry.total}회`,
        attrs: { value: entry.entryId },
      }),
    ),
  );
  const recipeSelect = h(
    "select",
    {
      className: "input",
      attrs: { "aria-label": "제작법 고르기" },
      on: { change: () => controller.selectQueueRecipe(facilityId, recipeSelect.value) },
    },
    recipes.map((recipe) => h("option", { text: recipe.name, attrs: { value: recipe.id } })),
  );
  recipeSelect.value = chosenId;
  return h("div", { className: "plan-block queue" }, [
    h("span", { className: "plan-label" }, [
      "지정 횟수 대기열 ",
      h("small", { text: `(${facility.queue.length}/${slots}칸 · 위에서부터 차례로 만들어요)` }),
    ]),
    h("div", { className: "pill-tabs two", attrs: { role: "group", "aria-label": "대기열 화면" } }, [
      h("button", {
        className: `pill-tab${view === "list" ? " current" : ""}`,
        text: "대기열 보기",
        attrs: { type: "button", "aria-pressed": view === "list" ? "true" : "false" },
        on: { click: () => controller.setQueueView("list") },
      }),
      h("button", {
        className: `pill-tab${view === "add" ? " current" : ""}`,
        text: "작업 추가",
        attrs: { type: "button", "aria-pressed": view === "add" ? "true" : "false" },
        on: { click: () => controller.setQueueView("add") },
      }),
    ]),
    view === "list"
      ? facility.queue.length === 0
        ? h("p", { className: "empty", text: "대기열이 비어 있어요." })
        : h("div", { className: "queue-add" }, [
            queueSelect,
            h("button", {
              className: "outline-button",
              text: "선택한 작업 빼기",
              attrs: { type: "button" },
              disabled: Object.keys(state.busy).some((key) => key.startsWith("queue-remove:") && state.busy[key]),
              on: { click: () => void controller.removeQueue(facilityId, queueSelect.value) },
            }),
          ])
      : null,
    view === "add"
      ? h("div", { className: "queue-add" }, [
          recipeSelect,
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
        ])
      : null,
  ]);
}
