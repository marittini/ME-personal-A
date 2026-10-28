// 탐사 (board 02-1, with plan §15.6: tabs 조사 · 순찰 · 이야기 탐험). [이야기 탐험] the pair, the arc's trail with its
// place sign, the three episodes (읽음 · 출발 가능 · 잠김 with the exact condition), the chosen episode's 소요 시간 ·
// 참여 주민 · 준비물 · 발견 종류, the placement note, 탐험 출발 / 탐험 취소 / 이야기 읽기, the running strip and the
// 72-hour note. Read arcs stay below to read again (도감). The beat is never shown before reading.
// 조사 · 순찰 keep their place, locked (P4b).
import type { AppState, Controller } from "../../app/controller";
import { button, errorLine, h, statusLine } from "../../app/dom";
import type { EpisodeView, GameContent, PairStoryView, WorldView } from "../../app/types";
import { card, renderFrame } from "../chrome/frame";
import { ICONS } from "../chrome/icons";
import { featureButton } from "../chrome/locked";
import { residentAvatar } from "../residents/resident-figure";
import { itemName, itemTile, jobProgress } from "../work/production-view";

const SVG_NS = "http://www.w3.org/2000/svg";

const STATUS_TEXT: Record<EpisodeView["status"], string> = {
  locked: "잠김",
  available: "출발 가능",
  running: "탐험 중",
  unlocked: "이야기 열림",
  read: "읽음",
};

function tabs(controller: Controller) {
  return h("div", { className: "field-tabs explore-tabs", attrs: { role: "tablist", "aria-label": "탐사" } }, [
    featureButton(controller, "survey-patrol", {
      className: "field-tab",
      label: "조사",
      children: [ICONS.search("icon field-glyph"), h("span", { text: "조사" })],
    }),
    featureButton(controller, "survey-patrol", {
      className: "field-tab",
      label: "순찰",
      children: [ICONS.compass("icon field-glyph"), h("span", { text: "순찰" })],
    }),
    h("button", { className: "field-tab current", attrs: { type: "button", role: "tab", "aria-selected": "true" } }, [
      ICONS.leaf("icon field-glyph"),
      h("span", { text: "이야기 탐험" }),
    ]),
  ]);
}

/** The trail: three stops, filled as episodes are read; the current stop carries the leaf marker. */
function trail(pair: PairStoryView, current: number) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 360 170");
  svg.setAttribute("class", "trail-art");
  svg.setAttribute("aria-hidden", "true");
  const stops = [
    [60, 120],
    [170, 92],
    [285, 60],
  ];
  const fill = (index: number) =>
    pair.episodes[index]!.status === "read" ? "#5a9a44" : index === current ? "#fff8e8" : "#cdbf9f";
  svg.innerHTML = `
    <g stroke="#4b2e1a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
      <rect width="360" height="170" fill="#cfe5c0" stroke="none"/>
      <path d="M-5 150 Q90 110 170 130 T365 105 V175 H-5z" fill="#a9cc86"/>
      <path d="M200 -5 Q215 60 190 95 T230 175 H262 Q240 120 262 85 T236 -5z" fill="#9fd0e6"/>
      <circle cx="30" cy="40" r="26" fill="#8fbf6e"/><circle cx="330" cy="140" r="22" fill="#8fbf6e"/>
      <rect x="300" y="22" width="34" height="46" rx="4" fill="#cdbf9f"/><path d="M308 68 V40 a9 9 0 0 1 18 0 V68" fill="#a9cc86"/>
      <path d="M20 135 Q60 120 ${stops[0]![0]} ${stops[0]![1]} Q120 100 ${stops[1]![0]} ${stops[1]![1]} Q230 80 ${stops[2]![0]} ${stops[2]![1]}"
        fill="none" stroke="#fff8e8" stroke-width="6" stroke-dasharray="10 8"/>
      ${stops.map(([x, y], index) => `<circle cx="${x}" cy="${y}" r="11" fill="${fill(index)}"/>`).join("")}
      <g transform="translate(${stops[current]![0] - 14} ${stops[current]![1] - 46})">
        <path d="M14 30 L8 22 H4 a4 4 0 0 1-4-4 V4 a4 4 0 0 1 4-4 H24 a4 4 0 0 1 4 4 V18 a4 4 0 0 1-4 4 H20z" fill="#fff8e8"/>
        <path d="M14 18 c0-6 0-9 0-12 M14 12 c-4-1-6-4-6-7 4 1 6 3 6 7z M14 10 c4-1 5-4 5-7-4 1-5 3-5 7z" fill="#5a9a44" stroke-width="2"/>
      </g>
    </g>`;
  return svg;
}

