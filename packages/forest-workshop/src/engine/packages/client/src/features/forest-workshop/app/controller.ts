// Application actions. The only module that writes the store or calls the API; screens call these actions.
//
// Retry safety: every change carries a request ID. While an action is pending its button is disabled. If the
// request fails without a definite answer (network loss, server error), the same ID is kept so pressing the button
// again cannot apply the change twice; a definite refusal (a 4xx with a code) drops it.
//
// Module map: this file holds the shared core (store, request tracking, commands, navigation) and the world, settings
// and backup actions. Residents, pairs and pictures live in resident-actions.ts; 주민 등록 in register-actions.ts;
// production in production-actions.ts; 초대 and 납품 in invite-actions.ts; 탐사 and 이야기 in story-actions.ts. Each receives the core and adds its actions
// to the controller.
import { gameApi } from "./api";
import { previewBackup, type BackupSummary } from "./backup-preview";
import { lockedMessage, type LockedFeature } from "./features";
import {
  clampFontSize,
  readFontSize,
  readSeasonChoice,
  writeFontSize,
  writeSeasonChoice,
  type StoredSeasonChoice,
} from "./preferences";
import { resolveSeason } from "./season";
import { frameArt, probeAsset, type Season } from "./assets";
import type { Loadable } from "./dom";
import { errorCode, errorMessage, newRequestId, newWorldId } from "./host-api";
import { createStore, type Store } from "./store";
import { WorldGate } from "./world-gate";
import { createRegisterActions, type RegisterState } from "./register-actions";
import { createProductionActions, type ProductionSheet, type WorkView } from "./production-actions";
import { createResidentActions, type ResidentsView, type ResidentSheet } from "./resident-actions";
import { createInviteActions, type InviteSheet, type InviteTab } from "./invite-actions";
import { createStoryActions, type ExploreView, type ReaderState } from "./story-actions";
import type {
  CommandResponse,
  DeliveryList,
  GameContent,
  Placement,
  StorageUsage,
  WorldState,
  WorldSummary,
  WorldView,
} from "./types";

export type Route =
  | "worlds"
  | "home"
  | "work"
  | "facilities"
  | "settings"
  | "backup"
  | "diagnostics"
  | "residents"
  | "relations"
  | "register"
  | "resident-image"
  | "invite"
  | "explore"
  | "story";

/** A backup file picked for restore, shown as a preview until the player confirms (mockup 05 · 복원 미리보기). */
export interface RestoreSelection {
  fileName: string;
  signature: string;
  backup: unknown;
  summary: BackupSummary;
}

export interface Notice {
  kind: "info" | "error";
  text: string;
}

export interface AppState {
  route: Route;
  worlds: Loadable<WorldSummary[]>;
  world: Loadable<WorldView> | null;
  content: GameContent | null;
  /** Action keys with a request in flight. */
  busy: Readonly<Record<string, boolean>>;
  notice: Notice | null;
  restore: RestoreSelection | null;
  /** 설정 → 표시 → 글자 크기, per viewer. */
  fontSize: number;
  /** 설정 → 표시 → 계절: follow today's date, or one season (per viewer, visual only). */
  seasonChoice: StoredSeasonChoice;
  /** Pack files that loaded (app/assets.ts probeAsset); the frame turns their CSS art on. */
  artReady: string[];
  /** 시설과 창고: which tab is open. */
  facilitiesTab: "facilities" | "protection" | "storage";
  invitePage?: number;
  worldsPage?: number;
  worldCreateOpen?: boolean;
  worldDraft?: { worldName: string; nickname: string };
  settingsSection?: "workshop" | "display" | "manage";
  settingsNicknameDraft?: { worldId: string; value: string };
  /** 저장·백업 → 저장 공간 사용량, loaded when that screen opens. */
  storage: Loadable<StorageUsage> | null;
  /** The welcome-package sheet was put off for this session ("나중에"). */
  starterSheetHidden: boolean;
  /** 주민 (board 03-1): tab, search, filter and the selected resident. */
  residentsView: ResidentsView;
  /** The resident 관계 and 주민 그림 are about. */
  focusResidentId: string | null;
  /** 관계 → 변경 · 보관 mode. */
  relationsEditing: boolean;
  /** A sheet over the current screen (프로필, 페어 추가, 이전 그림, 그림 이력 정리). */
  sheet: Sheet | null;
  /** 주민 그림: slider values not yet applied. */
  placementDraft: Placement | null;
  /** 주민 등록 (board 05-3) while it is open. */
  register: RegisterState | null;
  /** 공방 작업 · 시설과 창고: the shown facility and unapplied rule edits. */
  work: WorkView;
  /** Client time the shown world arrived; countdowns are estimated from it. */
  worldReceivedAt: number;
  /** 초대 (board 03-3): 주민 초대 or 종표 교환. */
  inviteTab: InviteTab;
  /** Today's 납품 의뢰, loaded when 초대권 받기 opens. */
  deliveries: Loadable<DeliveryList> | null;
  /** 탐사 (board 02-1): tab, pair and the story overview. */
  explore: ExploreView;
  /** 공방 이야기 (board 02-2) while a scene is open. */
  reader: ReaderState | null;
}

