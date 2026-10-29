// 배치 변경 (board 01-2): who works at this facility. Only residents who came to the workshop can be placed, one place
// each (choosing someone placed elsewhere moves them). Each row says what they would add here: their passive when
// their 전문 분야 matches, nothing otherwise. Facilities work without anyone (plan §7.2-A).
import type { AppState, Controller } from "../../app/controller";
import { button, h } from "../../app/dom";
import type { GameContent, WorldView } from "../../app/types";
import { sheetDialog } from "../chrome/sheet";
import { kindTag, residentAvatar } from "../residents/resident-figure";
import { FIELD_LABELS, crewBonus, facilityOf, passiveOf, percent, talentOf } from "./production-view";

export function renderAssignSheet(
  state: AppState,
  world: WorldView,
  content: GameContent,
  controller: Controller,
  facilityId: string,
) {
  const facility = facilityOf(content, facilityId);
  const current = world.state.production.facilities[facilityId]?.residentId ?? null;
  const busy = Boolean(state.busy[`assign:${facilityId}`]);
  const placedAt = (residentId: string) =>
    Object.entries(world.state.production.facilities).find(([, f]) => f.residentId === residentId)?.[0] ?? null;
  const recruited = Object.values(world.state.residents)
    .filter((resident) => resident.recruited)
    .sort(
      (a, b) =>
        Number(b.field === facility?.field) - Number(a.field === facility?.field) ||
        a.displayName.localeCompare(b.displayName, "ko"),
    );
  const bonus = crewBonus(content, world.state, facilityId);
  return sheetDialog("fw-assign", `${facility?.name ?? "시설"} 배치 변경`, [
    h("p", {
      className: "muted",
      text: `${facility ? FIELD_LABELS[facility.field] : ""} 분야 주민을 두면 처리 속도가 빨라져요. 지금 작업은 시작한 속도 그대로 끝나고, 다음 회차부터 적용돼요. 페어 두 사람이 모두 배치되면 모든 시설 +${percent(content.crew.setBonusPerPair)}(최대 ${percent(content.crew.setBonusMax)}).`,
    }),
    h("p", { className: "assign-now" }, [
      h("strong", { text: "지금 " }),
      bonus.resident ? bonus.resident.displayName : "배치한 주민 없음",
      ` · 주민 효과 +${percent(bonus.total)}`,
    ]),
    recruited.length === 0
      ? h("div", { className: "assign-empty" }, [
          h("p", { className: "empty", text: "아직 공방에 온 주민이 없어요. 주민이 없어도 시설은 계속 일해요." }),
          world.state.progress.starterResidentId === null
            ? button(Object.keys(world.state.residents).length ? "시작 주민 고르기" : "첫 주민 맞이하기", () =>
                controller.openRegister(Object.keys(world.state.residents).length ? 3 : 1),
              )
            : button("주민 초대하기", () => controller.navigate("invite")),
        ])
      : h(
          "ul",
          { className: "pick-list" },
          recruited.map((resident) => {
            const matches = resident.field === facility?.field;
            const elsewhere = placedAt(resident.residentId);
            const talent = talentOf(content, resident.talentId);
            const note = [
              matches
                ? `+${percent(passiveOf(content, resident.breakthrough))}${talent ? ` · 특기 ${talent.name}: ${talent.description}` : ""}`
                : `${FIELD_LABELS[resident.field]} 분야라 효과 없음`,
              elsewhere && elsewhere !== facilityId
                ? `${facilityOf(content, elsewhere)?.name ?? ""}에서 옮겨 와요`
                : "",
            ]
              .filter(Boolean)
              .join(" · ");
            return h("li", {}, [
              h(
                "button",
                {
                  className: `pick-row${resident.residentId === current ? " selected" : ""}`,
                  attrs: { type: "button", "aria-pressed": resident.residentId === current ? "true" : "false" },
                  disabled: busy || resident.residentId === current,
                  on: { click: () => void controller.assignResident(facilityId, resident.residentId) },
                },
                [
                  residentAvatar(resident),
                  h("strong", { text: resident.displayName }),
                  kindTag(resident),
                  h("small", { className: matches ? "good" : "muted", text: note }),
                ],
              ),
            ]);
          }),
        ),
    current
      ? button("배치 해제", () => void controller.assignResident(facilityId, null), {
          variant: "secondary",
          disabled: busy,
        })
      : null,
    button("닫기", () => controller.closeSheet(), { variant: "secondary", attrs: { "data-wide": "" } }),
  ]);
}
