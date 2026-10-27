// 전문 분야 · 특기: what a resident is good at. Both were decided when the resident was registered, from their own
// character or persona text (plan §3, §7.2-A); this sheet explains them and where they help. Nothing here changes them.
import type { AppState, Controller } from "../../app/controller";
import { button, h } from "../../app/dom";
import type { WorldView } from "../../app/types";
import { sheetDialog } from "../chrome/sheet";
import { FIELD_ICONS, FIELD_LABELS, passiveOf, percent, talentOf } from "../work/production-view";

export function renderFieldSheet(state: AppState, world: WorldView, controller: Controller, residentId: string) {
  const resident = world.state.residents[residentId];
  const content = state.content;
  if (!resident || !content) return null;
  const talent = talentOf(content, resident.talentId);
  const facility = content.facilities.find((candidate) => candidate.field === resident.field);
  return sheetDialog("fw-field", `${resident.displayName}의 전문 분야 · 특기`, [
    h("div", { className: "talent-card" }, [
      h("p", { className: "talent-field" }, [
        FIELD_ICONS[resident.field]("icon"),
        h("strong", { text: `${FIELD_LABELS[resident.field]} 분야` }),
        h("span", { className: "muted", text: ` · ${facility?.name ?? ""}` }),
      ]),
      h("p", {
        className: "muted",
        text: `${facility?.name ?? "같은 분야 시설"}에 배치하면 처리 속도가 빨라져요: 기본 ${percent(passiveOf(content, 0))} → 지금 ${percent(passiveOf(content, resident.breakthrough))} (돌파 ${resident.breakthrough}/${content.crew.maxBreakthrough}).`,
      }),
      talent
        ? h("p", { className: "talent-name" }, [
            h("strong", { text: `특기 · ${talent.name}` }),
            h("span", { text: talent.description }),
          ])
        : null,
    ]),
    h("p", {
      className: "hint",
      text: "전문 분야와 특기는 주민을 맞이할 때 원래 설정을 바탕으로 정해졌어요. 원본 카드는 바뀌지 않아요.",
    }),
    button("닫기", () => controller.closeSheet(), { variant: "secondary", attrs: { "data-wide": "" } }),
  ]);
}
