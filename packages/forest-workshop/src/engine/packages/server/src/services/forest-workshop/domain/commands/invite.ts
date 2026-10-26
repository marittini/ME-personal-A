// 초대 commands (plan §7.2-F, board 03-3):
//   invite.draw     1회 / 10회 초대: 초대권 per draw; ten draws are applied one after another (each sees the last).
//   invite.setWish  희망 주민 설정: one registered resident weighs more, and the guarantee brings them first.
//   invite.exchange 종표 교환: 종표 bring the chosen resident (선택 영입) or give them 돌파.
// The roll uses the server's seed for the attempt (CommandContext.seed); a replay returns the stored result.
import { z } from "zod";
import { MAX_BREAKTHROUGH } from "../../content/crew";
import { INVITE_RULES } from "../../content/invite";
import { FwError } from "../errors";
import { sha256Hex } from "../ids";
import { drawOnce, receive, roll, type DrawResult } from "../invite/draw";
import type { WorldState } from "../world-model";
import { defineCommand } from "./command";

function requireStarted(state: WorldState) {
  if (state.progress.starterResidentId === null) throw new FwError("starter_needed");
  if (Object.keys(state.residents).length === 0) throw new FwError("invite_empty");
}

export const drawInvites = defineCommand({
  type: "invite.draw",
  payloadSchema: z.object({ count: z.union([z.literal(1), z.literal(INVITE_RULES.multiDraw)]) }).strict(),
  requiresFreshView: false,
  apply(state, payload, context) {
    requireStarted(state);
    const cost = payload.count * INVITE_RULES.ticketsPerDraw;
    if (state.wallet.tickets < cost) {
      throw new FwError("not_enough_tickets", { details: { missing: cost - state.wallet.tickets } });
    }
    let next: WorldState = { ...state, wallet: { ...state.wallet, tickets: state.wallet.tickets - cost } };
    const seed = context.seed ?? sha256Hex(`${state.worldId}:${context.commandId}`);
    const draws: DrawResult[] = [];
    for (let index = 0; index < payload.count; index += 1) {
      const drawn = drawOnce(next, roll(seed, index), context.now);
      next = drawn.state;
      draws.push(drawn.result);
    }
    return { state: next, result: { draws, tickets: next.wallet.tickets, tokens: next.wallet.tokens } };
  },
});

export const setWish = defineCommand({
  type: "invite.setWish",
  payloadSchema: z.object({ residentId: z.string().uuid().nullable() }).strict(),
  requiresFreshView: false,
  apply(state, payload) {
    if (payload.residentId !== null && !state.residents[payload.residentId]) throw new FwError("resident_not_found");
    return {
      state: { ...state, invite: { ...state.invite, wishResidentId: payload.residentId } },
      result: { residentId: payload.residentId },
    };
  },
});

export const exchangeTokens = defineCommand({
  type: "invite.exchange",
  payloadSchema: z.object({ residentId: z.string().uuid() }).strict(),
  requiresFreshView: false,
  apply(state, payload, context) {
    requireStarted(state);
    const resident = state.residents[payload.residentId];
    if (!resident) throw new FwError("resident_not_found");
    if (resident.recruited && resident.breakthrough >= MAX_BREAKTHROUGH) throw new FwError("max_breakthrough");
    if (state.wallet.tokens < INVITE_RULES.tokensPerExchange) throw new FwError("not_enough_tokens");
    const paid = {
      ...state,
      wallet: { ...state.wallet, tokens: state.wallet.tokens - INVITE_RULES.tokensPerExchange },
    };
    const received = receive(paid, payload.residentId, "exchange", context.now);
    return { state: received.state, result: { ...received.result, tokens: received.state.wallet.tokens } };
  },
});
