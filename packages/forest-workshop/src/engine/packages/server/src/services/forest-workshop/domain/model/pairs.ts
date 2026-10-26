// Pairs (plan §3, §7.1; owner decision 2026-10-27: any two residents may pair). A pair links two different
// residents of the world, whatever their kind: character–persona, character–character or persona–persona. One
// resident may belong to several pairs (A–B and A–C): it is one A in one shared world, with a separate relationship
// row for each pair. Adding a pair creates no memories and no romance; archiving one is not a break-up in the world.
// familiarity/ease are the pair's own measures, separate from the player's trust, and are not a romance state.
//
// A pair has no direction: `residentIds` is stored in ascending order, so A–B and B–A are the same couple.
import { z } from "zod";

export const MAX_PAIRS = 200;
export const RELATION_RANGE = { min: 0, max: 100 } as const;

const relationValue = z.number().int().min(RELATION_RANGE.min).max(RELATION_RANGE.max);

export const pairSchema = z
  .object({
    pairId: z.string().uuid(),
    residentIds: z
      .tuple([z.string().uuid(), z.string().uuid()])
      .refine(([a, b]) => a < b, { message: "two different residents, in ascending order" }),
    createdAt: z.string().datetime(),
    archived: z.boolean(),
    archivedAt: z.string().datetime().nullable(),
    familiarity: relationValue,
    ease: relationValue,
    /** The latest shared event, written by the story phase (P4); null until then. */
    lastEvent: z
      .object({ at: z.string().datetime(), summary: z.string().min(1).max(80) })
      .strict()
      .nullable(),
  })
  .strict();
export type Pair = z.infer<typeof pairSchema>;

/** The stored form of a couple: ascending order. */
export function coupleOf(first: string, second: string): [string, string] {
  return first < second ? [first, second] : [second, first];
}

export function samePair(pair: Pick<Pair, "residentIds">, first: string, second: string): boolean {
  const [a, b] = coupleOf(first, second);
  return pair.residentIds[0] === a && pair.residentIds[1] === b;
}

export function pairIncludes(pair: Pick<Pair, "residentIds">, residentId: string): boolean {
  return pair.residentIds[0] === residentId || pair.residentIds[1] === residentId;
}

/** The other resident of a pair, seen from one of its residents. */
export function partnerIn(pair: Pick<Pair, "residentIds">, residentId: string): string {
  return pair.residentIds[0] === residentId ? pair.residentIds[1] : pair.residentIds[0];
}
