// Residents (plan §3, §7.1, §8.1). A resident is a character or persona the player registered into this world.
// The source (sourceKind/sourceId) and the residentId are separate: the source is only read, never written, and a
// snapshot of what it said at registration is kept for the 원래 설정 ↔ 공방 세계 설정 comparison. A persona resident is
// an inhabitant like any other; it is never the player (the player has a nickname only).
import { z } from "zod";
import { MAX_BREAKTHROUGH } from "../../content/crew";
import { FIELD_IDS } from "../../content/production";

export const RESIDENT_KINDS = ["character", "persona"] as const;
export type ResidentKind = (typeof RESIDENT_KINDS)[number];

export const MAX_RESIDENTS = 100;
export const WORLD_SETTING_MAX = 200;
export const DISPLAY_NAME_MAX = 40;
export const SOURCE_NAME_MAX = 80;
export const SNAPSHOT_FIELD_MAX = { description: 8000, personality: 4000, scenario: 4000 } as const;
export const IMAGE_HISTORY_LIMIT = 3;
export const CHANGE_LOG_LIMIT = 50;
export const PLACEMENT_LIMITS = {
  scale: { min: 50, max: 150, default: 100 },
  offsetX: { min: -50, max: 50, default: 0 },
  markerHeight: { min: -50, max: 50, default: 0 },
} as const;

const isoTime = z.string().datetime();
const uuid = z.string().uuid();

/** One-line text: trimmed, inner whitespace collapsed. */
const lineText = (max: number) =>
  z
    .string()
    .transform((value) => value.trim().replace(/\s+/gu, " "))
    .pipe(z.string().min(1).max(max));

/** Multi-line text the player edits (공방 세계 설정): trimmed, at most one blank line in a row. */
export const worldSettingSchema = z
  .string()
  .transform((value) =>
    value
      .replace(/\r\n?/gu, "\n")
      .replace(/\n{3,}/gu, "\n\n")
      .trim(),
  )
  .pipe(z.string().min(1).max(WORLD_SETTING_MAX));

export const displayNameSchema = lineText(DISPLAY_NAME_MAX);

export const sourceRefSchema = z.object({ kind: z.enum(RESIDENT_KINDS), id: z.string().min(1).max(128) }).strict();

export const sourceSnapshotSchema = z
  .object({
    name: z.string().min(1).max(SOURCE_NAME_MAX),
    description: z.string().max(SNAPSHOT_FIELD_MAX.description),
    personality: z.string().max(SNAPSHOT_FIELD_MAX.personality),
    scenario: z.string().max(SNAPSHOT_FIELD_MAX.scenario),
    /** sha256 of the full source record when read, so a later "source changed" check needs no copy of it. */
    sourceHash: z.string().regex(/^[0-9a-f]{64}$/u),
    takenAt: isoTime,
  })
  .strict();
export type SourceSnapshot = z.infer<typeof sourceSnapshotSchema>;

/** `global-gallery:<id>` — the only form a picture is referenced by (plan §6); the URL is kept for display only. */
export const GALLERY_REFERENCE = /^global-gallery:[A-Za-z0-9._-]{1,128}$/u;

export const residentImageSchema = z
  .object({
    reference: z.string().regex(GALLERY_REFERENCE),
    url: z.string().min(1).max(512),
    width: z.number().int().min(1).max(4096),
    height: z.number().int().min(1).max(4096),
    bytes: z.number().int().min(1),
    hasTransparency: z.boolean(),
    fileName: z.string().max(120),
    uploadKey: z.string().regex(/^[A-Za-z0-9-]{8,64}$/u),
    uploadedAt: isoTime,
  })
  .strict();
export type ResidentImage = z.infer<typeof residentImageSchema>;

const placementValue = (limits: { min: number; max: number }) => z.number().int().min(limits.min).max(limits.max);
export const placementSchema = z
  .object({
    scale: placementValue(PLACEMENT_LIMITS.scale),
    offsetX: placementValue(PLACEMENT_LIMITS.offsetX),
    markerHeight: placementValue(PLACEMENT_LIMITS.markerHeight),
  })
  .strict();
export type Placement = z.infer<typeof placementSchema>;

export const DEFAULT_PLACEMENT: Placement = {
  scale: PLACEMENT_LIMITS.scale.default,
  offsetX: PLACEMENT_LIMITS.offsetX.default,
  markerHeight: PLACEMENT_LIMITS.markerHeight.default,
};

export const CHANGE_KINDS = [
  "registered",
  "setting",
  "name",
  "recruited",
  "image",
  "image_restored",
  "image_history_cleared",
  "placement",
  "field",
  "breakthrough",
] as const;

export const changeSchema = z.object({ at: isoTime, kind: z.enum(CHANGE_KINDS), detail: z.string().max(200) }).strict();
export type ResidentChange = z.infer<typeof changeSchema>;

export const residentSchema = z
  .object({
    residentId: uuid,
    kind: z.enum(RESIDENT_KINDS),
    sourceId: z.string().min(1).max(128),
    source: sourceSnapshotSchema,
    displayName: displayNameSchema,
    worldSetting: worldSettingSchema,
    /** Recruited residents live in the workshop; the others are registered and wait for an invitation (P3). */
    recruited: z.boolean(),
    /** 전문 분야, decided at registration (domain/residents/talent-assign.ts). A placed resident helps only in a
     *  facility of this field. */
    field: z.enum(FIELD_IDS),
    /** 특기 of that field (content/talents.ts), decided with the field. */
    talentId: z.string().min(1).max(64),
    /** 돌파 0–5, from inviting a resident who already came (plan §7.2-F). */
    breakthrough: z.number().int().min(0).max(MAX_BREAKTHROUGH),
    registeredAt: isoTime,
    image: z
      .object({
        current: residentImageSchema.nullable(),
        /** Earlier pictures, newest first. Kept so the player can go back; the gallery keeps their files. */
        history: z.array(residentImageSchema).max(IMAGE_HISTORY_LIMIT),
        placement: placementSchema,
      })
      .strict(),
    /** 변경 이력, newest first. */
    changes: z.array(changeSchema).max(CHANGE_LOG_LIMIT),
  })
  .strict();
export type Resident = z.infer<typeof residentSchema>;

/** Newest first, capped. */
export function withChange(resident: Resident, change: ResidentChange): Resident {
  return { ...resident, changes: [change, ...resident.changes].slice(0, CHANGE_LOG_LIMIT) };
}

/** Every picture reference a resident holds (current and history); the gallery must keep these files. */
export function residentImageReferences(resident: Resident): ResidentImage[] {
  return [...(resident.image.current ? [resident.image.current] : []), ...resident.image.history];
}
