// 백업 불러오기 → 복원 미리보기 → 새 세계로 복원 (board 05-2). The preview box is always in its place: empty until a
// file is picked, then 주민 · 페어 · 그림 counted from the file. Nothing is sent before "새 세계로 복원".
import type { AppState, Controller } from "../../app/controller";
import { h } from "../../app/dom";
import { ICONS, type IconFactory } from "../chrome/icons";

function previewRow(icon: IconFactory, label: string, value: string) {
  return h("div", { className: "preview-row" }, [
    icon("icon"),
    h("span", { text: label }),
    h("strong", { text: value }),
  ]);
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
  const selection = state.restore;
  const summary = selection?.summary;
  return h("div", { className: "restore" }, [
    input,
    h("label", { className: "menu-row", attrs: { for: inputId } }, [
      h("span", { className: "menu-icon" }, [ICONS.download()]),
      h("span", { className: "menu-text" }, [
        h("span", { className: "menu-title", text: "백업 불러오기" }),
        h("span", { className: "menu-detail", text: selection ? selection.fileName : "새 세계로 복원" }),
      ]),
      h("span", { className: "menu-chevron" }, [ICONS.chevron()]),
    ]),
    h("div", { className: "preview-box", attrs: { "aria-live": "polite" } }, [
      h("p", { className: "preview-head" }, [ICONS.eye("icon"), h("strong", { text: "복원 미리보기" })]),
      summary
        ? h("div", { className: "preview-rows" }, [
            previewRow(ICONS.residents, "주민", `${summary.residents}명`),
            previewRow(ICONS.pair, "페어", `${summary.pairs}개`),
            previewRow(ICONS.image, "그림", `${summary.pictures}개`),
          ])
        : h("p", { className: "muted", text: "백업 파일을 고르면 담긴 내용을 먼저 보여 드려요." }),
    ]),
    h(
      "button",
      {
        className: "button big-action",
        attrs: { type: "button", "data-wide": "" },
        disabled: !summary || busy,
        on: { click: () => void controller.confirmRestore() },
      },
      [ICONS.restore("icon"), h("span", { text: busy ? "복원하는 중…" : "새 세계로 복원" })],
    ),
    h("p", { className: "hint center" }, [ICONS.info("icon"), "현재 세계는 덮어쓰지 않아요."]),
  ]);
}
