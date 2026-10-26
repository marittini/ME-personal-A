// onboarding.claimStarterKit — the one-time welcome package. The amounts come from content/starter-kit.ts; the
// server alone decides them, and a second claim is refused however it arrives (another tab, a retry with a new ID).
import { z } from "zod";
import { STARTER_KIT } from "../../content/starter-kit";
import { FwError } from "../errors";
import { addItems } from "../world-model";
import { defineCommand } from "./command";

export const claimStarterKit = defineCommand({
  type: "onboarding.claimStarterKit",
  payloadSchema: z.object({}).strict(),
  requiresFreshView: false,
  apply(state) {
    if (state.progress.starterKitClaimed) throw new FwError("already_claimed");
    return {
      state: {
        ...state,
        wallet: { ...state.wallet, gold: state.wallet.gold + STARTER_KIT.gold },
        inventory: addItems(state.inventory, STARTER_KIT.items),
        progress: { ...state.progress, starterKitClaimed: true },
      },
      result: { granted: { gold: STARTER_KIT.gold, items: { ...STARTER_KIT.items } } },
    };
  },
});
