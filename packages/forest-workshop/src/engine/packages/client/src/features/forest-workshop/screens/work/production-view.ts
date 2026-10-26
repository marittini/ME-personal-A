// What the production screens share: names from content, an icon per item, durations, the countdown of a running
// job and the sentence that explains why a facility waits. Countdowns are estimates from the moment the world arrived
// (the server's workshop time runs with real time while the player is here); client-entry.ts ticks them every second
// and asks the server once a run should have finished.
import type { AppState } from "../../app/controller";
import { h } from "../../app/dom";
import type { GameContent, Job, Waiting, WorldView } from "../../app/types";
import { ICONS, type IconFactory } from "../chrome/icons";

const ITEM_ICONS: Record<string, IconFactory> = {
  "wild-berry": ICONS.berry,
  herb: ICONS.leaf,
  wood: ICONS.log,
  "berry-jam": ICONS.jar,
};

export function itemName(content: GameContent | null, itemId: string): string {
  return content?.items.find((item) => item.id === itemId)?.name ?? itemId;
}

export function itemIcon(itemId: string, className = "icon"): SVGSVGElement {
  return (ITEM_ICONS[itemId] ?? ICONS.box)(className);
}

/** An item picture slot: the item's icon in a framed tile (the illustrated item art arrives with P5). */
export function itemTile(itemId: string, size: "small" | "big" = "small") {
  return h("span", { className: `item-tile ${size} item-${itemId}`, attrs: { "aria-hidden": "true" } }, [
    itemIcon(itemId, "icon"),
  ]);
}

export function recipeOf(content: GameContent | null, recipeId: string) {
  return content?.recipes.find((recipe) => recipe.id === recipeId) ?? null;
}

export function facilityOf(content: GameContent | null, facilityId: string) {
  return content?.facilities.find((facility) => facility.id === facilityId) ?? null;
}

export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return hours ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

export function formatHours(ms: number): string {
  const hours = ms / 3_600_000;
  return hours >= 10 || Number.isInteger(hours) ? `${Math.floor(hours)}` : hours.toFixed(1);
}

/** One run's time at a level, as the server computes it (content/production.ts runDurationMs). */
export function runMs(content: GameContent, recipe: { minutes: number }, level: number): number {
  return Math.max(
    60_000,
    Math.round((recipe.minutes * 60_000) / (1 + content.production.speedBonusPerLevel * (level - 1))),
  );
}

/** Speed bonus at a level, as the server computes it. */
export function speedPercent(content: GameContent | null, level: number): number {
  return Math.round((content?.production.speedBonusPerLevel ?? 0) * (level - 1) * 100);
}

/** Estimated real epoch ms a running job ends, from the world as it arrived. */
export function jobEndsAt(state: AppState, world: WorldView, job: Job): number {
  return state.worldReceivedAt + (job.endsSim - world.state.production.simMs);
}

/** A countdown and a progress bar that client-entry.ts updates every second without re-rendering. */
export function jobProgress(state: AppState, world: WorldView, job: Job) {
  const endsAt = jobEndsAt(state, world, job);
  const total = job.endsSim - job.startedSim;
  const fill = h("span", {
    className: "bar-fill",
    attrs: { "data-progress-end": String(endsAt), "data-progress-total": String(total) },
  });
  const remaining = Math.max(0, endsAt - Date.now());
  fill.style.width = `${Math.round(((total - remaining) / Math.max(1, total)) * 100)}%`;
  return {
    bar: h("span", { className: "bar teal" }, [fill]),
    countdown: h("span", {
      className: "countdown",
      text: formatDuration(remaining),
      attrs: { "data-countdown-end": String(endsAt) },
    }),
  };
}

/** Why a facility waits, in the player's words (plan §7.2-E: 부족·대기 이유, 보호로 사용 못하는 양). */
export function waitingText(content: GameContent | null, waiting: Waiting | null): string {
  if (!waiting) return "";
  if (waiting.reason === "no_rules") return "켜 둔 운영 규칙이 없어 쉬고 있어요.";
  if (waiting.reason === "target_reached") return "모든 목표 재고를 채워 쉬고 있어요. 재고가 줄면 다시 시작해요.";
  const name = itemName(content, waiting.itemId ?? "");
  const guard = waiting.protectedAmount ? ` (보호 ${waiting.protectedAmount}개는 쓰지 않아요)` : "";
  return `${name}이(가) 부족해 기다리는 중: 한 번에 ${waiting.needed ?? "?"}개 필요, 쓸 수 있는 양 ${waiting.usable ?? 0}개${guard}.`;
}
