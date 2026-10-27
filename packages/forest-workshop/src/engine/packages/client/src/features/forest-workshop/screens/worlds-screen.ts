// World list, new world and restore. Shown first when no world is open; reached later from 저장·백업 → 다른 세계.
// The mockups have no board for it, so it uses the framed (wood) style of 설정 with the same cards and rows.
import type { AppState, Controller } from "../app/controller";
import { button, errorLine, h, statusLine } from "../app/dom";
import { card, renderFrame } from "./chrome/frame";
import { ICONS } from "./chrome/icons";
import { renderRestorePanel } from "./settings/restore-panel";

const NAME_LIMIT = { world: 40, nickname: 24 };

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function worldList(state: AppState, controller: Controller) {
  const section = card("내 세계", [], { id: "fw-worlds" });
  const { worlds } = state;
  if (worlds.state === "loading") section.append(statusLine("불러오는 중…"));
  else if (worlds.state === "error") {
    section.append(
      errorLine(worlds.message),
      button("다시 시도", () => void controller.loadWorlds(), { variant: "secondary" }),
    );
  } else if (worlds.value.length === 0) {
    section.append(h("p", { className: "empty", text: "아직 세계가 없습니다. 아래에서 새로 만들어 주세요." }));
  } else {
    section.append(
      h(
        "ul",
        { className: "menu-list" },
        worlds.value.map((world) =>
          h("li", {}, [
            h(
              "button",
              {
                className: "menu-row",
                attrs: { type: "button" },
                disabled: !world.readable,
                on: { click: () => void controller.openWorld(world.worldId) },
              },
              [
                h("span", { className: "menu-icon" }, [ICONS.house()]),
                h("span", { className: "menu-text" }, [
                  h("span", { className: "menu-title", text: world.worldName }),
                  h("span", {
                    className: "menu-detail",
                    text: world.readable
                      ? `마지막 저장 ${formatDate(world.updatedAt)}`
                      : "이 버전에서 읽을 수 없는 세계",
                  }),
                ]),
                h("span", { className: "menu-chevron" }, [ICONS.chevron()]),
              ],
            ),
          ]),
        ),
      ),
    );
  }
  return section;
}

function createForm(state: AppState, controller: Controller) {
  const busy = Boolean(state.busy["create-world"]);
  const worldName = h("input", {
    className: "input",
    attrs: {
      id: "fw-world-name",
      name: "worldName",
      maxlength: String(NAME_LIMIT.world),
      autocomplete: "off",
      required: "",
    },
  });
  const nickname = h("input", {
    className: "input",
    attrs: {
      id: "fw-nickname",
      name: "playerNickname",
      maxlength: String(NAME_LIMIT.nickname),
      autocomplete: "off",
      required: "",
    },
  });
  const form = h(
    "form",
    {
      className: "card form",
      attrs: { "aria-labelledby": "fw-create" },
      on: {
        submit: (event) => {
          event.preventDefault();
          if (!worldName.value.trim() || !nickname.value.trim()) return;
          void controller.createWorld(worldName.value, nickname.value);
        },
      },
    },
    [
      h("h2", { className: "section-title", text: "새 세계 만들기", attrs: { id: "fw-create" } }),
      h("p", {
        className: "muted",
        text: "플레이어는 외형 없이 닉네임으로만 등장합니다. 둘 다 나중에 설정에서 바꿀 수 있습니다.",
      }),
      h("label", { className: "field-label", text: "세계 이름", attrs: { for: "fw-world-name" } }),
      worldName,
      h("label", { className: "field-label", text: "내 닉네임", attrs: { for: "fw-nickname" } }),
      nickname,
      h("button", {
        className: "button",
        text: busy ? "만드는 중…" : "만들기",
        attrs: { type: "submit" },
        disabled: busy,
      }),
    ],
  );
  return form;
}

export function renderWorldsScreen(state: AppState, controller: Controller) {
  const open = state.world?.state === "ready";
  return renderFrame(state, controller, {
    top: open
      ? { kind: "sub", title: "세계 고르기", back: { route: "backup", label: "저장·백업" }, resources: false }
      : { kind: "sub", title: "숲결 공방", resources: false },
    backdrop: "wood",
    body: [
      worldList(state, controller),
      createForm(state, controller),
      card("백업에서 복원", [renderRestorePanel(state, controller, "fw-worlds-restore")], {
        id: "fw-worlds-restore-title",
        className: "menu",
      }),
    ],
    nav: false,
  });
}
