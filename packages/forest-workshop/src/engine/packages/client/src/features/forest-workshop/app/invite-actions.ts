// 초대 (board 03-3) and 초대권 받기 (납품 의뢰): the actions behind 1회 / 10회 초대, 희망 주민, 종표 교환 and delivering a
// request. The server rolls, decides every amount and checks today's list; the client shows what it was told.
import { gameApi } from "./api";
import type { ControllerCore } from "./controller";
import { errorMessage } from "./host-api";
import type { DrawResult } from "./types";

export type InviteTab = "invite" | "exchange";

export type InviteSheet =
  | { kind: "invite-result"; draws: DrawResult[] }
  | { kind: "invite-chances" }
  | { kind: "invite-log" }
  | { kind: "invite-wish" }
  | { kind: "deliveries" };

export function createInviteActions(core: ControllerCore) {
  const { store } = core;

  async function loadDeliveries() {
    const world = core.currentWorld();
    if (!world) return;
    store.set({ deliveries: { state: "loading" } });
    try {
      store.set({ deliveries: { state: "ready", value: await gameApi.getDeliveries(world.worldId) } });
    } catch (error) {
      store.set({ deliveries: { state: "error", message: errorMessage(error, "납품 의뢰를 불러오지 못했습니다.") } });
    }
  }

  return {
    setInviteTab(tab: InviteTab) {
      store.set({ inviteTab: tab });
    },

    async draw(count: number) {
      const response = await core.runCommand(`invite:${count}`, "invite.draw", { count });
      if (response) store.set({ sheet: { kind: "invite-result", draws: response.result.draws as DrawResult[] } });
    },

    async setWish(residentId: string | null) {
      const response = await core.runCommand("invite-wish", "invite.setWish", { residentId });
      if (response) store.set({ sheet: null });
    },

    async exchange(residentId: string) {
      const response = await core.runCommand(`exchange:${residentId}`, "invite.exchange", { residentId });
      if (response) store.set({ sheet: { kind: "invite-result", draws: [response.result as unknown as DrawResult] } });
    },

    /** 초대권 받기: today's 납품 의뢰. */
    openDeliveries() {
      store.set({ sheet: { kind: "deliveries" } });
      void loadDeliveries();
    },

    async deliver(orderId: string) {
      const response = await core.runCommand(`deliver:${orderId}`, "economy.deliver", { orderId });
      if (!response) return;
      const reward = response.result.reward as { tickets: number; gold: number };
      core.notify(`납품했어요. 초대권 ${reward.tickets}장과 ${reward.gold} G를 받았어요.`);
      await loadDeliveries();
    },
  };
}
