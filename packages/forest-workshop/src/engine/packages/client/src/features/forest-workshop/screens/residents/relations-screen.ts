// 관계 (board 03-2): sign + ribbon, the shared resident with "A–B · A–C" and "두 관계는 같은 세계에서 이어져요", one
// row per pair (both faces, 현재 관계, 최근 사건, 기억 보기, 지침 관리), the note "페어 지정은 연인 선언이 아니에요.",
// 페어 추가 and 변경 · 보관.
// Real now: the rows, 현재 관계 (from the pair's familiarity), 최근 사건 (none until stories, P4), 페어 추가 and
// 변경 · 보관 (archive and restore). 기억 보기 and 지침 관리 open with memory and guidelines (P4), locked in place.
import type { AppState, Controller } from "../../app/controller";
import { button, h, statusLine } from "../../app/dom";
import type { GameContent, Pair, Resident, WorldView } from "../../app/types";
import { card, renderFrame } from "../chrome/frame";
import { ICONS } from "../chrome/icons";
import { featureButton } from "../chrome/locked";
import { KIND_LABEL, kindTag, residentAvatar } from "./resident-figure";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function stageLabel(content: GameContent | null, familiarity: number) {
  const stages = content?.relationStages ?? [];
  return [...stages].reverse().find((stage) => familiarity >= stage.from)?.label ?? "–";
}

function partnerOf(pair: Pair, resident: Resident, world: WorldView) {
  const partnerId = resident.kind === "character" ? pair.personaResidentId : pair.characterResidentId;
  return world.state.residents[partnerId] ?? null;
}

function hero(resident: Resident, pairs: Pair[]) {
  const letters = pairs.map((_, index) => `A–${LETTERS[index + 1] ?? "?"}`).join(" · ");
  return card(
    null,
    [
      h("div", { className: "relation-hero" }, [
        residentAvatar(resident, "large"),
        h("span", { className: "hero-label", text: `공유 주민 · ${resident.displayName}` }),
        h("strong", { className: "hero-pairs", text: pairs.length ? letters : "아직 페어가 없어요" }),
        h("p", {
          className: "hero-note",
          text:
            pairs.length > 1
              ? "두 관계는 같은 세계에서 이어져요"
              : pairs.length === 1
                ? "같은 세계에서 이어지는 관계예요"
                : `${KIND_LABEL[resident.kind === "character" ? "persona" : "character"]} 주민과 페어를 만들 수 있어요`,
        }),
      ]),
    ],
    { className: "hero-card" },
  );
}

function pairRow(
  pair: Pair,
  index: number,
  resident: Resident,
  world: WorldView,
  state: AppState,
  controller: Controller,
) {
  const partner = partnerOf(pair, resident, world);
  const editing = state.relationsEditing;
  const busy = Boolean(state.busy[`pair-archive:${pair.pairId}`]);
  return h("li", { className: "pair-row card" }, [
    h("div", { className: "pair-faces" }, [
      h("span", { className: "pair-letters" }, [
        h("span", { className: "letter", text: "A" }),
        "×",
        h("span", { className: "letter", text: LETTERS[index + 1] ?? "?" }),
      ]),
      h("span", { className: "faces" }, [
        residentAvatar(resident),
        h("span", { className: "times", text: "×" }),
        residentAvatar(partner),
      ]),
      h("span", { className: "partner-name", text: partner?.displayName ?? "알 수 없는 주민" }),
    ]),
    h("div", { className: "pair-info" }, [
      h("div", { className: "relation-now" }, [
        h("small", { text: "현재 관계" }),
        h("strong", { text: stageLabel(state.content, pair.familiarity) }),
      ]),
      h("p", { className: "recent" }, [
        h("span", { className: "recent-label", text: "최근 사건" }),
        h("span", { text: pair.lastEvent?.summary ?? "아직 없어요" }),
      ]),
      editing
        ? h("div", { className: "pair-actions" }, [
            button(busy ? "보관 중…" : "보관", () => void controller.archivePair(pair.pairId), {
              variant: "secondary",
              disabled: busy,
            }),
          ])
        : h("div", { className: "pair-actions" }, [
            featureButton(controller, "pair-memory", {
              className: "outline-button",
              label: "기억 보기",
              children: [ICONS.book("icon"), h("span", { text: "기억 보기" })],
            }),
            featureButton(controller, "pair-guidelines", {
              className: "outline-button",
              label: "지침 관리",
              children: [ICONS.gear("icon"), h("span", { text: "지침 관리" })],
            }),
          ]),
    ]),
  ]);
}

function archivedList(pairs: Pair[], resident: Resident, world: WorldView, state: AppState, controller: Controller) {
  if (pairs.length === 0) return null;
  return card(
    "보관한 페어",
    [
      h(
        "ul",
        { className: "archived-list" },
        pairs.map((pair) => {
          const partner = partnerOf(pair, resident, world);
          const busy = Boolean(state.busy[`pair-restore:${pair.pairId}`]);
          return h("li", { className: "archived-row" }, [
            residentAvatar(partner),
            h("span", { className: "archived-name", text: `${resident.displayName} × ${partner?.displayName ?? "?"}` }),
            button(busy ? "되돌리는 중…" : "되돌리기", () => void controller.restorePair(pair.pairId), {
              variant: "secondary",
              disabled: busy,
            }),
          ]);
        }),
      ),
    ],
    { id: "fw-archived" },
  );
}