/** Sheets over a screen. */
export type Sheet = ResidentSheet | ProductionSheet | InviteSheet;

/** What the action modules share. */
export interface ControllerCore {
  store: Store<AppState>;
  track<T>(actionKey: string, work: () => Promise<T>, fallback: string): Promise<T | null>;
  runCommand(actionKey: string, type: string, payload?: Record<string, unknown>): Promise<CommandResponse | null>;
  currentWorld(): WorldView | null;
  requestIdFor(actionKey: string, signature: string, make?: () => string): string;
  /** Forgets a retry ID, once its action is finished for good. */
  forgetRequest(actionKey: string): void;
  showWorld(view: WorldView, content?: GameContent): void;
  /** Keeps a newer copy of the world without re-rendering (its visible parts did not change). */
  rememberWorld(view: WorldView): void;
  navigate(route: Route): void;
  /** Reloads 저장 공간 사용량 (after pictures change). */
  refreshStorage(): Promise<void>;
  notify(text: string, kind?: Notice["kind"]): void;
}

const LAST_WORLD_KEY = "forest-workshop:last-world";

function readLastWorld(): string | null {
  try {
    return localStorage.getItem(LAST_WORLD_KEY);
  } catch {
    return null;
  }
}

function writeLastWorld(worldId: string | null) {
  try {
    if (worldId) localStorage.setItem(LAST_WORLD_KEY, worldId);
    else localStorage.removeItem(LAST_WORLD_KEY);
  } catch {
    // Private windows and blocked storage: the player picks the world from the list instead.
  }
}

/** A definite refusal from the server: retrying the same request would only be refused again. */
function isDefiniteRefusal(error: unknown): boolean {
  const status = (error as { status?: unknown }).status;
  return typeof status === "number" && status >= 400 && status < 500 && errorCode(error) !== null;
}

interface PendingRequest {
  id: string;
  signature: string;
}

