// Production commands (plan §7.2, boards 01-2 공방 작업 · 01-3 시설과 창고):
//   production.setRules        운영 규칙 적용 / 추천 설정: a facility's rules, replaced as a whole (at most 5, one per
//                              recipe of that facility). A running job keeps going; the new rules apply from the next run.
//   production.setProtected    재고 보호 편집하기: protected amount per item (0–999). Production and selling never
//                              use protected stock.
//   production.upgradeFacility 강화: gold for the next level, decided by the server. The current run keeps the time it
//                              started with (plan §7.2-C); the next run is faster.
//   production.markReportsRead 작업 보고 확인: marks reports read. It grants nothing; outputs went to the storeroom
//                              when they were made (plan §7.2-C).
//   production.unlockFacility  해금: opens a facility once its condition holds (one time, no cost).
//   production.setMode         자동 운영 / 지정 횟수: the running run finishes as it is; the next run follows the new
//                              mode. The other mode's settings (rules, queue) wait unchanged (plan §7.2-B).
//   production.queueAdd/Remove 지정 횟수 대기열: 1–99 runs of one recipe per slot; slots grow with the level. Inputs
//                              are taken one run at a time when each run starts (plan §7.2-C).
//   production.assignResident  배치 변경: one recruited resident per facility, a resident in one facility at a time.
//                              The running run keeps its speed; the next run uses the new passive.
// Every command first settles the world to now (services/command-service.ts), so these act on the present workshop.
import { z } from "zod";
import { isKnownItem } from "../../content/items";
import {
  FACILITY_MAX_LEVEL,
  MAX_RULES_PER_FACILITY,
  PROTECTED_STOCK_RANGE,
  QUEUE_COUNT_RANGE,
  queueSlots,
  recipeDefinition,
  upgradeCost,
} from "../../content/production";
import { FwError } from "../errors";
import { FACILITY_MODES, ruleSchema, type FacilityState } from "../model/production";
import { unlockParts } from "../production/unlock";
import type { WorldState } from "../world-model";
import { defineCommand } from "./command";

function requireFacility(state: WorldState, facilityId: string, options: { open?: boolean } = {}): FacilityState {
  const facility = state.production.facilities[facilityId];
  if (!facility) throw new FwError("facility_not_found");
  if (options.open !== false && !facility.unlocked) throw new FwError("facility_locked");
  return facility;
}

function putFacility(state: WorldState, facilityId: string, facility: FacilityState): WorldState {
  return {
    ...state,
    production: { ...state.production, facilities: { ...state.production.facilities, [facilityId]: facility } },
  };
}

export const setRules = defineCommand({
  type: "production.setRules",
  payloadSchema: z
    .object({ facilityId: z.string().max(64), rules: z.array(ruleSchema).max(MAX_RULES_PER_FACILITY) })
    .strict(),
  // Last write wins: rules are a whole plan the player applies; another tab's plan is replaced, never merged.
  requiresFreshView: false,
  apply(state, payload) {
    const facility = requireFacility(state, payload.facilityId);
    const recipes = new Set<string>();
    const policies = new Set<string>();
    for (const rule of payload.rules) {
      if (recipeDefinition(rule.recipeId)?.facilityId !== payload.facilityId) throw new FwError("invalid_rules");
      if (recipes.has(rule.recipeId) || policies.has(rule.policyId)) throw new FwError("invalid_rules");
      recipes.add(rule.recipeId);
      policies.add(rule.policyId);
    }
    const next = { ...facility, rules: payload.rules };
    return { state: putFacility(state, payload.facilityId, next), result: { facilityId: payload.facilityId } };
  },
});

export const setProtected = defineCommand({
  type: "production.setProtected",
  payloadSchema: z
    .object({
      itemId: z.string().max(64),
      amount: z.number().int().min(PROTECTED_STOCK_RANGE.min).max(PROTECTED_STOCK_RANGE.max),
    })
    .strict(),
  requiresFreshView: false,
  apply(state, payload) {
    if (!isKnownItem(payload.itemId)) throw new FwError("invalid_payload");
    const protectedStock = { ...state.production.protectedStock };
    if (payload.amount === 0) delete protectedStock[payload.itemId];
    else protectedStock[payload.itemId] = payload.amount;
    return {
      state: { ...state, production: { ...state.production, protectedStock } },
      result: { itemId: payload.itemId, amount: payload.amount },
    };
  },
});

export const upgradeFacility = defineCommand({
  type: "production.upgradeFacility",
  // The level the player saw: a retry after a successful upgrade, or a second tap, must not upgrade twice.
  payloadSchema: z.object({ facilityId: z.string().max(64), fromLevel: z.number().int().min(1) }).strict(),
  requiresFreshView: false,
  apply(state, payload) {
    const facility = requireFacility(state, payload.facilityId);
    if (facility.level !== payload.fromLevel) {
      throw new FwError("stale_view", { details: { level: facility.level } });
    }
    if (facility.level >= FACILITY_MAX_LEVEL) throw new FwError("max_level");
    const cost = upgradeCost(facility.level);
    if (state.wallet.gold < cost) throw new FwError("not_enough_gold", { details: { cost } });
    const next = { ...facility, level: facility.level + 1 };
    return {
      state: {
        ...putFacility(state, payload.facilityId, next),
        wallet: { ...state.wallet, gold: state.wallet.gold - cost },
      },
      result: { facilityId: payload.facilityId, level: next.level, cost },
    };
  },
});

