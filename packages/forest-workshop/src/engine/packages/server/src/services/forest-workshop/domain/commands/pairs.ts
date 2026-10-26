// Pair commands (plan §7.1, board 03-2 관계): 페어 추가, and 변경 · 보관 as archive / restore.
// Any two different residents may pair. A new pair starts at the lowest familiarity and ease with no event: adding it
// creates no memories, no backdated history and no romance. Archiving keeps every value so restoring brings the same
// relationship back.
import { z } from "zod";
import { FwError } from "../errors";
import { MAX_PAIRS, coupleOf, samePair, type Pair } from "../model/pairs";
import type { WorldState } from "../world-model";
import { defineCommand } from "./command";

function requirePair(state: WorldState, pairId: string): Pair {
  const pair = state.pairs[pairId];
  if (!pair) throw new FwError("pair_not_found");
  return pair;
}

function putPair(state: WorldState, pair: Pair): WorldState {
  return { ...state, pairs: { ...state.pairs, [pair.pairId]: pair } };
}

export const addPair = defineCommand({
  type: "pairs.add",
  payloadSchema: z
    .object({ pairId: z.string().uuid(), residentIds: z.tuple([z.string().uuid(), z.string().uuid()]) })
    .strict(),
  requiresFreshView: false,
  apply(state, payload, context) {
    const [first, second] = payload.residentIds;
    if (first === second) throw new FwError("pair_self");
    if (!state.residents[first] || !state.residents[second]) throw new FwError("resident_not_found");
    if (state.pairs[payload.pairId]) throw new FwError("pair_exists");
    const twin = Object.values(state.pairs).find((other) => samePair(other, first, second));
    if (twin) {
      // The same two residents already have a row: restore that one instead, so their history stays one history.
      throw new FwError("pair_exists", { details: { pairId: twin.pairId, archived: twin.archived } });
    }
    if (Object.keys(state.pairs).length >= MAX_PAIRS) throw new FwError("pair_limit");
    const pair: Pair = {
      pairId: payload.pairId,
      residentIds: coupleOf(first, second),
      createdAt: context.now,
      archived: false,
      archivedAt: null,
      familiarity: 0,
      ease: 0,
      lastEvent: null,
    };
    return { state: putPair(state, pair), result: { pairId: pair.pairId } };
  },
});

export const archivePair = defineCommand({
  type: "pairs.archive",
  payloadSchema: z.object({ pairId: z.string().uuid() }).strict(),
  requiresFreshView: false,
  apply(state, payload, context) {
    const pair = requirePair(state, payload.pairId);
    if (pair.archived) return { state, result: { pairId: pair.pairId, archived: true } };
    return {
      state: putPair(state, { ...pair, archived: true, archivedAt: context.now }),
      result: { pairId: pair.pairId, archived: true },
    };
  },
});

export const restorePair = defineCommand({
  type: "pairs.restore",
  payloadSchema: z.object({ pairId: z.string().uuid() }).strict(),
  requiresFreshView: false,
  apply(state, payload) {
    const pair = requirePair(state, payload.pairId);
    if (!pair.archived) return { state, result: { pairId: pair.pairId, archived: false } };
    return {
      state: putPair(state, { ...pair, archived: false, archivedAt: null }),
      result: { pairId: pair.pairId, archived: false },
    };
  },
});