function pairChooser(state: AppState, world: WorldView, overview: PairStoryView[], controller: Controller) {
  if (overview.length < 2) return null;
  const chooser = h(
    "select",
    {
      className: "input",
      attrs: { "aria-label": "페어 고르기" },
      on: { change: () => controller.selectStoryPair(chooser.value) },
    },
    overview.map((pair) => {
      const names = world.state.pairs[pair.pairId]!.residentIds.map(
        (id) => world.state.residents[id]?.displayName ?? "주민",
      );
      return h("option", { text: names.join(" · "), attrs: { value: pair.pairId } });
    }),
  );
  chooser.value = overview.some((pair) => pair.pairId === state.explore.pairId)
    ? state.explore.pairId!
    : overview[0]!.pairId;
  return chooser;
}

function episodeTiles(pair: PairStoryView, selected: number) {
  return h(
    "ol",
    { className: "episode-row", attrs: { "aria-label": "이야기 편" } },
    pair.episodes.map((episode) =>
      h("li", { className: `episode-tile ${episode.status}${episode.index === selected ? " selected" : ""}` }, [
        h("span", { className: "episode-icon" }, [
          (episode.status === "locked" ? ICONS.lock : ICONS.book)("icon big"),
          episode.status === "read" ? h("span", { className: "episode-check" }, [ICONS.check("icon tiny")]) : null,
        ]),
        h("span", { className: "episode-text" }, [
          h("strong", { text: `${episode.index + 1}편` }),
          h("span", { text: episode.title }),
          h("small", {
            text:
              episode.status === "locked" ? (episode.reasons[0] ?? STATUS_TEXT.locked) : STATUS_TEXT[episode.status],
          }),
        ]),
      ]),
    ),
  );
}

