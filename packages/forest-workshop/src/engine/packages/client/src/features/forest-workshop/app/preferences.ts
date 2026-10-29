// Per-viewer display preferences (설정 → 표시). They belong to this browser only, like the Engine's own UI
// preferences, so they live in localStorage; every read and write tolerates blocked storage.

const FONT_SIZE_KEY = "forest-workshop:font-size";
export const FONT_SIZE = { min: 12, max: 22, default: 16, step: 1 } as const;

export function clampFontSize(value: number): number {
  if (!Number.isFinite(value)) return FONT_SIZE.default;
  return Math.min(FONT_SIZE.max, Math.max(FONT_SIZE.min, Math.round(value)));
}

export function readFontSize(): number {
  try {
    const stored = localStorage.getItem(FONT_SIZE_KEY);
    return stored === null ? FONT_SIZE.default : clampFontSize(Number(stored));
  } catch {
    return FONT_SIZE.default;
  }
}

export function writeFontSize(value: number) {
  try {
    localStorage.setItem(FONT_SIZE_KEY, String(clampFontSize(value)));
  } catch {
    // Blocked storage: the size still applies for this session.
  }
}

const SEASON_KEY = "forest-workshop:season";
const SEASON_CHOICES = ["auto", "spring", "summer", "autumn", "winter"] as const;
export type StoredSeasonChoice = (typeof SEASON_CHOICES)[number];

export function readSeasonChoice(): StoredSeasonChoice {
  try {
    const stored = localStorage.getItem(SEASON_KEY);
    return SEASON_CHOICES.includes(stored as StoredSeasonChoice) ? (stored as StoredSeasonChoice) : "auto";
  } catch {
    return "auto";
  }
}

export function writeSeasonChoice(value: StoredSeasonChoice) {
  try {
    localStorage.setItem(SEASON_KEY, value);
  } catch {
    // Blocked storage: the choice still applies for this session.
  }
}

export interface AutoReadingPreference {
  enabled: boolean;
  seconds: number;
}
const AUTO_READING_KEY = "forest-workshop:auto-reading";
export function normalizeAutoReading(value: Partial<AutoReadingPreference> | null | undefined): AutoReadingPreference {
  return {
    enabled: value?.enabled === true,
    seconds:
      typeof value?.seconds === "number" && Number.isFinite(value.seconds)
        ? Math.max(2, Math.min(10, Math.round(value.seconds)))
        : 4,
  };
}
export function readAutoReading(): AutoReadingPreference {
  try {
    return normalizeAutoReading(JSON.parse(localStorage.getItem(AUTO_READING_KEY) ?? "null"));
  } catch {
    return normalizeAutoReading(null);
  }
}
export function writeAutoReading(value: AutoReadingPreference) {
  try {
    localStorage.setItem(AUTO_READING_KEY, JSON.stringify(normalizeAutoReading(value)));
  } catch {
    /* Session state remains usable. */
  }
}

export type GenerationPurpose = "story" | "profile" | "letter";
const MODEL_KEY = "forest-workshop:model-connections";
export function readModelConnection(purpose: GenerationPurpose): string | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(MODEL_KEY) ?? "{}")[purpose];
    return typeof value === "string" && value.length > 0 && value.length <= 128 ? value : null;
  } catch {
    return null;
  }
}
export function writeModelConnection(purpose: GenerationPurpose, value: string | null): boolean {
  try {
    const current = {
      story: readModelConnection("story"),
      profile: readModelConnection("profile"),
      letter: readModelConnection("letter"),
    };
    current[purpose] = value;
    localStorage.setItem(MODEL_KEY, JSON.stringify(current));
    return true;
  } catch {
    return false;
  }
}
