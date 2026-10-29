// A written scene (`fw-story` document, plan §6: 큰 본문은 immutable 저장). Written once when the player first reads an
// unlocked episode; never rewritten by a later generation. The world points to it by the storyId fixed in the plan.
import { z } from "zod";

const uuid = z.string().uuid();

/** The six agreed emotion marks (plan §8; drawn art in assets/emotions) and "none". */
export const EMOTIONS = ["none", "joy", "affection", "curiosity", "fluster", "inspiration", "annoyance"] as const;
/** Marks of prompt v1 (0.6.0), still read from scenes written then; shown as their closest drawn mark. */
export const LEGACY_EMOTIONS = {
  calm: "affection",
  surprise: "curiosity",
  worry: "fluster",
  thinking: "inspiration",
  shy: "fluster",
} as const;
const STORED_EMOTIONS = [
  ...EMOTIONS,
  ...(Object.keys(LEGACY_EMOTIONS) as Array<keyof typeof LEGACY_EMOTIONS>),
] as const;
export const STORY_LIMITS = {
  segmentsMin: 4,
  segmentsMax: 16,
  lineMax: 120,
  narrationMax: 160,
  questionMax: 100,
  optionMax: 40,
  memoriesMax: 3,
  memoryMax: 100,
} as const;

export const segmentSchema = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("line"),
      speakerId: uuid,
      text: z.string().min(1).max(STORY_LIMITS.lineMax),
      emotion: z.enum(STORED_EMOTIONS),
    })
    .strict(),
  z.object({ kind: z.literal("narration"), text: z.string().min(1).max(STORY_LIMITS.narrationMax) }).strict(),
  z
    .object({
      kind: z.literal("choice"),
      askerId: uuid,
      question: z.string().min(1).max(STORY_LIMITS.questionMax),
      options: z
        .array(
          z
            .object({ optionId: z.string().min(1).max(16), text: z.string().min(1).max(STORY_LIMITS.optionMax) })
            .strict(),
        )
        .min(2)
        .max(3),
    })
    .strict(),
]);
export type Segment = z.infer<typeof segmentSchema>;

export const storyMemorySchema = z
  .object({
    text: z.string().min(1).max(STORY_LIMITS.memoryMax),
    factType: z.enum(["event", "feeling"]),
    knowerIds: z.array(uuid).min(1).max(2),
    subjectIds: z.array(uuid).max(2),
  })
  .strict();
export type StoryMemory = z.infer<typeof storyMemorySchema>;

export const storyDocumentSchema = z
  .object({
    schemaVersion: z.literal(1),
    worldId: uuid,
    storyId: uuid,
    pairId: uuid,
    arcId: z.string().min(1).max(64),
    episode: z.number().int().min(0).max(2),
    title: z.string().min(1).max(60),
    place: z.string().min(1).max(60),
    participants: z.array(uuid).min(1).max(2),
    segments: z.array(segmentSchema).min(STORY_LIMITS.segmentsMin).max(STORY_LIMITS.segmentsMax),
    /** Facts the scene leaves, recorded in the ledger when it is read (knowers are participants only). */
    memories: z.array(storyMemorySchema).max(STORY_LIMITS.memoriesMax),
    /** contextManifest (plan §7.7): what the writer was given, by ID and count — never private text. */
    manifest: z
      .object({
        promptVersion: z.number().int().min(1),
        connectionId: z.string().max(128),
        model: z.string().max(128),
        perspective: z.literal("shared"),
        participantIds: z.array(uuid),
        factIds: z.array(z.number().int().min(1)),
        estimatedTokens: z.number().int().min(0),
        worldRevision: z.number().int().min(0),
        guidelineRevisions: z
          .object({ world: z.number().int().min(0), pair: z.number().int().min(0) })
          .strict()
          .optional(),
      })
      .strict(),
    generatedAt: z.string().datetime(),
  })
  .strict();
export type StoryDocument = z.infer<typeof storyDocumentSchema>;
