// 공방 이야기 (board 02-2): back + sign, 기록 · 자동 on the right, the episode title ribbon, the stage with the
// participants (their one uploaded picture each; an emotion mark over the one speaking), the dialogue box (speaker
// tag, line, narration), n / N and 계속. A resident's question to the player shows its answers; one answer, once.
// At the end, 다 읽음 records the reading. The reading space hides the bottom bar and has an explicit way back
// (plan §15.6). The first open of an unlocked episode writes the scene: that is a language-model call, so the box
// says so, and a failure offers the same plan again (no new expedition, no cost).
import { currentSeason, type AppState, type Controller } from "../../app/controller";
import { BACKGROUND_ART, EMOTION_ART, assetImage, type Season } from "../../app/assets";
import { button, h } from "../../app/dom";
import { storyTextPages } from "../../app/story-pages";

import type { Emotion, Segment, StoryDocument, WorldView } from "../../app/types";
import type { ReaderState } from "../../app/story-actions";
import { renderFrame } from "../chrome/frame";
import { ICONS } from "../chrome/icons";
import { sheetDialog } from "../chrome/sheet";
import { emotionPosition, residentFigure } from "../residents/resident-figure";

/** Scenes written before prompt v2 carry the earlier emotion names; they show as the nearest of the six arts. */
const LEGACY: Record<string, Emotion> = {
  calm: "affection",
  surprise: "curiosity",
  worry: "fluster",
  thinking: "inspiration",
  shy: "fluster",
};

const MARK_TEXT: Record<keyof typeof EMOTION_ART, string> = {
  joy: "♪",
  affection: "♡",
  curiosity: "?",
  fluster: "💧",
  inspiration: "✦",
  annoyance: "💢",
};

function emotionArt(emotion: string) {
  const known = (emotion in EMOTION_ART ? emotion : LEGACY[emotion]) as keyof typeof EMOTION_ART | undefined;
  if (!known) return null;
  return assetImage(EMOTION_ART[known], {
    className: "emotion-bubble emotion-art",
    fallback: () => h("span", { className: "emotion-bubble", text: MARK_TEXT[known] }),
  });
}

function nameOf(world: WorldView, residentId: string) {
  return world.state.residents[residentId]?.displayName ?? "주민";
}

function stage(season: Season, world: WorldView, story: StoryDocument | null, current: Segment | undefined) {
  const ids = story?.participants ?? [];
  const speaking = current?.kind === "line" ? current.speakerId : current?.kind === "choice" ? current.askerId : null;
  return h("section", { className: "story-stage", attrs: { "aria-hidden": "true" } }, [
    assetImage(BACKGROUND_ART[season].scene, {
      className: "stage-art",
      fallback: () => h("span", { className: "stage-shelf" }),
    }),
    h(
      "div",
      { className: `stage-cast cast-${ids.length}` },
      ids.map((id) => {
        const resident = world.state.residents[id];
        if (!resident) return null;
        const mark =
          speaking !== id ? null : current?.kind === "line" ? emotionArt(current.emotion) : emotionArt("curiosity");
        const spot = h("span", { className: `stage-spot${speaking === id ? " speaking" : ""}` }, [
          mark,
          residentFigure(resident),
        ]);
        const position = emotionPosition(resident.image.placement);
        spot.style.setProperty("--mark-bottom", `${position.bottom}%`);
        spot.style.setProperty("--mark-left", `${position.left}%`);
        return spot;
      }),
    ),
  ]);
}

