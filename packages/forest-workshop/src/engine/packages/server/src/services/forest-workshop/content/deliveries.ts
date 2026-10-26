// 납품 의뢰 (plan §7.2-A 주민 초대용 납품, §7.2-C, §7.6): each UTC day the workshop gets a few requests. Delivering one
// (always the player's confirmed action) gives 초대권 and a little gold. Only today's list exists: missed days are
// not collected later. Requests take usable stock only (never protected stock). Play-test values.
export interface DeliveryOrder {
  id: string;
  /** Short line shown on the request card. */
  title: string;
  items: Readonly<Record<string, number>>;
  reward: { tickets: number; gold: number };
}

/** Requests a new workshop can fill (채집터 · 가공대). One of these is always on the day's list. */
export const STARTER_ORDERS: readonly DeliveryOrder[] = [
  { id: "jam-jars", title: "이웃 마을 잡화점의 잼 주문", items: { "berry-jam": 2 }, reward: { tickets: 1, gold: 20 } },
  { id: "berry-basket", title: "산딸기 한 바구니", items: { "wild-berry": 15 }, reward: { tickets: 1, gold: 10 } },
  { id: "herb-bundle", title: "약초상의 허브 다발", items: { herb: 8 }, reward: { tickets: 1, gold: 10 } },
];

/** Requests that need the facilities opened later. */
export const LATER_ORDERS: readonly DeliveryOrder[] = [
  { id: "dried-herbs", title: "찻집의 말린 허브", items: { "dried-herb": 3 }, reward: { tickets: 1, gold: 30 } },
  { id: "flour-sack", title: "빵집의 밀가루 한 자루", items: { flour: 3 }, reward: { tickets: 1, gold: 30 } },
  { id: "honey-jar", title: "꿀 한 단지", items: { honey: 2 }, reward: { tickets: 1, gold: 20 } },
  { id: "pie-order", title: "축하 자리에 놓을 파이", items: { "berry-pie": 1 }, reward: { tickets: 2, gold: 40 } },
  { id: "sachet-gift", title: "선물용 향주머니", items: { "herb-sachet": 1 }, reward: { tickets: 2, gold: 30 } },
  { id: "tray-set", title: "나무 쟁반 두 개", items: { "wooden-tray": 2 }, reward: { tickets: 2, gold: 30 } },
];

export const ORDERS_PER_DAY = 3;

export const ALL_ORDERS: readonly DeliveryOrder[] = [...STARTER_ORDERS, ...LATER_ORDERS];
