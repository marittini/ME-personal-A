import { z } from "zod";
import { FwError } from "../errors";
import { MEMORY_FACT_MAX, MEMORY_LIMIT } from "../model/memory";
import { defineCommand } from "./command";
const factId = z.number().int().min(1);
export const correctMemory = defineCommand({
  type: "memory.correct",
  requiresFreshView: true,
  payloadSchema: z.object({ factId, text: z.string().trim().min(1).max(MEMORY_FACT_MAX) }).strict(),
  apply(state, payload, context) {
    const original = state.memory.facts.find((f) => f.factId === payload.factId);
    if (!original || original.status !== "active")
      throw new FwError("invalid_payload", { message: "사용 중인 기억만 정정할 수 있어요." });
    if (state.memory.facts.length >= MEMORY_LIMIT)
      throw new FwError("invalid_payload", { message: "기억 저장 한도에 도달했어요. 원문은 변경하지 않았어요." });
    const corrected = {
      ...original,
      factId: state.memory.nextFactId,
      text: payload.text,
      supersedes: original.factId,
      occurredAt: context.now,
    };
    const facts = state.memory.facts.map((f) =>
      f.factId === original.factId ? { ...f, status: "corrected" as const } : f,
    );
    return {
      state: { ...state, memory: { facts: [...facts, corrected], nextFactId: state.memory.nextFactId + 1 } },
      result: { factId: corrected.factId },
    };
  },
});
export const setMemoryStatus = defineCommand({
  type: "memory.setStatus",
  requiresFreshView: true,
  payloadSchema: z.object({ factId, active: z.boolean() }).strict(),
  apply(state, payload) {
    const fact = state.memory.facts.find((f) => f.factId === payload.factId);
    if (!fact || fact.status === "corrected")
      throw new FwError("invalid_payload", { message: "정정된 원문은 다시 사용할 수 없어요." });
    const status = payload.active ? ("active" as const) : ("invalidated" as const);
    if (payload.active && state.memory.facts.some((f) => f.supersedes === fact.factId && f.status === "active"))
      throw new FwError("invalid_payload", { message: "이 기억의 정정본이 사용 중이에요." });
    return {
      state: {
        ...state,
        memory: {
          ...state.memory,
          facts: state.memory.facts.map((f) => (f.factId === fact.factId ? { ...f, status } : f)),
        },
      },
      result: { factId: fact.factId, status },
    };
  },
});
