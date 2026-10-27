// 특기 (plan §3 전문분야 5종, §7.2-A/F): every resident gets a field and one talent of that field when they are
// registered — decided by the server from the character or persona, never picked afterwards. A talent works where its
// owner is placed in a facility of their field: one recipe of that facility runs faster, or needs one input less.
// Play-test values.
import { FIELD_IDS, facilityDefinition, recipeDefinition, type FieldId } from "./production";

export type TalentEffect =
  /** This recipe runs faster by `bonus` (added to the facility's speed). */
  | { kind: "speed"; recipeId: string; bonus: number }
  /** This recipe takes `amount` less of `itemId` per run (never below 1). */
  | { kind: "save"; recipeId: string; itemId: string; amount: number };

export interface TalentDefinition {
  id: string;
  field: FieldId;
  name: string;
  description: string;
  effect: TalentEffect;
}

const speed = (recipeId: string, bonus = 0.15): TalentEffect => ({ kind: "speed", recipeId, bonus });
const save = (recipeId: string, itemId: string, amount = 1): TalentEffect => ({
  kind: "save",
  recipeId,
  itemId,
  amount,
});

export const TALENTS: readonly TalentDefinition[] = [
  // 채집
  {
    id: "berry-eye",
    field: "gather",
    name: "덤불 눈썰미",
    description: "산딸기 채집이 15% 빨라요.",
    effect: speed("gather-berry"),
  },
  {
    id: "herb-nose",
    field: "gather",
    name: "약초 코",
    description: "허브 채집이 15% 빨라요.",
    effect: speed("gather-herb"),
  },
  {
    id: "woodcutter",
    field: "gather",
    name: "가지 고르기",
    description: "나뭇가지 줍기가 15% 빨라요.",
    effect: speed("gather-wood"),
  },
  {
    id: "squirrel-path",
    field: "gather",
    name: "다람쥐 길",
    description: "도토리 줍기가 15% 빨라요.",
    effect: speed("gather-acorn"),
  },
  // 재배
  {
    id: "wheat-hands",
    field: "grow",
    name: "밀밭 손길",
    description: "밀 기르기가 15% 빨라요.",
    effect: speed("grow-wheat"),
  },
  {
    id: "flower-talk",
    field: "grow",
    name: "꽃에게 말 걸기",
    description: "들꽃 기르기가 15% 빨라요.",
    effect: speed("grow-flower"),
  },
  {
    id: "vine-keeper",
    field: "grow",
    name: "넝쿨지기",
    description: "호박 기르기가 15% 빨라요.",
    effect: speed("grow-pumpkin"),
  },
  {
    id: "tea-picker",
    field: "grow",
    name: "새순 따기",
    description: "찻잎 기르기가 15% 빨라요.",
    effect: speed("grow-tea"),
  },
  // 조사
  {
    id: "bee-friend",
    field: "survey",
    name: "벌의 친구",
    description: "벌집 찾기가 15% 빨라요.",
    effect: speed("survey-honey"),
  },
  {
    id: "mushroom-lore",
    field: "survey",
    name: "버섯 도감",
    description: "버섯 살피기가 15% 빨라요.",
    effect: speed("survey-mushroom"),
  },
  {
    id: "bird-watcher",
    field: "survey",
    name: "새 관찰",
    description: "깃털 찾기가 15% 빨라요.",
    effect: speed("survey-feather"),
  },
  {
    id: "lucky-glance",
    field: "survey",
    name: "행운의 눈",
    description: "네잎클로버 찾기가 15% 빨라요.",
    effect: speed("survey-clover"),
  },
  // 가공
  {
    id: "jam-thrift",
    field: "process",
    name: "알뜰한 잼 솥",
    description: "산딸기 잼에 산딸기가 1개 덜 들어요.",
    effect: save("berry-jam", "wild-berry"),
  },
  { id: "fine-mill", field: "process", name: "고운 맷돌", description: "밀가루가 15% 빨라요.", effect: speed("flour") },
  { id: "spinner", field: "process", name: "물레질", description: "무명실이 15% 빨라요.", effect: speed("thread") },
  {
    id: "acorn-soak",
    field: "process",
    name: "도토리 우리기",
    description: "도토리 가루에 도토리가 1개 덜 들어요.",
    effect: save("acorn-flour", "acorn"),
  },
  // 제작
  {
    id: "baker",
    field: "craft",
    name: "빵 굽는 손",
    description: "산딸기 파이가 15% 빨라요.",
    effect: speed("berry-pie"),
  },
  {
    id: "knitter",
    field: "craft",
    name: "뜨개 솜씨",
    description: "뜨개 목도리에 무명실이 1개 덜 들어요.",
    effect: save("knit-scarf", "thread"),
  },
  {
    id: "carpenter",
    field: "craft",
    name: "목수의 눈",
    description: "새집에 판자가 1개 덜 들어요.",
    effect: save("birdhouse", "plank"),
  },
  {
    id: "wreath-maker",
    field: "craft",
    name: "화환 엮기",
    description: "들꽃 화환이 15% 빨라요.",
    effect: speed("flower-wreath"),
  },
];

const BY_ID = new Map(TALENTS.map((talent) => [talent.id, talent]));

export function talentDefinition(talentId: string | null | undefined): TalentDefinition | undefined {
  return talentId ? BY_ID.get(talentId) : undefined;
}

export function talentsOf(field: FieldId): TalentDefinition[] {
  return TALENTS.filter((talent) => talent.field === field);
}

/** Refuses broken data on import: a talent's recipe must belong to a facility of its field; every field has talents. */
export function validateTalents(talents: readonly TalentDefinition[] = TALENTS): void {
  const ids = new Set<string>();
  for (const talent of talents) {
    if (ids.has(talent.id)) throw new Error(`Duplicate talent ${talent.id}`);
    ids.add(talent.id);
    const recipe = recipeDefinition(talent.effect.recipeId);
    if (!recipe || facilityDefinition(recipe.facilityId)?.field !== talent.field) {
      throw new Error(`Talent ${talent.id}: recipe outside its field`);
    }
    if (talent.effect.kind === "save") {
      const need = recipe.inputs[talent.effect.itemId] ?? 0;
      if (need - talent.effect.amount < 1) throw new Error(`Talent ${talent.id}: would remove an input`);
    }
  }
  for (const field of FIELD_IDS)
    if (!talents.some((talent) => talent.field === field)) throw new Error(`No talent for ${field}`);
}

validateTalents();