function pairAddSheet(resident: Resident, world: WorldView, state: AppState, controller: Controller) {
  const partnerKind = resident.kind === "character" ? "persona" : "character";
  const linked = new Set(
    Object.values(world.state.pairs)
      .filter(
        (pair) => pair.characterResidentId === resident.residentId || pair.personaResidentId === resident.residentId,
      )
      .map((pair) => (resident.kind === "character" ? pair.personaResidentId : pair.characterResidentId)),
  );
  const candidates = Object.values(world.state.residents).filter((other) => other.kind === partnerKind);
  return h("div", { className: "sheet-backdrop" }, [
    h(
      "section",
      { className: "sheet card", attrs: { role: "dialog", "aria-modal": "true", "aria-labelledby": "fw-pair-add" } },
      [
        h("h2", { className: "section-title", text: "페어 추가", attrs: { id: "fw-pair-add" } }),
        h("p", {
          className: "muted",
          text: `${resident.displayName}와(과) 이어질 ${KIND_LABEL[partnerKind]} 주민을 골라 주세요. 지난 기억이 새로 생기지는 않아요.`,
        }),
        candidates.length === 0
          ? h("p", {
              className: "empty",
              text: `${KIND_LABEL[partnerKind]} 주민이 아직 없어요. 주민 불러오기에서 먼저 등록해 주세요.`,
            })
          : h(
              "ul",
              { className: "candidate-list" },
              candidates.map((other) => {
                const already = linked.has(other.residentId);
                const key =
                  resident.kind === "character"
                    ? `pair-add:${resident.residentId}:${other.residentId}`
                    : `pair-add:${other.residentId}:${resident.residentId}`;
                return h("li", {}, [
                  h(
                    "button",
                    {
                      className: "candidate",
                      attrs: { type: "button" },
                      disabled: already || Boolean(state.busy[key]),
                      on: { click: () => void controller.addPair(resident.residentId, other.residentId) },
                    },
                    [
                      residentAvatar(other),
                      h("span", { className: "candidate-name", text: other.displayName }),
                      kindTag(other),
                      h("span", {
                        className: "candidate-state",
                        text: already ? "이미 페어" : state.busy[key] ? "만드는 중…" : "고르기",
                      }),
                    ],
                  ),
                ]);
              }),
            ),
        button("닫기", () => controller.closeSheet(), { variant: "secondary", attrs: { "data-wide": "" } }),
      ],
    ),
  ]);
}

export function renderRelationsScreen(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  const resident = world ? (world.state.residents[state.focusResidentId ?? ""] ?? null) : null;
  const frame = {
    top: {
      kind: "sub" as const,
      title: "관계",
      subtitle: "같은 세계에서 이어지는 관계",
      back: { route: "residents" as const, label: "주민" },
      resources: false,
    },
    backdrop: "forest" as const,
    nav: true,
  };
  if (!world || !resident)
    return renderFrame(state, controller, {
      ...frame,
      body: [statusLine(world ? "주민을 고른 뒤 관계를 열어 주세요." : "세계를 불러오는 중…")],
    });
  const mine = Object.values(world.state.pairs)
    .filter(
      (pair) => pair.characterResidentId === resident.residentId || pair.personaResidentId === resident.residentId,
    )
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const active = mine.filter((pair) => !pair.archived);
  return renderFrame(state, controller, {
    ...frame,
    body: [
      hero(resident, active),
      h(
        "ul",
        { className: "pair-list" },
        active.map((pair, index) => pairRow(pair, index, resident, world, state, controller)),
      ),
      h("p", { className: "notice-strip" }, [
        h("span", { className: "bang", text: "!" }),
        "페어 지정은 연인 선언이 아니에요.",
      ]),
      h("div", { className: "rule-actions" }, [
        h(
          "button",
          {
            className: "button wide-main",
            attrs: { type: "button" },
            on: { click: () => controller.openSheet({ kind: "pair-add", residentId: resident.residentId }) },
          },
          [ICONS.people("icon"), h("span", { text: "페어 추가" })],
        ),
        h(
          "button",
          {
            className: `button secondary${state.relationsEditing ? " pressed" : ""}`,
            attrs: { type: "button", "aria-pressed": state.relationsEditing ? "true" : "false" },
            on: { click: () => controller.toggleRelationsEditing() },
          },
          [ICONS.archive("icon"), h("span", { text: state.relationsEditing ? "변경 끝내기" : "변경 · 보관" })],
        ),
      ]),
      state.relationsEditing
        ? archivedList(
            mine.filter((pair) => pair.archived),
            resident,
            world,
            state,
            controller,
          )
        : null,
    ],
    sheet: state.sheet?.kind === "pair-add" ? pairAddSheet(resident, world, state, controller) : null,
  });
}
