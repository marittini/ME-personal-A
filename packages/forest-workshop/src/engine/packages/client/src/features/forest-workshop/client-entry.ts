// Forest Workshop client. Registers <marinara-capability-forest-workshop>, which the Engine mounts from the Library
// banner (view="browser"). It renders into its own Shadow DOM with plain DOM nodes: no second React, no global CSS.
//
// Module map:
//   app/              host API client, typed routes, store, controller (all state changes and requests), DOM helpers,
//                     locked-feature registry, per-viewer preferences
//   screens/chrome/   the parts every board shares: frame, top bar, bottom bar, icons, locked elements
//   screens/<area>/   one folder per mockup area (home, work, residents, settings), one render function per screen
//   styles*.ts        scoped portrait styles (styles-residents.ts for the resident boards), sized from the player's
//                     text size
import { createController, type AppState, type Controller } from "./app/controller";
import { renderFrame } from "./screens/chrome/frame";
import { DiagnosticsPanel } from "./screens/diagnostics-panel";
import { renderHomeScreen } from "./screens/home/home-screen";
import { renderRegisterScreen } from "./screens/residents/register-screen";
import { renderRelationsScreen } from "./screens/residents/relations-screen";
import { renderResidentImageScreen } from "./screens/residents/resident-image-screen";
import { renderResidentsScreen } from "./screens/residents/residents-screen";
import { renderBackupScreen } from "./screens/settings/backup-screen";
import { renderSettingsScreen } from "./screens/settings/settings-screen";
import { renderFacilitiesScreen } from "./screens/work/facilities-screen";
import { renderWorkScreen } from "./screens/work/work-screen";
import { renderWorldsScreen } from "./screens/worlds-screen";
import { STYLES } from "./styles";
import { RESIDENT_STYLES } from "./styles-residents";

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
    this.styleNode.textContent = STYLES + RESIDENT_STYLES;
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
      case "residents":
        return renderResidentsScreen(state, controller);
      case "relations":
        return renderRelationsScreen(state, controller);
      case "register":
        return renderRegisterScreen(state, controller);
      case "resident-image":
        return renderResidentImageScreen(state, controller);
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
    // Keep keyboard focus, the caret in a text field and the scroll position across re-renders of the same screen,
    // so a field that updates the store as the player types keeps working.
    const focused = this.root.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
    const focusedId = focused?.id;
    const caret =
      focused && "selectionStart" in focused && typeof focused.selectionStart === "number"
        ? [focused.selectionStart, focused.selectionEnd ?? focused.selectionStart]
        : null;
    const scrollTop = state.route === this.renderedRoute ? (this.root.querySelector(".scroll")?.scrollTop ?? 0) : 0;
    this.root.replaceChildren(this.styleNode, screen);
    this.renderedRoute = state.route;
    const scroller = this.root.querySelector(".scroll");
    if (scroller) scroller.scrollTop = scrollTop;
    if (focusedId) {
      const next = this.root.getElementById(focusedId) as HTMLInputElement | HTMLTextAreaElement | null;
      next?.focus({ preventScroll: true });
      if (next && caret && typeof next.setSelectionRange === "function") {
        try {
          next.setSelectionRange(caret[0]!, caret[1]!);
        } catch {
          // type=range and similar inputs have no caret.
        }
      }
    }
  }
}

if (typeof customElements !== "undefined" && !customElements.get(TAG)) {
  customElements.define(TAG, ForestWorkshopElement);
}
