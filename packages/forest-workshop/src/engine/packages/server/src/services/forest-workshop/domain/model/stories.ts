// Story progress (plan §6 세계 문서, §7.3). The world keeps where each pair's current arc stands and the one
// expedition slot; the words of each scene live in their own `fw-story` document (store/story-repository.ts).
// Episode states: not started → running (expedition out) → unlocked (time reached; the scene may not be written yet)
// → read. "locked" / "available" are not stored: they are derived from the conditions (domain/stories/arcs.ts).
import { z } from "zod";

const uuid = z.string().uuid();
const isoTime = z.string().datetime();
const nonNegativeInt = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER);

export const EPISODE_STATES = ["idle", "running", "unlocked", "read"] as const;
export type EpisodeState = (typeof EPISODE_STATES)[number];

export const episodeProgressSchema = z
  .object({
    state: z.enum(EPISODE_STATES),
    /** The scene's document ID, fixed by the plan so a retried generation writes the same scene. */
    storyId: uuid,
    unlockedAt: isoTime.nullable(),
    readAt: isoTime.nullable(),
    /** The player's answer to the scene's question, once (plan §3 선택지로 답변). */
    choice: z
      .object({ optionId: z.string().min(1).max(16), at: isoTime })
      .strict()
      .nullable(),
  })
  .strict();
export type EpisodeProgress = z.infer<typeof episodeProgressSchema>;

export const arcProgressSchema = z
  .object({
    arcId: z.string().min(1).max(64),
    /** The resident of episode 1 (and the first named in 2–3), fixed when the arc starts. */
    leadId: uuid,
    startedAt: isoTime,
    episodes: z.tuple([episodeProgressSchema, episodeProgressSchema, episodeProgressSchema]),
  })
  .strict();
export type ArcProgress = z.infer<typeof arcProgressSchema>;

export const MAX_COMPLETED_ARCS = 1000;

export const pairStoriesSchema = z
  .object({
    current: arcProgressSchema.nullable(),
    /** Arcs read to the end, in order (도감: they can be read again). */
    completed: z.array(arcProgressSchema).max(MAX_COMPLETED_ARCS),
  })
  .strict();
export type PairStories = z.infer<typeof pairStoriesSchema>;

export const expeditionSchema = z
  .object({
    pairId: uuid,
    episode: z.number().int().min(0).max(2),
    participants: z.array(uuid).min(1).max(2),
    /** Workshop time: the expedition timer counts under the same 72-hour rule as production (plan §7.6). */
    startedSim: nonNegativeInt,
    endsSim: nonNegativeInt,
    startedAt: isoTime,
    /** Taken when it left; returned in full if it is cancelled. */
    preparations: z.record(z.string(), z.number().int().min(1).max(999)),
  })
  .strict();
export type Expedition = z.infer<typeof expeditionSchema>;

export const storiesStateSchema = z
  .object({
    pairs: z.record(uuid, pairStoriesSchema),
    expedition: expeditionSchema.nullable(),
  })
  .strict();
export type StoriesState = z.infer<typeof storiesStateSchema>;
