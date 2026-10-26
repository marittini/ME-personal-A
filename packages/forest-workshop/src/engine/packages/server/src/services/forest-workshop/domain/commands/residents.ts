// Resident commands (plan §7.1, board 05-3 주민 등록 · 03-1 주민):
//   residents.register      자료 선택 → 재구축 확정. The server reads the source itself (prepare), so the snapshot
//                           can never come from the client; the same source in a world is refused (one resident).
//   residents.update        수정: 공방 세계 설정 or the display name, with a change-log entry.
//   residents.chooseStarter 시작 주민: once per world; that resident is recruited.
import { z } from "zod";
import { FwError } from "../errors";
import {
  DEFAULT_PLACEMENT,
  MAX_RESIDENTS,
  displayNameSchema,
  sourceRefSchema,
  sourceSnapshotSchema,
  withChange,
  worldSettingSchema,
  type Resident,
} from "../model/residents";
import type { WorldState } from "../world-model";
import { defineCommand } from "./command";

export function requireResident(state: WorldState, residentId: string): Resident {
  const resident = state.residents[residentId];
  if (!resident) throw new FwError("resident_not_found");
  return resident;
}

export function putResident(state: WorldState, resident: Resident): WorldState {
  return { ...state, residents: { ...state.residents, [resident.residentId]: resident } };
}

/** Change-log detail: the start of the new text, so the log reads well without holding a second copy. */
function excerpt(text: string, max = 60) {
  const line = text.replace(/\s+/gu, " ");
  return line.length > max ? `${line.slice(0, max - 1)}…` : line;
}

export const registerResident = defineCommand({
  type: "residents.register",
  payloadSchema: z
    .object({ residentId: z.string().uuid(), source: sourceRefSchema, worldSetting: worldSettingSchema })
    .strict(),
  requiresFreshView: false,
  prepare: (payload, host, now) => host.readSource(payload.source.kind, payload.source.id, now),
  apply(state, payload, context) {
    const snapshot = sourceSnapshotSchema.parse(context.prepared);
    const existing = Object.values(state.residents).find(
      (resident) => resident.kind === payload.source.kind && resident.sourceId === payload.source.id,
    );
    if (existing) throw new FwError("resident_exists", { details: { residentId: existing.residentId } });
    if (state.residents[payload.residentId]) throw new FwError("resident_exists");
    if (Object.keys(state.residents).length >= MAX_RESIDENTS) throw new FwError("resident_limit");

    const resident: Resident = {
      residentId: payload.residentId,
      kind: payload.source.kind,
      sourceId: payload.source.id,
      source: snapshot,
      displayName: displayNameSchema.parse(snapshot.name.slice(0, 40)),
      worldSetting: payload.worldSetting,
      recruited: false,
      registeredAt: context.now,
      image: { current: null, history: [], placement: DEFAULT_PLACEMENT },
      changes: [{ at: context.now, kind: "registered", detail: excerpt(payload.worldSetting) }],
    };
    return { state: putResident(state, resident), result: { residentId: resident.residentId } };
  },
});

export const updateResident = defineCommand({
  type: "residents.update",
  payloadSchema: z
    .object({
      residentId: z.string().uuid(),
      worldSetting: worldSettingSchema.optional(),
      displayName: displayNameSchema.optional(),
    })
    .strict()
    .refine((payload) => payload.worldSetting !== undefined || payload.displayName !== undefined, {
      message: "nothing to change",
    }),
  // An edit of text the player was looking at: refuse it when that text has changed elsewhere since.
  requiresFreshView: true,
  apply(state, payload, context) {
    let resident = requireResident(state, payload.residentId);
    if (payload.worldSetting !== undefined && payload.worldSetting !== resident.worldSetting) {
      resident = withChange(
        { ...resident, worldSetting: payload.worldSetting },
        { at: context.now, kind: "setting", detail: excerpt(payload.worldSetting) },
      );
    }
    if (payload.displayName !== undefined && payload.displayName !== resident.displayName) {
      resident = withChange(
        { ...resident, displayName: payload.displayName },
        { at: context.now, kind: "name", detail: payload.displayName },
      );
    }
    return { state: putResident(state, resident), result: { residentId: resident.residentId } };
  },
});

export const chooseStarter = defineCommand({
  type: "residents.chooseStarter",
  payloadSchema: z.object({ residentId: z.string().uuid() }).strict(),
  requiresFreshView: false,
  apply(state, payload, context) {
    if (state.progress.starterResidentId !== null) {
      // Choosing the same starter again (another tab, a retry with a new ID) is not an error for the player.
      if (state.progress.starterResidentId === payload.residentId) {
        return { state, result: { residentId: payload.residentId, alreadyChosen: true } };
      }
      throw new FwError("starter_chosen");
    }
    const resident = withChange(
      { ...requireResident(state, payload.residentId), recruited: true },
      { at: context.now, kind: "recruited", detail: "시작 주민" },
    );
    return {
      state: {
        ...putResident(state, resident),
        progress: { ...state.progress, starterResidentId: resident.residentId },
      },
      result: { residentId: resident.residentId, alreadyChosen: false },
    };
  },
});
