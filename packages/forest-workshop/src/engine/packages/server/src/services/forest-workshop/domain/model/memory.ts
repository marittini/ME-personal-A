// The memory ledger (plan §7.7). Each fact records who knows it: a scene's facts are known by the residents who were
// there, a player's answer by the resident who asked. Prompts read a resident's memory only through
// domain/stories/memory.ts, which filters by knower before anything is assembled — never by deleting secrets from a
// combined list afterwards. Correcting a fact keeps the old one, marked, with the new one pointing back (P4b screen).
//
// ponytail: the ledger lives in the world document (one transaction with the relation change that reading makes).
// Its size is capped; when stories grow past it, move it to its own `fw-memory` document with the same CAS rules.
import { z } from "zod";

const uuid = z.string().uuid();

export const MEMORY_FACT_MAX = 160;
export const MEMORY_LIMIT = 1000;

export const factSchema = z
  .object({
    factId: z.number().int().min(1),
    text: z.string().min(1).max(MEMORY_FACT_MAX),
    /** event: something that happened · feeling: how someone felt (never promoted to fact) · player: a player answer. */
    factType: z.enum(["event", "feeling", "player"]),
    /** The residents who know it. Nobody else's prompt may read it. */
    knowerIds: z.array(uuid).min(1).max(8),
    /** Who it is about. */
    subjectIds: z.array(uuid).max(8),
    /** knowers: only the knowers · public: anyone in the world (world rules, announced events). */
    visibility: z.enum(["knowers", "public"]),
    pairId: uuid.nullable(),
    storyId: uuid.nullable(),
    occurredAt: z.string().datetime(),
    status: z.enum(["active", "corrected", "invalidated"]),
    supersedes: z.number().int().min(1).nullable(),
  })
  .strict();
export type Fact = z.infer<typeof factSchema>;

export const memorySchema = z
  .object({
    facts: z.array(factSchema).max(MEMORY_LIMIT),
    nextFactId: z.number().int().min(1),
  })
  .strict();
export type Memory = z.infer<typeof memorySchema>;
