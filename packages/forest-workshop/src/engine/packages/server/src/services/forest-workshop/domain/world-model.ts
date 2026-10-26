// The world document's shape (plan §6). The zod schema is the single source: the TypeScript type is inferred from
// it, every load is validated against it, and a backup is checked with it before anything is written.
// Later phases add residents, pairs, facilities, jobs and the rest through a schema migration (domain/migrations.ts).
import { z } from "zod";
import { isKnownItem } from "../content/items";

export const CURRENT_SCHEMA_VERSION = 1;

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

export const worldStateSchema = z
  .object({
    schemaVersion: z.literal(CURRENT_SCHEMA_VERSION),
    worldId: z.string().uuid(),
    createdAt: z.string().datetime(),
    settings: z.object({ worldName: worldNameSchema, playerNickname: nicknameSchema }).strict(),
    wallet: z.object({ gold: nonNegativeInt }).strict(),
    inventory: inventorySchema,
    progress: z.object({ starterKitClaimed: z.boolean() }).strict(),
  })
  .strict();

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
    progress: { starterKitClaimed: false },
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
