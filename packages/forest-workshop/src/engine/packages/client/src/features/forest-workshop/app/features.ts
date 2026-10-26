// Mockup elements whose feature is not built yet. They keep their place and shape on screen, drawn as locked
// (owner decision 2026-10-26, docs/forest-workshop/ui-spec.md). Tapping one says which phase opens it.
// When a phase lands, delete its entries here: every screen asks `isLocked()` and turns the element on by itself.

export type LockedFeature =
  | "tickets"
  | "weather"
  | "mail"
  | "stories"
  | "explore"
  | "invite"
  | "work-fields"
  | "work-mode"
  | "auto-sell"
  | "assign-residents"
  | "weather-effects"
  | "auto-read"
  | "ai-guidelines"
  | "memory"
  | "specialty"
  | "breakthrough"
  | "pair-memory"
  | "pair-guidelines";

const LOCKED: Readonly<Record<LockedFeature, { label: string; phase: "P2" | "P3" | "P4" | "P5" }>> = {
  tickets: { label: "초대권", phase: "P3" },
  weather: { label: "현실 날씨", phase: "P5" },
  mail: { label: "우편함", phase: "P4" },
  stories: { label: "주민 이야기", phase: "P4" },
  explore: { label: "탐사", phase: "P4" },
  invite: { label: "초대", phase: "P3" },
  "work-fields": { label: "재배 · 조사 · 제작 시설", phase: "P3" },
  "work-mode": { label: "지정 횟수 제작", phase: "P3" },
  "auto-sell": { label: "자동 판매", phase: "P3" },
  "assign-residents": { label: "주민 배치", phase: "P3" },
  "weather-effects": { label: "날씨 효과", phase: "P5" },
  "auto-read": { label: "자동 읽기", phase: "P4" },
  "ai-guidelines": { label: "AI 지침 관리", phase: "P4" },
  memory: { label: "기억 관리", phase: "P4" },
  specialty: { label: "전문 분야", phase: "P3" },
  breakthrough: { label: "패시브 · 돌파", phase: "P3" },
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
