// Forest Workshop client. Registers <marinara-capability-forest-workshop>, which the Engine mounts from the Library
// banner (view="browser"). It renders into its own Shadow DOM with plain DOM nodes: no second React, no global CSS.
//
// Module map:
//   app/      host API client, typed routes, store, controller (all state changes and requests), DOM helpers
//   screens/  one render function per screen, plus the self-contained connection-check panel
//   styles.ts scoped portrait styles
import { createController, type AppState, type Controller } from "./app/controller";
import { renderBackupScreen } from "./screens/backup-screen";
import { renderLayout } from "./screens/layout";
import { DiagnosticsPanel } from "./screens/diagnostics-panel";
import { renderHomeScreen } from "./screens/home-screen";
import { renderSettingsScreen } from "./screens/settings-screen";
import { renderWorldsScreen } from "./screens/worlds-screen";
import { STYLES } from "./styles";

const TAG = "marinara-capability-forest-workshop";

class ForestWorkshopElement extends HTMLElement {
  private readonly root: ShadowRoot;
  private controller: Controller | null = null;
  private diagnostics: DiagnosticsPanel | null = null;
  private unsubscribe: (() => void) | null = null;
  private readonly styleNode = document.createElement("style");

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

  private render(state: AppState) {
    const controller = this.controller!;
    let screen: HTMLElement;
    switch (state.route) {
      case "home":
        screen = renderHomeScreen(state, controller);
        break;
      case "settings":
        screen = renderSettingsScreen(state, controller);
        break;
      case "backup":
        screen = renderBackupScreen(state, controller);
        break;
      case "diagnostics":
        this.diagnostics!.start();
        screen = renderLayout(state, controller, {
          title: "연결 점검",
          back: { route: "settings", label: "설정" },
          showWorldBar: false,
          body: [this.diagnostics!.node],
        });
        break;
      default:
        screen = renderWorldsScreen(state, controller);
    }
    // Keep keyboard focus on the same control across re-renders when it still exists.
    const focusedId = (this.root.activeElement as HTMLElement | null)?.id;
    this.root.replaceChildren(this.styleNode, screen);
    if (focusedId) (this.root.getElementById(focusedId) as HTMLElement | null)?.focus();
  }
}

if (typeof customElements !== "undefined" && !customElements.get(TAG)) {
  customElements.define(TAG, ForestWorkshopElement);
}