function dialogue(state: AppState, world: WorldView, reader: ReaderState, controller: Controller) {
  if (reader.story.state === "loading") {
    return h("div", { className: "dialogue-box loading", attrs: { role: "status" } }, [
      h("p", { text: "이야기를 쓰는 중이에요…" }),
      h("p", { className: "muted", text: "처음 여는 이야기는 언어 모델이 지금 써요. 잠시 걸릴 수 있어요." }),
    ]);
  }
  if (reader.story.state === "error") {
    return h("div", { className: "dialogue-box error", attrs: { role: "alert" } }, [
      h("p", { text: reader.story.message }),
      h("div", { className: "row-actions" }, [
        button("같은 이야기로 다시 시도", () => controller.retryStory()),
        button("닫기", () => controller.closeStory(), { variant: "secondary" }),
      ]),
    ]);
  }
  const story = reader.story.value;
  const segments = story.segments;
  const finished = reader.index >= segments.length;
  if (finished) {
    const busy = Boolean(state.busy[`read:${reader.storyId}`]);
    return h("div", { className: "dialogue-box end" }, [
      h("p", { className: "end-line", text: "이야기는 여기까지예요." }),
      h("p", { className: "muted", text: "다 읽으면 이 장면을 함께한 주민들의 기억에 남아요." }),
      button(busy ? "기록하는 중…" : "다 읽음", () => void controller.finishStory(), {
        disabled: busy,
        attrs: { "data-wide": "" },
      }),
    ]);
  }
  const segment = segments[reader.index]!;
  if (segment.kind === "choice") {
    const progress = findProgress(world, reader);
    const chosen = progress?.choice?.optionId ?? null;
    const busy = Boolean(state.busy[`choose:${reader.storyId}`]);
    const splitChoice =
      segment.question.length + segment.options.reduce((sum, option) => sum + option.text.length, 0) > 150;
    if (splitChoice && (reader.choiceView ?? "question") === "question") {
      return h("div", { className: "dialogue-box choice" }, [
        h("span", { className: "speaker-tag" }, [ICONS.leaf("icon tiny"), nameOf(world, segment.askerId)]),
        h("p", { className: "line", text: segment.question }),
        button("답변 고르기", () => controller.setChoiceView("answers")),
      ]);
    }
    return h("div", { className: "dialogue-box choice" }, [
      h("span", { className: "speaker-tag" }, [ICONS.leaf("icon tiny"), nameOf(world, segment.askerId)]),
      splitChoice
        ? button("질문 다시 보기", () => controller.setChoiceView("question"), { variant: "secondary" })
        : h("p", { className: "line", text: segment.question }),
      h(
        "div",
        { className: "choice-options", attrs: { role: "group", "aria-label": "대답 고르기" } },
        segment.options.map((option) =>
          h("button", {
            className: `choice-option${chosen === option.optionId ? " chosen" : ""}`,
            text: option.text,
            attrs: { type: "button", "aria-pressed": chosen === option.optionId ? "true" : "false" },
            disabled: busy || chosen !== null || progress?.state === "read",
            on: { click: () => void controller.chooseAnswer(option.optionId) },
          }),
        ),
      ),
      chosen || progress?.state === "read"
        ? h("p", { className: "muted", text: chosen ? "이미 대답했어요." : "다시 읽을 때는 대답이 남지 않아요." })
        : h("p", { className: "muted", text: "대답은 한 번만 할 수 있어요. 물어본 주민만 기억해요." }),
    ]);
  }
  return h("div", { className: `dialogue-box${segment.kind === "narration" ? " narration-only" : ""}` }, [
    segment.kind === "line"
      ? h("span", { className: "speaker-tag" }, [ICONS.leaf("icon tiny"), nameOf(world, segment.speakerId)])
      : null,
    h("p", {
      className: segment.kind === "line" ? "line" : "narration",
      text: (reader.textPages ?? storyTextPages(segment))[reader.textPage ?? 0] ?? segment.text,
    }),
  ]);
}

function findProgress(world: WorldView, reader: ReaderState) {
  const stored = world.state.stories.pairs[reader.pairId];
  const arcs = [stored?.current, ...(stored?.completed ?? [])];
  return arcs.find((arc) => arc?.episodes[reader.episode]?.storyId === reader.storyId)?.episodes[reader.episode];
}

