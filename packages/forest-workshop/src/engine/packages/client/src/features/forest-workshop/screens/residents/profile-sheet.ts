// 프로필 (board 03-1 → 프로필): the resident's 원래 설정 (the source as it was read at registration) beside the
// 공방 세계 설정, which can be edited here, and the 변경 이력 (plan §10 P2: 변경 이력, 원본 비교). The source card itself
// is never changed.
import type { AppState, Controller } from "../../app/controller";
import { button, h } from "../../app/dom";
import type { ResidentChange, WorldView } from "../../app/types";
import { ICONS } from "../chrome/icons";
import { pagePicker } from "../chrome/page-picker";
import { kindTag } from "./resident-figure";

const CHANGE_LABEL: Record<string, string> = {
  registered: "등록",
  setting: "세계 설정 수정",
  name: "이름 수정",
  recruited: "영입",
  image: "그림 등록",
  image_restored: "이전 그림으로",
  image_history_cleared: "그림 이력 정리",
  placement: "배치 변경",
};

function formatTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function sourceBlock(label: string, text: string) {
  return text ? h("div", { className: "source-field" }, [h("strong", { text: label }), h("p", { text })]) : null;
}

function changeRow(change: ResidentChange) {
  return h("li", { className: "change-row" }, [
    h("span", { className: "change-kind", text: CHANGE_LABEL[change.kind] ?? change.kind }),
    h("span", { className: "change-detail", text: change.detail }),
    h("time", { className: "change-time", text: formatTime(change.at), attrs: { datetime: change.at } }),
  ]);
}

export function renderProfileSheet(world: WorldView, state: AppState, controller: Controller, residentId: string) {
  const resident = world.state.residents[residentId];
  if (!resident) return null;
  const max = state.content?.residents.worldSettingMax ?? 200;
  const busy = Boolean(state.busy[`resident-setting:${residentId}`]);
  const profile = state.sheet?.kind === "profile" && state.sheet.residentId === residentId ? state.sheet : null;
  const draft = profile?.draft ?? resident.worldSetting;
  const counter = h("span", { className: "counter-text", text: `${draft.length} / ${max}` });
  const textarea = h("textarea", {
    className: "textarea",
    attrs: { id: "fw-profile-setting", maxlength: String(max), rows: "4", "aria-describedby": "fw-profile-count" },
    on: {
      input: () => {
        counter.textContent = `${textarea.value.length} / ${max}`;
        controller.rememberProfile({ draft: textarea.value });
      },
    },
  });
  textarea.value = draft;
  counter.id = "fw-profile-count";
  const { source } = resident;
  const original = h("div", { className: "compare-box source" }, [
    h("h3", { className: "compare-title" }, [ICONS.document("icon"), "원래 설정"]),
    h("p", {
      className: "muted",
      text: `${source.name} · ${formatTime(source.takenAt)}에 읽음 · 원본은 바뀌지 않아요`,
    }),
    sourceBlock("설명", source.description),
    sourceBlock("성격", source.personality),
    sourceBlock("상황", source.scenario),
    !source.description && !source.personality && !source.scenario
      ? h("p", { className: "muted", text: "원본에 적힌 설명이 없어요." })
      : null,
  ]);
  const worldPanel = h("div", { className: "profile-panel" }, [
    h(
      "form",
      {
        className: "compare-box world",
        on: {
          submit: (event) => {
            event.preventDefault();
            if (textarea.value.trim() && textarea.value !== resident.worldSetting) {
              void controller.updateWorldSetting(residentId, textarea.value);
            }
          },
        },
      },
      [
        h("label", { className: "compare-title", attrs: { for: "fw-profile-setting" } }, [
          ICONS.leaf("icon"),
          "공방 세계 설정",
        ]),
        textarea,
        counter,
        h("button", {
          className: "button small",
          text: busy ? "저장 중…" : "수정 저장",
          attrs: { type: "submit" },
          disabled: busy,
        }),
      ],
    ),
  ]);
  const sourcePanel = h("div", { className: "profile-panel" }, [original]);
  const historyList = h("ol", { className: "change-list" });
  const historyCount = Math.max(1, Math.ceil(resident.changes.length / 2));
  let historyPage = Math.min(profile?.historyPage ?? 0, historyCount - 1);

  function showHistory(page: number) {
    historyPage = Math.max(0, Math.min(historyCount - 1, page));
    controller.rememberProfile({ historyPage });
    historyList.replaceChildren(...resident.changes.slice(historyPage * 2, historyPage * 2 + 2).map(changeRow));
  }
  showHistory(historyPage);
  const historyPanel = h("div", { className: "profile-panel" }, [
    h("h3", { className: "subhead", text: "변경 이력" }),
    resident.changes.length ? historyList : h("p", { className: "muted", text: "아직 변경 이력이 없어요." }),
    pagePicker(
      "변경 이력 고르기",
      historyPage,
      Array.from(
        { length: historyCount },
        (_, index) =>
          `${index + 1} · ${resident.changes
            .slice(index * 2, index * 2 + 2)
            .map((change) => CHANGE_LABEL[change.kind] ?? change.kind)
            .join(" · ")}`,
      ),
      showHistory,
    ),
  ]);
  const panels = [worldPanel, sourcePanel, historyPanel];
  const tabs = ["공방 설정", "원래 설정", "변경 이력"].map((label, index) =>
    h("button", {
      className: "profile-tab",
      text: label,
      attrs: { type: "button", "aria-pressed": index === 0 ? "true" : "false" },
      on: {
        click: () => {
          controller.rememberProfile({ panel: index });
          selectPanel(index);
        },
      },
    }),
  );
  function selectPanel(selected: number) {
    panels.forEach((panel, index) => (panel.hidden = index !== selected));
    tabs.forEach((tab, index) => tab.setAttribute("aria-pressed", index === selected ? "true" : "false"));
  }
  selectPanel(profile?.panel ?? 0);
  return h("div", { className: "sheet-backdrop" }, [
    h(
      "section",
      { className: "sheet card", attrs: { role: "dialog", "aria-modal": "true", "aria-labelledby": "fw-profile" } },
      [
        h("div", { className: "sheet-head" }, [
          h("h2", { className: "section-title", text: `${resident.displayName} 프로필`, attrs: { id: "fw-profile" } }),
          kindTag(resident),
          button("닫기", () => controller.closeSheet(), { variant: "secondary" }),
        ]),
        h("div", { className: "profile-tabs", attrs: { "aria-label": "프로필 내용 선택" } }, tabs),
        ...panels,
      ],
    ),
  ]);
}
