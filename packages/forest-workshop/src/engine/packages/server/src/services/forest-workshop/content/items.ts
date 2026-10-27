// Item catalogue. Content data, not code: names, categories and the gold a sale brings. Amounts a feature grants live
// with that feature. Initial values for play-testing (plan §3, §7.2-F), expected to change.

/** material: gathered, grown or found · processed: made on 가공대, used again · goods: finished on 제작대. */
export type ItemCategory = "material" | "processed" | "goods";

export interface ItemDefinition {
  id: string;
  /** Korean display name. */
  name: string;
  category: ItemCategory;
  /** Gold for one item sold from the storeroom. */
  sellPrice: number;
}

export const ITEMS: readonly ItemDefinition[] = [
  // 채집
  { id: "wild-berry", name: "산딸기", category: "material", sellPrice: 2 },
  { id: "herb", name: "허브", category: "material", sellPrice: 2 },
  { id: "wood", name: "목재", category: "material", sellPrice: 3 },
  { id: "pinecone", name: "솔방울", category: "material", sellPrice: 2 },
  { id: "acorn", name: "도토리", category: "material", sellPrice: 2 },
  // 재배
  { id: "wheat", name: "밀", category: "material", sellPrice: 2 },
  { id: "flower", name: "들꽃", category: "material", sellPrice: 3 },
  { id: "pumpkin", name: "호박", category: "material", sellPrice: 9 },
  { id: "cotton", name: "목화", category: "material", sellPrice: 4 },
  { id: "tea-leaf", name: "찻잎", category: "material", sellPrice: 4 },
  // 조사
  { id: "honey", name: "꿀", category: "material", sellPrice: 6 },
  { id: "mushroom", name: "버섯", category: "material", sellPrice: 4 },
  { id: "beeswax", name: "밀랍", category: "material", sellPrice: 8 },
  { id: "feather", name: "깃털", category: "material", sellPrice: 4 },
  { id: "clover", name: "네잎클로버", category: "material", sellPrice: 20 },
  // 가공
  { id: "berry-jam", name: "산딸기 잼", category: "processed", sellPrice: 14 },
  { id: "dried-herb", name: "말린 허브", category: "processed", sellPrice: 8 },
  { id: "flour", name: "밀가루", category: "processed", sellPrice: 8 },
  { id: "plank", name: "판자", category: "processed", sellPrice: 8 },
  { id: "thread", name: "무명실", category: "processed", sellPrice: 10 },
  { id: "herb-tea", name: "허브차", category: "processed", sellPrice: 20 },
  { id: "pumpkin-puree", name: "호박 퓌레", category: "processed", sellPrice: 7 },
  { id: "acorn-flour", name: "도토리 가루", category: "processed", sellPrice: 10 },
  // 제작
  { id: "herb-sachet", name: "허브 향주머니", category: "goods", sellPrice: 30 },
  { id: "berry-pie", name: "산딸기 파이", category: "goods", sellPrice: 48 },
  { id: "wooden-tray", name: "나무 쟁반", category: "goods", sellPrice: 26 },
  { id: "beeswax-candle", name: "밀랍 초", category: "goods", sellPrice: 30 },
  { id: "knit-scarf", name: "뜨개 목도리", category: "goods", sellPrice: 60 },
  { id: "flower-wreath", name: "들꽃 화환", category: "goods", sellPrice: 24 },
  { id: "pumpkin-soup", name: "호박 수프", category: "goods", sellPrice: 36 },
  { id: "honey-cake", name: "꿀 케이크", category: "goods", sellPrice: 42 },
  { id: "birdhouse", name: "새집", category: "goods", sellPrice: 44 },
  { id: "acorn-cookie", name: "도토리 쿠키", category: "goods", sellPrice: 26 },
  { id: "tea-gift", name: "네잎 찻상자", category: "goods", sellPrice: 90 },
];

const BY_ID = new Map(ITEMS.map((item) => [item.id, item]));

export function isKnownItem(itemId: string): boolean {
  return BY_ID.has(itemId);
}

export function itemDefinition(itemId: string): ItemDefinition | undefined {
  return BY_ID.get(itemId);
}