function details(
  state: AppState,
  world: WorldView,
  content: GameContent,
  pair: PairStoryView,
  episode: EpisodeView,
  controller: Controller,
) {
  const usable = (itemId: string) =>
    Math.max(0, (world.state.inventory[itemId] ?? 0) - (world.state.production.protectedStock[itemId] ?? 0));
  const preparations = Object.entries(episode.preparations);
  const ready = preparations.every(([itemId, amount]) => usable(itemId) >= amount);
  const participants = episode.participants.map((id) => world.state.residents[id]).filter(Boolean);
  const expedition = world.state.stories.expedition;
  const running = expedition && expedition.pairId === pair.pairId && expedition.episode === episode.index;
  const busy = (key: string) => Boolean(state.busy[key]);
  const placed = participants.filter((resident) =>
    Object.values(world.state.production.facilities).some((facility) => facility.residentId === resident!.residentId),
  );

  let action;
  if (episode.status === "available") {
    const key = `depart:${pair.pairId}:${episode.index}`;
    action = button(
      busy(key) ? "출발하는 중…" : ready ? "탐험 출발" : "준비물이 부족해요",
      () => void controller.depart(pair.pairId, episode.index),
      { disabled: busy(key) || !ready, attrs: { "data-wide": "" } },
    );
  } else if (episode.status === "running" && running) {
    const progress = jobProgress(state, world, expedition);
    action = h("div", { className: "expedition-running" }, [
      h("p", { className: "running-line" }, [
        ICONS.compass("icon"),
        h("strong", { text: "탐험 중" }),
        progress.countdown,
      ]),
      progress.bar,
      button(
        busy("expedition-cancel") ? "취소하는 중…" : "탐험 취소 (준비물은 모두 돌려받아요)",
        () => void controller.cancelExpedition(),
        {
          variant: "secondary",
          disabled: busy("expedition-cancel"),
        },
      ),
    ]);
  } else if ((episode.status === "unlocked" || episode.status === "read") && episode.storyId) {
    const storyId = episode.storyId;
    action = button(
      episode.status === "read" ? "다시 읽기" : episode.written ? "이어 읽기" : "이야기 읽기",
      () => controller.openStory(pair.pairId, episode.index, storyId),
      { attrs: { "data-wide": "" } },
    );
  } else {
    action = h("div", { className: "locked-reasons" }, [
      h("p", { className: "hint", text: "아직 떠날 수 없어요:" }),
      h(
        "ul",
        {},
        episode.reasons.map((reason) => h("li", { text: reason })),
      ),
    ]);
  }

  return h("div", { className: "expedition-details" }, [
    h("div", { className: "detail-grid" }, [
      h("div", { className: "detail-cell" }, [
        ICONS.clock("icon big"),
        h("span", {}, [h("small", { text: "소요 시간" }), h("strong", { text: `${episode.minutes}분` })]),
      ]),
      h("div", { className: "detail-cell" }, [
        ICONS.people("icon big"),
        h("span", {}, [h("small", { text: "참여 주민" }), h("strong", { text: `${participants.length}명` })]),
        h(
          "span",
          { className: "avatar-row" },
          participants.map((resident) => residentAvatar(resident!)),
        ),
      ]),
      h("div", { className: "detail-cell wide" }, [
        ICONS.box("icon big"),
        h("span", {}, [
          h("small", { text: "준비물" }),
          h(
            "span",
            { className: "prep-list" },
            preparations.map(([itemId, amount]) =>
              h("span", { className: `prep${usable(itemId) >= amount ? " ok" : ""}` }, [
                itemTile(itemId),
                `${itemName(content, itemId)} ${Math.min(usable(itemId), amount)}/${amount}`,
                usable(itemId) >= amount ? ICONS.check("icon tiny") : null,
              ]),
            ),
          ),
        ]),
      ]),
      h("div", { className: "detail-cell wide" }, [
        ICONS.sparkle("icon big"),
        h("span", {}, [h("small", { text: "발견할 수 있는 것" }), h("strong", { text: pair.arc.discovery })]),
      ]),
    ]),
    h("p", {
      className: "hint",
      text: placed.length
        ? `${placed.map((resident) => resident!.displayName).join(", ")}은(는) 출발하면 시설에서 빠져요. 시설은 기본 효율로 계속 일하고, 진행 중인 작업은 취소하지 않아요.`
        : "시설은 그대로 일해요. 탐험은 일상 생산과 따로 하나씩 떠나요.",
    }),
    action,
  ]);
}

function completedList(state: AppState, pair: PairStoryView, controller: Controller) {
  if (pair.completed.length === 0)
    return card("읽은 이야기", [h("p", { className: "empty", text: "아직 읽은 이야기가 없어요." })]);
  const count = Math.ceil(pair.completed.length / 2);
  const page = Math.min(state.explore.historyPage ?? 0, count - 1);
  return card("읽은 이야기", [
    h(
      "ul",
      { className: "menu-list" },
      pair.completed
        .slice()
        .reverse()
        .slice(page * 2, page * 2 + 2)
        .map((arc) =>
          h("li", { className: "completed-arc" }, [
            h("strong", { text: arc.title }),
            h(
              "span",
              { className: "row-actions" },
              arc.storyIds.map((storyId, index) =>
                h("button", {
                  className: "outline-button small",
                  text: `${index + 1}편`,
                  attrs: { type: "button", "aria-label": `${arc.title} ${index + 1}편 다시 읽기` },
                  on: { click: () => controller.openStory(pair.pairId, index, storyId) },
                }),
              ),
            ),
          ]),
        ),
    ),
    count > 1
      ? h("div", { className: "resident-pages" }, [
          button("이전", () => controller.setExploreHistoryPage(page - 1), {
            variant: "secondary",
            disabled: page === 0,
          }),
          h("span", { text: `${page + 1} / ${count}`, attrs: { "aria-live": "polite" } }),
          button("다음", () => controller.setExploreHistoryPage(page + 1), {
            variant: "secondary",
            disabled: page + 1 >= count,
          }),
        ])
      : null,
  ]);
}

