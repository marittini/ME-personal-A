// 전문 분야 고르기: the player chooses each resident's field (채집 · 재배 · 조사 · 가공 · 제작), free to change any time.
// A resident placed in a facility of their field helps with the passive (plan §7.2-A).
import type { AppState, Controller } from "../../app/controller";
import { button, h } from "../../app/dom";
import type { FieldId, WorldView } from "../../app/types";
import { sheetDialog } from "../chrome/sheet";
import { FIELD_ICONS, FIELD_LABELS } from "../work/production-view";

export function renderFieldSheet(state: AppState, world: WorldView, controller: Controller, residentId: string) {
  const resident = world.state.residents[residentId];
  if (!resident) return null;
  const busy = Boolean(state.busy[`field:${residentId}`]);
  return sheetDialog("fw-field", `${resident.displayName}의 전문 분야`, [
    h("p", {
      className: "muted",
      text: "같은 분야의 시설에 배치하면 그 시설이 빨라져요. 언제든 무료로 바꿀 수 있어요.",
    }),
    h(
      "ul",
      { className: "pick-list fields" },
      (Object.keys(FIELD_LABELS) as FieldId[]).map((field) =>
        h("li", {}, [
          h(
            "button",
            {
              className: `pick-row${resident.field === field ? " selected" : ""}`,
              attrs: { type: "button", "aria-pressed": resident.field === field ? "true" : "false" },
              disabled: busy,
              on: { click: () => void controller.setField(residentId, field) },
            },
            [
              FIELD_ICONS[field]("icon"),
              h("strong", { text: FIELD_LABELS[field] }),
              h("small", {
                className: "muted",
                text: state.content?.facilities.find((facility) => facility.field === field)?.name ?? "",
              }),
            ],
          ),
        ]),
      ),
    ),
    button("닫기", () => controller.closeSheet(), { variant: "secondary", attrs: { "data-wide": "" } }),
  ]);
}
