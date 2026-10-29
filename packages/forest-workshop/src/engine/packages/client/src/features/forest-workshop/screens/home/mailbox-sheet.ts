import type { AppState, Controller } from "../../app/controller";
import { button, h } from "../../app/dom";
import { sheetDialog } from "../chrome/sheet";
import { pagePicker } from "../chrome/page-picker";
export function renderMailboxSheet(state: AppState, controller: Controller) {
  const view = state.sheet,
    world = state.world?.state === "ready" ? state.world.value : null;
  if (view?.kind !== "mailbox" || !world) return null;
  const letters = (world.state.mailbox?.letters ?? [])
    .filter((l) => l.archived === Boolean(view.archived))
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id));
  const selected = letters.find((l) => l.id === view.id);
  const page = Math.max(0, Math.min(view.page ?? 0, Math.ceil(letters.length / 4) - 1));
  const activity = selected
    ? world.state.activities?.completed?.find((item) => item.mailId === selected.id)
    : undefined;
  const generated = activity
    ? world.state.mailbox.letters.find((item) => item.id === `resident-${activity.id}`)
    : undefined;
  const busy = Boolean(state.busy[`mail:${selected?.id}`] || (activity && state.busy[`letter:${activity.id}`]));
  return sheetDialog("fw-mailbox", "우편함", [
    h(
      "div",
      { className: "mail-tabs", attrs: { role: "group", "aria-label": "우편 분류" } },
      [false, true].map((archived) =>
        button(
          archived ? "보관함" : "받은 편지",
          () => controller.setMailboxView({ archived, page: 0, id: undefined }),
          { variant: "secondary", attrs: { "aria-pressed": String(Boolean(view.archived) === archived) } },
        ),
      ),
    ),
    selected
      ? h("article", { className: "letter-detail" }, [
          h("h3", { text: selected.title }),
          h("p", { className: "muted", text: `${selected.sender} · ${selected.createdAt.slice(0, 10)}` }),
          h("p", { className: "letter-body", text: selected.body }),
          activity
            ? button(
                generated ? "주민 편지 보기" : busy ? "편지를 쓰고 있어요…" : "주민 편지 쓰기 · AI 사용",
                () =>
                  generated
                    ? void controller.openActivityLetter(generated.id)
                    : void controller.generateResidentLetter(activity.id),
                { disabled: busy },
              )
            : null,
          button(
            selected.archived ? "받은 편지로" : "보관하기",
            () => void controller.archiveLetter(selected.id, !selected.archived),
            { disabled: busy },
          ),
          button("목록으로", () => controller.setMailboxView({ id: undefined }), {
            variant: "secondary",
            disabled: busy,
          }),
        ])
      : h(
          "div",
          { className: "mail-list" },
          letters.length
            ? letters
                .slice(page * 4, page * 4 + 4)
                .map((letter) =>
                  button(
                    `${letter.readAt ? "읽음" : "새 편지"} · ${letter.sender} · ${letter.title}`,
                    () => void controller.openLetter(letter.id),
                    { variant: "secondary", disabled: Boolean(state.busy[`mail:${letter.id}`]) },
                  ),
                )
            : [h("p", { className: "empty", text: view.archived ? "보관한 편지가 없어요." : "받은 편지가 없어요." })],
        ),
    !selected
      ? pagePicker(
          "편지 목록 고르기",
          page,
          Array.from(
            { length: Math.ceil(letters.length / 4) },
            (_, i) => `${i + 1} · ${i * 4 + 1}–${Math.min(letters.length, i * 4 + 4)}`,
          ),
          (page) => controller.setMailboxView({ page }),
        )
      : null,
    button("닫기", () => controller.closeSheet(), { variant: "secondary" }),
  ]);
}
