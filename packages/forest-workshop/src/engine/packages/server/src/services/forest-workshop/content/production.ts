// Facilities and recipes (plan §7.2, §7.2-F). Content data: one facility per field (채집 · 재배 · 조사 · 가공 · 제작).
// A new world opens with the first two (채집터 · 가공대), the small gather → process loop of the first play test
// (plan §11 재미·부담 검증: 2시설 · 3제작법); the other three open by a one-time condition (해금 퀘스트, plan §7.2-F).
// Every number is a play-test starting point.
//
// validateProductionContent() runs on import and refuses broken data: unknown items or facilities, a recipe that
// needs its own output, or a cycle between recipes (plan §7.2-D: 순환 제작법은 콘텐츠 검증에서 거절).
import { isKnownItem } from "./items";

export const FIELD_IDS = ["gather", "grow", "survey", "process", "craft"] as const;
export type FieldId = (typeof FIELD_IDS)[number];

/** What opens a facility (once). All parts must hold. */
export interface UnlockCondition {
  /** Another facility at this level or higher (it must be open). */
  facilityLevel?: { facilityId: string; level: number };
  /** Made this many of an item over the world's life. */
  made?: { itemId: string; amount: number };
}

export interface FacilityDefinition {
  id: string;
  name: string;
  field: FieldId;
  /** Global facility priority when two facilities compete for the same material: lower first (plan §7.2-D). */
  order: number;
  description: string;
  /** null = open from the start. */
  unlock: UnlockCondition | null;
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
    unlock: null,
  },
  {
    id: "grow-plot",
    name: "재배밭",
    field: "grow",
    order: 2,
    description: "밀과 들꽃을 길러 거두는 밭이에요.",
    unlock: { made: { itemId: "berry-jam", amount: 3 } },
  },
  {
    id: "survey-desk",
    name: "조사대",
    field: "survey",
    order: 3,
    description: "숲 구석구석을 살펴 귀한 재료를 찾아요.",
    unlock: { facilityLevel: { facilityId: "gather-yard", level: 3 } },
  },
  {
    id: "process-bench",
    name: "가공대",
    field: "process",
    order: 4,
    description: "재료를 가공해 다양한 물건을 만들 수 있어요.",
    unlock: null,
  },
  {
    id: "craft-bench",
    name: "제작대",
    field: "craft",
    order: 5,
    description: "가공한 재료로 선물이 될 물건을 지어요.",
    unlock: { facilityLevel: { facilityId: "process-bench", level: 3 }, made: { itemId: "flour", amount: 2 } },
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
    id: "gather-wood",
    name: "나뭇가지 줍기",
    facilityId: "gather-yard",
    description: "바람에 떨어진 가지를 주워 목재로 다듬어요.",
    inputs: {},
    outputs: { wood: 2 },
    minutes: 14,
  },
  {
    id: "gather-pinecone",
    name: "솔방울 줍기",
    facilityId: "gather-yard",
    description: "소나무 아래에서 마른 솔방울을 모아요.",
    inputs: {},
    outputs: { pinecone: 3 },
    minutes: 12,
  },
  {
    id: "gather-acorn",
    name: "도토리 줍기",
    facilityId: "gather-yard",
    description: "참나무 숲에서 도토리를 주워요.",
    inputs: {},
    outputs: { acorn: 3 },
    minutes: 16,
  },
  {
    id: "grow-wheat",
    name: "밀 기르기",
    facilityId: "grow-plot",
    description: "밭 한 줄에 밀을 길러 거둬요.",
    inputs: {},
    outputs: { wheat: 3 },
    minutes: 15,
  },
  {
    id: "grow-flower",
    name: "들꽃 기르기",
    facilityId: "grow-plot",
    description: "향이 좋은 들꽃을 길러요.",
    inputs: {},
    outputs: { flower: 2 },
    minutes: 18,
  },
  {
    id: "grow-pumpkin",
    name: "호박 기르기",
    facilityId: "grow-plot",
    description: "넝쿨을 돌봐 둥근 호박을 거둬요.",
    inputs: {},
    outputs: { pumpkin: 1 },
    minutes: 30,
  },
  {
    id: "grow-cotton",
    name: "목화 기르기",
    facilityId: "grow-plot",
    description: "하얀 솜이 터지면 목화를 따요.",
    inputs: {},
    outputs: { cotton: 2 },
    minutes: 24,
  },
  {
    id: "grow-tea",
    name: "찻잎 기르기",
    facilityId: "grow-plot",
    description: "어린 찻잎만 골라 따요.",
    inputs: {},
    outputs: { "tea-leaf": 2 },
    minutes: 20,
  },
  {
    id: "survey-honey",
    name: "벌집 찾기",
    facilityId: "survey-desk",
    description: "오래된 나무를 살펴 꿀을 조금 얻어 와요.",
    inputs: {},
    outputs: { honey: 1 },
    minutes: 20,
  },
  {
    id: "survey-mushroom",
    name: "버섯 살피기",
    facilityId: "survey-desk",
    description: "그늘진 곳의 버섯을 조심히 골라 와요.",
    inputs: {},
    outputs: { mushroom: 2 },
    minutes: 16,
  },
  {
    id: "survey-beeswax",
    name: "빈 벌집 모으기",
    facilityId: "survey-desk",
    description: "벌이 떠난 벌집에서 밀랍을 얻어요.",
    inputs: {},
    outputs: { beeswax: 1 },
    minutes: 25,
  },
  {
    id: "survey-feather",
    name: "깃털 찾기",
    facilityId: "survey-desk",
    description: "새들이 쉬어 간 자리에서 깃털을 주워요.",
    inputs: {},
    outputs: { feather: 2 },
    minutes: 18,
  },
  {
    id: "survey-clover",
    name: "네잎클로버 찾기",
    facilityId: "survey-desk",
    description: "클로버 밭을 오래 들여다봐요.",
    inputs: {},
    outputs: { clover: 1 },
    minutes: 40,
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
  {
    id: "dried-herb",
    name: "말린 허브",
    facilityId: "process-bench",
    description: "허브를 그늘에 말려 향을 모아요.",
    inputs: { herb: 3 },
    outputs: { "dried-herb": 1 },
    minutes: 10,
  },
  {
    id: "flour",
    name: "밀가루",
    facilityId: "process-bench",
    description: "밀을 곱게 빻아요.",
    inputs: { wheat: 3 },
    outputs: { flour: 1 },
    minutes: 12,
  },
  {
    id: "plank",
    name: "판자",
    facilityId: "process-bench",
    description: "목재를 켜서 판자로 다듬어요.",
    inputs: { wood: 2 },
    outputs: { plank: 1 },
    minutes: 10,
  },
  {
    id: "thread",
    name: "무명실",
    facilityId: "process-bench",
    description: "목화솜을 자아 실을 뽑아요.",
    inputs: { cotton: 2 },
    outputs: { thread: 1 },
    minutes: 14,
  },
  {
    id: "herb-tea",
    name: "허브차",
    facilityId: "process-bench",
    description: "찻잎에 말린 허브를 섞어 덖어요.",
    inputs: { "tea-leaf": 2, "dried-herb": 1 },
    outputs: { "herb-tea": 1 },
    minutes: 16,
  },
  {
    id: "pumpkin-puree",
    name: "호박 퓌레",
    facilityId: "process-bench",
    description: "호박을 쪄서 곱게 으깨요.",
    inputs: { pumpkin: 1 },
    outputs: { "pumpkin-puree": 2 },
    minutes: 15,
  },
  {
    id: "acorn-flour",
    name: "도토리 가루",
    facilityId: "process-bench",
    description: "도토리를 우려 말린 뒤 빻아요.",
    inputs: { acorn: 4 },
    outputs: { "acorn-flour": 1 },
    minutes: 14,
  },
  {
    id: "herb-sachet",
    name: "허브 향주머니",
    facilityId: "craft-bench",
    description: "말린 허브와 들꽃을 천에 담아 묶어요.",
    inputs: { "dried-herb": 2, flower: 1 },
    outputs: { "herb-sachet": 1 },
    minutes: 25,
  },
  {
    id: "berry-pie",
    name: "산딸기 파이",
    facilityId: "craft-bench",
    description: "잼과 밀가루, 꿀 한 숟갈로 구운 파이예요.",
    inputs: { "berry-jam": 1, flour: 2, honey: 1 },
    outputs: { "berry-pie": 1 },
    minutes: 30,
  },
  {
    id: "wooden-tray",
    name: "나무 쟁반",
    facilityId: "craft-bench",
    description: "판자를 다듬어 둥근 쟁반을 만들어요.",
    inputs: { plank: 2 },
    outputs: { "wooden-tray": 1 },
    minutes: 20,
  },
  {
    id: "beeswax-candle",
    name: "밀랍 초",
    facilityId: "craft-bench",
    description: "밀랍을 녹여 무명실 심지에 입혀요.",
    inputs: { beeswax: 1, thread: 1 },
    outputs: { "beeswax-candle": 1 },
    minutes: 22,
  },
  {
    id: "knit-scarf",
    name: "뜨개 목도리",
    facilityId: "craft-bench",
    description: "무명실로 천천히 목도리를 떠요.",
    inputs: { thread: 4 },
    outputs: { "knit-scarf": 1 },
    minutes: 40,
  },
  {
    id: "flower-wreath",
    name: "들꽃 화환",
    facilityId: "craft-bench",
    description: "들꽃과 솔방울을 엮어 문에 걸 화환을 만들어요.",
    inputs: { flower: 3, pinecone: 2 },
    outputs: { "flower-wreath": 1 },
    minutes: 28,
  },
  {
    id: "pumpkin-soup",
    name: "호박 수프",
    facilityId: "craft-bench",
    description: "호박 퓌레에 버섯을 넣고 뭉근히 끓여요.",
    inputs: { "pumpkin-puree": 2, mushroom: 2 },
    outputs: { "pumpkin-soup": 1 },
    minutes: 26,
  },
  {
    id: "honey-cake",
    name: "꿀 케이크",
    facilityId: "craft-bench",
    description: "밀가루 반죽에 꿀을 듬뿍 넣어 구워요.",
    inputs: { flour: 2, honey: 2 },
    outputs: { "honey-cake": 1 },
    minutes: 30,
  },
  {
    id: "birdhouse",
    name: "새집",
    facilityId: "craft-bench",
    description: "판자로 집을 짓고 깃털로 입구를 꾸며요.",
    inputs: { plank: 3, feather: 1 },
    outputs: { birdhouse: 1 },
    minutes: 35,
  },
  {
    id: "acorn-cookie",
    name: "도토리 쿠키",
    facilityId: "craft-bench",
    description: "도토리 가루와 꿀로 고소한 쿠키를 구워요.",
    inputs: { "acorn-flour": 1, honey: 1 },
    outputs: { "acorn-cookie": 1 },
    minutes: 18,
  },
  {
    id: "tea-gift",
    name: "네잎 찻상자",
    facilityId: "craft-bench",
    description: "허브차 두 봉에 네잎클로버를 얹은 선물 상자예요.",
    inputs: { "herb-tea": 2, clover: 1 },
    outputs: { "tea-gift": 1 },
    minutes: 45,
  },
];

