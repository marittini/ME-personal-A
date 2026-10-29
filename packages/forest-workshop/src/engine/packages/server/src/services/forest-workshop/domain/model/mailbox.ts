import { z } from "zod";
// ponytail: fixed welcome mail is small and transactional with the world. Generated letters require separate
// documents, indexed paging and backup support before this initial 200-letter ceiling is expanded.
export const letterSchema = z
  .object({
    id: z.string().min(1).max(80),
    eventId: z.string().min(1).max(80),
    sender: z.string().min(1).max(80),
    title: z.string().min(1).max(80),
    body: z.string().min(1).max(1000),
    createdAt: z.string().datetime(),
    readAt: z.string().datetime().nullable(),
    archived: z.boolean(),
  })
  .strict();
export const mailboxSchema = z
  .object({ letters: z.array(letterSchema).max(200) })
  .strict()
  .refine(
    (box) =>
      new Set(box.letters.map((l) => l.id)).size === box.letters.length &&
      new Set(box.letters.map((l) => l.eventId)).size === box.letters.length,
    { message: "duplicate letter" },
  );
export function initialMailbox(now: string) {
  return {
    letters: [
      {
        id: "welcome-v1",
        eventId: "welcome-v1",
        sender: "공방 안내",
        title: "숲결 공방에 오신 걸 환영해요",
        body: "이곳에서는 주민들과 함께 물건을 만들고 이야기를 쌓아 갈 수 있어요. 잠시 쉬어 가도 괜찮아요. 편지는 읽은 뒤 보관함으로 옮겨 언제든 다시 볼 수 있어요.",
        createdAt: now,
        readAt: null,
        archived: false,
      },
    ],
  };
}
