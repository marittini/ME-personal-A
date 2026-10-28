// 초대 (board 03-3): the sign with 새로운 인연을 맞이해요, 초대권 (+ → 초대권 받기) and 종표 at the top; 주민 초대 ·
// 종표 교환 tabs; the envelope; 희망 주민 설정; 1회 초대 · 10회 초대 with the shortage note; 확률 보기 · 초대 기록; and
// the 종표 교환 card (n / 5 · 원하는 주민 선택). [종표 교환] lists the registered residents to choose from.
// Every registered resident has the same chance (no grades); the server rolls and decides (plan §7.2-F).
import type { AppState, Controller } from "../../app/controller";
import { button, h, statusLine } from "../../app/dom";
import type { GameContent, Resident, WorldView } from "../../app/types";
import { card, renderFrame } from "../chrome/frame";
import { ICONS } from "../chrome/icons";
import { kindTag, residentAvatar } from "../residents/resident-figure";
import { renderInviteSheet } from "./invite-sheets";

export function inviteCounters(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  if (!world) return null;
  const { tickets, tokens } = world.state.wallet;
  return h("div", { className: "resources invite-counters" }, [
    h(
      "button",
      {
        className: "counter ticket",
        attrs: { type: "button", "aria-label": `초대권 ${tickets}장 — 초대권 받기` },
        on: { click: () => controller.openDeliveries() },
      },
      [
        h("span", { className: "ticket-mark" }, [ICONS.ticket("icon")]),
        h("span", { className: "counter-value", text: String(tickets) }),
        h("span", { className: "counter-plus" }, [ICONS.plus("icon tiny")]),
      ],
    ),
    h("span", { className: "counter token", attrs: { "aria-label": `종표 ${tokens}개` } }, [
      h("span", { className: "token-mark" }, [ICONS.leaf("icon")]),
      h("span", { className: "counter-value", text: String(tokens) }),
    ]),
  ]);
}

function tabs(state: AppState, controller: Controller) {
  const tab = (id: AppState["inviteTab"], label: string, icon: SVGSVGElement) =>
    h(
      "button",
      {
        className: `segment${state.inviteTab === id ? " selected" : ""}`,
        attrs: { type: "button", role: "tab", "aria-selected": state.inviteTab === id ? "true" : "false" },
        on: { click: () => controller.setInviteTab(id) },
      },
      [icon, h("span", { text: label })],
    );
  return h("div", { className: "segmented invite-tabs", attrs: { role: "tablist", "aria-label": "초대" } }, [
    tab("invite", "주민 초대", ICONS.sprout("icon")),
    tab("exchange", "종표 교환", ICONS.leaf("icon")),
  ]);
}

function drawButton(state: AppState, world: WorldView, content: GameContent, count: number, controller: Controller) {
  const cost = count * content.invite.ticketsPerDraw;
  const missing = Math.max(0, cost - world.state.wallet.tickets);
  const empty = Object.keys(world.state.residents).length === 0;
  const busy = Boolean(state.busy[`invite:${count}`]);
  return h(
    "button",
    {
      className: `draw-button${missing ? " short" : ""}`,
      attrs: {
        type: "button",
        "aria-label": `${count}회 초대 — 초대권 ${cost}장${missing ? `, ${missing}장 부족` : ""}`,
      },
      disabled: busy || missing > 0 || empty || world.state.progress.starterResidentId === null,
      on: { click: () => void controller.draw(count) },
    },
    [
      h("strong", { className: "draw-title", text: busy ? "초대하는 중…" : `${count}회 초대` }),
      h("span", { className: "draw-cost" }, [ICONS.ticket("icon"), `${cost}장`]),
      missing ? h("span", { className: "draw-short" }, [ICONS.info("icon tiny"), `초대권 ${missing}장 부족`]) : null,
    ],
  );
}

