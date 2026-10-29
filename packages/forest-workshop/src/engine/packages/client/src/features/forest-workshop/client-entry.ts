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
import { screenPageKey } from "./app/screen-page";
import { measureStoryPages } from "./app/story-pages";
import { renderFrame } from "./screens/chrome/frame";
import { DiagnosticsPanel } from "./screens/diagnostics-panel";
import { renderHomeScreen } from "./screens/home/home-screen";
import { renderInviteScreen } from "./screens/invite/invite-screen";
import { renderExploreScreen } from "./screens/explore/explore-screen";
import { renderStoryReader } from "./screens/explore/story-reader";
import { renderRegisterScreen } from "./screens/residents/register-screen";
import { renderRelationsScreen } from "./screens/residents/relations-screen";
import { renderResidentImageScreen } from "./screens/residents/resident-image-screen";
import { renderResidentsScreen } from "./screens/residents/residents-screen";
import { renderBackupScreen } from "./screens/settings/backup-screen";
import { renderSettingsScreen } from "./screens/settings/settings-screen";
import { renderFacilitiesScreen } from "./screens/work/facilities-screen";
import { renderWorkScreen } from "./screens/work/work-screen";
import { renderWorldsScreen } from "./screens/worlds-screen";
import { formatDuration } from "./screens/work/production-view";
import { STYLES } from "./styles";
import { PRODUCTION_STYLES } from "./styles-production";
import { INVITE_STYLES } from "./styles-invite";
import { STORY_STYLES } from "./styles-story";
import { ART_STYLES } from "./styles-art";
import { RESIDENT_STYLES } from "./styles-residents";

const TAG = "marinara-capability-forest-workshop";

class ForestWorkshopElement extends HTMLElement {
  private readonly root: ShadowRoot;
  private controller: Controller | null = null;
  private diagnostics: DiagnosticsPanel | null = null;
  private unsubscribe: (() => void) | null = null;
  private readonly styleNode = document.createElement("style");
  private renderedRoute: AppState["route"] | null = null;
  private renderedPage: string | null = null;
  private ticker: ReturnType<typeof setInterval> | undefined;
  private readonly resizeObserver = new ResizeObserver(() => this.measureStory());
  /** Countdown ends already asked about, so a finished run triggers one refresh, not one per second. */
  private refreshedEnds = new Set<string>();
  private readonly onPresence = () => {
    if (document.hidden) this.controller?.pauseAutoReading();
    void this.controller?.heartbeat();
  };
  private readonly onBlur = () => this.controller?.pauseAutoReading();
  /** The world the last opening heartbeat was for: opening a world is presence at once, not a minute later. */
  private presentWorld: string | null = null;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.styleNode.textContent =
      STYLES + PRODUCTION_STYLES + RESIDENT_STYLES + INVITE_STYLES + STORY_STYLES + ART_STYLES;
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
    // Presence (plan §7.6): a heartbeat every minute while this screen is visible and focused, and at once when it
    // becomes so again.
    this.resizeObserver.observe(this);
    this.controller.startHeartbeat();
    document.addEventListener("visibilitychange", this.onPresence);
    window.addEventListener("focus", this.onPresence);
    window.addEventListener("blur", this.onBlur);
    clearInterval(this.ticker);
    this.ticker = setInterval(() => this.tick(), 1000);
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.controller?.stopHeartbeat();
    this.controller?.pauseAutoReading();
    document.removeEventListener("visibilitychange", this.onPresence);
    window.removeEventListener("focus", this.onPresence);
    window.removeEventListener("blur", this.onBlur);
    clearInterval(this.ticker);
  }

  /** Moves countdowns and progress bars without re-rendering; asks the server once when a run should have ended. */
  private tick() {
    const now = Date.now();
    for (const node of this.root.querySelectorAll<HTMLElement>("[data-countdown-end]")) {
      const end = Number(node.dataset.countdownEnd);
      node.textContent = formatDuration(end - now);
      if (end <= now && !this.refreshedEnds.has(node.dataset.countdownEnd!)) {
        this.refreshedEnds.add(node.dataset.countdownEnd!);
        // A moment's grace so the server's clock has passed the end too.
        setTimeout(() => void this.controller?.refreshProduction(), 1500);
      }
    }
    for (const node of this.root.querySelectorAll<HTMLElement>("[data-progress-end]")) {
      const end = Number(node.dataset.progressEnd);
      const total = Math.max(1, Number(node.dataset.progressTotal));
      node.style.width = `${Math.min(100, Math.max(0, Math.round(((total - Math.max(0, end - now)) / total) * 100)))}%`;
    }
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
      case "invite":
        return renderInviteScreen(state, controller);
      case "explore":
        return renderExploreScreen(state, controller);
      case "story":
        return renderStoryReader(state, controller);
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

  /** Measure the actual rendered dialogue area, including its current font, width and speaker label. */
  private measureStory() {
    const reader = this.controller?.store.get().reader;
    if (!reader || reader.story.state !== "ready" || this.controller?.store.get().route !== "story") return;
    const segment = reader.story.value.segments[reader.index];
    if (!segment || segment.kind === "choice") return;
    const box = this.root.querySelector<HTMLElement>(".story-layout .dialogue-box:not(.choice)");
    if (!box) return;
    const pages = measureStoryPages(box, segment.text);
    if (!pages) return;
    this.controller?.setStoryTextPages(reader.storyId, reader.index, pages);
  }

  private render(state: AppState) {
    const openWorld = state.world?.state === "ready" ? state.world.value.worldId : null;
    if (openWorld && openWorld !== this.presentWorld) {
      this.presentWorld = openWorld;
      queueMicrotask(() => void this.controller?.heartbeat());
    }
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
    const page = screenPageKey(state);
    const scrollTop =
      state.route === this.renderedRoute && page === this.renderedPage
        ? (this.root.querySelector(".scroll")?.scrollTop ?? 0)
        : 0;
    this.root.replaceChildren(this.styleNode, screen);
    this.renderedRoute = state.route;
    this.renderedPage = page;
    const scroller = this.root.querySelector(".scroll");
    if (scroller) scroller.scrollTop = scrollTop;
    this.measureStory();
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
