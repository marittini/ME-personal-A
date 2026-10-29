import type { AppState, Controller } from "../../app/controller";
import type { WorldView } from "../../app/types";
import { button, h } from "../../app/dom";
import { card } from "../chrome/frame";
import { formatDuration } from "../work/production-view";
export function activityPanel(state: AppState, world: WorldView, controller: Controller) {
  const kind = state.explore.tab === "patrol" ? "patrol" : "survey";
  const label = kind === "survey" ? "조사" : "순찰";
  const running = world.state.activities?.running;
  const residents = Object.values(world.state.residents).filter((r) => r.recruited);
  const available = residents.filter((r) => !world.state.stories.expedition?.participants.includes(r.residentId));
  const chosen = available.find((r) => r.residentId === state.explore.activityResidentId) ?? available[0];
  const picker = h(
    "select",
    {
      className: "input",
      attrs: { "aria-label": "활동 주민 선택" },
      on: { change: () => controller.selectActivityResident(picker.value) },
    },
    available.map((r) => h("option", { text: r.displayName, attrs: { value: r.residentId } })),
  );
  picker.value = chosen?.residentId ?? "";
  const elapsed = Math.max(0, Date.now() - (state.worldReceivedAt ?? Date.now()));
  const remaining = running ? Math.max(0, running.endsSim - world.state.production.simMs - elapsed) : 0;
  const full =
    (world.state.activities?.completed.length ?? 0) >= 100 || (world.state.mailbox?.letters.length ?? 0) >= 200;
  return card(
    "공방 주변",
    [
      h("p", {
        text:
          kind === "survey"
            ? "주변의 풀과 나뭇잎을 살펴보고 발견을 기록해요."
            : "길과 쉼터를 한 바퀴 돌며 안부를 확인해요.",
      }),
      running
        ? h("div", { className: "activity-running" }, [
            h("strong", {
              text: `${world.state.residents[running.residentId]?.displayName ?? "주민"} · ${running.kind === "survey" ? "조사" : "순찰"} 중`,
            }),
            h("span", {
              className: "countdown",
              text: formatDuration(remaining),
              attrs: { "data-countdown-end": String(Date.now() + remaining) },
            }),
            button("활동 취소", () => void controller.cancelActivity(running.id), {
              variant: "secondary",
              disabled: Boolean(state.busy[`activity-cancel:${running.id}`]),
            }),
            h("p", {
              className: "muted",
              text: "완료 결과는 기록과 우편함에 남아요. 취소해도 재화는 소모되지 않아요.",
            }),
          ])
        : h("div", { className: "activity-prepare" }, [
            available.length ? picker : h("p", { text: "영입한 주민 중 이야기 탐험에 참여하지 않은 주민이 필요해요." }),
            h("p", { text: `소요 ${kind === "survey" ? 30 : 15}분 · 주민 1명 · 결과 기록과 편지` }),
            h("p", {
              className: "muted",
              text: "출발하면 시설 배치에서 빠져요. 생산 중인 작업은 취소되지 않아요. 재료·골드·초대권 보상은 없어요.",
            }),
            button(
              full ? "기록 저장 한도에 도달했어요" : `${label} 출발`,
              () => {
                if (chosen) void controller.startActivity(kind, chosen.residentId);
              },
              { disabled: !chosen || full || Boolean(state.busy["activity-start"]) },
            ),
          ]),
      h("p", {
        className: "muted",
        text: "세계당 조사·순찰 한 활동만 진행해요. 미접속 시간은 최대 72시간까지 반영돼요. 남은 시간은 추정치예요.",
      }),
      h("h3", { text: "최근 완료 기록" }),
      ...(world.state.activities?.completed ?? []).slice(0, 3).map((r) =>
        h("div", { className: "activity-record" }, [
          h("strong", {
            text: `${r.kind === "survey" ? "조사" : "순찰"} · ${world.state.residents[r.residentId]?.displayName ?? "주민"}`,
          }),
          h("p", { text: r.summary }),
          button("결과 편지 읽기", () => void controller.openActivityLetter(r.mailId), {
            variant: "secondary",
            disabled: Boolean(state.busy[`mail:${r.mailId}`]),
            attrs: { "aria-label": `${r.kind === "survey" ? "조사" : "순찰"} 결과 편지 읽기` },
          }),
        ]),
      ),
      button("우편함 열기", () => controller.openMailbox(), { variant: "secondary" }),
    ],
    { className: "activity-card" },
  );
}
