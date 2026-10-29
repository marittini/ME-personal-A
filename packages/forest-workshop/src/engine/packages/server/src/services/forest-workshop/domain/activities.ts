import type { WorldState } from "./world-model";
export function settleActivities(state: WorldState, now: string): WorldState {
  const run = state.activities.running;
  if (!run || state.production.simMs < run.endsSim) return state;
  const mailId = `activity-${run.id}`;
  const summary =
    run.kind === "survey"
      ? "공방 주변을 살펴보고 나뭇잎과 작은 풀의 모습을 기록했어요."
      : "공방 주변을 한 바퀴 돌며 길과 이웃의 쉼터가 평온한지 확인했어요.";
  const result = { id: run.id, kind: run.kind, residentId: run.residentId, completedAt: now, summary, mailId };
  return {
    ...state,
    activities: { running: null, completed: [result, ...state.activities.completed] },
    mailbox: {
      letters: state.mailbox.letters.some((l) => l.eventId === mailId)
        ? state.mailbox.letters
        : [
            {
              id: mailId,
              eventId: mailId,
              sender: state.residents[run.residentId]?.displayName ?? "공방 주민",
              title: run.kind === "survey" ? "공방 주변 조사 기록" : "공방 주변 순찰 기록",
              body: summary,
              createdAt: now,
              readAt: null,
              archived: false,
            },
            ...state.mailbox.letters,
          ],
    },
  };
}
