// What 현재 관계 (board 03-2) reads for a pair, from its familiarity. Content data for play-testing, not code; the
// words describe closeness, never romance (plan §7.1: 수치는 연애 상태가 아니다).
export interface RelationStage {
  /** Lowest familiarity (0–100) at which this label applies. */
  from: number;
  label: string;
}

export const RELATION_STAGES: readonly RelationStage[] = [
  { from: 0, label: "막 이어진 사이" },
  { from: 20, label: "얼굴을 익힌 사이" },
  { from: 40, label: "편하게 지내는 사이" },
  { from: 60, label: "서로 기대는 사이" },
  { from: 80, label: "오래 함께한 사이" },
];
