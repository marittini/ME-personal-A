// 초대 and 납품 state (plan §7.2-F, board 03-3). Kept small: the wish, the guarantee counter, a short 초대 기록, and
// which of today's delivery requests are done.
import { z } from "zod";
import { INVITE_RULES } from "../../content/invite";

const nonNegativeInt = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER);

export const INVITE_OUTCOMES = ["new", "breakthrough", "token"] as const;
export type InviteOutcome = (typeof INVITE_OUTCOMES)[number];

export const inviteLogEntrySchema = z
  .object({
    logId: nonNegativeInt,
    at: z.string().datetime(),
    residentId: z.string().uuid(),
    /** The name when drawn, so the log still reads well if the resident is renamed. */
    name: z.string().min(1).max(40),
    outcome: z.enum(INVITE_OUTCOMES),
    /** 돌파 after this draw (for "breakthrough"). */
    breakthrough: z.number().int().min(0).max(5),
    /** How it came: a draw, the guarantee, or a 종표 exchange. */
    via: z.enum(["draw", "guarantee", "exchange"]),
  })
  .strict();
export type InviteLogEntry = z.infer<typeof inviteLogEntrySchema>;

export const inviteStateSchema = z
  .object({
    wishResidentId: z.string().uuid().nullable(),
    /** Draws since the last new resident (the guarantee counter). */
    sinceNew: z.number().int().min(0).max(INVITE_RULES.guaranteeAfter),
    log: z.array(inviteLogEntrySchema).max(INVITE_RULES.logLimit),
    nextLogId: nonNegativeInt,
  })
  .strict();
export type InviteState = z.infer<typeof inviteStateSchema>;

export const deliveryStateSchema = z
  .object({
    /** The UTC day `done` belongs to; another day's list starts empty. */
    day: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/u)
      .nullable(),
    done: z.array(z.string().max(64)).max(20),
  })
  .strict();
export type DeliveryState = z.infer<typeof deliveryStateSchema>;

export function initialInvite(): InviteState {
  return { wishResidentId: null, sinceNew: 0, log: [], nextLogId: 1 };
}
