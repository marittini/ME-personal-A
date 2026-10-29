// Residents, pairs and pictures (boards 03-1 주민, 03-2 관계, 04-2 주민 그림). Screen state for those boards and the
// actions behind their buttons. Every change is a server command; a picture is uploaded first and the server attaches
// it. Retried uploads reuse their upload key, so a picture is never stored twice.
import { gameApi } from "./api";
import type { ControllerCore, Sheet } from "./controller";
import { newWorldId as newUuid } from "./host-api";
import type { Pair, Placement, Resident, ResidentKind, WorldState } from "./types";

export interface ResidentsView {
  tab: "all" | ResidentKind;
  query: string;
  filter: "all" | "recruited" | "waiting";
  selectedId: string | null;
  page?: number;
  detailOpen?: boolean;
}

export type ResidentSheet =
  | { kind: "mailbox"; archived?: boolean; page?: number; id?: string }
  | { kind: "guidelines"; pairId?: string; draft?: { enabled: boolean; text: string } }
  | {
      kind: "memory";
      pairId?: string;
      page?: number;
      factId?: number;
      draft?: string;
      residentId?: string;
      status?: "all" | "active" | "corrected" | "invalidated";
    }
  | { kind: "profile"; residentId: string; panel?: number; draft?: string; historyPage?: number }
  | { kind: "pair-add"; residentId: string }
  | { kind: "image-history"; residentId: string }
  | { kind: "history-cleanup" }
  | { kind: "field"; residentId: string };

/** The residents 주민 shows, in its order: recruited first, then by registration. */
export function visibleResidents(state: WorldState, view: ResidentsView): Resident[] {
  const query = view.query.trim().toLowerCase();
  return Object.values(state.residents)
    .filter((resident) => view.tab === "all" || resident.kind === view.tab)
    .filter((resident) =>
      view.filter === "all" ? true : view.filter === "recruited" ? resident.recruited : !resident.recruited,
    )
    .filter(
      (resident) =>
        !query ||
        resident.displayName.toLowerCase().includes(query) ||
        resident.source.name.toLowerCase().includes(query),
    )
    .sort((a, b) => Number(b.recruited) - Number(a.recruited) || a.registeredAt.localeCompare(b.registeredAt));
}

/** The action key of "pair these two": the same whichever of the two the player started from. */
export function pairAddKey(first: string, second: string): string {
  return `pair-add:${[first, second].sort().join(":")}`;
}

/** The other resident of a pair, seen from one of its residents. */
export function partnerOf(pair: Pair, residentId: string): string {
  return pair.residentIds[0] === residentId ? pair.residentIds[1] : pair.residentIds[0];
}

