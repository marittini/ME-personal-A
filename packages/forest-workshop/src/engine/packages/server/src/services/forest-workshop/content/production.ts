// Facilities and recipes (plan §7.2, §7.2-F). Content data for the first play test: two facilities and three recipes,
// a small gather → process loop (plan §11 재미·부담 검증: 2시설 · 3제작법). Every number is a play-test starting point.
//
// validateProductionContent() runs on import and refuses broken data: unknown items or facilities, a recipe that
// needs its own output, or a cycle between recipes (plan §7.2-D: 순환 제작법은 콘텐츠 검증에서 거절).
import { isKnownItem } from "./items";

export type FieldId = "gather" | "grow" | "survey" | "process" | "craft";

export interface FacilityDefinition {
  id: string;
  name: string;
  field: FieldId;
  /** Global facility priority when two facilities compete for the same material: lower first (plan §7.2-D). */
  order: number;
  description: string;
}

export interface RecipeDefinition {
  id: string;
  name: string;
  facilityId: string;
  description: string;
  inputs: Readonly<Record<string, number>>;
  outputs: Readonly<Record<string, number>>;
  /** Time for one run at level 1, in minutes. */
  minutes: number;
}

export interface RuleTemplate {
  recipeId: string;
  targetStock: number;
  priority: number;
}

export const FACILITIES: readonly FacilityDefinition[] = [
  {
    id: "gather-yard",
    name: "채집터",
    field: "gather",
    order: 1,
    description: "숲에서 재료를 모아 오는 기본 시설이에요.",
  },
  {
    id: "process-bench",
    name: "가공대",
    field: "process",
    order: 2,
    description: "재료를 가공해 다양한 물건을 만들 수 있어요.",
  },
];

export const RECIPES: readonly RecipeDefinition[] = [
  {
    id: "gather-berry",
    name: "산딸기 채집",
    facilityId: "gather-yard",
    description: "숲길 덤불에서 산딸기를 모아요.",
    inputs: {},
    outputs: { "wild-berry": 3 },
    minutes: 10,
  },
  {
    id: "gather-herb",
    name: "허브 채집",
    facilityId: "gather-yard",
    description: "볕 드는 언덕에서 허브를 뜯어 와요.",
    inputs: {},
    outputs: { herb: 2 },
    minutes: 12,
  },
  {
    id: "berry-jam",
    name: "산딸기 잼",
    facilityId: "process-bench",
    description: "숲에서 수확한 산딸기로 만든 달콤한 잼이에요.",
    inputs: { "wild-berry": 4 },
    outputs: { "berry-jam": 1 },
    minutes: 15,
  },
];

/** The recommended rules a new world starts with, and what 추천 설정 proposes (plan §7.2-B, §7.2-E). */
export const RECOMMENDED_RULES: Readonly<Record<string, readonly RuleTemplate[]>> = {
  "gather-yard": [
    { recipeId: "gather-berry", targetStock: 30, priority: 1 },
    { recipeId: "gather-herb", targetStock: 10, priority: 2 },
  ],
  "process-bench": [{ recipeId: "berry-jam", targetStock: 5, priority: 1 }],
};

export const FACILITY_MAX_LEVEL = 20;
/** Speed bonus per level above 1 (plan §7.2-F: 시설 20레벨). +2% per level, capped by the max level. */
export const SPEED_BONUS_PER_LEVEL = 0.02;
export const MAX_RULES_PER_FACILITY = 5;
export const TARGET_STOCK_RANGE = { min: 1, max: 999 } as const;
export const PROTECTED_STOCK_RANGE = { min: 0, max: 999 } as const;

/** Gold to go from `level` to `level + 1`. */
export function upgradeCost(level: number): number {
  return Math.round(60 * 1.35 ** (level - 1));
}

export function speedBonus(level: number): number {
  return SPEED_BONUS_PER_LEVEL * (Math.max(1, level) - 1);
}

/** Run time in ms at a facility level: faster by the speed bonus, never below one minute. */
export function runDurationMs(recipe: RecipeDefinition, level: number): number {
  return Math.max(60_000, Math.round((recipe.minutes * 60_000) / (1 + speedBonus(level))));
}

const RECIPE_BY_ID = new Map(RECIPES.map((recipe) => [recipe.id, recipe]));
const FACILITY_BY_ID = new Map(FACILITIES.map((facility) => [facility.id, facility]));

export function recipeDefinition(recipeId: string): RecipeDefinition | undefined {
  return RECIPE_BY_ID.get(recipeId);
}

export function facilityDefinition(facilityId: string): FacilityDefinition | undefined {
  return FACILITY_BY_ID.get(facilityId);
}

/** Facilities in their global priority order. */
export const FACILITY_ORDER: readonly string[] = [...FACILITIES].sort((a, b) => a.order - b.order).map((f) => f.id);

export function validateProductionContent(
  facilities: readonly FacilityDefinition[] = FACILITIES,
  recipes: readonly RecipeDefinition[] = RECIPES,
): void {
  const facilityIds = new Set(facilities.map((facility) => facility.id));
  const recipeIds = new Set<string>();
  for (const recipe of recipes) {
    if (recipeIds.has(recipe.id)) throw new Error(`Duplicate recipe ${recipe.id}`);
    recipeIds.add(recipe.id);
    if (!facilityIds.has(recipe.facilityId)) throw new Error(`Recipe ${recipe.id}: unknown facility`);
    if (!(recipe.minutes > 0)) throw new Error(`Recipe ${recipe.id}: time must be positive`);
    const items = [...Object.entries(recipe.inputs), ...Object.entries(recipe.outputs)];
    for (const [itemId, amount] of items) {
      if (!isKnownItem(itemId)) throw new Error(`Recipe ${recipe.id}: unknown item ${itemId}`);
      if (!Number.isInteger(amount) || amount <= 0) throw new Error(`Recipe ${recipe.id}: bad amount for ${itemId}`);
    }
    if (Object.keys(recipe.outputs).length === 0) throw new Error(`Recipe ${recipe.id}: no output`);
  }
  // Item graph: input item → output item. A cycle means a recipe could, through others, feed itself.
  const edges = new Map<string, Set<string>>();
  for (const recipe of recipes) {
    for (const input of Object.keys(recipe.inputs)) {
      for (const output of Object.keys(recipe.outputs)) {
        if (!edges.has(input)) edges.set(input, new Set());
        edges.get(input)!.add(output);
      }
    }
  }
  const state = new Map<string, "visiting" | "done">();
  const visit = (item: string, path: string[]) => {
    if (state.get(item) === "done") return;
    if (state.get(item) === "visiting") throw new Error(`Recipe cycle: ${[...path, item].join(" → ")}`);
    state.set(item, "visiting");
    for (const next of edges.get(item) ?? []) visit(next, [...path, item]);
    state.set(item, "done");
  };
  for (const item of edges.keys()) visit(item, []);
}

validateProductionContent();
