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

// Only the generation service can submit model output; clients cannot create arbitrary mail.
export const saveResidentLetter = defineCommand({
  type: "mail.saveResidentLetter",
  internal: true,
  requiresFreshView: true,
  payloadSchema: z
    .object({
      activityId: z.string().uuid(),
      title: z.string().trim().min(1).max(80),
      body: z.string().trim().min(1).max(1000),
    })
    .strict(),
  apply(state, payload, context) {
    const activity = state.activities.completed.find((item) => item.id === payload.activityId);
    if (!activity) throw new FwError("invalid_payload", { message: "완료된 활동을 찾지 못했어요." });
    const id = `resident-${activity.id}`;
    if (state.mailbox.letters.some((letter) => letter.id === id)) return { state, result: { id } };
    if (state.mailbox.letters.length + (state.activities.running ? 1 : 0) >= 200)
      throw new FwError("invalid_payload", {
        message: "우편 공간이 부족해요. 진행 중인 활동의 결과 공간을 확보해야 해요.",
      });
    const resident = state.residents[activity.residentId];
    if (!resident) throw new FwError("invalid_payload", { message: "편지를 보낸 주민을 찾지 못했어요." });
    const letter = {
      id,
      eventId: id,
      sender: resident.displayName,
      title: payload.title,
      body: payload.body,
      createdAt: context.now,
      readAt: null,
      archived: false,
    };
    return { state: { ...state, mailbox: { letters: [letter, ...state.mailbox.letters] } }, result: { id } };
  },
});
