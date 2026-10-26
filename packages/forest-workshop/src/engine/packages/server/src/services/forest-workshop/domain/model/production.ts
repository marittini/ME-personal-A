// The workshop's production state (plan §6 세계 문서: facilities/jobs/automationPolicies/productionReports/
// lastSettledAt, §7.2, §7.6). Times inside the simulation are "workshop time" (simMs): it runs with real time while
// the player is present and for at most 72 hours of an absence, so a job paused at the 72-hour edge keeps its
// remaining minutes until the player returns.
import { z } from "zod";
import {
  FACILITY_MAX_LEVEL,
  MAX_RULES_PER_FACILITY,
  PROTECTED_STOCK_RANGE,
  QUEUE_COUNT_RANGE,
  QUEUE_SLOT_LEVELS,
  TARGET_STOCK_RANGE,
} from "../../content/production";

const nonNegativeInt = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER);
const amounts = z.record(z.string(), z.number().int().min(1).max(1_000_000));
const isoTime = z.string().datetime();

export const ruleSchema = z
  .object({
    policyId: z.string().uuid(),
    enabled: z.boolean(),
    recipeId: z.string().min(1).max(64),
    targetStock: z.number().int().min(TARGET_STOCK_RANGE.min).max(TARGET_STOCK_RANGE.max),
    /** 1–5, smaller first; ties keep the order of the list (plan §7.2-B). */
    priority: z.number().int().min(1).max(5),
  })
  .strict();
export type Rule = z.infer<typeof ruleSchema>;

export const jobSchema = z
  .object({
    jobId: nonNegativeInt,
    recipeId: z.string().min(1).max(64),
    /** The rule (자동 운영) or the queue entry (지정 횟수) that started it. */
    policyId: z.string().uuid(),
    source: z.enum(["rule", "queue"]),
    /** Workshop time the run started and ends. Duration and outputs are fixed at the start (plan §7.2-C). */
    startedSim: nonNegativeInt,
    endsSim: nonNegativeInt,
    consumed: amounts,
    outputs: amounts,
  })
  .strict();
export type Job = z.infer<typeof jobSchema>;

export const WAIT_REASONS = ["materials", "target_reached", "no_rules", "queue_empty", "locked"] as const;
export const waitingSchema = z
  .object({
    reason: z.enum(WAIT_REASONS),
    /** For "materials": the first rule's missing item, how many one run needs and how many are usable. */
    itemId: z.string().max(64).optional(),
    needed: nonNegativeInt.optional(),
    usable: nonNegativeInt.optional(),
    protectedAmount: nonNegativeInt.optional(),
  })
  .strict();
export type Waiting = z.infer<typeof waitingSchema>;

/** One 지정 횟수 request: run this recipe `total` times; `started` of them have begun. */
export const queueEntrySchema = z
  .object({
    entryId: z.string().uuid(),
    recipeId: z.string().min(1).max(64),
    total: z.number().int().min(QUEUE_COUNT_RANGE.min).max(QUEUE_COUNT_RANGE.max),
    started: z.number().int().min(0).max(QUEUE_COUNT_RANGE.max),
  })
  .strict()
  .refine((entry) => entry.started < entry.total, { message: "finished entry" });
export type QueueEntry = z.infer<typeof queueEntrySchema>;

export const FACILITY_MODES = ["auto", "count"] as const;
export type FacilityMode = (typeof FACILITY_MODES)[number];

export const facilityStateSchema = z
  .object({
    /** Opened by its 해금 condition (or from the start). A closed facility never runs. */
    unlocked: z.boolean(),
    level: z.number().int().min(1).max(FACILITY_MAX_LEVEL),
    /** 자동 운영 (rules) or 지정 횟수 (queue). Only one runs; the other's settings wait unchanged (plan §7.2-B). */
    mode: z.enum(FACILITY_MODES),
    rules: z.array(ruleSchema).max(MAX_RULES_PER_FACILITY),
    queue: z.array(queueEntrySchema).max(QUEUE_SLOT_LEVELS.length),
    /** The resident placed here (배치), or null. Facilities work without one. */
    residentId: z.string().uuid().nullable(),
    job: jobSchema.nullable(),
    /** Why the facility is idle, as of the last evaluation; null while a job runs. */
    waiting: waitingSchema.nullable(),
  })
  .strict();
export type FacilityState = z.infer<typeof facilityStateSchema>;

export const REPORT_LIMIT = 20;
export const reportSchema = z
  .object({
    reportId: nonNegativeInt,
    /** Real time the settlement that produced it ran. */
    at: isoTime,
    simFrom: nonNegativeInt,
    simTo: nonNegativeInt,
    produced: z.record(z.string(), nonNegativeInt),
    /** Inputs of the completed runs. */
    consumed: z.record(z.string(), nonNegativeInt),
    runs: nonNegativeInt,
    /** Auto-sold items and the gold they brought. */
    sold: z.record(z.string(), nonNegativeInt),
    gold: nonNegativeInt,
    /** Part of this report came from time the player was away (credited absence). */
    offlineMs: nonNegativeInt,
  })
  .strict();
export type ProductionReport = z.infer<typeof reportSchema>;

export const ABSENCE_LIMIT_MS = 72 * 60 * 60 * 1000;
/** An active screen renews its lease every 60 s; the lease lasts 90 s (plan §7.6). */
export const LEASE_MS = 90 * 1000;

export const activitySchema = z
  .object({
    /** Real time up to which time has been accounted; null until the first settlement. */
    settledAt: isoTime.nullable(),
    lastActiveAt: isoTime.nullable(),
    /** The player counts as present until this time (renewed by heartbeats and commands). */
    leaseUntil: isoTime.nullable(),
    /** Credited absence of the current absence so far, at most 72 hours. */
    absenceUsedMs: z.number().int().min(0).max(ABSENCE_LIMIT_MS),
    /** The absence that ended at the last return: credited and total length, for 미접속 누적. */
    lastAbsence: z.object({ creditedMs: nonNegativeInt, totalMs: nonNegativeInt }).strict().nullable(),
  })
  .strict();
export type Activity = z.infer<typeof activitySchema>;

/** 자동 판매 for one item (plan §7.2-C): off by default; keeps at least `keep` and sells at most `dailyMax` a UTC day. */
export const autoSellSchema = z
  .object({
    enabled: z.boolean(),
    keep: z.number().int().min(0).max(999),
    dailyMax: z.number().int().min(1).max(999),
  })
  .strict();
export type AutoSell = z.infer<typeof autoSellSchema>;

export const productionSchema = z
  .object({
    simMs: nonNegativeInt,
    facilities: z.record(z.string(), facilityStateSchema),
    protectedStock: z.record(
      z.string(),
      z.number().int().min(PROTECTED_STOCK_RANGE.min).max(PROTECTED_STOCK_RANGE.max),
    ),
    autoSell: z.record(z.string(), autoSellSchema),
    /** Auto-sold amounts on one UTC day; a new day starts from zero. Moving the city does not reset it. */
    sales: z
      .object({
        day: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/u)
          .nullable(),
        sold: z.record(z.string(), nonNegativeInt),
      })
      .strict(),
    /** Everything ever made, per item (해금 conditions). */
    made: z.record(z.string(), nonNegativeInt),
    reports: z.array(reportSchema).max(REPORT_LIMIT),
    /** Reports with an ID up to this one were read in 작업 보고 (reading never grants anything). */
    reportsReadThrough: nonNegativeInt,
    nextJobId: nonNegativeInt,
    nextReportId: nonNegativeInt,
    activity: activitySchema,
  })
  .strict();
export type ProductionState = z.infer<typeof productionSchema>;
