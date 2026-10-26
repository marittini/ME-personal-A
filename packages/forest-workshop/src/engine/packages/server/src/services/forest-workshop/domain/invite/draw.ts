// One 초대 draw (content/invite.ts has the rules). Pure: the roll comes from a seed the server made, so the command
// stays a pure rule and a replay answers with the stored result instead of rolling again.
import { MAX_BREAKTHROUGH } from "../../content/crew";
import { INVITE_RULES } from "../../content/invite";
import { sha256Hex } from "../ids";
import type { InviteLogEntry, InviteOutcome } from "../model/invite";
import { withChange, type Resident } from "../model/residents";
import type { WorldState } from "../world-model";

/** A number in [0, 1) from the seed and the draw's index. */
export function roll(seed: string, index: number): number {
  return parseInt(sha256Hex(`${seed}:${index}`).slice(0, 12), 16) / 2 ** 48;
}

/** Each resident's chance on a normal draw (no guarantee), in percent; what 확률 보기 shows. */
export function drawChances(state: Pick<WorldState, "residents" | "invite">): Record<string, number> {
  const residents = Object.keys(state.residents).sort();
  const weight = (id: string) =>
    id === state.invite.wishResidentId ? INVITE_RULES.wishWeight : INVITE_RULES.baseWeight;
  const total = residents.reduce((sum, id) => sum + weight(id), 0);
  return Object.fromEntries(residents.map((id) => [id, total ? (weight(id) / total) * 100 : 0]));
}

function pick(ids: readonly string[], weights: readonly number[], value: number): string {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let cursor = value * total;
  for (let index = 0; index < ids.length; index += 1) {
    cursor -= weights[index]!;
    if (cursor < 0) return ids[index]!;
  }
  return ids[ids.length - 1]!;
}

export interface DrawResult {
  residentId: string;
  outcome: InviteOutcome;
  breakthrough: number;
  via: InviteLogEntry["via"];
}

/** Brings `residentId` (a draw, the guarantee or an exchange): a new arrival, a 돌파, or a 종표 past the last 돌파. */
export function receive(
  state: WorldState,
  residentId: string,
  via: InviteLogEntry["via"],
  now: string,
): { state: WorldState; result: DrawResult } {
  const resident = state.residents[residentId]!;
  let next: Resident = resident;
  let outcome: InviteOutcome;
  let wallet = state.wallet;
  if (!resident.recruited) {
    outcome = "new";
    next = withChange({ ...resident, recruited: true }, { at: now, kind: "recruited", detail: "초대" });
  } else if (resident.breakthrough < MAX_BREAKTHROUGH) {
    outcome = "breakthrough";
    const breakthrough = resident.breakthrough + 1;
    next = withChange({ ...resident, breakthrough }, { at: now, kind: "breakthrough", detail: `돌파 ${breakthrough}` });
  } else {
    outcome = "token";
    wallet = { ...wallet, tokens: wallet.tokens + 1 };
  }
  const sinceNew = outcome === "new" ? 0 : Math.min(INVITE_RULES.guaranteeAfter, state.invite.sinceNew + 1);
  const entry: InviteLogEntry = {
    logId: state.invite.nextLogId,
    at: now,
    residentId,
    name: resident.displayName,
    outcome,
    breakthrough: next.breakthrough,
    via,
  };
  return {
    state: {
      ...state,
      wallet,
      residents: { ...state.residents, [residentId]: next },
      invite: {
        ...state.invite,
        // An exchange is the player's choice, not a draw: it does not move the guarantee counter unless it is new.
        sinceNew: via === "exchange" && outcome !== "new" ? state.invite.sinceNew : sinceNew,
        log: [entry, ...state.invite.log].slice(0, INVITE_RULES.logLimit),
        nextLogId: state.invite.nextLogId + 1,
      },
    },
    result: { residentId, outcome, breakthrough: next.breakthrough, via },
  };
}

/** One draw: the guarantee when it is due and someone is still waiting, otherwise a weighted roll over everyone. */
export function drawOnce(state: WorldState, value: number, now: string) {
  const everyone = Object.keys(state.residents).sort();
  const waiting = everyone.filter((id) => !state.residents[id]!.recruited);
  const wish = state.invite.wishResidentId;
  if (waiting.length > 0 && state.invite.sinceNew >= INVITE_RULES.guaranteeAfter) {
    const chosen =
      wish !== null && waiting.includes(wish)
        ? wish
        : pick(
            waiting,
            waiting.map(() => 1),
            value,
          );
    return receive(state, chosen, "guarantee", now);
  }
  const weights = everyone.map((id) => (id === wish ? INVITE_RULES.wishWeight : INVITE_RULES.baseWeight));
  return receive(state, pick(everyone, weights, value), "draw", now);
}
