// 홈 (board 01-1): top bar with the sign, gold, tickets, gear, weather and mail; the workshop scene; the work-report
// card; the 72-hour offline bar; the story card; the bottom bar. Blocks without their feature yet are locked in place
// (docs/forest-workshop/ui-spec.md). The welcome package opens as a sheet above.
import type { AppState, Controller } from "../../app/controller";
import { button, errorLine, h, statusLine } from "../../app/dom";
import { card, renderFrame } from "../chrome/frame";
import { ICONS } from "../chrome/icons";
import { featureButton, lockedBlock } from "../chrome/locked";
import { renderHomeScene } from "./home-scene";
import { renderStarterKitSheet } from "./starter-kit-sheet";

function workReport(controller: Controller) {
  return card(
    null,
    [
      lockedBlock(controller, "work-report", [
        h("h2", { className: "report-title", text: "공방 소식" }),
        h("div", { className: "report-body" }, [
          h("div", { className: "report-items" }, [
            h("div", { className: "report-slot" }, [
              h("span", { className: "slot-art" }),
              h("span", { className: "slot-name", text: "입고" }),
              h("strong", { text: "–" }),
            ]),
            h("div", { className: "report-slot" }, [
              h("span", { className: "slot-art" }),
              h("span", { className: "slot-name", text: "입고" }),
              h("strong", { text: "–" }),
            ]),
          ]),
          h("div", { className: "report-actions" }, [
            h("span", { className: "button report-button", attrs: { "aria-hidden": "true" } }, [
              "작업 보고",
              ICONS.chevron("icon"),
            ]),
            h("span", { className: "report-caption" }, [ICONS.leaf("icon tiny"), "자동 입고"]),
          ]),
        ]),
      ]),
    ],
    { className: "report-card" },
  );
}

function offlineBar(controller: Controller) {
  return featureButton(controller, "offline-cap", {
    className: "strip offline",
    label: "미접속 누적 진행",
    children: [ICONS.clock(), h("span", { text: "미접속 누적 –시간 / 최대 72시간" }), ICONS.info("icon muted-icon")],
  });
}

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
    body: [workReport(controller), offlineBar(controller), storyCard(controller)],
    nav: true,
    sheet: renderStarterKitSheet(state, controller),
  });
}
