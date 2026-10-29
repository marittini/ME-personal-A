// The world document's shape (plan §6). The zod schema is the single source: the TypeScript type is inferred from
// it, every load is validated against it, and a backup is checked with it before anything is written.
// Each phase adds its parts through a schema migration (domain/migrations.ts): v2 added residents and pairs (P2),
// v3 made pairs any two residents, v4 added production (P3a), v5 the rest of P3 (fields, placement, 지정 횟수, 자동 판매,
// 초대, 납품), v6 a field and talent on every resident, decided at registration, v7 stories, the memory ledger and
// the player's trust (P4).
import { z } from "zod";
import { isKnownItem } from "../content/items";
import { FACILITIES, queueSlots, recipeDefinition } from "../content/production";
import { talentDefinition } from "../content/talents";
import { deliveryStateSchema, initialInvite, inviteStateSchema } from "./model/invite";
import { memorySchema } from "./model/memory";
import { storiesStateSchema } from "./model/stories";
import { MAX_PAIRS, pairSchema } from "./model/pairs";
import { productionSchema } from "./model/production";
import { initialProduction } from "./production/initial";
import { MAX_RESIDENTS, residentSchema } from "./model/residents";

import { guidelinesSchema, initialGuidelines } from "./model/guidelines";

import { mailboxSchema, initialMailbox } from "./model/mailbox";

export const CURRENT_SCHEMA_VERSION = 10;

const nonNegativeInt = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER);
const displayText = (max: number) =>
  z
    .string()
    .transform((value) => value.trim().replace(/\s+/gu, " "))
    .pipe(z.string().min(1).max(max));

export const WORLD_NAME_MAX = 40;
export const NICKNAME_MAX = 24;

export const worldNameSchema = displayText(WORLD_NAME_MAX);
export const nicknameSchema = displayText(NICKNAME_MAX);

export const inventorySchema = z
  .record(z.string(), nonNegativeInt)
  .refine((inventory) => Object.keys(inventory).every(isKnownItem), { message: "unknown item" });

export const DEFAULT_GROUND = { left: 12, right: 88, top: 58, bottom: 90 };
export const groundSchema = z
  .object({
    left: z.number().min(0).max(80),
    right: z.number().min(20).max(100),
    top: z.number().min(35).max(85),
    bottom: z.number().min(55).max(100),
  })
  .strict()
  .refine((g) => g.right - g.left >= 20 && g.bottom - g.top >= 10, { message: "이동영역이 너무 좁아요" });

const worldShape = z
  .object({
    schemaVersion: z.literal(CURRENT_SCHEMA_VERSION),
    worldId: z.string().uuid(),
    createdAt: z.string().datetime(),
    settings: z
      .object({
        worldName: worldNameSchema,
        playerNickname: nicknameSchema,
        ground: groundSchema.default(DEFAULT_GROUND),
      })
      .strict(),
    /** gold · 초대권 · 종표 (선택 영입 증표). */
    wallet: z.object({ gold: nonNegativeInt, tickets: nonNegativeInt, tokens: nonNegativeInt }).strict(),
    inventory: inventorySchema,
    progress: z
      .object({
        starterKitClaimed: z.boolean(),
        /** The one starting resident chosen at registration (plan §3); null until chosen. */
        starterResidentId: z.string().uuid().nullable(),
      })
      .strict(),
    residents: z.record(z.string().uuid(), residentSchema),
    pairs: z.record(z.string().uuid(), pairSchema),
    production: productionSchema,
    invite: inviteStateSchema,
    deliveries: deliveryStateSchema,
    stories: storiesStateSchema,
    memory: memorySchema,
    mailbox: mailboxSchema,
    guidelines: guidelinesSchema.default(initialGuidelines),
  })
  .strict();

