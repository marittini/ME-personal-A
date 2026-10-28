// Production on screen (boards 01-1 공방 소식 · 01-2 공방 작업 · 01-3 시설과 창고): the rule drafts the player edits
// before 운영 규칙 적용, the presence heartbeat, and the actions behind upgrade, protection, selling and 작업 보고.
// The server decides every amount and time; the client shows what it was told and estimates countdowns from it.
import { gameApi } from "./api";
import type { ControllerCore } from "./controller";
import { newWorldId as newUuid } from "./host-api";
import type { AutoSell, FacilityMode, GameContent, ProductionState, Rule, WorldState } from "./types";

export interface WorkView {
  /** The facility 공방 작업 and 시설과 창고 show. */
  facilityId: string;
  /** Unapplied rule edits per facility; absent = the saved rules. */
  drafts: Record<string, Rule[]>;
  /** The rule whose recipe and target are shown, per facility. */
  selected: Record<string, string>;
  /** 지정 횟수: the recipe chosen for the next queue entry, per facility. */
  queueRecipe: Record<string, string>;
  section?: "status" | "recipe" | "priority";
}

export type ProductionSheet =
  | { kind: "work-report" }
  | { kind: "protect-edit" }
  | { kind: "sell"; itemId: string }
  | { kind: "assign"; facilityId: string }
  | { kind: "auto-sell" };

const HEARTBEAT_MS = 60_000;

/** Rules in the order the server tries them: enabled first is not implied; priority, then list order. */
export function sortRules(rules: readonly Rule[]): Rule[] {
  return rules
    .map((rule, index) => ({ rule, index }))
    .sort((a, b) => a.rule.priority - b.rule.priority || a.index - b.index)
    .map(({ rule }) => rule);
}

/** Renumbers priorities 1…n (capped at 5) in list order, so the list order is the order the server uses. */
function renumber(rules: Rule[]): Rule[] {
  return rules.map((rule, index) => ({ ...rule, priority: Math.min(5, index + 1) }));
}

export function draftRules(state: { work: WorkView }, production: ProductionState, facilityId: string): Rule[] {
  return state.work.drafts[facilityId] ?? sortRules(production.facilities[facilityId]?.rules ?? []);
}

export function isDraftDirty(state: { work: WorkView }, production: ProductionState, facilityId: string): boolean {
  const draft = state.work.drafts[facilityId];
  return (
    Boolean(draft) &&
    JSON.stringify(draft) !== JSON.stringify(sortRules(production.facilities[facilityId]?.rules ?? []))
  );
}

/** The parts of a world a heartbeat may change that the screens show; activity alone does not need a re-render. */
function visible(state: WorldState) {
  const { activity, simMs: _simMs, ...production } = state.production;
  // The last absence is shown (미접속 누적); the rest of the activity record is bookkeeping.
  return JSON.stringify([state.inventory, state.wallet, production, activity.lastAbsence]);
}

