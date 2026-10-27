// 주민 등록 (board 05-3): ① 자료 선택 → ② 재구축 → ③ 시작 주민.
// ① lists the player's characters and personas (read-only). ② shows the source's own text (원래 설정) beside the
// 공방 세계 설정 the player writes, or asks the language model for a draft (다시 제안). Nothing is saved until 재구축
// 확정; the picture chosen in ② is uploaded right after the resident exists. ③ appears only while the world has no
// starting resident.
import { gameApi } from "./api";
import type { ControllerCore } from "./controller";
import type { Loadable } from "./dom";
import { errorMessage, newWorldId as newUuid } from "./host-api";
import type { ResidentKind, SourceEntry, SourcePreview } from "./types";

export interface RegisterState {
  step: 1 | 2 | 3;
  kindTab: ResidentKind;
  query: string;
  sources: Loadable<SourceEntry[]>;
  selected: SourceEntry | null;
  preview: Loadable<SourcePreview> | null;
  draft: string;
  /** The picture picked in ②, uploaded after 재구축 확정; previewUrl is a local object URL. */
  pendingImage: { file: File; previewUrl: string } | null;
  /** ③: the resident about to become the starting resident. */
  starterChoice: string | null;
}

export function createRegisterActions(core: ControllerCore) {
  const { store } = core;

  function patch(update: Partial<RegisterState>) {
    store.set((state) => (state.register ? { register: { ...state.register, ...update } } : {}));
  }

  function dropPendingImage() {
    const pending = store.get().register?.pendingImage;
    if (pending) URL.revokeObjectURL(pending.previewUrl);
  }

  async function loadSources() {
    const world = core.currentWorld();
    if (!world) return;
    patch({ sources: { state: "loading" } });
    try {
      const { sources } = await gameApi.listSources(world.worldId);
      patch({ sources: { state: "ready", value: sources } });
    } catch (error) {
      patch({ sources: { state: "error", message: errorMessage(error, "캐릭터·페르소나 목록을 불러오지 못했어요.") } });
    }
  }

  return {
    /** Opens 주민 등록 at ①, or at ③ when only the starting resident is left to choose. */
    openRegister(step: 1 | 3 = 1) {
      dropPendingImage();
      store.set({
        register: {
          step,
          kindTab: "character",
          query: "",
          sources: { state: "loading" },
          selected: null,
          preview: null,
          draft: "",
          pendingImage: null,
          starterChoice: null,
        },
      });
      core.navigate("register");
      if (step === 1) void loadSources();
    },

    closeRegister() {
      dropPendingImage();
      store.set({ register: null });
      core.navigate("residents");
    },

    loadSources,
    setRegisterKind: (kindTab: ResidentKind) => patch({ kindTab }),
    setRegisterQuery: (query: string) => patch({ query }),
    backToSources: () => patch({ step: 1 }),
    /** Typing in 공방 세계 설정: kept without a re-render (see Store.remember). */
    setDraft: (draft: string) =>
      store.remember((state) => (state.register ? { register: { ...state.register, draft } } : {})),
    setStarterChoice: (starterChoice: string) => patch({ starterChoice }),

    async chooseSource(source: SourceEntry) {
      const world = core.currentWorld();
      if (!world) return;
      patch({ step: 2, selected: source, preview: { state: "loading" }, draft: "" });
      try {
        const preview = await gameApi.previewSource(world.worldId, source.kind, source.id);
        patch({ preview: { state: "ready", value: preview } });
      } catch (error) {
        patch({ preview: { state: "error", message: errorMessage(error, "자료를 읽지 못했어요.") } });
      }
    },

    /** 다시 제안: one language-model call; the answer only fills the form. */
    async suggestSetting() {
      const world = core.currentWorld();
      const selected = store.get().register?.selected;
      if (!world || !selected) return;
      const response = await core.track(
        "rebuild-suggestion",
        () => gameApi.rebuildSuggestion(world.worldId, { kind: selected.kind, id: selected.id }),
        "제안을 받지 못했어요. 직접 써도 돼요.",
      );
      if (response) patch({ draft: response.suggestion });
    },

    pickPendingImage(file: File) {
      dropPendingImage();
      patch({ pendingImage: { file, previewUrl: URL.createObjectURL(file) } });
    },

    clearPendingImage() {
      dropPendingImage();
      patch({ pendingImage: null });
    },

    /**
     * 재구축 확정 (withImage) or 나중에 그림 등록 (without). Registers, then uploads the picked picture. If the upload
     * fails the resident still exists, and the picture can be added from 주민 그림 later.
     */
    async confirmRegister(withImage: boolean, uploadImage: (residentId: string, file: File) => Promise<unknown>) {
      const register = store.get().register;
      const selected = register?.selected;
      if (!register || !selected || !register.draft.trim()) return;
      const key = `register:${selected.kind}:${selected.id}`;
      // The resident ID is made once per source and kept across retries, so a retry cannot register twice.
      const residentId = core.requestIdFor(`${key}:id`, key, newUuid);
      const response = await core.runCommand(key, "residents.register", {
        residentId,
        source: { kind: selected.kind, id: selected.id },
        worldSetting: register.draft,
      });
      if (!response) return;
      core.forgetRequest(`${key}:id`);
      const image = withImage ? register.pendingImage : null;
      if (image) await uploadImage(residentId, image.file);
      dropPendingImage();
      const world = core.currentWorld();
      if (world && world.state.progress.starterResidentId === null) {
        patch({ step: 3, starterChoice: residentId, pendingImage: null, selected: null, preview: null, draft: "" });
        return;
      }
      store.set((state) => ({ register: null, residentsView: { ...state.residentsView, selectedId: residentId } }));
      core.navigate("residents");
      core.notify(`${selected.name}을(를) 주민으로 등록했어요.`);
    },

    /** ③: the one starting resident. */
    async confirmStarter() {
      const choice = store.get().register?.starterChoice;
      if (!choice) return;
      const response = await core.runCommand("choose-starter", "residents.chooseStarter", { residentId: choice });
      if (!response) return;
      store.set({ register: null });
      core.navigate("home");
      core.notify("시작 주민이 공방에 왔어요.");
    },

    /** ③ → ①: register another source before choosing. */
    registerAnother() {
      patch({ step: 1, query: "" });
      void loadSources();
    },
  };
}
