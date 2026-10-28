// The sheets of 초대 (board 03-3): the result of a draw or exchange, 확률 보기, 초대 기록 and 희망 주민 설정.
// 확률 보기 shows the chances from the server's rules: every registered resident weighs the same, the wished one more,
// and the guarantee after a run without a new resident.
import type { AppState, Controller } from "../../app/controller";
import { button, h } from "../../app/dom";
import type { DrawResult, GameContent, WorldView } from "../../app/types";
import { ICONS } from "../chrome/icons";
import { sheetDialog } from "../chrome/sheet";
import { kindTag, residentAvatar, residentFigure } from "../residents/resident-figure";

const OUTCOME_LABEL = { new: "새 주민", breakthrough: "돌파", token: "종표" } as const;

function outcomeText(draw: DrawResult, max: number) {
  if (draw.outcome === "new") return "공방에 왔어요!";
  if (draw.outcome === "breakthrough") return `돌파 ${draw.breakthrough}/${max}`;
  return "최대 돌파라 종표 1개가 됐어요";
}

function closeButton(controller: Controller) {
  return button("닫기", () => controller.closeSheet(), { variant: "secondary", attrs: { "data-wide": "" } });
}

function pagedRows(state: AppState, controller: Controller, rows: HTMLElement[], listClass: string, ordered = false) {
  const sheet = state.sheet;
  const current =
    sheet &&
    (sheet.kind === "invite-result" ||
      sheet.kind === "invite-chances" ||
      sheet.kind === "invite-log" ||
      sheet.kind === "invite-wish")
      ? (sheet.page ?? 0)
      : 0;
  const count = Math.max(1, Math.ceil(rows.length / 2));
  const page = Math.min(current, count - 1);
  return h("div", { className: "paged-rows" }, [
    h(ordered ? "ol" : "ul", { className: listClass }, rows.slice(page * 2, page * 2 + 2)),
    count > 1
      ? h("div", { className: "resident-pages" }, [
          button("이전", () => controller.setInviteSheetPage(page - 1), { variant: "secondary", disabled: page === 0 }),
          h("span", { text: `${page + 1} / ${count}`, attrs: { "aria-live": "polite" } }),
          button("다음", () => controller.setInviteSheetPage(page + 1), {
            variant: "secondary",
            disabled: page + 1 >= count,
          }),
        ])
      : null,
  ]);
}

function resultSheet(
  state: AppState,
  world: WorldView,
  content: GameContent,
  draws: DrawResult[],
  controller: Controller,
) {
  const single = draws.length === 1 ? draws[0]! : null;
  const resident = single ? world.state.residents[single.residentId] : null;
  return sheetDialog("fw-invite-result", draws.length > 1 ? `${draws.length}회 초대 결과` : "초대 결과", [
    single && resident
      ? h("div", { className: "result-hero" }, [
          h("span", { className: "result-stage" }, [residentFigure(resident)]),
          h("strong", { className: "result-name", text: resident.displayName }),
          h("span", { className: `result-badge ${single.outcome}`, text: OUTCOME_LABEL[single.outcome] }),
          h("p", { className: "muted", text: outcomeText(single, content.crew.maxBreakthrough) }),
        ])
      : pagedRows(
          state,
          controller,
          draws.map((draw) => {
            const who = world.state.residents[draw.residentId];
            return h("li", { className: `result-row ${draw.outcome}` }, [
              residentAvatar(who ?? null),
              h("strong", { text: who?.displayName ?? "주민" }),
              h("span", { className: `result-badge ${draw.outcome}`, text: OUTCOME_LABEL[draw.outcome] }),
              h("small", {
                className: "muted",
                text: `${outcomeText(draw, content.crew.maxBreakthrough)}${draw.via === "guarantee" ? " · 보장" : ""}`,
              }),
            ]);
          }),
          "result-list",
          true,
        ),
    closeButton(controller),
  ]);
}

