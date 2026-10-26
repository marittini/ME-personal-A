// Item catalogue. Content data, not code: names, categories and the gold a sale brings. Amounts a feature grants live
// with that feature. Initial values for play-testing (plan §3, §7.2-F), expected to change.

export type ItemCategory = "material" | "product";

export interface ItemDefinition {
  id: string;
  /** Korean display name. */
  name: string;
  category: ItemCategory;
  /** Gold for one item sold from the storeroom. */
  sellPrice: number;
}

export const ITEMS: readonly ItemDefinition[] = [
  { id: "wild-berry", name: "산딸기", category: "material", sellPrice: 2 },
  { id: "herb", name: "허브", category: "material", sellPrice: 2 },
  { id: "wood", name: "목재", category: "material", sellPrice: 3 },
  { id: "berry-jam", name: "산딸기 잼", category: "product", sellPrice: 14 },
];

const BY_ID = new Map(ITEMS.map((item) => [item.id, item]));

export function isKnownItem(itemId: string): boolean {
  return BY_ID.has(itemId);
}

export function itemDefinition(itemId: string): ItemDefinition | undefined {
  return BY_ID.get(itemId);
}
