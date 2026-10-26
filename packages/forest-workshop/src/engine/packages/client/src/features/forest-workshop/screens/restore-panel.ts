// 백업 불러오기 → 복원 미리보기 → 새 세계로 복원 (mockup 05, middle). Used by 저장·백업 and by the world list, where a
// player without any world can restore one. Picking a file only previews it; nothing is sent until the button.
import type { AppState, Controller } from "../app/controller";
import { button, h, statusLine } from "../app/dom";
import { ICONS } from "./icons";

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "알 수 없음"
    : new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function renderRestorePanel(state: AppState, controller: Controller, inputId: string) {
  const busy = Boolean(state.busy.restore);
  const input = h("input", {
    className: "visually-hidden",
    attrs: { type: "file", accept: "application/json,.json", id: inputId },
    disabled: busy,
    on: {
      change: () => {
        const file = input.files?.[0];
        if (file) void controller.selectRestoreFile(file);
        input.value = "";
      },
    },
  });
  const pick = h("label", { className: "menu-row", attrs: { for: inputId } }, [
    h("span", { className: "menu-icon" }, [ICONS.download()]),
    h("span", { className: "menu-text" }, [
      h("span", { className: "menu-title", text: "백업 불러오기" }),
      h("span", { className: "menu-detail", text: "새 세계로 복원" }),
    ]),
    h("span", { className: "menu-chevron" }, [ICONS.chevron()]),
  ]);

  const selection = state.restore;
  const preview = selection
    ? h("div", { className: "preview-box", attrs: { "aria-labelledby": `${inputId}-preview` } }, [
        h("h3", { className: "subhead", text: "복원 미리보기", attrs: { id: `${inputId}-preview` } }),
        h("dl", { className: "facts" }, [
          h("dt", { text: "파일" }),
          h("dd", { text: selection.fileName }),
          h("dt", { text: "세계" }),
          h("dd", { text: selection.summary.worldName }),
          h("dt", { text: "닉네임" }),
          h("dd", { text: selection.summary.playerNickname }),
          h("dt", { text: "골드" }),
          h("dd", { text: selection.summary.gold.toLocaleString("ko-KR") }),
          h("dt", { text: "창고" }),
          h("dd", {
            text: `${selection.summary.itemKinds}종 · ${selection.summary.itemTotal.toLocaleString("ko-KR")}개`,
          }),
          h("dt", { text: "백업 시각" }),
          h("dd", { text: formatDate(selection.summary.exportedAt) }),
        ]),
        button(busy ? "복원하는 중…" : "새 세계로 복원", () => void controller.confirmRestore(), {
          disabled: busy,
          attrs: { "data-wide": "" },
        }),
        busy ? statusLine("복원하는 중…") : button("취소", () => controller.cancelRestore(), { variant: "secondary" }),
      ])
    : null;

  return h("div", { className: "restore" }, [
    input,
    pick,
    preview,
    h("p", { className: "hint" }, [ICONS.info(), "현재 세계는 덮어쓰지 않아요. 백업은 항상 새 세계로 복원됩니다."]),
  ]);
}
