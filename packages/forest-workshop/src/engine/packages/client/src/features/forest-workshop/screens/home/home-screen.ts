// 홈 (board 01-1): top bar with the sign, gold, tickets, gear, weather and mail; the workshop scene; the work-report
// card with 작업 보고 and the 72-hour absence bar (work-report.ts); the story card; the bottom bar. Blocks without their
// feature yet are locked in place (docs/forest-workshop/ui-spec.md). The welcome package opens as a sheet above.
import type { AppState, Controller } from "../../app/controller";
import { UI_ART, assetImage } from "../../app/assets";
import { button, errorLine, h, statusLine } from "../../app/dom";
import { card, renderFrame } from "../chrome/frame";
import { ICONS } from "../chrome/icons";
import type { GameContent, WorldState } from "../../app/types";
import { editingGround, groundActions } from "./ground-editor";
import { renderHomeScene } from "./home-scene";
import { renderStarterKitSheet } from "./starter-kit-sheet";
import { absenceStrip, workReportCard, workReportSheet } from "./work-report";

/** What the story card says, from the world: an opened episode first, then a running expedition. */
function storyLine(world: WorldState, content: GameContent | null): string {
  const arcTitle = (arcId: string) => content?.stories.arcs.find((arc) => arc.id === arcId)?.title ?? "이야기";
  for (const stories of Object.values(world.stories.pairs)) {
    const current = stories.current;
    if (current?.episodes.some((episode) => episode.state === "unlocked")) {
      return `새 이야기가 열렸어요 · ${arcTitle(current.arcId)}`;
    }
  }
  const expedition = world.stories.expedition;
  if (expedition) {
    const current = world.stories.pairs[expedition.pairId]?.current;
    return `탐험 중 · ${current ? arcTitle(current.arcId) : "이야기 탐험"}`;
  }
  return Object.keys(world.pairs).length
    ? "탐사에서 이야기 탐험을 떠날 수 있어요"
    : "페어를 만들면 두 주민의 이야기가 열려요";
}

function storyCard(world: WorldState, content: GameContent | null, controller: Controller) {
  return h(
    "button",
    {
      className: "strip story",
      attrs: { type: "button", "aria-label": `주민 이야기 — ${storyLine(world, content)}` },
      on: { click: () => controller.openExplore() },
    },
    [
      h("span", { className: "story-art", attrs: { "aria-hidden": "true" } }, [
        assetImage(UI_ART.storyVignette, { className: "story-vignette", fallback: () => ICONS.book("icon") }),
      ]),
      h("span", { className: "story-text" }, [
        h("strong", { text: "주민 이야기" }),
        h("span", { text: storyLine(world, content) }),
      ]),
      h("span", { className: "round-arrow" }, [ICONS.chevron()]),
    ],
  );
}

export function renderHomeScreen(state: AppState, controller: Controller) {
  const world = state.world;
  if (!world || world.state !== "ready") {
    return renderFrame(state, controller, {
      top: { kind: "home" },
      backdrop: "forest",
      nav: false,
      body: [
        world?.state === "error"
          ? card(null, [
              errorLine(world.message),
              button("세계 목록으로", () => controller.navigate("worlds"), { variant: "secondary" }),
            ])
          : statusLine("세계를 불러오는 중…"),
      ],
    });
  }
  return renderFrame(state, controller, {
    top: { kind: "home" },
    backdrop: "forest",
    hero: renderHomeScene(state, controller),
    homeLayout: true,
    body: editingGround(state)
      ? [groundActions(state, controller)]
      : [
          workReportCard(world.value, state.content, controller),
          storyCard(world.value.state, state.content, controller),
          absenceStrip(world.value, state.content, controller),
        ],
    nav: true,
    sheet:
      state.sheet?.kind === "work-report"
        ? workReportSheet(state, world.value, controller)
        : renderStarterKitSheet(state, controller),
  });
}