/** Rules that span several parts of the world. Every stored world, command result and backup passes them. */
export const worldStateSchema = worldShape.superRefine((world, context) => {
  const issue = (path: (string | number)[], message: string) =>
    context.addIssue({ code: z.ZodIssueCode.custom, path, message });
  const residents = Object.entries(world.residents);
  const pairs = Object.entries(world.pairs);
  if (residents.length > MAX_RESIDENTS) issue(["residents"], "too many residents");
  if (pairs.length > MAX_PAIRS) issue(["pairs"], "too many pairs");

  const sources = new Set<string>();
  for (const [key, resident] of residents) {
    if (resident.residentId !== key) issue(["residents", key], "key mismatch");
    // The same source is one resident in a world (plan §10 P2: 동일주민 1명 유지).
    const source = `${resident.kind}:${resident.sourceId}`;
    if (sources.has(source)) issue(["residents", key], "duplicate source");
    if (talentDefinition(resident.talentId)?.field !== resident.field) issue(["residents", key], "talent field");
    sources.add(source);
  }
  const starter = world.progress.starterResidentId;
  if (starter !== null && !world.residents[starter]?.recruited) issue(["progress", "starterResidentId"], "unknown");

  // Each couple has one row (archived or not), so its history stays one history.
  for (const [id, guideline] of Object.entries(world.guidelines.pairs)) {
    if (!world.pairs[id] || guideline.text.length > 500) issue(["guidelines", "pairs", id], "invalid pair guideline");
  }
  const couples = new Set<string>();
  for (const [key, pair] of pairs) {
    if (pair.pairId !== key) issue(["pairs", key], "key mismatch");
    if (!pair.residentIds.every((id) => world.residents[id])) issue(["pairs", key], "unknown resident");
    if (pair.archived !== (pair.archivedAt !== null)) issue(["pairs", key], "archive time");
    const couple = pair.residentIds.join(":");
    if (couples.has(couple)) issue(["pairs", key], "duplicate pair");
    couples.add(couple);
  }

  // Production: exactly the content's facilities; rules and jobs use their facility's recipes, one rule per recipe.
  const facilityIds = Object.keys(world.production.facilities);
  if (facilityIds.length !== FACILITIES.length || !FACILITIES.every((f) => world.production.facilities[f.id])) {
    issue(["production", "facilities"], "facility set");
  }
  const placed = new Set<string>();
  for (const [facilityId, facility] of Object.entries(world.production.facilities)) {
    if (facility.residentId !== null) {
      if (!world.residents[facility.residentId]?.recruited) issue(["production", facilityId], "placed resident");
      if (placed.has(facility.residentId)) issue(["production", facilityId], "resident placed twice");
      placed.add(facility.residentId);
    }
    if (facility.queue.length > queueSlots(facility.level)) issue(["production", facilityId], "queue slots");
    for (const entry of facility.queue) {
      if (recipeDefinition(entry.recipeId)?.facilityId !== facilityId)
        issue(["production", facilityId], "queue recipe");
    }
    if (!facility.unlocked && (facility.job || facility.residentId))
      issue(["production", facilityId], "closed facility");
    const recipes = new Set<string>();
    for (const rule of facility.rules) {
      if (recipeDefinition(rule.recipeId)?.facilityId !== facilityId) issue(["production", facilityId], "rule recipe");
      if (recipes.has(rule.recipeId)) issue(["production", facilityId], "duplicate recipe rule");
      recipes.add(rule.recipeId);
    }
    if (facility.job && recipeDefinition(facility.job.recipeId)?.facilityId !== facilityId) {
      issue(["production", facilityId], "job recipe");
    }
    if (facility.job && facility.job.endsSim < world.production.simMs) issue(["production", facilityId], "job overdue");
  }
  if (!Object.keys(world.production.protectedStock).every(isKnownItem)) issue(["production"], "protected item");
  if (!Object.keys(world.production.autoSell).every(isKnownItem)) issue(["production"], "auto-sell item");
  for (const [pairId] of Object.entries(world.stories.pairs)) {
    if (!world.pairs[pairId]) issue(["stories", pairId], "unknown pair");
  }
  const expedition = world.stories.expedition;
  if (expedition) {
    if (!world.pairs[expedition.pairId]) issue(["stories", "expedition"], "unknown pair");
    if (!expedition.participants.every((id) => world.residents[id]?.recruited)) {
      issue(["stories", "expedition"], "participants");
    }
    for (const facility of Object.values(world.production.facilities)) {
      if (facility.residentId && expedition.participants.includes(facility.residentId)) {
        issue(["stories", "expedition"], "participant placed in a facility");
      }
    }
  }
  for (const fact of world.memory.facts) {
    if (!fact.knowerIds.every((id) => world.residents[id])) issue(["memory", fact.factId], "unknown knower");
  }
  const wish = world.invite.wishResidentId;
  if (wish !== null && !world.residents[wish]) issue(["invite", "wishResidentId"], "unknown resident");
});

export type WorldState = z.infer<typeof worldStateSchema>;

export interface NewWorldInput {
  worldId: string;
  worldName: string;
  playerNickname: string;
  now: string;
}

export function createWorldState(input: NewWorldInput): WorldState {
  return worldStateSchema.parse({
    schemaVersion: CURRENT_SCHEMA_VERSION,
    worldId: input.worldId,
    createdAt: input.now,
    settings: { worldName: input.worldName, playerNickname: input.playerNickname },
    mailbox: initialMailbox(input.now),
    wallet: { gold: 0, tickets: 0, tokens: 0 },
    inventory: {},
    progress: { starterKitClaimed: false, starterResidentId: null },
    residents: {},
    pairs: {},
    production: initialProduction(input.worldId),
    invite: initialInvite(),
    deliveries: { day: null, done: [] },
    stories: { pairs: {}, expedition: null },
    memory: { facts: [], nextFactId: 1 },
  });
}

/** Adds items without ever letting a count overflow or go negative. */
export function addItems(inventory: WorldState["inventory"], items: Readonly<Record<string, number>>) {
  const next = { ...inventory };
  for (const [itemId, amount] of Object.entries(items)) {
    if (!isKnownItem(itemId)) throw new Error(`Unknown item ${itemId}`);
    const total = (next[itemId] ?? 0) + amount;
    if (!Number.isSafeInteger(total) || total < 0) throw new Error(`Invalid amount for ${itemId}`);
    next[itemId] = total;
  }
  return next;
}
