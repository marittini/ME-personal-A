// Forest Workshop client. Registers <marinara-capability-forest-workshop>, which the Engine mounts from the Library
// banner (view="browser"). It renders into its own Shadow DOM with plain DOM nodes: no second React, no global CSS.
//
// Module map:
//   app/              host API client, typed routes, store, controller (all state changes and requests), DOM helpers,
//                     locked-feature registry, per-viewer preferences
//   screens/chrome/   the parts every board shares: frame, top bar, bottom bar, icons, locked elements
//   screens/<area>/   one folder per mockup area (home, work, settings), one render function per screen
//   styles.ts         scoped portrait styles, sized in em from the player's text size
import { createController, type AppState, type Controller } from "./app/controller";
import { renderFrame } from "./screens/chrome/frame";
import { DiagnosticsPanel } from "./screens/diagnostics-panel";
import { renderHomeScreen } from "./screens/home/home-screen";
import { renderBackupScreen } from "./screens/settings/backup-screen";
import { renderSettingsScreen } from "./screens/settings/settings-screen";
import { renderFacilitiesScreen } from "./screens/work/facilities-screen";
import { renderWorkScreen } from "./screens/work/work-screen";
import { renderWorldsScreen } from "./screens/worlds-screen";
import { STYLES } from "./styles";

const TAG = "marinara-capability-forest-workshop";

class ForestWorkshopElement extends HTMLElement {
  private readonly root: ShadowRoot;
  private controller: Controller | null = null;
  private diagnostics: DiagnosticsPanel | null = null;
  private unsubscribe: (() => void) | null = null;
  private readonly styleNode = document.createElement("style");
  private renderedRoute: AppState["route"] | null = null;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.styleNode.textContent = STYLES;
  }

  connectedCallback() {
    if (!this.controller) {
      this.controller = createController();
      this.diagnostics = new DiagnosticsPanel();
      void this.controller.start();
    }
    this.unsubscribe?.();
    this.unsubscribe = this.controller.store.subscribe((state) => this.render(state));
    this.render(this.controller.store.get());
  }

  disconnectedCallback() {
    this.unsubscribe?.();
    this.unsubscribe = null;
  }

  private screen(state: AppState, controller: Controller): HTMLElement {
    switch (state.route) {
      case "home":
        return renderHomeScreen(state, controller);
      case "work":
        return renderWorkScreen(state, controller);
      case "facilities":
        return renderFacilitiesScreen(state, controller);
      case "settings":
        return renderSettingsScreen(state, controller);
      case "backup":
        return renderBackupScreen(state, controller);
      case "diagnostics":
        this.diagnostics!.start();
        return renderFrame(state, controller, {
          top: { kind: "sub", title: "연결 점검", back: { route: "backup", label: "저장·백업" }, resources: false },
          backdrop: "wood",
          body: [this.diagnostics!.node],
          nav: true,
        });
      default:
        return renderWorldsScreen(state, controller);
    }
  }

  private render(state: AppState) {
    const screen = this.screen(state, this.controller!);
    this.style.setProperty("--fw-font-size", `${state.fontSize}px`);
    // Keep keyboard focus and the scroll position across re-renders of the same screen.
    const focusedId = (this.root.activeElement as HTMLElement | null)?.id;
    const scrollTop = state.route === this.renderedRoute ? (this.root.querySelector(".scroll")?.scrollTop ?? 0) : 0;
    this.root.replaceChildren(this.styleNode, screen);
    this.renderedRoute = state.route;
    const scroller = this.root.querySelector(".scroll");
    if (scroller) scroller.scrollTop = scrollTop;
    if (focusedId) (this.root.getElementById(focusedId) as HTMLElement | null)?.focus({ preventScroll: true });
  }
}

if (typeof customElements !== "undefined" && !customElements.get(TAG)) {
  customElements.define(TAG, ForestWorkshopElement);
}