export function createProductionActions(core: ControllerCore) {
  const { store } = core;
  let heartbeatTimer: ReturnType<typeof setInterval> | undefined;
  let heartbeatBusy = false;

  function content(): GameContent | null {
    return store.get().content;
  }

  function patchWork(update: Partial<WorkView>) {
    store.set((state) => ({ work: { ...state.work, ...update } }));
  }

  function editDraft(facilityId: string, change: (rules: Rule[]) => Rule[]) {
    const world = core.currentWorld();
    if (!world) return;
    const current = draftRules(store.get(), world.state.production, facilityId);
    patchWork({ drafts: { ...store.get().work.drafts, [facilityId]: change(current.map((rule) => ({ ...rule }))) } });
  }

  /** Presence (plan §7.6): only a visible, focused game screen renews it. */
  async function heartbeat() {
    const world = core.currentWorld();
    if (!world || heartbeatBusy) return;
    if (typeof document !== "undefined" && (document.visibilityState !== "visible" || !document.hasFocus())) return;
    heartbeatBusy = true;
    try {
      const view = await gameApi.heartbeat(world.worldId);
      const latest = core.currentWorld();
      if (!latest || latest.worldId !== view.worldId) return;
      // Same screen content: keep it without a re-render, so a field being typed in is not rebuilt.
      if (visible(latest.state) === visible(view.state)) core.rememberWorld(view);
      else core.showWorld(view);
    } catch {
      // A missed heartbeat only means this minute may count as absence; the next one tries again.
    } finally {
      heartbeatBusy = false;
    }
  }

  /** Reads the world again without a loading state (a countdown reached its end). A read is not presence. */
  async function refreshProduction() {
    const world = core.currentWorld();
    if (!world) return;
    try {
      const view = await gameApi.getState(world.worldId);
      const latest = core.currentWorld();
      if (!latest || latest.worldId !== view.worldId) return;
      if (visible(latest.state) === visible(view.state)) core.rememberWorld(view);
      else core.showWorld(view);
    } catch {
      // The next heartbeat or action brings the world up to date.
    }
  }

  return {
    heartbeat,
    refreshProduction,

    startHeartbeat() {
      clearInterval(heartbeatTimer);
      heartbeatTimer = setInterval(() => void heartbeat(), HEARTBEAT_MS);
      void heartbeat();
    },

    stopHeartbeat() {
      clearInterval(heartbeatTimer);
      heartbeatTimer = undefined;
    },

    selectFacility(facilityId: string) {
      patchWork({ facilityId, section: "status" });
    },

    setWorkSection(section: NonNullable<WorkView["section"]>) {
      patchWork({ section });
    },

    selectRule(facilityId: string, policyId: string) {
      patchWork({ selected: { ...store.get().work.selected, [facilityId]: policyId } });
    },

    changeTarget(facilityId: string, policyId: string, delta: number) {
      const range = content()?.production.targetStock ?? { min: 1, max: 999 };
      editDraft(facilityId, (rules) =>
        rules.map((rule) =>
          rule.policyId === policyId
            ? { ...rule, targetStock: Math.min(range.max, Math.max(range.min, rule.targetStock + delta)) }
            : rule,
        ),
      );
    },

    toggleRule(facilityId: string, policyId: string) {
      editDraft(facilityId, (rules) =>
        rules.map((rule) => (rule.policyId === policyId ? { ...rule, enabled: !rule.enabled } : rule)),
      );
    },

    moveRule(facilityId: string, policyId: string, direction: -1 | 1) {
      editDraft(facilityId, (rules) => {
        const index = rules.findIndex((rule) => rule.policyId === policyId);
        const target = index + direction;
        if (index < 0 || target < 0 || target >= rules.length) return rules;
        const next = [...rules];
        [next[index], next[target]] = [next[target]!, next[index]!];
        return renumber(next);
      });
    },

    addRule(facilityId: string, recipeId: string) {
      const template = content()?.production.recommendedRules[facilityId]?.find((rule) => rule.recipeId === recipeId);
      const policyId = newUuid();
      editDraft(facilityId, (rules) =>
        renumber([
          ...rules,
          { policyId, enabled: true, recipeId, targetStock: template?.targetStock ?? 10, priority: 5 },
        ]),
      );
      patchWork({ selected: { ...store.get().work.selected, [facilityId]: policyId } });
    },

    removeRule(facilityId: string, policyId: string) {
      editDraft(facilityId, (rules) => renumber(rules.filter((rule) => rule.policyId !== policyId)));
    },

    /** 추천 설정: the recommended rules as a draft to look at; nothing changes until 운영 규칙 적용. */
    recommendRules(facilityId: string) {
      const world = core.currentWorld();
      const templates = content()?.production.recommendedRules[facilityId] ?? [];
      if (!world) return;
      const saved = world.state.production.facilities[facilityId]?.rules ?? [];
      const draft = templates.map((template) => ({
        policyId: saved.find((rule) => rule.recipeId === template.recipeId)?.policyId ?? newUuid(),
        enabled: true,
        recipeId: template.recipeId,
        targetStock: template.targetStock,
        priority: template.priority,
      }));
      patchWork({ drafts: { ...store.get().work.drafts, [facilityId]: draft } });
      core.notify("추천 설정을 불러왔어요. 확인한 뒤 '운영 규칙 적용'을 누르면 바뀌어요.");
    },

    /** 되돌리기: drops the draft; the saved rules stay as they are. */
    discardDraft(facilityId: string) {
      const drafts = { ...store.get().work.drafts };
      delete drafts[facilityId];
      patchWork({ drafts });
    },

    async applyRules(facilityId: string) {
      const draft = store.get().work.drafts[facilityId];
      if (!draft) return;
      const response = await core.runCommand(`rules:${facilityId}`, "production.setRules", {
        facilityId,
        rules: draft,
      });
      if (!response) return;
      const drafts = { ...store.get().work.drafts };
      delete drafts[facilityId];
      patchWork({ drafts });
      core.notify("운영 규칙을 적용했어요. 지금 작업은 그대로 이어지고 다음 회차부터 바뀌어요.");
    },

    async upgradeFacility(facilityId: string, fromLevel: number) {
      const response = await core.runCommand(`upgrade:${facilityId}:${fromLevel}`, "production.upgradeFacility", {
        facilityId,
        fromLevel,
      });
      if (response) core.notify(`Lv. ${String(response.result.level)}로 강화했어요. 다음 회차부터 빨라져요.`);
    },

    async setProtected(itemId: string, amount: number) {
      await core.runCommand(`protect:${itemId}`, "production.setProtected", { itemId, amount });
    },

    async sell(itemId: string, amount: number) {
      const response = await core.runCommand(`sell:${itemId}`, "economy.sell", { itemId, amount });
      if (response) {
        store.set({ sheet: null });
        core.notify(`${amount}개를 팔아 ${String(response.result.gold)} G를 받았어요.`);
      }
    },

    async unlockFacility(facilityId: string) {
      const response = await core.runCommand(`unlock:${facilityId}`, "production.unlockFacility", { facilityId });
      if (response && !response.result.alreadyOpen) core.notify("시설이 열렸어요. 추천 규칙으로 바로 일을 시작해요.");
    },

    /** 자동 운영 / 지정 횟수: the running run finishes as it is; the next one follows the new mode. */
    async setMode(facilityId: string, mode: FacilityMode) {
      const response = await core.runCommand(`mode:${facilityId}`, "production.setMode", { facilityId, mode });
      if (response?.result.running) core.notify("지금 작업이 끝나면 바뀐 방식으로 이어져요.");
    },

    selectQueueRecipe(facilityId: string, recipeId: string) {
      patchWork({ queueRecipe: { ...store.get().work.queueRecipe, [facilityId]: recipeId } });
    },

    async addQueue(facilityId: string, recipeId: string, count: number) {
      // The entry ID stays the same while this request is retried, so a lost answer cannot add it twice.
      const entryKey = `queue-entry:${facilityId}`;
      const entryId = core.requestIdFor(entryKey, JSON.stringify([recipeId, count]), newUuid);
      const response = await core.runCommand(`queue:${facilityId}`, "production.queueAdd", {
        facilityId,
        entryId,
        recipeId,
        count,
      });
      if (response) core.forgetRequest(entryKey);
    },

    async removeQueue(facilityId: string, entryId: string) {
      await core.runCommand(`queue-remove:${entryId}`, "production.queueRemove", { facilityId, entryId });
    },

    /** 배치 변경: null takes the resident out. */
    async assignResident(facilityId: string, residentId: string | null) {
      const response = await core.runCommand(`assign:${facilityId}`, "production.assignResident", {
        facilityId,
        residentId,
      });
      if (response) store.set({ sheet: null });
    },

    async setAutoSell(itemId: string, setting: AutoSell) {
      const response = await core.runCommand(`auto-sell:${itemId}`, "economy.setAutoSell", { itemId, setting });
      if (response) core.notify(setting.enabled ? "자동 판매 설정을 저장했어요." : "자동 판매를 껐어요.");
    },

    /** 작업 보고 확인: marks what was shown as read. Outputs went to the storeroom when they were made. */
    async readReports(throughReportId: number) {
      const response = await core.runCommand("reports-read", "production.markReportsRead", { throughReportId });
      if (response) store.set({ sheet: null });
    },
  };
}