export const markReportsRead = defineCommand({
  type: "production.markReportsRead",
  payloadSchema: z.object({ throughReportId: z.number().int().min(0) }).strict(),
  requiresFreshView: false,
  apply(state, payload) {
    const latest = state.production.reports[0]?.reportId ?? 0;
    const through = Math.min(Math.max(payload.throughReportId, state.production.reportsReadThrough), latest);
    return {
      state: { ...state, production: { ...state.production, reportsReadThrough: through } },
      result: { reportsReadThrough: through },
    };
  },
});

export const unlockFacility = defineCommand({
  type: "production.unlockFacility",
  payloadSchema: z.object({ facilityId: z.string().max(64) }).strict(),
  requiresFreshView: false,
  apply(state, payload) {
    const facility = requireFacility(state, payload.facilityId, { open: false });
    if (facility.unlocked) return { state, result: { facilityId: payload.facilityId, alreadyOpen: true } };
    const parts = unlockParts(state.production, payload.facilityId);
    if (!parts.every((part) => part.met)) throw new FwError("unlock_not_met", { details: { parts } });
    return {
      state: putFacility(state, payload.facilityId, { ...facility, unlocked: true, waiting: null }),
      result: { facilityId: payload.facilityId, alreadyOpen: false },
    };
  },
});

export const setMode = defineCommand({
  type: "production.setMode",
  payloadSchema: z.object({ facilityId: z.string().max(64), mode: z.enum(FACILITY_MODES) }).strict(),
  requiresFreshView: false,
  apply(state, payload) {
    const facility = requireFacility(state, payload.facilityId);
    return {
      state: putFacility(state, payload.facilityId, { ...facility, mode: payload.mode }),
      result: { facilityId: payload.facilityId, mode: payload.mode, running: facility.job !== null },
    };
  },
});

export const queueAdd = defineCommand({
  type: "production.queueAdd",
  payloadSchema: z
    .object({
      facilityId: z.string().max(64),
      entryId: z.string().uuid(),
      recipeId: z.string().max(64),
      count: z.number().int().min(QUEUE_COUNT_RANGE.min).max(QUEUE_COUNT_RANGE.max),
    })
    .strict(),
  requiresFreshView: false,
  apply(state, payload) {
    const facility = requireFacility(state, payload.facilityId);
    if (recipeDefinition(payload.recipeId)?.facilityId !== payload.facilityId) throw new FwError("invalid_payload");
    if (facility.queue.some((entry) => entry.entryId === payload.entryId)) throw new FwError("invalid_payload");
    if (facility.queue.length >= queueSlots(facility.level)) throw new FwError("queue_full");
    const queue = [
      ...facility.queue,
      { entryId: payload.entryId, recipeId: payload.recipeId, total: payload.count, started: 0 },
    ];
    return {
      state: putFacility(state, payload.facilityId, { ...facility, queue }),
      result: { facilityId: payload.facilityId, entryId: payload.entryId },
    };
  },
});

export const queueRemove = defineCommand({
  type: "production.queueRemove",
  payloadSchema: z.object({ facilityId: z.string().max(64), entryId: z.string().uuid() }).strict(),
  requiresFreshView: false,
  apply(state, payload) {
    const facility = requireFacility(state, payload.facilityId);
    // Only runs that have not started are removed; a running run finishes and its output stays (plan §7.2-C).
    const queue = facility.queue.filter((entry) => entry.entryId !== payload.entryId);
    return {
      state: putFacility(state, payload.facilityId, { ...facility, queue }),
      result: { facilityId: payload.facilityId, removed: queue.length !== facility.queue.length },
    };
  },
});

export const assignResident = defineCommand({
  type: "production.assignResident",
  payloadSchema: z.object({ facilityId: z.string().max(64), residentId: z.string().uuid().nullable() }).strict(),
  requiresFreshView: false,
  apply(state, payload) {
    requireFacility(state, payload.facilityId);
    if (payload.residentId !== null) {
      const resident = state.residents[payload.residentId];
      if (!resident) throw new FwError("resident_not_found");
      if (!resident.recruited) throw new FwError("resident_not_recruited");
      if (state.activities.running?.residentId === resident.residentId) throw new FwError("resident_busy");
      if (state.stories.expedition?.participants.includes(resident.residentId)) throw new FwError("resident_busy");
    }
    // Placing a resident here takes them out of any other facility (one place at a time, plan §7.2-A).
    const facilities = Object.fromEntries(
      Object.entries(state.production.facilities).map(([facilityId, facility]) => {
        if (facilityId === payload.facilityId) return [facilityId, { ...facility, residentId: payload.residentId }];
        if (payload.residentId !== null && facility.residentId === payload.residentId) {
          return [facilityId, { ...facility, residentId: null }];
        }
        return [facilityId, facility];
      }),
    );
    return {
      state: { ...state, production: { ...state.production, facilities } },
      result: { facilityId: payload.facilityId, residentId: payload.residentId },
    };
  },
});
