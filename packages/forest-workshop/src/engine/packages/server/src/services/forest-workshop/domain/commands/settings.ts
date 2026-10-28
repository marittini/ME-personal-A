// settings.update — renames the world or the player's nickname. The player has a nickname only, no appearance
// (plan §3). Edits what the player saw, so it refuses an outdated screen.
import { z } from "zod";
import { groundSchema, nicknameSchema, worldNameSchema } from "../world-model";
import { defineCommand } from "./command";

const payloadSchema = z
  .object({
    worldName: worldNameSchema.optional(),
    playerNickname: nicknameSchema.optional(),
    ground: groundSchema.optional(),
  })
  .strict()
  .refine(
    (payload) =>
      payload.worldName !== undefined || payload.playerNickname !== undefined || payload.ground !== undefined,
    {
      message: "nothing to change",
    },
  );

export const updateSettings = defineCommand({
  type: "settings.update",
  payloadSchema,
  requiresFreshView: true,
  apply(state, payload) {
    const settings = {
      ground: payload.ground ?? state.settings.ground,
      worldName: payload.worldName ?? state.settings.worldName,
      playerNickname: payload.playerNickname ?? state.settings.playerNickname,
    };
    return { state: { ...state, settings }, result: { settings } };
  },
});