function statusStrip(state: AppState, world: WorldView, overview: PairStoryView[], content: GameContent) {
  const expedition = world.state.stories.expedition;
  const pair = expedition ? overview.find((candidate) => candidate.pairId === expedition.pairId) : null;
  const limitHours = Math.round(content.production.absenceLimitMs / 3_600_000);
  if (!expedition || !pair) {
    return h("div", { className: "strip offline explore-strip" }, [
      ICONS.compass(),
      h("span", { text: "지금은 떠난 탐험이 없어요." }),
      h("small", { className: "muted", text: `방치 누적 최대 ${limitHours}시간` }),
    ]);
  }
  const progress = jobProgress(state, world, expedition);
  return h("div", { className: "strip offline explore-strip" }, [
    ICONS.compass(),
    h("span", { className: "strip-progress" }, [
      h("span", {}, [`${pair.episodes[expedition.episode]!.title} · `, progress.countdown, " 남음"]),
      progress.bar,
    ]),
    h("small", { className: "muted", text: `방치 누적 최대 ${limitHours}시간` }),
  ]);
}

function body(state: AppState, world: WorldView, content: GameContent, controller: Controller) {
  const overview = state.explore.overview;
  if (!overview || overview.state === "loading") return [tabs(controller), statusLine("이야기를 불러오는 중…")];
  if (overview.state === "error") {
    return [
      tabs(controller),
      card(null, [errorLine(overview.message), button("다시 불러오기", () => void controller.loadStoryOverview())]),
    ];
  }
  const pairs = overview.value.pairs.filter((pair) => !world.state.pairs[pair.pairId]?.archived);
  if (pairs.length === 0) {
    return [
      tabs(controller),
      card(null, [
        h("p", { text: "페어를 만들면 두 주민의 이야기 탐험이 열려요." }),
        h("p", { className: "muted", text: "1편은 한 주민만 공방에 와 있어도 떠날 수 있어요." }),
        button("주민 화면으로", () => controller.navigate("residents"), { variant: "secondary" }),
      ]),
    ];
  }
  const pair = pairs.find((candidate) => candidate.pairId === state.explore.pairId) ?? pairs[0]!;
  const selected = pair.episodes.find((episode) => episode.status !== "read")?.index ?? 2;
  const section = state.explore.section ?? "episode";
  const sections = [
    ["episode", "탐험 준비"],
    ["journey", "여정"],
    ["history", "읽은 이야기"],
  ] as const;
  return [
    tabs(controller),
    pairChooser(state, world, pairs, controller),
    h(
      "div",
      { className: "pill-tabs", attrs: { role: "group", "aria-label": "이야기 화면" } },
      sections.map(([id, label]) =>
        h("button", {
          className: `pill-tab${section === id ? " current" : ""}`,
          text: label,
          attrs: { type: "button", "aria-pressed": section === id ? "true" : "false" },
          on: { click: () => controller.setExploreSection(id) },
        }),
      ),
    ),
    section === "journey"
      ? h("section", { className: "card trail-card", attrs: { "aria-label": `${pair.arc.place} 지도` } }, [
          trail(pair, selected),
          h("span", { className: "place-sign", text: pair.arc.place }),
        ])
      : null,
    section === "episode"
      ? card(
          pair.arc.title,
          [episodeTiles(pair, selected), details(state, world, content, pair, pair.episodes[selected]!, controller)],
          { className: "arc-card" },
        )
      : null,
    section === "journey" ? statusStrip(state, world, pairs, content) : null,
    section === "history" ? completedList(state, pair, controller) : null,
  ];
}

export function renderExploreScreen(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  return renderFrame(state, controller, {
    top: { kind: "sub", title: "탐사", back: { route: "home", label: "홈" }, resources: true },
    backdrop: "forest",
    body: world && state.content ? body(state, world, state.content, controller) : [statusLine("세계를 불러오는 중…")],
    nav: true,
  });
}
