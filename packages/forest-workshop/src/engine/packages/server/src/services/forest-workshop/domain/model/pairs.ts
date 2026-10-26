// Pairs (plan §3, §7.1). A pair links one character resident and one persona resident. One resident may belong to
// several pairs (A–B and A–C): it is one A in one shared world, with a separate relationship row for each pair.
// Adding a pair creates no memories and no romance; archiving one is not a break-up inside the world.
// familiarity/ease are the pair's own measures, separate from the player's trust, and are not a romance state.
import { z } from "zod";

export const MAX_PAIRS = 200;
export const RELATION_RANGE = { min: 0, max: 100 } as const;

const relationValue = z.number().int().min(RELATION_RANGE.min).max(RELATION_RANGE.max);

export const pairSchema = z
  .object({
    pairId: z.string().uuid(),
    characterResidentId: z.string().uuid(),
    personaResidentId: z.string().uuid(),
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

export function samePair(pair: Pair, characterResidentId: string, personaResidentId: string): boolean {
  return pair.characterResidentId === characterResidentId && pair.personaResidentId === personaResidentId;
}
