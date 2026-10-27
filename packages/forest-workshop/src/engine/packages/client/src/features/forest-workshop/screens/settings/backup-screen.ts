// 저장·백업 (board 05-2): 저장 완료 with the last save time, 저장 공간 사용량 (주민 그림 · 배경 · 기록), 백업 내보내기 ·
// 백업 불러오기 with the restore preview, and 그림 이력 정리. Below the mockup's content, two rows the mockup does not
// draw but restore needs: 다른 세계 (restore always creates one) and 연결 점검.
import type { AppState, Controller, Route } from "../../app/controller";
import { button, errorLine, h, statusLine } from "../../app/dom";
import type { StorageUsage, WorldState } from "../../app/types";
import { card, renderFrame } from "../chrome/frame";
import { ICONS, type IconFactory } from "../chrome/icons";
import { renderRestorePanel } from "./restore-panel";

function formatSavedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "알 수 없음";
  const time = new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
  return date.toDateString() === new Date().toDateString()
    ? `오늘 ${time}`
    : `${new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric" }).format(date)} ${time}`;
}

export function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

function usageCard(state: AppState) {
  const usage = state.storage;
  let content;
  if (!usage || usage.state === "loading") content = statusLine("확인하는 중…");
  else if (usage.state === "error") content = errorLine(usage.message);
  else {
    const rows: Array<[IconFactory, string, keyof StorageUsage]> = [
      [ICONS.image, "주민 그림", "residentImagesBytes"],
      [ICONS.landscape, "배경", "backgroundsBytes"],
      [ICONS.document, "기록", "recordsBytes"],
    ];
    const largest = Math.max(1, ...rows.map(([, , key]) => usage.value[key]));
    content = h(
      "div",
      { className: "usage-rows" },
      rows.map(([icon, label, key]) => {
        const bytes = usage.value[key];
        const bar = h("span", { className: "usage-fill" });
        // A visible sliver for any non-zero size; nothing for zero.
        bar.style.width = bytes > 0 ? `max(0.9em, ${Math.round((bytes / largest) * 100)}%)` : "0";
        return h("div", { className: "usage-row" }, [
          icon("icon"),
          h("span", { className: "usage-label", text: label }),
          h("span", { className: "usage-bar", attrs: { role: "presentation" } }, [bar]),
          h("span", { className: "usage-size", text: formatSize(bytes) }),
        ]);
      }),
    );
  }
  return card(
    "저장 공간 사용량",
    [content, h("p", { className: "hint center" }, [ICONS.info("icon"), "그림은 WebP로 보관해요."])],
    { id: "fw-usage" },
  );
}

function exportRow(state: AppState, controller: Controller) {
  const busy = Boolean(state.busy.backup);
  return h(
    "button",
    {
      className: "menu-row",
      attrs: { type: "button" },
      disabled: busy,
      on: { click: () => void controller.downloadBackup() },
    },
    [
      h("span", { className: "menu-icon" }, [ICONS.upload()]),
      h("span", { className: "menu-text" }, [
        h("span", { className: "menu-title", text: busy ? "백업 만드는 중…" : "백업 내보내기" }),
        h("span", { className: "menu-detail", text: "세계 · 재화 · 창고 포함 · 비밀키 제외" }),
      ]),
      h("span", { className: "menu-chevron" }, [ICONS.chevron()]),
    ],
  );
}

function secondaryRow(controller: Controller, route: Route, icon: IconFactory, title: string, detail: string) {
  return h(
    "button",
    { className: "menu-row quiet", attrs: { type: "button" }, on: { click: () => controller.navigate(route) } },
    [
      h("span", { className: "menu-icon quiet" }, [icon()]),
      h("span", { className: "menu-text" }, [
        h("span", { className: "menu-title", text: title }),
        h("span", { className: "menu-detail", text: detail }),
      ]),
      h("span", { className: "menu-chevron" }, [ICONS.chevron()]),
    ],
  );
}

export function renderBackupScreen(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  const body = world
    ? [
        h("section", { className: "card saved", attrs: { "aria-label": "저장 상태" } }, [
          h("p", { className: "saved-title" }, [h("span", { className: "check" }, [ICONS.check()]), "저장 완료"]),
          h("p", { className: "saved-time", text: `마지막 저장 ${formatSavedAt(world.updatedAt)}` }),
        ]),
        usageCard(state),
        card(null, [exportRow(state, controller), renderRestorePanel(state, controller, "fw-backup-restore")], {
          className: "menu",
        }),
        card(
          null,
          [
            h(
              "button",
              {
                className: "menu-row",
                attrs: { type: "button" },
                on: { click: () => controller.openSheet({ kind: "history-cleanup" }) },
              },
              [
                h("span", { className: "menu-icon light" }, [ICONS.image()]),
                h("span", { className: "menu-text" }, [
                  h("span", { className: "menu-title", text: "그림 이력 정리" }),
                  h("span", { className: "menu-detail", text: "다른 곳에서 쓰는 그림은 유지" }),
                ]),
                h("span", { className: "menu-chevron" }, [ICONS.chevron()]),
              ],
            ),
            secondaryRow(controller, "worlds", ICONS.house, "다른 세계", "세계 고르기 · 새로 만들기"),
            secondaryRow(controller, "diagnostics", ICONS.info, "연결 점검", "엔진 연결과 그림 저장 경로 확인"),
          ],
          { className: "menu" },
        ),
      ]
    : [statusLine("세계를 불러오는 중…")];
  return renderFrame(state, controller, {
    top: { kind: "sub", title: "저장·백업", back: { route: "settings", label: "설정" }, resources: false },
    backdrop: "wood",
    body,
    nav: true,
    sheet:
      world && state.sheet?.kind === "history-cleanup" ? historyCleanupSheet(world.state, state, controller) : null,
  });
}

/** 그림 이력 정리: confirms first, because earlier pictures cannot be brought back afterwards. */
function historyCleanupSheet(world: WorldState, state: AppState, controller: Controller) {
  const count = Object.values(world.residents).reduce((total, resident) => total + resident.image.history.length, 0);
  const bytes = Object.values(world.residents)
    .flatMap((resident) => resident.image.history)
    .reduce((total, image) => total + image.bytes, 0);
  const busy = Boolean(state.busy["image-history-clear"]);
  return h("div", { className: "sheet-backdrop" }, [
    h(
      "section",
      {
        className: "sheet card",
        attrs: { role: "dialog", "aria-modal": "true", "aria-labelledby": "fw-history-cleanup" },
      },
      [
        h("h2", { className: "section-title", text: "그림 이력 정리", attrs: { id: "fw-history-cleanup" } }),
        count
          ? h("p", {
              text: `주민들의 이전 그림 ${count}장(${formatSize(bytes)})을 정리해요. 지금 쓰는 그림은 그대로이고, 정리한 그림은 '이전 그림'에서 되돌릴 수 없어요.`,
            })
          : h("p", { className: "empty", text: "정리할 이전 그림이 없어요." }),
        h("p", { className: "hint", text: "다른 곳에서 쓰는 그림 파일은 갤러리에 그대로 남아요." }),
        count
          ? button(busy ? "정리하는 중…" : `${count}장 정리하기`, () => void controller.clearImageHistory(), {
              disabled: busy,
              attrs: { "data-wide": "" },
            })
          : null,
        button("닫기", () => controller.closeSheet(), { variant: "secondary", attrs: { "data-wide": "" } }),
      ],
    ),
  ]);
}
