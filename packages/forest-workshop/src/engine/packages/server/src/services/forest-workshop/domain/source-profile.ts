// Reads the parts of a character card or persona the game keeps (plan §7.1: 원본 snapshot). Pure and tolerant:
// character data arrives as the stored JSON text, personas as the row object; both are read field by field and
// anything missing is an empty string. Avatars, gallery images and appearance-for-image fields are never read: a
// resident's picture comes only from the player's own upload (plan §8.1).
import type { ResidentKind } from "./model/residents";
import { SNAPSHOT_FIELD_MAX, SOURCE_NAME_MAX } from "./model/residents";

export interface SourceProfile {
  kind: ResidentKind;
  id: string;
  name: string;
  description: string;
  personality: string;
  scenario: string;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value === "string") {
    try {
      return asRecord(JSON.parse(value));
    } catch {
      return null;
    }
  }
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function text(record: Record<string, unknown>, key: string, max: number): string {
  const value = record[key];
  if (typeof value !== "string") return "";
  const trimmed = value.replace(/\r\n?/gu, "\n").trim();
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}

/** Null when the record has no usable name (it cannot become a resident). */
export function readSourceProfile(kind: ResidentKind, id: string, data: unknown): SourceProfile | null {
  const outer = asRecord(data);
  if (!outer) return null;
  // Character Card V2/V3 keep the fields under `data`; Marinara's own rows keep them at the top.
  const card = asRecord(outer.data) ?? outer;
  const name = text(card, "name", SOURCE_NAME_MAX).replace(/\s+/gu, " ");
  if (!name) return null;
  const description = text(card, "description", SNAPSHOT_FIELD_MAX.description);
  // A persona's backstory is its personal history; it belongs with the description it extends.
  const backstory = kind === "persona" ? text(card, "backstory", SNAPSHOT_FIELD_MAX.description) : "";
  return {
    kind,
    id,
    name,
    description: [description, backstory].filter(Boolean).join("\n\n").slice(0, SNAPSHOT_FIELD_MAX.description),
    personality: text(card, "personality", SNAPSHOT_FIELD_MAX.personality),
    scenario: text(card, "scenario", SNAPSHOT_FIELD_MAX.scenario),
  };
}

/** The short "원래 설정" line the screens show: the first sentences of the description, or the personality. */
export function sourceSummary(profile: Pick<SourceProfile, "description" | "personality">, max = 160): string {
  const base = (profile.description || profile.personality).replace(/\s+/gu, " ").trim();
  if (base.length <= max) return base;
  const cut = base.slice(0, max);
  const stop = cut.lastIndexOf(". ");
  return `${stop > max / 2 ? cut.slice(0, stop + 1) : cut.slice(0, max - 1)}…`;
}
