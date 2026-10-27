// What the production screens share: names from content, an icon per item, durations, the countdown of a running
// job and the sentence that explains why a facility waits. Countdowns are estimates from the moment the world arrived
// (the server's workshop time runs with real time while the player is here); client-entry.ts ticks them every second
// and asks the server once a run should have finished.
import type { AppState } from "../../app/controller";
import { h } from "../../app/dom";
import type { FieldId, GameContent, Job, TalentDefinition, Waiting, WorldState, WorldView } from "../../app/types";
import { ICONS, type IconFactory } from "../chrome/icons";

const ITEM_ICONS: Record<string, IconFactory> = {
  "wild-berry": ICONS.berry,
  herb: ICONS.leaf,
  wood: ICONS.log,
  pinecone: ICONS.pinecone,
  acorn: ICONS.acorn,
  wheat: ICONS.wheat,
  flower: ICONS.flower,
  pumpkin: ICONS.pumpkin,
  cotton: ICONS.weather,
  "tea-leaf": ICONS.sprout,
  honey: ICONS.jar,
  mushroom: ICONS.mushroom,
  beeswax: ICONS.box,
  feather: ICONS.feather,
  clover: ICONS.clover,
  "berry-jam": ICONS.jar,
  "dried-herb": ICONS.leaf,
  flour: ICONS.box,
  plank: ICONS.log,
  thread: ICONS.spool,
  "herb-tea": ICONS.cup,
  "pumpkin-puree": ICONS.pumpkin,
  "acorn-flour": ICONS.acorn,
  "herb-sachet": ICONS.heart,
  "berry-pie": ICONS.cake,
  "wooden-tray": ICONS.log,
  "beeswax-candle": ICONS.candle,
  "knit-scarf": ICONS.scarf,
  "flower-wreath": ICONS.flower,
  "pumpkin-soup": ICONS.cup,
  "honey-cake": ICONS.cake,
  birdhouse: ICONS.house,
  "acorn-cookie": ICONS.acorn,
  "tea-gift": ICONS.clover,
};

export const FIELD_LABELS: Record<FieldId, string> = {
  gather: "채집",
  grow: "재배",
  survey: "조사",
  process: "가공",
  craft: "제작",
};

export const FIELD_ICONS: Record<FieldId, IconFactory> = {
  gather: ICONS.leaf,
  grow: ICONS.sprout,
  survey: ICONS.search,
  process: ICONS.jar,
  craft: ICONS.hammer,
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

/** One run's time at a level and resident bonus, as the server computes it (content/production.ts runDurationMs). */
export function runMs(content: GameContent, recipe: { minutes: number }, level: number, extraBonus = 0): number {
  return Math.max(
    60_000,
    Math.round((recipe.minutes * 60_000) / (1 + content.production.speedBonusPerLevel * (level - 1) + extraBonus)),
  );
}

/** A resident's passive at this 돌파, as the server computes it (content/crew.ts). */
export function passiveOf(content: GameContent, breakthrough: number): number {
  const steps = Math.min(content.crew.maxBreakthrough, Math.max(0, breakthrough));
  return Math.round((content.crew.passiveBase + content.crew.passivePerBreakthrough * steps) * 1000) / 1000;
}

/** Placed residents' speed for a facility, as the server computes it (domain/production/crew.ts). */
export function crewBonus(content: GameContent, state: WorldState, facilityId: string) {
  const placed = new Set(
    Object.values(state.production.facilities)
      .map((facility) => facility.residentId)
      .filter((id): id is string => id !== null),
  );
  const pairs = Object.values(state.pairs).filter(
    (pair) => !pair.archived && pair.residentIds.every((id) => placed.has(id)),
  ).length;
  const set = Math.min(content.crew.setBonusMax, Math.round(content.crew.setBonusPerPair * pairs * 1000) / 1000);
  const residentId = state.production.facilities[facilityId]?.residentId ?? null;
  const resident = residentId ? state.residents[residentId] : undefined;
  const matches = resident !== undefined && resident.field === facilityOf(content, facilityId)?.field;
  const passive = matches ? passiveOf(content, resident.breakthrough) : 0;
  const talent = matches ? (talentOf(content, resident.talentId) ?? null) : null;
  return {
    resident: resident ?? null,
    matches,
    passive,
    set,
    talent,
    total: Math.round((passive + set) * 1000) / 1000,
  };
}

export function talentOf(content: GameContent | null, talentId: string): TalentDefinition | undefined {
  return content?.talents.find((talent) => talent.id === talentId);
}

/** One run of a recipe with the facility's crew, as the server computes it (domain/production/crew.ts crewRecipe). */
export function crewRun(
  recipe: { id: string; inputs: Record<string, number> },
  crew: { total: number; talent: TalentDefinition | null },
) {
  const inputs = { ...recipe.inputs };
  let extraBonus = crew.total;
  const effect = crew.talent?.effect;
  let talentApplies = false;
  if (effect && effect.recipeId === recipe.id) {
    talentApplies = true;
    if (effect.kind === "speed") extraBonus += effect.bonus;
    else if (inputs[effect.itemId] !== undefined)
      inputs[effect.itemId] = Math.max(1, inputs[effect.itemId]! - effect.amount);
  }
  return { extraBonus: Math.round(extraBonus * 1000) / 1000, inputs, talentApplies };
}

export function percent(value: number): string {
  return `${Math.round(value * 1000) / 10}%`;
}

/** The parts of a facility's 해금 condition and whether each holds (domain/production/unlock.ts). */
export function unlockParts(content: GameContent, state: WorldState, facilityId: string) {
  const condition = facilityOf(content, facilityId)?.unlock;
  if (!condition) return [];
  const parts: Array<{ text: string; have: number; need: number; met: boolean }> = [];
  if (condition.facilityLevel) {
    const other = state.production.facilities[condition.facilityLevel.facilityId];
    const have = other?.unlocked ? other.level : 0;
    const need = condition.facilityLevel.level;
    const name = facilityOf(content, condition.facilityLevel.facilityId)?.name ?? "";
    parts.push({ text: `${name} Lv. ${need} 이상`, have, need, met: have >= need });
  }
  if (condition.made) {
    const have = state.production.made[condition.made.itemId] ?? 0;
    const need = condition.made.amount;
    parts.push({ text: `${itemName(content, condition.made.itemId)} ${need}개 만들기`, have, need, met: have >= need });
  }
  return parts;
}

/** Queue slots at a level (content/production.ts queueSlots). */
export function queueSlotsAt(content: GameContent, level: number): number {
  return content.production.queueSlotLevels.filter((from) => level >= from).length;
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
  if (waiting.reason === "queue_empty") return "지정 횟수 대기열이 비어 쉬고 있어요.";
  if (waiting.reason === "locked") return "아직 열리지 않은 시설이에요.";
  const name = itemName(content, waiting.itemId ?? "");
  const guard = waiting.protectedAmount ? ` (보호 ${waiting.protectedAmount}개는 쓰지 않아요)` : "";
  return `${name}이(가) 부족해 기다리는 중: 한 번에 ${waiting.needed ?? "?"}개 필요, 쓸 수 있는 양 ${waiting.usable ?? 0}개${guard}.`;
}
