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

export const WEATHER_KINDS = ["clear", "cloudy", "rain", "snow"] as const;
export type WeatherKind = (typeof WEATHER_KINDS)[number];
export interface WeatherEffectsPreference {
  enabled: boolean;
  kind: WeatherKind;
}
export const WEATHER_LABELS: Record<WeatherKind, string> = { clear: "맑음", cloudy: "흐림", rain: "비", snow: "눈" };
const WEATHER_EFFECTS_KEY = "forest-workshop:weather-effects";
export function normalizeWeatherEffects(
  value: Partial<WeatherEffectsPreference> | null | undefined,
): WeatherEffectsPreference {
  return {
    enabled: value?.enabled !== false,
    kind: WEATHER_KINDS.includes(value?.kind as WeatherKind) ? value!.kind! : "clear",
  };
}
export function readWeatherEffects(): WeatherEffectsPreference {
  try {
    return normalizeWeatherEffects(JSON.parse(localStorage.getItem(WEATHER_EFFECTS_KEY) ?? "null"));
  } catch {
    return normalizeWeatherEffects(null);
  }
}
export function writeWeatherEffects(value: WeatherEffectsPreference) {
  try {
    localStorage.setItem(WEATHER_EFFECTS_KEY, JSON.stringify(normalizeWeatherEffects(value)));
  } catch {
    /* Blocked storage: retain session state. */
  }
}
