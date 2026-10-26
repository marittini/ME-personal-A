// The world document's shape (plan §6). The zod schema is the single source: the TypeScript type is inferred from
// it, every load is validated against it, and a backup is checked with it before anything is written.
// Each phase adds its parts through a schema migration (domain/migrations.ts): v2 added residents and pairs (P2).
import { z } from "zod";
import { isKnownItem } from "../content/items";
import { MAX_PAIRS, pairSchema, samePair } from "./model/pairs";
import { MAX_RESIDENTS, residentSchema } from "./model/residents";

export const CURRENT_SCHEMA_VERSION = 2;

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

const worldShape = z
  .object({
    schemaVersion: z.literal(CURRENT_SCHEMA_VERSION),
    worldId: z.string().uuid(),
    createdAt: z.string().datetime(),
    settings: z.object({ worldName: worldNameSchema, playerNickname: nicknameSchema }).strict(),
    wallet: z.object({ gold: nonNegativeInt }).strict(),
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
    sources.add(source);
  }
  const starter = world.progress.starterResidentId;
  if (starter !== null && !world.residents[starter]?.recruited) issue(["progress", "starterResidentId"], "unknown");

  const activeCouples: Array<{ characterResidentId: string; personaResidentId: string }> = [];
  for (const [key, pair] of pairs) {
    if (pair.pairId !== key) issue(["pairs", key], "key mismatch");
    if (world.residents[pair.characterResidentId]?.kind !== "character") issue(["pairs", key], "character side");
    if (world.residents[pair.personaResidentId]?.kind !== "persona") issue(["pairs", key], "persona side");
    if (pair.archived !== (pair.archivedAt !== null)) issue(["pairs", key], "archive time");
    if (!pair.archived) {
      if (activeCouples.some((other) => samePair(pair, other.characterResidentId, other.personaResidentId))) {
        issue(["pairs", key], "duplicate active pair");
      }
      activeCouples.push(pair);
    }
  }
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
    wallet: { gold: 0 },
    inventory: {},
    progress: { starterKitClaimed: false, starterResidentId: null },
    residents: {},
    pairs: {},
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