function inviteBody(state: AppState, world: WorldView, content: GameContent, controller: Controller) {
  const residents = Object.values(world.state.residents);
  const wish = world.state.invite.wishResidentId ? world.state.residents[world.state.invite.wishResidentId] : null;
  const waiting = residents.filter((resident) => !resident.recruited).length;
  const guaranteeIn = content.invite.guaranteeAfter - world.state.invite.sinceNew + 1;
  const tokens = world.state.wallet.tokens;
  const need = content.invite.tokensPerExchange;
  return [
    card(null, [
      h(
        "button",
        {
          className: "menu-row wish-row",
          attrs: { type: "button" },
          on: { click: () => controller.openSheet({ kind: "invite-wish" }) },
        },
        [
          h("span", { className: "menu-icon light" }, [ICONS.sprout("icon")]),
          h("span", { className: "menu-text" }, [
            h("span", { className: "menu-title", text: "희망 주민 설정" }),
            h("span", {
              className: "menu-detail",
              text: wish ? `${wish.displayName} · 다른 주민보다 잘 만나요` : "등록된 캐릭터·페르소나 중에서 만나요.",
            }),
          ]),
          h("span", { className: "menu-chevron" }, [ICONS.chevron()]),
        ],
      ),
      residents.length === 0
        ? h("div", { className: "invite-empty" }, [
            h("p", { className: "empty", text: "초대할 주민이 없어요. 먼저 캐릭터나 페르소나를 불러와 주세요." }),
            button("주민 불러오기", () => controller.navigate("residents")),
          ])
        : world.state.progress.starterResidentId === null
          ? h("div", { className: "invite-empty" }, [
              h("p", { className: "empty", text: "시작 주민을 먼저 정하면 초대할 수 있어요." }),
              button("주민 화면으로", () => controller.navigate("residents")),
            ])
          : null,
      h("div", { className: "draw-row" }, [
        drawButton(state, world, content, 1, controller),
        drawButton(state, world, content, content.invite.multiDraw, controller),
      ]),
      h("p", {
        className: "hint center",
        text:
          residents.length === 0
            ? "등록한 주민 중에서 새로운 인연을 만날 수 있어요."
            : waiting > 0
              ? `아직 오지 않은 주민 ${waiting}명 · 늦어도 ${Math.max(1, guaranteeIn)}번째 초대에는 새 주민을 만나요.`
              : "모두 공방에 왔어요. 다시 만나면 돌파, 최대 돌파 뒤에는 종표가 돼요.",
      }),
      h("div", { className: "link-row" }, [
        h(
          "button",
          {
            className: "link-button with-icon",
            attrs: { type: "button" },
            on: { click: () => controller.openSheet({ kind: "invite-chances" }) },
          },
          [ICONS.info("icon"), h("span", { text: "확률 보기" })],
        ),
        h(
          "button",
          {
            className: "link-button with-icon",
            attrs: { type: "button" },
            on: { click: () => controller.openSheet({ kind: "invite-log" }) },
          },
          [ICONS.document("icon"), h("span", { text: "초대 기록" })],
        ),
      ]),
    ]),
    card(null, [
      h(
        "button",
        {
          className: "exchange-card",
          attrs: { type: "button", "aria-label": `종표 교환 ${tokens} / ${need} — 원하는 주민 선택` },
          on: { click: () => controller.setInviteTab("exchange") },
        },
        [
          h("span", { className: "token-coin big" }, [ICONS.leaf("icon big")]),
          h("span", { className: "exchange-count" }, [
            h("strong", { text: "종표 교환" }),
            h("span", { className: "count-pill", text: `${tokens} / ${need}` }),
          ]),
          h("span", { className: "exchange-text" }, [
            h("strong", {}, [ICONS.people("icon"), " 원하는 주민 선택"]),
            h("span", { className: "muted", text: "최대 돌파 이후 중복은 종표로." }),
          ]),
          h("span", { className: "menu-chevron" }, [ICONS.chevron()]),
        ],
      ),
    ]),
  ];
}

function exchangeRow(
  state: AppState,
  resident: Resident,
  content: GameContent,
  tokens: number,
  controller: Controller,
) {
  const max = content.crew.maxBreakthrough;
  const maxed = resident.recruited && resident.breakthrough >= max;
  const busy = Boolean(state.busy[`exchange:${resident.residentId}`]);
  const status = !resident.recruited
    ? "초대 대기 → 영입"
    : maxed
      ? "최대 돌파"
      : `돌파 ${resident.breakthrough}/${max} → ${resident.breakthrough + 1}`;
  return h("li", { className: "exchange-row" }, [
    residentAvatar(resident),
    h("span", { className: "exchange-name" }, [
      h("strong", { text: resident.displayName }),
      h("span", { className: "tag-row" }, [kindTag(resident), h("small", { className: "muted", text: status })]),
    ]),
    h("button", {
      className: "button small",
      text: busy ? "교환 중…" : "교환",
      attrs: { type: "button", "aria-label": `${resident.displayName}와(과) 종표 교환` },
      disabled: busy || maxed || tokens < content.invite.tokensPerExchange,
      on: { click: () => void controller.exchange(resident.residentId) },
    }),
  ]);
}

function exchangeBody(state: AppState, world: WorldView, content: GameContent, controller: Controller) {
  const tokens = world.state.wallet.tokens;
  const residents = Object.values(world.state.residents).sort(
    (a, b) => Number(a.recruited) - Number(b.recruited) || a.displayName.localeCompare(b.displayName, "ko"),
  );
  const count = Math.max(1, Math.ceil(residents.length / 2));
  const page = Math.min(state.invitePage ?? 0, count - 1);
  return [
    card("종표 교환", [
      h("p", { className: "exchange-summary" }, [
        h("span", { className: "token-coin" }, [ICONS.leaf("icon")]),
        h("strong", { text: `${tokens} / ${content.invite.tokensPerExchange}` }),
        h("span", {
          className: "muted",
          text: ` 종표 ${content.invite.tokensPerExchange}개로 원하는 주민을 바로 맞이하거나 돌파해요.`,
        }),
      ]),
      residents.length === 0
        ? h("p", { className: "empty", text: "등록된 주민이 없어요." })
        : h(
            "ul",
            { className: "exchange-list" },
            residents
              .slice(page * 2, page * 2 + 2)
              .map((resident) => exchangeRow(state, resident, content, tokens, controller)),
          ),
      count > 1
        ? h("div", { className: "resident-pages" }, [
            button("이전", () => controller.setInvitePage(page - 1), { variant: "secondary", disabled: page === 0 }),
            h("span", { text: `${page + 1} / ${count}`, attrs: { "aria-live": "polite" } }),
            button("다음", () => controller.setInvitePage(page + 1), {
              variant: "secondary",
              disabled: page + 1 >= count,
            }),
          ])
        : null,
    ]),
  ];
}

export function renderInviteScreen(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  const content = state.content;
  const ready = world && content;
  return renderFrame(state, controller, {
    top: {
      kind: "sub",
      title: "초대",
      subtitle: "새로운 인연을 맞이해요",
      resources: false,
      counters: inviteCounters(state, controller),
    },
    backdrop: "forest",
    body: ready
      ? [
          tabs(state, controller),
          ...(state.inviteTab === "invite"
            ? inviteBody(state, world, content, controller)
            : exchangeBody(state, world, content, controller)),
        ]
      : [statusLine("세계를 불러오는 중…")],
    nav: true,
    sheet: ready ? renderInviteSheet(state, world, content, controller) : null,
  });
}
