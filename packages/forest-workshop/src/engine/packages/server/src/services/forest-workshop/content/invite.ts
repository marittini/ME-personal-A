// 초대 (plan §7.2-F, board 03-3). Every registered resident has the same chance (no grades); the one the player wishes
// for weighs a little more. A draw brings a resident who has not come yet, or gives 돌파 to one who has; past the
// last 돌파 it gives a 종표, and enough 종표 bring the resident the player chooses (선택 영입). After a run of draws
// without a new arrival, the next draw is a new resident (the wished one if they are still waiting): the guarantee.
// 10회 초대 is ten single draws applied one after another. The server rolls; the client only shows the result.
// Play-test values.
export const INVITE_RULES = {
  ticketsPerDraw: 1,
  multiDraw: 10,
  baseWeight: 1,
  wishWeight: 2,
  /** The draw that follows this many draws without a new resident brings a new one (if anyone is still waiting). */
  guaranteeAfter: 9,
  tokensPerExchange: 5,
  logLimit: 50,
} as const;
