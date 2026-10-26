// Mockup elements whose feature is not built yet. They keep their place and shape on screen, drawn as locked
// (owner decision 2026-10-26, docs/forest-workshop/ui-spec.md). Tapping one says which phase opens it.
// When a phase lands, delete its entries here: every screen asks `isLocked()` and turns the element on by itself.

export type LockedFeature =
  | "weather"
  | "mail"
  | "stories"
  | "explore"
  | "weather-effects"
  | "auto-read"
  | "ai-guidelines"
  | "memory"
  | "pair-memory"
  | "pair-guidelines";

const LOCKED: Readonly<Record<LockedFeature, { label: string; phase: "P4" | "P5" }>> = {
  weather: { label: "현실 날씨", phase: "P5" },
  mail: { label: "우편함", phase: "P4" },
  stories: { label: "주민 이야기", phase: "P4" },
  explore: { label: "탐사", phase: "P4" },
  "weather-effects": { label: "날씨 효과", phase: "P5" },
  "auto-read": { label: "자동 읽기", phase: "P4" },
  "ai-guidelines": { label: "AI 지침 관리", phase: "P4" },
  memory: { label: "기억 관리", phase: "P4" },
  "pair-memory": { label: "페어 기억 보기", phase: "P4" },
  "pair-guidelines": { label: "페어 지침 관리", phase: "P4" },
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
  return entry ? `${entry.label} 기능은 준비 중이에요. 개발 ${entry.phase} 단계에서 열려요.` : "";
}
