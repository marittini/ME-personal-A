// 탐사 → 이야기 탐험 (board 02-1) and 공방 이야기 (02-2): the story overview the server derives, departure and
// cancel, opening a scene (written on first open: a language-model call), stepping through it, the player's one
// answer, and 다 읽음. The server decides every condition, time and change; the client shows what it was told.
import { gameApi } from "./api";
import type { ControllerCore, Route } from "./controller";
import type { Loadable } from "./dom";
import { errorCode, errorMessage } from "./host-api";
import type { StoryDocument, StoryOverview } from "./types";

export type ExploreTab = "survey" | "patrol" | "story";

export interface ExploreView {
  tab: ExploreTab;
  pairId: string | null;
  overview: Loadable<StoryOverview> | null;
}

export interface ReaderState {
  pairId: string;
  episode: number;
  storyId: string;
  story: Loadable<StoryDocument>;
  /** Segments shown so far (index of the current one). */
  index: number;
  auto: boolean;
  backlog: boolean;
  /** The screen to return to. */
  from: Route;
}

const AUTO_MS = 2800;

export function createStoryActions(core: ControllerCore) {
  const { store } = core;
  let autoTimer: ReturnType<typeof setInterval> | undefined;
  let seenRevision = -1;
  let seenRoute = "";

  function patchExplore(update: Partial<ExploreView>) {
    store.set((state) => ({ explore: { ...state.explore, ...update } }));
  }

  function patchReader(update: Partial<ReaderState>) {
    store.set((state) => (state.reader ? { reader: { ...state.reader, ...update } } : {}));
  }

  async function loadOverview(silent = false) {
    const world = core.currentWorld();
    if (!world) return;
    if (!silent) patchExplore({ overview: { state: "loading" } });
    try {
      const overview = await gameApi.getStoryOverview(world.worldId);
      const pairId = store.get().explore.pairId;
      patchExplore({
        overview: { state: "ready", value: overview },
        pairId: overview.pairs.some((pair) => pair.pairId === pairId) ? pairId : (overview.pairs[0]?.pairId ?? null),
      });
    } catch (error) {
      if (!silent)
        patchExplore({ overview: { state: "error", message: errorMessage(error, "이야기를 불러오지 못했습니다.") } });
    }
  }

  // The overview follows the world: a settlement that ends an expedition, a read elsewhere, another tab.
  store.subscribe((state) => {
    // Entering 탐사 (any way: the bottom bar, a link) loads the overview.
    if (state.route !== seenRoute) {
      seenRoute = state.route;
      if (state.route === "explore") void loadOverview(state.explore.overview?.state === "ready");
    }
    const revision = state.world?.state === "ready" ? state.world.value.revision : -1;
    if (revision === seenRevision) return;
    seenRevision = revision;
    if ((state.route === "explore" || state.route === "home") && state.explore.overview?.state === "ready") {
      void loadOverview(true);
    }
  });

  function stopAuto() {
    clearInterval(autoTimer);
    autoTimer = undefined;
  }

  function segments() {
    const reader = store.get().reader;
    return reader?.story.state === "ready" ? reader.story.value.segments : [];
  }

  /** The player's answer to this episode's question, if given (from the world, the authority). */
  function answered(): boolean {
    const reader = store.get().reader;
    const world = core.currentWorld();
    if (!reader || !world) return false;
    const stored = world.state.stories.pairs[reader.pairId];
    const arcs = [stored?.current, ...(stored?.completed ?? [])];
    const progress = arcs.find((arc) => arc?.episodes[reader.episode]?.storyId === reader.storyId)?.episodes[
      reader.episode
    ];
    return Boolean(progress?.choice) || progress?.state === "read";
  }

  function advance() {
    const reader = store.get().reader;
    if (!reader) return;
    const list = segments();
    const current = list[reader.index];
    // A question waits for the answer (once); after it, or when re-reading, it steps on.
    if (current?.kind === "choice" && !answered()) return;
    if (reader.index < list.length) patchReader({ index: reader.index + 1 });
    if (reader.index + 1 >= list.length) stopAuto();
  }

  async function loadStory() {
    const reader = store.get().reader;
    const world = core.currentWorld();
    if (!reader || !world) return;
    patchReader({ story: { state: "loading" } });
    try {
      let story: StoryDocument;
      try {
        story = await gameApi.getStory(world.worldId, reader.storyId);
      } catch (error) {
        if (errorCode(error) !== "story_not_found") throw error;
        story = await gameApi.generateStory(world.worldId, reader.pairId, reader.episode);
      }
      if (store.get().reader?.storyId !== reader.storyId) return;
      patchReader({ story: { state: "ready", value: story }, index: 0 });
    } catch (error) {
      if (store.get().reader?.storyId !== reader.storyId) return;
      patchReader({
        story: {
          state: "error",
          message: errorMessage(error, "이야기를 쓰지 못했어요. 같은 이야기로 다시 시도할 수 있어요."),
        },
      });
    }
  }

  return {
    loadStoryOverview: loadOverview,

    openExplore() {
      core.navigate("explore");
    },

    setExploreTab(tab: ExploreTab) {
      patchExplore({ tab });
    },

    selectStoryPair(pairId: string) {
      patchExplore({ pairId });
    },

    async depart(pairId: string, episode: number) {
      const response = await core.runCommand(`depart:${pairId}:${episode}`, "stories.depart", { pairId, episode });
      if (!response) return;
      core.notify(`탐험을 떠났어요. ${String(response.result.minutes)}분 뒤에 이야기가 열려요.`);
      await loadOverview(true);
    },

    async cancelExpedition() {
      const response = await core.runCommand("expedition-cancel", "stories.cancel", {});
      if (!response) return;
      core.notify("탐험을 취소했어요. 준비물은 모두 돌려받았어요.");
      await loadOverview(true);
    },

    openStory(pairId: string, episode: number, storyId: string) {
      stopAuto();
      const from = store.get().route === "story" ? "explore" : store.get().route;
      store.set({
        reader: { pairId, episode, storyId, story: { state: "loading" }, index: 0, auto: false, backlog: false, from },
      });
      core.navigate("story");
      void loadStory();
    },

    retryStory() {
      void loadStory();
    },

    advanceStory: advance,

    toggleAuto() {
      const reader = store.get().reader;
      if (!reader) return;
      if (reader.auto) {
        stopAuto();
        patchReader({ auto: false });
        return;
      }
      patchReader({ auto: true });
      autoTimer = setInterval(() => {
        const current = store.get().reader;
        if (!current?.auto || store.get().route !== "story") return stopAuto();
        advance();
      }, AUTO_MS);
    },

    toggleBacklog() {
      const reader = store.get().reader;
      if (reader) patchReader({ backlog: !reader.backlog });
    },

    async chooseAnswer(optionId: string) {
      const reader = store.get().reader;
      if (!reader) return;
      const response = await core.runCommand(`choose:${reader.storyId}`, "stories.choose", {
        pairId: reader.pairId,
        episode: reader.episode,
        storyId: reader.storyId,
        optionId,
      });
      if (response) advance();
    },

    /** 다 읽음: records the reading once (memories, the pair's small change) and returns. */
    async finishStory() {
      const reader = store.get().reader;
      if (!reader) return;
      stopAuto();
      const response = await core.runCommand(`read:${reader.storyId}`, "stories.markRead", {
        pairId: reader.pairId,
        episode: reader.episode,
        storyId: reader.storyId,
      });
      if (!response) return;
      store.set({ reader: null });
      core.navigate(reader.from === "story" ? "explore" : reader.from);
      if (!response.result.alreadyRead) {
        core.notify(
          response.result.arcDone
            ? "이 탐험의 이야기를 모두 읽었어요. 다음 탐험이 열렸어요."
            : "이야기를 다 읽었어요. 다음 이야기를 떠날 수 있는지 확인해 보세요.",
        );
      }
      await loadOverview(true);
    },

    closeStory() {
      const reader = store.get().reader;
      stopAuto();
      store.set({ reader: null });
      core.navigate(reader?.from && reader.from !== "story" ? reader.from : "explore");
    },
  };
}
