// Mockup elements whose feature is not built yet. They keep their place and shape on screen, drawn as locked
// (owner decision 2026-10-26, docs/forest-workshop/ui-spec.md). Tapping one says which phase opens it.
// When a phase lands, delete its entries here: every screen asks `isLocked()` and turns the element on by itself.

export type LockedFeature = "weather" | "survey-patrol" | "weather-effects" | "memory" | "pair-memory";

const LOCKED: Readonly<Record<LockedFeature, { label: string; phase: "P4b" | "P5" }>> = {
  weather: { label: "현실 날씨", phase: "P5" },
  "survey-patrol": { label: "조사 · 순찰", phase: "P4b" },
  "weather-effects": { label: "날씨 효과", phase: "P5" },
  memory: { label: "기억 관리", phase: "P4b" },
  "pair-memory": { label: "페어 기억 보기", phase: "P4b" },
};

export function isLocked(feature: LockedFeature): boolean {
  return feature in LOCKED;
}

export function lockedPhase(feature: LockedFeature): string {
  return LOCKED[feature]?.phase ?? "";
}

/** The sentence a tap on a locked element shows. */
export function lockedMessage(feature: LockedFeature): string {
  const entry = LOCKED[feature];
  return entry ? `${entry.label} 기능은 아직 준비 중이에요.` : "";
}
