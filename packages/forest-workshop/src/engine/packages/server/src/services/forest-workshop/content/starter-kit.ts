// The one-time welcome package that lets the first session start a small gather → process loop (plan §7.2-E).
// Initial values for play-testing.

export const STARTER_KIT = {
  gold: 200,
  /** 초대권 for the first invitations (board 03-3); more come from 납품 의뢰. */
  tickets: 3,
  items: {
    "wild-berry": 20,
    herb: 10,
    wood: 10,
  } as Readonly<Record<string, number>>,
} as const;
