import { z } from "zod";
import { FwError } from "../errors";
import { defineCommand } from "./command";
export const readMail = defineCommand({
  type: "mail.read",
  requiresFreshView: false,
  payloadSchema: z.object({ id: z.string().min(1).max(80) }).strict(),
  apply(state, payload, context) {
    const found = state.mailbox.letters.find((l) => l.id === payload.id);
    if (!found) throw new FwError("invalid_payload", { message: "편지를 찾지 못했어요." });
    return {
      state: {
        ...state,
        mailbox: {
          letters: state.mailbox.letters.map((l) =>
            l.id === found.id ? { ...l, readAt: l.readAt ?? context.now } : l,
          ),
        },
      },
      result: { id: found.id },
    };
  },
});
export const archiveMail = defineCommand({
  type: "mail.archive",
  requiresFreshView: false,
  payloadSchema: z.object({ id: z.string().min(1).max(80), archived: z.boolean() }).strict(),
  apply(state, payload) {
    if (!state.mailbox.letters.some((l) => l.id === payload.id))
      throw new FwError("invalid_payload", { message: "편지를 찾지 못했어요." });
    return {
      state: {
        ...state,
        mailbox: {
          letters: state.mailbox.letters.map((l) => (l.id === payload.id ? { ...l, archived: payload.archived } : l)),
        },
      },
      result: { id: payload.id },
    };
  },
});