export function createResidentActions(core: ControllerCore) {
  const { store } = core;

  function residentIn(residentId: string | null): Resident | null {
    const world = core.currentWorld();
    return world && residentId ? (world.state.residents[residentId] ?? null) : null;
  }

  function patchView(patch: Partial<ResidentsView>) {
    store.set((state) => ({ residentsView: { ...state.residentsView, ...patch } }));
  }

  return {
    openGuidelines(pairId?: string) {
      store.set({ sheet: { kind: "guidelines", pairId } });
    },
    rememberGuidelines(draft: { enabled: boolean; text: string }) {
      store.remember((state) =>
        state.sheet?.kind === "guidelines" ? { sheet: { ...state.sheet, draft: { ...draft } } } : {},
      );
    },
    async saveGuidelines(pairId: string | undefined, draft: { enabled: boolean; text: string }) {
      const response = await core.runCommand(`guidelines:${pairId ?? "world"}`, "guidelines.update", {
        ...(pairId ? { pairId } : {}),
        ...draft,
      });
      if (!response) return;
      store.set((state) =>
        state.sheet?.kind === "guidelines" &&
        state.sheet.pairId === pairId &&
        JSON.stringify(state.sheet.draft) === JSON.stringify(draft)
          ? { sheet: { ...state.sheet, draft: undefined } }
          : {},
      );
      core.notify("AI 지침을 저장했어요. 다음에 새로 쓰는 이야기부터 적용돼요.");
    },
    openMailbox() {
      store.set({ sheet: { kind: "mailbox" } });
    },
    async openActivityLetter(id: string) {
      const letter = core.currentWorld()?.state.mailbox.letters.find((item) => item.id === id);
      if (!letter) {
        store.set({ sheet: { kind: "mailbox" } });
        core.notify("결과 편지를 찾을 수 없어요. 우편함을 확인해 주세요.");
        return;
      }
      store.set({ sheet: { kind: "mailbox", archived: letter.archived } });
      const response = letter.readAt ? true : await core.runCommand(`mail:${id}`, "mail.read", { id });
      if (response) store.set((state) => (state.sheet?.kind === "mailbox" ? { sheet: { ...state.sheet, id } } : {}));
    },
    setMailboxView(patch: { archived?: boolean; page?: number; id?: string }) {
      store.set((state) => (state.sheet?.kind === "mailbox" ? { sheet: { ...state.sheet, ...patch } } : {}));
    },
    async openLetter(id: string) {
      const response = await core.runCommand(`mail:${id}`, "mail.read", { id });
      if (response) store.set((state) => (state.sheet?.kind === "mailbox" ? { sheet: { ...state.sheet, id } } : {}));
    },
    async archiveLetter(id: string, archived: boolean) {
      const response = await core.runCommand(`mail:${id}`, "mail.archive", { id, archived });
      if (response)
        store.set((state) => (state.sheet?.kind === "mailbox" ? { sheet: { ...state.sheet, id: undefined } } : {}));
    },
    openMemory(pairId?: string) {
      store.set({ sheet: { kind: "memory", pairId, page: 0 } });
    },
    updateMemoryView(update: {
      page?: number;
      factId?: number;
      draft?: string;
      residentId?: string;
      status?: "all" | "active" | "corrected" | "invalidated";
    }) {
      store.set((state) => (state.sheet?.kind === "memory" ? { sheet: { ...state.sheet, ...update } } : {}));
    },
    rememberMemoryDraft(draft: string) {
      store.remember((state) => (state.sheet?.kind === "memory" ? { sheet: { ...state.sheet, draft } } : {}));
    },
    async correctMemory(factId: number, text: string) {
      const response = await core.runCommand(`memory:${factId}`, "memory.correct", { factId, text });
      if (response) {
        store.set((state) =>
          state.sheet?.kind === "memory"
            ? { sheet: { ...state.sheet, factId: Number(response.result.factId), draft: undefined } }
            : {},
        );
        core.notify("기억을 정정했어요. 원문은 이력에 남아요.");
      }
    },
    async setMemoryStatus(factId: number, active: boolean) {
      await core.runCommand(`memory:${factId}`, "memory.setStatus", { factId, active });
    },
    setResidentsTab: (tab: ResidentsView["tab"]) => patchView({ tab, page: 0 }),
    setResidentsQuery: (query: string) => patchView({ query, page: 0 }),
    setResidentsFilter: (filter: ResidentsView["filter"]) => patchView({ filter, page: 0 }),
    setResidentsPage: (page: number) => patchView({ page: Math.max(0, page) }),
    showResidentsList: () => patchView({ detailOpen: false }),
    selectResident: (residentId: string) => patchView({ selectedId: residentId, detailOpen: true }),

    openResidents(residentId?: string) {
      patchView(residentId ? { selectedId: residentId, detailOpen: true } : { detailOpen: false });
      core.navigate("residents");
    },

    openRelations(residentId: string) {
      store.set({ focusResidentId: residentId });
      core.navigate("relations");
    },

    openResidentImage(residentId: string) {
      const resident = residentIn(residentId);
      store.set({ focusResidentId: residentId, placementDraft: resident ? { ...resident.image.placement } : null });
      core.navigate("resident-image");
    },

    openSheet(sheet: Sheet) {
      store.set({ sheet, notice: null });
    },

    closeSheet() {
      store.set({ sheet: null });
    },

    rememberProfile(patch: { panel?: number; draft?: string; historyPage?: number }) {
      store.remember((state) => (state.sheet?.kind === "profile" ? { sheet: { ...state.sheet, ...patch } } : {}));
    },

    toggleRelationsEditing() {
      store.set((state) => ({ relationsEditing: !state.relationsEditing }));
    },

    async updateWorldSetting(residentId: string, worldSetting: string) {
      const response = await core.runCommand(`resident-setting:${residentId}`, "residents.update", {
        residentId,
        worldSetting,
      });
      if (response) {
        store.remember((state) =>
          state.sheet?.kind === "profile" ? { sheet: { ...state.sheet, draft: undefined } } : {},
        );
        core.notify("공방 세계 설정을 고쳤어요. 변경 이력에 남았어요.");
      }
      return response;
    },

    // 관계 (board 03-2) ------------------------------------------------------------------------------------------
    async addPair(residentId: string, partnerId: string) {
      const resident = residentIn(residentId);
      const partner = residentIn(partnerId);
      if (!resident || !partner) return;
      const key = pairAddKey(resident.residentId, partner.residentId);
      // The pair ID is made once per couple and kept across retries, so a retried add cannot make two rows.
      const pairId = core.requestIdFor(`${key}:id`, key, newUuid);
      const response = await core.runCommand(key, "pairs.add", {
        pairId,
        residentIds: [resident.residentId, partner.residentId],
      });
      if (response) {
        core.forgetRequest(`${key}:id`);
        store.set({ sheet: null });
        core.notify(`${resident.displayName} × ${partner.displayName} 페어를 만들었어요.`);
      }
    },

    archivePair: (pairId: string) => core.runCommand(`pair-archive:${pairId}`, "pairs.archive", { pairId }),
    restorePair: (pairId: string) => core.runCommand(`pair-restore:${pairId}`, "pairs.restore", { pairId }),

    // 주민 그림 (board 04-2) ---------------------------------------------------------------------------------------
    setPlacementDraft(patch: Partial<Placement>) {
      store.set((state) => (state.placementDraft ? { placementDraft: { ...state.placementDraft, ...patch } } : {}));
    },

    /** 기본 배치: back to the defaults on screen; 적용 saves them. */
    resetPlacementDraft() {
      const defaults = store.get().content?.residents.placement;
      if (!defaults) return;
      store.set({
        placementDraft: {
          scale: defaults.scale.default,
          offsetX: defaults.offsetX.default,
          markerHeight: defaults.markerHeight.default,
        },
      });
    },

    async applyPlacement(residentId: string) {
      const placement = store.get().placementDraft;
      if (!placement) return;
      const response = await core.runCommand(`placement:${residentId}`, "residents.setPlacement", {
        residentId,
        placement,
      });
      if (response) core.notify("배치를 적용했어요. 그림 파일은 그대로예요.");
    },

    async uploadResidentImage(residentId: string, file: File) {
      const world = core.currentWorld();
      if (!world) return null;
      const actionKey = `image-upload:${residentId}`;
      const uploadKey = core.requestIdFor(actionKey, `${residentId}:${file.name}:${file.size}:${file.lastModified}`);
      const response = await core.track(
        actionKey,
        () => gameApi.uploadResidentImage({ worldId: world.worldId, residentId, uploadKey, file }),
        "그림을 저장하지 못했어요. 기존 그림은 그대로예요.",
      );
      if (!response) return null;
      const latest = core.currentWorld() ?? world;
      core.showWorld({
        worldId: latest.worldId,
        revision: response.revision,
        updatedAt: new Date().toISOString(),
        state: response.state as WorldState,
      });
      core.notify(response.duplicate ? "이미 저장된 그림이에요." : "그림을 WebP로 저장했어요.");
      return response;
    },

    async restoreResidentImage(residentId: string, reference: string) {
      const response = await core.runCommand(`image-restore:${residentId}`, "residents.restoreImage", {
        residentId,
        reference,
      });
      if (response) {
        store.set({ sheet: null });
        core.notify("이전 그림으로 되돌렸어요.");
      }
    },

    /** 그림 이력 정리 (board 05-2): earlier pictures of every resident; current pictures stay. */
    async clearImageHistory() {
      const response = await core.runCommand("image-history-clear", "residents.clearImageHistory", {});
      if (!response) return;
      store.set({ sheet: null });
      const count = Array.isArray(response.result.released) ? response.result.released.length : 0;
      core.notify(count ? `이전 그림 ${count}장을 정리했어요.` : "정리할 이전 그림이 없어요.");
      await core.refreshStorage();
    },
  };
}
