// Application actions. The only module that writes the store or calls the API; screens call these actions.
//
// Retry safety: every change carries a request ID. While an action is pending its button is disabled. If the
// request fails without a definite answer (network loss, server error), the same ID is kept so pressing the button
// again cannot apply the change twice; a definite refusal (a 4xx with a code) drops it.
import { gameApi } from "./api";
import { previewBackup, type BackupSummary } from "./backup-preview";
import { lockedMessage, type LockedFeature } from "./features";
import { clampFontSize, readFontSize, writeFontSize } from "./preferences";
import type { Loadable } from "./dom";
import { errorCode, errorMessage, newRequestId, newWorldId } from "./host-api";
import { createStore, type Store } from "./store";
import type { GameContent, StorageUsage, WorldState, WorldSummary, WorldView } from "./types";

export type Route = "worlds" | "home" | "work" | "facilities" | "settings" | "backup" | "diagnostics";

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
  /** 시설과 창고: which tab is open. */
  facilitiesTab: "facilities" | "storage";
  /** 저장·백업 → 저장 공간 사용량, loaded when that screen opens. */
  storage: Loadable<StorageUsage> | null;
  /** The welcome-package sheet was put off for this session ("나중에"). */
  starterSheetHidden: boolean;
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
    facilitiesTab: "facilities",
    storage: null,
    starterSheetHidden: false,
  });
  const pending = new Map<string, PendingRequest>();

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

  function showWorld(view: WorldView, content?: GameContent) {
    writeLastWorld(view.worldId);
    store.set((state) => ({
      world: {
        state: "ready",
        value: { worldId: view.worldId, revision: view.revision, updatedAt: view.updatedAt, state: view.state },
      },
      content: content ?? state.content,
      route: state.route === "worlds" ? "home" : state.route,
    }));
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
    store.set({ world: { state: "loading" }, route: "home", notice: null });
    try {
      const view = await gameApi.getState(worldId);
      showWorld(view, view.content);
    } catch (error) {
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

  return {
    store,

    async start() {
      const worlds = await loadWorlds();
      const last = readLastWorld();
      if (worlds && last && worlds.some((world) => world.worldId === last && world.readable)) await openWorld(last);
    },

    loadWorlds,
    openWorld,
    reloadWorld,

    navigate(route: Route) {
      store.set({ route, notice: null, restore: null });
      if (route === "worlds") void loadWorlds();
      if (route === "backup") void loadStorage();
    },

    /** A locked mockup element was tapped: say which phase opens it. */
    notifyLocked(feature: LockedFeature) {
      store.set({ notice: { kind: "info", text: lockedMessage(feature) } });
    },

    setFontSize(value: number) {
      const fontSize = clampFontSize(value);
      writeFontSize(fontSize);
      store.set({ fontSize });
    },

    setFacilitiesTab(tab: AppState["facilitiesTab"]) {
      store.set({ facilitiesTab: tab });
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
      if (created) showWorld(created, created.content);
    },

    /** Sends a game command; the server decides every amount. */
    async runCommand(actionKey: string, type: string, payload: Record<string, unknown> = {}) {
      const world = currentWorld();
      if (!world) return null;
      const signature = JSON.stringify([world.worldId, type, payload]);
      const commandId = requestIdFor(actionKey, signature);
      const response = await track(
        actionKey,
        () =>
          gameApi.sendCommand({ worldId: world.worldId, commandId, expectedRevision: world.revision, type, payload }),
        "요청을 처리하지 못했습니다. 다시 시도해 주세요.",
      );
      if (!response) return null;
      showWorld({
        worldId: world.worldId,
        revision: response.revision,
        updatedAt: new Date().toISOString(),
        state: response.state as WorldState,
      });
      return response;
    },

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
      showWorld(restored, restored.content);
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
