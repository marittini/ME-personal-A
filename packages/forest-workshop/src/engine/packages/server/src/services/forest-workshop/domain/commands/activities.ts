import { z } from "zod";
import { FwError } from "../errors";
import { defineCommand } from "./command";
export const startActivity = defineCommand({
  type: "activities.start",
  requiresFreshView: false,
  payloadSchema: z
    .object({
      id: z.string().uuid(),
      kind: z.enum(["survey", "patrol"]),
      placeId: z.literal("workshop-edge"),
      residentId: z.string().uuid(),
    })
    .strict(),
  apply(state, payload, context) {
    if (state.activities.running) throw new FwError("resident_busy");
    if (state.activities.completed.some((a) => a.id === payload.id))
      throw new FwError("invalid_payload", { message: "이미 완료한 활동이에요." });
    if (state.activities.completed.length >= 100 || state.mailbox.letters.length >= 200)
      throw new FwError("invalid_payload", { message: "활동 기록 또는 우편 저장 한도에 도달했어요." });
    const resident = state.residents[payload.residentId];
    if (!resident) throw new FwError("resident_not_found");
    if (!resident.recruited) throw new FwError("resident_not_recruited");
    if (state.stories.expedition?.participants.includes(payload.residentId)) throw new FwError("resident_busy");
    const minutes = payload.kind === "survey" ? 30 : 15;
    const facilities = Object.fromEntries(
      Object.entries(state.production.facilities).map(([id, f]) => [
        id,
        f.residentId === payload.residentId ? { ...f, residentId: null } : f,
      ]),
    );
    return {
      state: {
        ...state,
        production: { ...state.production, facilities },
        activities: {
          ...state.activities,
          running: {
            ...payload,
            startedSim: state.production.simMs,
            endsSim: state.production.simMs + minutes * 60000,
            startedAt: context.now,
          },
        },
      },
      result: { id: payload.id, minutes },
    };
  },
});
export const cancelActivity = defineCommand({
  type: "activities.cancel",
  requiresFreshView: false,
  payloadSchema: z.object({ id: z.string().uuid() }).strict(),
  apply(state, payload) {
    if (state.activities.running?.id !== payload.id)
      throw new FwError("invalid_payload", { message: "이 활동은 진행 중이 아니에요." });
    return { state: { ...state, activities: { ...state.activities, running: null } }, result: { id: payload.id } };
  },
});