function chancesSheet(state: AppState, world: WorldView, content: GameContent, controller: Controller) {
  const ids = Object.keys(world.state.residents).sort();
  const wish = world.state.invite.wishResidentId;
  const weight = (id: string) => (id === wish ? content.invite.wishWeight : content.invite.baseWeight);
  const total = ids.reduce((sum, id) => sum + weight(id), 0);
  return sheetDialog("fw-invite-chances", "확률 보기", [
    h("p", {
      className: "muted",
      text: `등록된 주민은 모두 같은 확률이에요(등급 없음). 희망 주민은 ${content.invite.wishWeight}배로 만나요. 새 주민 없이 ${content.invite.guaranteeAfter}번이 지나면 다음 초대는 아직 오지 않은 주민이에요(희망 주민이 기다리면 그 주민). 10회 초대는 한 번씩 차례로 적용돼요.`,
    }),
    ids.length === 0
      ? h("p", { className: "empty", text: "등록된 주민이 없어요." })
      : pagedRows(
          state,
          controller,
          ids.map((id) => {
            const resident = world.state.residents[id]!;
            const chance = total ? (weight(id) / total) * 100 : 0;
            return h("li", { className: "chance-row" }, [
              residentAvatar(resident),
              h("span", { className: "chance-name" }, [
                h("strong", { text: resident.displayName }),
                id === wish ? h("span", { className: "tag wish", text: "희망" }) : null,
              ]),
              h("strong", { className: "chance-value", text: `${chance.toFixed(chance < 10 ? 2 : 1)}%` }),
            ]);
          }),
          "chance-list",
        ),
    h("p", {
      className: "muted",
      text: `처음 만나면 영입, 다시 만나면 돌파(최대 ${content.crew.maxBreakthrough}), 최대 돌파 뒤에는 종표 1개. 종표 ${content.invite.tokensPerExchange}개로 원하는 주민을 고를 수 있어요.`,
    }),
    closeButton(controller),
  ]);
}

function logSheet(state: AppState, world: WorldView, content: GameContent, controller: Controller) {
  const log = world.state.invite.log;
  const formatter = new Intl.DateTimeFormat("ko-KR", { dateStyle: "short", timeStyle: "short" });
  return sheetDialog("fw-invite-log", "초대 기록", [
    log.length === 0
      ? h("p", { className: "empty", text: "아직 초대 기록이 없어요." })
      : pagedRows(
          state,
          controller,
          log.map((entry) =>
            h("li", { className: `result-row ${entry.outcome}` }, [
              residentAvatar(world.state.residents[entry.residentId] ?? null),
              h("strong", { text: world.state.residents[entry.residentId]?.displayName ?? entry.name }),
              h("span", { className: `result-badge ${entry.outcome}`, text: OUTCOME_LABEL[entry.outcome] }),
              h("small", {
                className: "muted",
                text: `${formatter.format(new Date(entry.at))}${entry.via === "guarantee" ? " · 보장" : entry.via === "exchange" ? " · 종표 교환" : ""}${entry.outcome === "breakthrough" ? ` · 돌파 ${entry.breakthrough}/${content.crew.maxBreakthrough}` : ""}`,
              }),
            ]),
          ),
          "result-list",
          true,
        ),
    h("p", { className: "muted", text: `최근 ${content.invite.logLimit}건까지 보관해요.` }),
    closeButton(controller),
  ]);
}

function wishSheet(state: AppState, world: WorldView, controller: Controller) {
  const current = world.state.invite.wishResidentId;
  const busy = Boolean(state.busy["invite-wish"]);
  const residents = Object.values(world.state.residents).sort((a, b) =>
    a.displayName.localeCompare(b.displayName, "ko"),
  );
  return sheetDialog("fw-invite-wish", "희망 주민 설정", [
    h("p", { className: "muted", text: "등록된 캐릭터·페르소나 중 한 명을 고르면 그 주민을 더 잘 만나요." }),
    residents.length === 0
      ? h("p", { className: "empty", text: "등록된 주민이 없어요." })
      : pagedRows(
          state,
          controller,
          residents.map((resident) =>
            h("li", {}, [
              h(
                "button",
                {
                  className: `pick-row${resident.residentId === current ? " selected" : ""}`,
                  attrs: { type: "button", "aria-pressed": resident.residentId === current ? "true" : "false" },
                  disabled: busy,
                  on: { click: () => void controller.setWish(resident.residentId) },
                },
                [
                  residentAvatar(resident),
                  h("strong", { text: resident.displayName }),
                  kindTag(resident),
                  h("small", { className: "muted", text: resident.recruited ? "영입 완료" : "초대 대기" }),
                  resident.residentId === current ? ICONS.check("icon") : null,
                ],
              ),
            ]),
          ),
          "pick-list",
        ),
    current
      ? button("희망 주민 해제", () => void controller.setWish(null), { variant: "secondary", disabled: busy })
      : null,
    closeButton(controller),
  ]);
}

export function renderInviteSheet(state: AppState, world: WorldView, content: GameContent, controller: Controller) {
  const sheet = state.sheet;
  if (!sheet) return null;
  if (sheet.kind === "invite-result") return resultSheet(state, world, content, sheet.draws, controller);
  if (sheet.kind === "invite-chances") return chancesSheet(state, world, content, controller);
  if (sheet.kind === "invite-log") return logSheet(state, world, content, controller);
  if (sheet.kind === "invite-wish") return wishSheet(state, world, controller);
  return null;
}
