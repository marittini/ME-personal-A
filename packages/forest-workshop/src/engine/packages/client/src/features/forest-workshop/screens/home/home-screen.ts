// 홈 (board 01-1): top bar with the sign, gold, tickets, gear, weather and mail; the workshop scene; the work-report
// card with 작업 보고 and the 72-hour absence bar (work-report.ts); the story card; the bottom bar. Blocks without their
// feature yet are locked in place (docs/forest-workshop/ui-spec.md). The welcome package opens as a sheet above.
import type { AppState, Controller } from "../../app/controller";
import { button, errorLine, h, statusLine } from "../../app/dom";
import { card, renderFrame } from "../chrome/frame";
import { ICONS } from "../chrome/icons";
import { featureButton } from "../chrome/locked";
import { renderHomeScene } from "./home-scene";
import { renderStarterKitSheet } from "./starter-kit-sheet";
import { absenceStrip, workReportCard, workReportSheet } from "./work-report";

function storyCard(controller: Controller) {
  return featureButton(controller, "stories", {
    className: "strip story",
    label: "주민 이야기",
    children: [
      h("span", { className: "story-art", attrs: { "aria-hidden": "true" } }, [ICONS.book("icon")]),
      h("span", { className: "story-text" }, [
        h("strong", { text: "주민 이야기" }),
        h("span", { text: "도착한 이야기가 여기에 보여요" }),
      ]),
      h("span", { className: "round-arrow" }, [ICONS.chevron()]),
    ],
  });
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
    body: [
      workReportCard(world.value, state.content, controller),
      absenceStrip(world.value, state.content, controller),
      storyCard(controller),
    ],
    nav: true,
    sheet:
      state.sheet?.kind === "work-report"
        ? workReportSheet(state, world.value, controller)
        : renderStarterKitSheet(state, controller),
  });
}
