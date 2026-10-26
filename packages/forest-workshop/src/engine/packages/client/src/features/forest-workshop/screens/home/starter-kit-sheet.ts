// The one-time welcome package (plan §7.2-E), shown as a sheet over the home so the home itself keeps the mockup's
// layout. The amounts come from the server's content; the server alone grants them.
import type { AppState, Controller } from "../../app/controller";
import { button, h } from "../../app/dom";
import type { GameContent } from "../../app/types";
import { ICONS } from "../chrome/icons";

function itemName(content: GameContent, itemId: string) {
  return content.items.find((item) => item.id === itemId)?.name ?? itemId;
}

export function renderStarterKitSheet(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  const content = state.content;
  if (!world || !content || world.state.progress.starterKitClaimed || state.starterSheetHidden) return null;
  const busy = Boolean(state.busy["claim-starter-kit"]);
  const kit = content.starterKit;
  return h("div", { className: "sheet-backdrop" }, [
    h(
      "section",
      { className: "sheet card", attrs: { role: "dialog", "aria-modal": "true", "aria-labelledby": "fw-starter" } },
      [
        h("h2", { className: "section-title", text: "공방 시작 꾸러미", attrs: { id: "fw-starter" } }),
        h("p", { className: "muted", text: "첫 채집과 가공을 시작할 재료예요. 한 번만 받을 수 있어요." }),
        h("ul", { className: "kit" }, [
          h("li", { className: "kit-item" }, [
            h("span", { className: "coin" }),
            h("span", { text: "골드" }),
            h("strong", { text: kit.gold.toLocaleString("ko-KR") }),
          ]),
          ...Object.entries(kit.items).map(([itemId, amount]) =>
            h("li", { className: "kit-item" }, [
              ICONS.leaf("icon"),
              h("span", { text: itemName(content, itemId) }),
              h("strong", { text: amount.toLocaleString("ko-KR") }),
            ]),
          ),
        ]),
        button(
          busy ? "받는 중…" : "받기",
          () => void controller.runCommand("claim-starter-kit", "onboarding.claimStarterKit"),
          {
            disabled: busy,
            attrs: { "data-wide": "" },
          },
        ),
        button("나중에", () => controller.hideStarterSheet(), { variant: "secondary", attrs: { "data-wide": "" } }),
      ],
    ),
  ]);
}
