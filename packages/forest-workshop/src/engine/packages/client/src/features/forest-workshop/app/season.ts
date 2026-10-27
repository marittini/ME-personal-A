// The season the workshop shows. Until the city weather of P5 decides it (plan §8: 도시 직접 지정 → 현실 계절), it
// follows today's date in the northern hemisphere, or the season the viewer picked in 설정 → 표시. Purely visual: it
// never touches production, sales, deliveries, gifts or any daily limit (those use the server's UTC day).
import type { Season } from "./assets";

export type SeasonChoice = "auto" | Season;

/** Northern-hemisphere meteorological seasons by month (0 = January). */
export function seasonForDate(date: Date): Season {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

export function resolveSeason(choice: SeasonChoice, now: Date = new Date()): Season {
  return choice === "auto" ? seasonForDate(now) : choice;
}

export const SEASON_LABELS: Record<Season, string> = { spring: "봄", summer: "여름", autumn: "가을", winter: "겨울" };
