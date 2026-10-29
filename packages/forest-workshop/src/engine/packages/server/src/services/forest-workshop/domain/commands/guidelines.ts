import { z } from "zod";
import { FwError } from "../errors";
import { emptyGuideline } from "../model/guidelines";
import { defineCommand } from "./command";
export const updateGuidelines = defineCommand({
  type: "guidelines.update",
  requiresFreshView: true,
  payloadSchema: z
    .object({ pairId: z.string().uuid().optional(), enabled: z.boolean(), text: z.string().trim().max(1000) })
    .strict()
    .refine((p) => !p.pairId || p.text.length <= 500, { message: "페어 지침은 500자 이내로 작성해 주세요." })
    .refine((p) => !p.enabled || p.text.length > 0, { message: "사용할 지침을 작성해 주세요." }),
  apply(state, payload, context) {
    if (payload.pairId && !state.pairs[payload.pairId]) throw new FwError("pair_not_found");
    const previous = payload.pairId
      ? (state.guidelines.pairs[payload.pairId] ?? emptyGuideline())
      : state.guidelines.world;
    const value = {
      enabled: payload.enabled,
      text: payload.text,
      revision: previous.revision + 1,
      updatedAt: context.now,
    };
    const guidelines = payload.pairId
      ? { ...state.guidelines, pairs: { ...state.guidelines.pairs, [payload.pairId]: value } }
      : { ...state.guidelines, world: value };
    return { state: { ...state, guidelines }, result: { pairId: payload.pairId ?? null, revision: value.revision } };
  },
});