export function createController() {
  const store: Store<AppState> = createStore<AppState>({
    route: "worlds",
    worlds: { state: "loading" },
    world: null,
    content: null,
    busy: {},
    notice: null,
    restore: null,
    fontSize: readFontSize(),
    seasonChoice: readSeasonChoice(),
    artReady: [],
    facilitiesTab: "facilities",
    storage: null,
    starterSheetHidden: false,
    residentsView: { tab: "all", query: "", filter: "all", selectedId: null },
    focusResidentId: null,
    relationsEditing: false,
    sheet: null,
    placementDraft: null,
    register: null,
    work: { facilityId: "gather-yard", drafts: {}, selected: {}, queueRecipe: {} },
    inviteTab: "invite",
    deliveries: null,
    explore: { tab: "story", pairId: null, overview: null },
    reader: null,
    worldReceivedAt: Date.now(),
  });
  const pending = new Map<string, PendingRequest>();
  const gate = new WorldGate();

  /** Asks for the current season's backdrop and the four UI panels; each one switches on when it has loaded. */
  function loadFrameArt() {
    for (const { path } of frameArt(currentSeason(store.get()))) {
      void probeAsset(path).then((ok) => {
        if (ok && !store.get().artReady.includes(path)) {
          store.set((state) => ({ artReady: [...state.artReady, path] }));
        }
      });
    }
  }
  loadFrameArt();

  // An info toast goes away by itself after a few seconds; an error stays until it is closed.
  const INFO_NOTICE_MS = 4000;
  let shownNotice: Notice | null = null;
  let noticeTimer: ReturnType<typeof setTimeout> | undefined;
  store.subscribe((state) => {
    if (state.notice === shownNotice) return;
    shownNotice = state.notice;
    clearTimeout(noticeTimer);
    if (shownNotice?.kind === "info") {
      const notice = shownNotice;
      noticeTimer = setTimeout(() => {
        if (store.get().notice === notice) store.set({ notice: null });
      }, INFO_NOTICE_MS);
    }
  });

  /** The request ID for this action: reused while the same request is being retried. */
  function requestIdFor(actionKey: string, signature: string, make: () => string = newRequestId): string {
    const existing = pending.get(actionKey);
    if (existing && existing.signature === signature) return existing.id;
    const id = make();
    pending.set(actionKey, { id, signature });
    return id;
  }

  function setBusy(actionKey: string, value: boolean) {
    store.set((state) => ({ busy: { ...state.busy, [actionKey]: value } }));
  }

  async function track<T>(actionKey: string, work: () => Promise<T>, fallback: string): Promise<T | null> {
    if (store.get().busy[actionKey]) return null;
    setBusy(actionKey, true);
    store.set({ notice: null });
    try {
      const value = await work();
      pending.delete(actionKey);
      return value;
    } catch (error) {
      if (isDefiniteRefusal(error)) pending.delete(actionKey);
      store.set({ notice: { kind: "error", text: errorMessage(error, fallback) } });
      if (errorCode(error) === "stale_view") void reloadWorld();
      return null;
    } finally {
      setBusy(actionKey, false);
    }
  }

  /** Puts a world on screen (no checks: callers decide). */
  function applyWorld(view: WorldView, content?: GameContent) {
    writeLastWorld(view.worldId);
    store.set((state) => ({
      world: {
        state: "ready",
        value: { worldId: view.worldId, revision: view.revision, updatedAt: view.updatedAt, state: view.state },
      },
      worldReceivedAt: Date.now(),
      // Another world: its rule drafts and selections start fresh.
      work:
        state.world?.state === "ready" && state.world.value.worldId === view.worldId
          ? state.work
          : { facilityId: state.work.facilityId, drafts: {}, selected: {}, queueRecipe: {} },
      content: content ?? state.content,
      route: state.route === "worlds" ? "home" : state.route,
    }));
  }

  /** An update of the world on screen: dropped when it is for another world or older than what is shown. */
  function showWorld(view: WorldView, content?: GameContent) {
    if (!gate.acceptsUpdate(currentWorld(), view)) return;
    applyWorld(view, content);
  }

  /** Opening a world the player chose (create, restore): a new navigation. */
  function enterWorld(view: WorldView, content?: GameContent) {
    gate.beginNavigation();
    applyWorld(view, content);
  }

  function rememberWorld(view: WorldView) {
    if (!gate.acceptsUpdate(currentWorld(), view)) return;
    store.remember({
      world: {
        state: "ready",
        value: { worldId: view.worldId, revision: view.revision, updatedAt: view.updatedAt, state: view.state },
      },
      worldReceivedAt: Date.now(),
    });
  }

  async function loadWorlds() {
    store.set({ worlds: { state: "loading" } });
    try {
      const { worlds } = await gameApi.listWorlds();
      store.set({ worlds: { state: "ready", value: worlds } });
      return worlds;
    } catch (error) {
      store.set({ worlds: { state: "error", message: errorMessage(error, "세계 목록을 불러오지 못했습니다.") } });
      return null;
    }
  }

  async function openWorld(worldId: string) {
    const ticket = gate.beginNavigation();
    store.set({ world: { state: "loading" }, route: "home", notice: null });
    try {
      const view = await gameApi.getState(worldId);
      // The player may have opened another world meanwhile: this answer belongs to an older navigation.
      if (!gate.isCurrentNavigation(ticket)) return;
      applyWorld(view, view.content);
    } catch (error) {
      if (!gate.isCurrentNavigation(ticket)) return;
      if (errorCode(error) === "world_not_found") writeLastWorld(null);
      store.set({ world: { state: "error", message: errorMessage(error, "세계를 불러오지 못했습니다.") } });
    }
  }

  async function loadStorage() {
    const world = currentWorld();
    if (!world) return;
    store.set({ storage: { state: "loading" } });
    try {
      store.set({ storage: { state: "ready", value: await gameApi.getStorage(world.worldId) } });
    } catch (error) {
      store.set({ storage: { state: "error", message: errorMessage(error, "저장 공간을 확인하지 못했습니다.") } });
    }
  }

  async function reloadWorld() {
    const world = store.get().world;
    if (world?.state === "ready") await openWorld(world.value.worldId);
  }

  function currentWorld(): WorldView | null {
    const world = store.get().world;
    return world?.state === "ready" ? world.value : null;
  }

  function navigate(route: Route) {
    store.set({ route, notice: null, restore: null, sheet: null, relationsEditing: false });
    if (route === "worlds") void loadWorlds();
    if (route === "backup") void loadStorage();
  }

  /** Sends a game command; the server decides every amount. */
  async function runCommand(actionKey: string, type: string, payload: Record<string, unknown> = {}) {
    const world = currentWorld();
    if (!world) return null;
    const signature = JSON.stringify([world.worldId, type, payload]);
    const commandId = requestIdFor(actionKey, signature);
    const response = await track(
      actionKey,
      () => gameApi.sendCommand({ worldId: world.worldId, commandId, expectedRevision: world.revision, type, payload }),
      "요청을 처리하지 못했습니다. 다시 시도해 주세요.",
    );
    if (!response) return null;
    // The player left this world while the command was out: its answer must not touch the world now on screen,
    // and the caller's follow-up (a notice, a sheet) must not run there either.
    if (currentWorld()?.worldId !== world.worldId) return null;
    showWorld({
      worldId: world.worldId,
      revision: response.revision,
      updatedAt: new Date().toISOString(),
      state: response.state as WorldState,
    });
    return response;
  }

  const core: ControllerCore = {
    store,
    track,
    runCommand,
    currentWorld,
    requestIdFor,
    forgetRequest: (actionKey) => pending.delete(actionKey),
    showWorld,
    rememberWorld,
    navigate,
    refreshStorage: loadStorage,
    notify: (text, kind = "info") => store.set({ notice: { kind, text } }),
  };

  return {
    store,
    ...createResidentActions(core),
    ...createRegisterActions(core),
    ...createProductionActions(core),
    ...createInviteActions(core),
    ...createStoryActions(core),

    async start() {
      const worlds = await loadWorlds();
      const last = readLastWorld();
      if (worlds && last && worlds.some((world) => world.worldId === last && world.readable)) await openWorld(last);
    },

    loadWorlds,
    openWorld,
    reloadWorld,

    setWorldsPage(page: number) {
      store.set({ worldsPage: Math.max(0, page) });
    },

    rememberWorldDraft(worldDraft: NonNullable<AppState["worldDraft"]>) {
      store.remember({ worldDraft });
    },

    rememberWorldCreateOpen(worldCreateOpen: boolean) {
      store.remember({ worldCreateOpen });
    },

    navigate,
    notify: core.notify,

    /** A locked mockup element was tapped: say which phase opens it. */
    notifyLocked(feature: LockedFeature) {
      store.set({ notice: { kind: "info", text: lockedMessage(feature) } });
    },

    setSeasonChoice(choice: StoredSeasonChoice) {
      writeSeasonChoice(choice);
      store.set({ seasonChoice: choice });
      loadFrameArt();
    },

    setFontSize(value: number) {
      const fontSize = clampFontSize(value);
      writeFontSize(fontSize);
      store.set({ fontSize });
    },

    setFacilitiesTab(tab: AppState["facilitiesTab"]) {
      store.set((state) => ({ facilitiesTab: tab, work: { ...state.work, inventoryPage: 0 } }));
    },

    setSettingsSection(settingsSection: NonNullable<AppState["settingsSection"]>) {
      store.set({ settingsSection });
    },

    rememberSettingsNickname(worldId: string, value: string) {
      store.remember({ settingsNicknameDraft: { worldId, value } });
    },

    async saveSettingsNickname(worldId: string, value: string) {
      const result = await runCommand("rename-nickname", "settings.update", { playerNickname: value });
      const draft = store.get().settingsNicknameDraft;
      if (result && draft?.worldId === worldId && draft.value === value) {
        store.remember({ settingsNicknameDraft: undefined });
      }
      return result;
    },

    hideStarterSheet() {
      store.set({ starterSheetHidden: true });
    },

    showStarterSheet() {
      store.set({ starterSheetHidden: false });
    },

    dismissNotice() {
      store.set({ notice: null });
    },

    async createWorld(worldName: string, playerNickname: string) {
      const signature = JSON.stringify([worldName.trim(), playerNickname.trim()]);
      const worldId = requestIdFor("create-world", signature, newWorldId);
      const created = await track(
        "create-world",
        () => gameApi.createWorld({ worldId, worldName, playerNickname }),
        "세계를 만들지 못했습니다.",
      );
      if (created) {
        store.remember({ worldDraft: undefined, worldCreateOpen: false });
        enterWorld(created, created.content);
      }
    },

    runCommand,

    async downloadBackup() {
      const world = currentWorld();
      if (!world) return;
      const backup = await track("backup", () => gameApi.getBackup(world.worldId), "백업을 만들지 못했습니다.");
      if (!backup) return;
      const blob = new Blob([`${JSON.stringify(backup, null, 2)}\n`], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `forest-workshop-${world.state.settings.worldName}-${backup.exportedAt.slice(0, 10)}.json`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      store.set({ notice: { kind: "info", text: "백업 파일을 저장했습니다. 비밀키는 들어 있지 않습니다." } });
    },

    /** Step 1 of restore: read the file and show what it holds. Nothing is sent yet. */
    async selectRestoreFile(file: File) {
      let raw: unknown;
      try {
        raw = JSON.parse(await file.text());
      } catch {
        store.set({
          restore: null,
          notice: { kind: "error", text: "백업 파일을 읽을 수 없습니다. JSON 백업 파일을 골라 주세요." },
        });
        return;
      }
      const preview = previewBackup(raw);
      if (!preview.ok) {
        store.set({ restore: null, notice: { kind: "error", text: preview.message } });
        return;
      }
      store.set({
        notice: null,
        restore: {
          fileName: file.name,
          signature: `${file.name}:${file.size}:${file.lastModified}`,
          backup: raw,
          summary: preview.summary,
        },
      });
    },

    cancelRestore() {
      store.set({ restore: null });
    },

    /** Step 2: restore into a new world. The current world is never overwritten. */
    async confirmRestore() {
      const selection = store.get().restore;
      if (!selection) return;
      const newWorldIdForRestore = requestIdFor("restore", selection.signature, newWorldId);
      const restored = await track(
        "restore",
        () => gameApi.restore(newWorldIdForRestore, selection.backup),
        "백업을 복원하지 못했습니다.",
      );
      if (!restored) return;
      enterWorld(restored, restored.content);
      store.set({
        route: "home",
        restore: null,
        notice: {
          kind: "info",
          text: `백업을 새 세계 '${restored.state.settings.worldName}'(으)로 복원했습니다. 기존 세계는 그대로입니다.`,
        },
      });
    },
  };
}

export type Controller = ReturnType<typeof createController>;

/** The season the screens draw now (visual only). */
export function currentSeason(state: Pick<AppState, "seasonChoice">): Season {
  return resolveSeason(state.seasonChoice);
}

/** Shell classes for the frame art of the current season that has loaded. */
export function artClasses(state: Pick<AppState, "seasonChoice" | "artReady">): string {
  return frameArt(currentSeason(state))
    .filter(({ path }) => state.artReady.includes(path))
    .map(({ flag }) => ` ${flag}`)
    .join("");
}