/** The recommended rules a new world starts with, and what 추천 설정 proposes (plan §7.2-B, §7.2-E). */
export const RECOMMENDED_RULES: Readonly<Record<string, readonly RuleTemplate[]>> = {
  "gather-yard": [
    { recipeId: "gather-berry", targetStock: 30, priority: 1 },
    { recipeId: "gather-herb", targetStock: 10, priority: 2 },
    { recipeId: "gather-wood", targetStock: 8, priority: 3 },
  ],
  "grow-plot": [
    { recipeId: "grow-wheat", targetStock: 15, priority: 1 },
    { recipeId: "grow-flower", targetStock: 6, priority: 2 },
    { recipeId: "grow-cotton", targetStock: 6, priority: 3 },
  ],
  "survey-desk": [
    { recipeId: "survey-honey", targetStock: 4, priority: 1 },
    { recipeId: "survey-mushroom", targetStock: 6, priority: 2 },
  ],
  "process-bench": [
    { recipeId: "berry-jam", targetStock: 5, priority: 1 },
    { recipeId: "dried-herb", targetStock: 3, priority: 2 },
    { recipeId: "flour", targetStock: 4, priority: 3 },
  ],
  "craft-bench": [
    { recipeId: "berry-pie", targetStock: 2, priority: 1 },
    { recipeId: "herb-sachet", targetStock: 2, priority: 2 },
  ],
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

/** 지정 횟수 queue slots: 3, growing to 5 with the facility level (plan §7.2-F: 대기열 3→5). */
export const QUEUE_SLOT_LEVELS: readonly number[] = [1, 1, 1, 8, 15];
export const QUEUE_COUNT_RANGE = { min: 1, max: 99 } as const;

export function queueSlots(level: number): number {
  return QUEUE_SLOT_LEVELS.filter((from) => level >= from).length;
}

/**
 * Run time in ms at a facility level, with any extra speed from placed residents (content/crew.ts): faster by the
 * total bonus, never below one minute.
 */
export function runDurationMs(recipe: RecipeDefinition, level: number, extraBonus = 0): number {
  return Math.max(60_000, Math.round((recipe.minutes * 60_000) / (1 + speedBonus(level) + extraBonus)));
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
  const fields = new Set<string>();
  for (const facility of facilities) {
    if (fields.has(facility.field)) throw new Error(`Two facilities for field ${facility.field}`);
    fields.add(facility.field);
    const needs = facility.unlock?.facilityLevel?.facilityId;
    if (needs !== undefined && (!facilityIds.has(needs) || needs === facility.id)) {
      throw new Error(`Facility ${facility.id}: bad unlock facility`);
    }
    const item = facility.unlock?.made?.itemId;
    if (item !== undefined && !isKnownItem(item)) throw new Error(`Facility ${facility.id}: unknown unlock item`);
  }
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
