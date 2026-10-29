import type { AppState, Controller } from "../../app/controller";
import { button, h } from "../../app/dom";
import { sheetDialog } from "../chrome/sheet";
import { pagePicker } from "../chrome/page-picker";
const STATUS = { active: "사용 중", corrected: "정정 전 원문", invalidated: "사용 중지" };
const TYPE = { event: "사건", feeling: "감정", player: "플레이어 답변" };
export function renderMemorySheet(state: AppState, controller: Controller) {
  const view = state.sheet;
  const world = state.world?.state === "ready" ? state.world.value : null;
  if (view?.kind !== "memory" || !world) return null;
  const pair = view.pairId ? world.state.pairs[view.pairId] : null;
  const facts = world.state.memory.facts
    .filter(
      (f) =>
        !view.pairId ||
        (pair && (f.visibility === "public" || pair.residentIds.every((id) => f.knowerIds.includes(id)))),
    )
    .filter((f) => !view.status || view.status === "all" || f.status === view.status)
    .filter((f) => !view.residentId || f.visibility === "public" || f.knowerIds.includes(view.residentId))
    .slice()
    .reverse();
  const selected = facts.find((f) => f.factId === view.factId) ?? facts[0];
  const page = Math.max(0, Math.min(view.page ?? 0, Math.ceil(facts.length / 3) - 1));
  const busy = selected ? Boolean(state.busy[`memory:${selected.factId}`]) : false;
  const draft = view.draft ?? selected?.text ?? "";
  const filter = (patch: { residentId?: string; status?: "all" | "active" | "corrected" | "invalidated" }) => {
    const current = controller.store.get().sheet;
    if (current?.kind === "memory" && current.draft !== undefined && current.draft !== selected?.text) {
      controller.notify("정정문을 저장한 뒤 필터를 바꿔 주세요.");
      return;
    }
    controller.updateMemoryView({ ...patch, page: 0, factId: undefined, draft: undefined });
  };
  const statuses = ["all", "active", "corrected", "invalidated"] as const;
  const residentIds = ["", ...Object.keys(world.state.residents)];
  const statusSelect = pagePicker(
    "기억 상태 필터",
    Math.max(0, statuses.indexOf(view.status ?? "all")),
    ["모든 상태", ...Object.values(STATUS)],
    (index) => filter({ status: statuses[index] }),
  );
  const residentSelect = pagePicker(
    "기억 인지 주민 필터",
    Math.max(0, residentIds.indexOf(view.residentId ?? "")),
    residentIds.map((id) => (id ? world.state.residents[id]!.displayName : "모든 인지 주민")),
    (index) => filter({ residentId: residentIds[index] }),
  );
  const editor = h("textarea", {
    className: "textarea",
    attrs: { "aria-label": "기억 정정문", maxlength: "160", rows: "3" },
    on: { input: () => controller.rememberMemoryDraft(editor.value) },
  });
  editor.value = draft;
  return sheetDialog(
    "fw-memory",
    view.pairId ? "페어 공유 기억" : "기억 관리",
    [
      h("p", {
        className: "muted",
        text: view.pairId
          ? "두 주민이 함께 아는 기억과 공개 기억만 보여요. 정정해도 인지 범위는 바뀌지 않아요."
          : "세계 관리자는 전체 기억을 볼 수 있어요. 주민은 자신이 아는 기억과 공개 기억만 사용해요.",
      }),
      h("div", { className: "memory-filters" }, [statusSelect, residentSelect]),
      facts.length
        ? h(
            "div",
            { className: "memory-choices", attrs: { role: "group", "aria-label": "기억 선택" } },
            facts.slice(page * 3, page * 3 + 3).map((f) =>
              button(
                `${f.text.slice(0, 32)} · ${STATUS[f.status]}`,
                () => {
                  const current = controller.store.get().sheet;
                  if (current?.kind === "memory" && current.draft !== undefined && current.draft !== selected?.text) {
                    controller.notify("정정문을 저장한 뒤 다른 기억을 선택해 주세요.");
                    return;
                  }
                  controller.updateMemoryView({ factId: f.factId, draft: undefined });
                },
                { variant: "secondary", attrs: { "aria-pressed": String(f.factId === selected?.factId) } },
              ),
            ),
          )
        : h("p", { className: "empty", text: "아직 기록된 기억이 없어요." }),
      pagePicker(
        "기억 목록 고르기",
        page,
        Array.from(
          { length: Math.ceil(facts.length / 3) },
          (_, i) => `${i + 1} · ${i * 3 + 1}–${Math.min(facts.length, i * 3 + 3)}`,
        ),
        (page) => controller.updateMemoryView({ page }),
      ),
      selected
        ? h("section", { className: "memory-detail" }, [
            h("p", { className: "memory-text", text: selected.text }),
            h("span", { className: "muted", text: `${TYPE[selected.factType]} · ${STATUS[selected.status]}` }),
            h("p", {
              className: "muted",
              text: `아는 주민: ${selected.visibility === "public" ? "모두" : selected.knowerIds.map((id) => world.state.residents[id]?.displayName ?? "주민").join(", ")}`,
            }),
            h("p", {
              className: "muted",
              text: `${selected.occurredAt.slice(0, 10)} · ${selected.storyId ? `출처 이야기 ${selected.storyId}` : "공방 기록"}${selected.supersedes ? ` · 정정 원문 #${selected.supersedes}` : ""}`,
            }),
            selected.status === "active"
              ? h(
                  "form",
                  {
                    on: {
                      submit: (event) => {
                        event.preventDefault();
                        if (editor.value.trim() && editor.value.trim() !== selected.text)
                          void controller.correctMemory(selected.factId, editor.value);
                      },
                    },
                  },
                  [
                    h("label", { className: "compare-title", text: "기억 정정문" }),
                    editor,
                    h("p", {
                      className: "muted",
                      text: "원문과 출처는 보존하며 다음 생성부터 정정본을 사용해요. 이미 쓴 이야기는 바뀌지 않아요.",
                    }),
                    h("button", { className: "button", text: "정정 저장", attrs: { type: "submit" }, disabled: busy }),
                  ],
                )
              : null,
            selected.status !== "corrected"
              ? button(
                  selected.status === "active" ? "사용 중지" : "다시 사용",
                  () => void controller.setMemoryStatus(selected.factId, selected.status !== "active"),
                  { variant: "secondary", disabled: busy },
                )
              : null,
          ])
        : null,
      button("닫기", () => controller.closeSheet(), { variant: "secondary" }),
    ],
    "memory-sheet",
  );
}