function backlogSheet(world: WorldView, reader: ReaderState, controller: Controller) {
  const story = reader.story.state === "ready" ? reader.story.value : null;
  const shown = story ? story.segments.slice(0, Math.min(reader.index + 1, story.segments.length)) : [];
  const count = Math.max(1, shown.length);
  const page = Math.min(reader.backlogPage ?? count - 1, count - 1);
  return sheetDialog("fw-backlog", "기록", [
    h(
      "ol",
      { className: "backlog-list" },
      shown
        .slice(page, page + 1)
        .map((segment) =>
          h("li", { className: `backlog-${segment.kind}` }, [
            segment.kind === "line"
              ? h("strong", { text: nameOf(world, segment.speakerId) })
              : segment.kind === "choice"
                ? h("strong", { text: nameOf(world, segment.askerId) })
                : null,
            h("span", { text: segment.kind === "choice" ? segment.question : segment.text }),
          ]),
        ),
    ),
    count > 1
      ? h("div", { className: "resident-pages" }, [
          button("이전", () => controller.setBacklogPage(page - 1), { variant: "secondary", disabled: page === 0 }),
          h("span", { text: `${page + 1} / ${count}`, attrs: { "aria-live": "polite" } }),
          button("다음", () => controller.setBacklogPage(page + 1), {
            variant: "secondary",
            disabled: page + 1 >= count,
          }),
        ])
      : null,
    button("닫기", () => controller.toggleBacklog(), { variant: "secondary", attrs: { "data-wide": "" } }),
  ]);
}

export function renderStoryReader(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  const reader = state.reader;
  if (!world || !reader) {
    return renderFrame(state, controller, {
      top: { kind: "sub", title: "공방 이야기", back: { route: "explore", label: "탐사" }, resources: false },
      backdrop: "wood",
      body: [h("p", { className: "muted", text: "열린 이야기가 없어요." })],
      nav: true,
    });
  }
  const story = reader.story.state === "ready" ? reader.story.value : null;
  const total = story?.segments.length ?? 0;
  const current = story?.segments[reader.index];
  const textPages = reader.textPages ?? storyTextPages(current);
  const lastTextPage = (reader.textPage ?? 0) >= textPages.length - 1;
  const waitingAnswer =
    current?.kind === "choice" && !findProgress(world, reader)?.choice && findProgress(world, reader)?.state !== "read";
  const counters = h("div", { className: "resources reader-tools" }, [
    h(
      "button",
      {
        className: "chip-button",
        attrs: { type: "button", "aria-pressed": reader.backlog ? "true" : "false" },
        disabled: !story,
        on: { click: () => controller.toggleBacklog() },
      },
      [ICONS.book("icon"), h("span", { text: "기록" })],
    ),
    h(
      "button",
      {
        className: `chip-button${reader.auto ? " active" : ""}`,
        attrs: { type: "button", "aria-pressed": reader.auto ? "true" : "false" },
        disabled: !story,
        on: { click: () => controller.toggleAuto() },
      },
      [ICONS.chevron("icon"), h("span", { text: reader.auto ? "자동 끄기" : "자동" })],
    ),
  ]);
  const frame = renderFrame(state, controller, {
    top: {
      kind: "sub",
      title: "공방 이야기",
      subtitle: story?.title ?? "이야기",
      resources: false,
      counters,
    },
    backdrop: "wood",
    storyLayout: true,
    body: [
      stage(currentSeason(state), world, story, current),
      dialogue(state, world, reader, controller),
      story && reader.index < total
        ? h("div", { className: "reader-foot" }, [
            h("span", { className: "count-pill", text: `${reader.index + 1} / ${total}` }),
            button(
              reader.index === total - 1 && lastTextPage ? "다 읽고 보관" : "계속",
              () => {
                if (reader.index === total - 1 && lastTextPage) void controller.finishStory();
                else controller.advanceStory();
              },
              {
                disabled: waitingAnswer || Boolean(state.busy[`read:${reader.storyId}`]),
                attrs: { "data-wide": "" },
              },
            ),
          ])
        : null,
    ],
    nav: false,
    sheet: reader.backlog ? backlogSheet(world, reader, controller) : null,
  });
  // The back button closes the scene (it is not a route of its own to return to).
  const back = frame.querySelector<HTMLButtonElement>(".back-button, .back-spacer");
  if (back) {
    const close = h(
      "button",
      {
        className: "back-button",
        attrs: { type: "button", "aria-label": "이야기 닫기" },
        on: { click: () => controller.closeStory() },
      },
      [ICONS.back()],
    );
    back.replaceWith(close);
  }
  return frame;
}
