// 저장·백업 (mockup 05, middle): save status, export, and restore with a preview. The storage-usage bars of the
// mockup arrive with resident pictures (P2), when there is picture storage to measure.
import type { AppState, Controller } from "../app/controller";
import { h, statusLine } from "../app/dom";
import { ICONS } from "./icons";
import { renderLayout } from "./layout";
import { renderRestorePanel } from "./restore-panel";

function formatSavedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "알 수 없음";
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  const time = new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit" }).format(date);
  return sameDay
    ? `오늘 ${time}`
    : new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function renderBackupScreen(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  const exporting = Boolean(state.busy.backup);
  const body = world
    ? [
        h("section", { className: "card saved", attrs: { "aria-label": "저장 상태" } }, [
          h("p", { className: "saved-title" }, [h("span", { className: "check" }, [ICONS.check()]), "저장 완료"]),
          h("p", { className: "muted", text: `마지막 저장 ${formatSavedAt(world.updatedAt)}` }),
        ]),
        h("section", { className: "card menu", attrs: { "aria-label": "백업" } }, [
          h(
            "button",
            {
              className: "menu-row",
              attrs: { type: "button" },
              disabled: exporting,
              on: { click: () => void controller.downloadBackup() },
            },
            [
              h("span", { className: "menu-icon" }, [ICONS.upload()]),
              h("span", { className: "menu-text" }, [
                h("span", { className: "menu-title", text: exporting ? "백업 만드는 중…" : "백업 내보내기" }),
                h("span", { className: "menu-detail", text: "세계 설정 · 재화 · 창고 · 비밀키 제외" }),
              ]),
              h("span", { className: "menu-chevron" }, [ICONS.chevron()]),
            ],
          ),
          renderRestorePanel(state, controller, "fw-backup-restore"),
        ]),
      ]
    : [statusLine("세계를 불러오는 중…")];
  return renderLayout(state, controller, {
    title: "저장·백업",
    back: { route: "settings", label: "설정" },
    showWorldBar: false,
    body,
  });
}
