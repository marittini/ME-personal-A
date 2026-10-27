// Resident picture commands (plan §8.1, board 04-2 주민 그림):
//   residents.setImage            internal: the upload service checked, converted and stored the WebP first. The new
//                                 picture becomes current; the previous one moves to history (newest 3 kept).
//   residents.restoreImage        이전 그림: a history picture becomes current again, the current one moves to history.
//   residents.setPlacement        적용: size, left/right position and marker height; never baked into the picture.
//   residents.clearImageHistory   그림 이력 정리: drops history references. Their files are removed from the gallery
//                                 afterwards only if nothing else uses them (services/resident-image-service.ts).
// A picture that falls off the 3-entry history is returned in `released`, so the service can offer it for cleanup.
import { z } from "zod";
import { FwError } from "../errors";
import {
  IMAGE_HISTORY_LIMIT,
  placementSchema,
  residentImageSchema,
  withChange,
  type ResidentImage,
} from "../model/residents";
import { defineCommand } from "./command";
import { putResident, requireResident } from "./residents";

function pushHistory(history: ResidentImage[], previous: ResidentImage | null) {
  const next = [...(previous ? [previous] : []), ...history];
  return { kept: next.slice(0, IMAGE_HISTORY_LIMIT), released: next.slice(IMAGE_HISTORY_LIMIT) };
}

export const setResidentImage = defineCommand({
  type: "residents.setImage",
  payloadSchema: z.object({ residentId: z.string().uuid(), image: residentImageSchema }).strict(),
  requiresFreshView: false,
  internal: true,
  apply(state, payload, context) {
    const resident = requireResident(state, payload.residentId);
    const { kept, released } = pushHistory(resident.image.history, resident.image.current);
    const next = withChange(
      { ...resident, image: { ...resident.image, current: payload.image, history: kept } },
      { at: context.now, kind: "image", detail: payload.image.fileName || "그림" },
    );
    return {
      state: putResident(state, next),
      result: { residentId: next.residentId, image: payload.image, released: released.map((image) => image.reference) },
    };
  },
});

export const restoreResidentImage = defineCommand({
  type: "residents.restoreImage",
  payloadSchema: z.object({ residentId: z.string().uuid(), reference: z.string().max(160) }).strict(),
  requiresFreshView: true,
  apply(state, payload, context) {
    const resident = requireResident(state, payload.residentId);
    const chosen = resident.image.history.find((image) => image.reference === payload.reference);
    if (!chosen) throw new FwError("image_not_found");
    const rest = resident.image.history.filter((image) => image.reference !== payload.reference);
    const { kept, released } = pushHistory(rest, resident.image.current);
    const next = withChange(
      { ...resident, image: { ...resident.image, current: chosen, history: kept } },
      { at: context.now, kind: "image_restored", detail: chosen.fileName || "이전 그림" },
    );
    return {
      state: putResident(state, next),
      result: { residentId: next.residentId, image: chosen, released: released.map((image) => image.reference) },
    };
  },
});

export const setResidentPlacement = defineCommand({
  type: "residents.setPlacement",
  payloadSchema: z.object({ residentId: z.string().uuid(), placement: placementSchema }).strict(),
  requiresFreshView: false,
  apply(state, payload, context) {
    const resident = requireResident(state, payload.residentId);
    const { scale, offsetX, markerHeight } = payload.placement;
    const next = withChange(
      { ...resident, image: { ...resident.image, placement: payload.placement } },
      { at: context.now, kind: "placement", detail: `크기 ${scale}% · 좌우 ${offsetX} · 기호 ${markerHeight}` },
    );
    return { state: putResident(state, next), result: { residentId: next.residentId, placement: payload.placement } };
  },
});

export const clearResidentImageHistory = defineCommand({
  type: "residents.clearImageHistory",
  payloadSchema: z.object({ residentId: z.string().uuid().optional() }).strict(),
  requiresFreshView: false,
  apply(state, payload, context) {
    const targets = payload.residentId
      ? [requireResident(state, payload.residentId)]
      : Object.values(state.residents).filter((resident) => resident.image.history.length > 0);
    let next = state;
    const released: string[] = [];
    for (const resident of targets) {
      if (resident.image.history.length === 0) continue;
      released.push(...resident.image.history.map((image) => image.reference));
      next = putResident(
        next,
        withChange(
          { ...resident, image: { ...resident.image, history: [] } },
          { at: context.now, kind: "image_history_cleared", detail: `${resident.image.history.length}장` },
        ),
      );
    }
    return { state: next, result: { released } };
  },
});
