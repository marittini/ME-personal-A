// Item catalogue. Content data, not code: names and categories here; amounts live with the feature that grants them.
// Initial values for play-testing (plan §3, §7.2-F), expected to change.

export type ItemCategory = "material" | "product";

export interface ItemDefinition {
  id: string;
  /** Korean display name. */
  name: string;
  category: ItemCategory;
}

export const ITEMS: readonly ItemDefinition[] = [
  { id: "wild-berry", name: "산딸기", category: "material" },
  { id: "herb", name: "허브", category: "material" },
  { id: "wood", name: "목재", category: "material" },
];

const ITEM_IDS = new Set(ITEMS.map((item) => item.id));

export function isKnownItem(itemId: string): boolean {
  return ITEM_IDS.has(itemId);
}
