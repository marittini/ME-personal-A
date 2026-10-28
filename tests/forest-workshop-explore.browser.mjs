// Browser regression for work section navigation and unapplied rule visibility.
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
const temp = await mkdtemp(join(tmpdir(), "forest-explore-"));
const client = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
let browser;
try {
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import { renderExploreScreen } from ${JSON.stringify(join(client, "screens/explore/explore-screen.ts"))};\nimport { STYLES } from ${JSON.stringify(join(client, "styles.ts"))};\nimport { RESIDENT_STYLES } from ${JSON.stringify(join(client, "styles-residents.ts"))};\nimport { PRODUCTION_STYLES } from ${JSON.stringify(join(client, "styles-production.ts"))};\nimport { INVITE_STYLES } from ${JSON.stringify(join(client, "styles-invite.ts"))};\nimport { STORY_STYLES } from ${JSON.stringify(join(client, "styles-story.ts"))};\nimport { ART_STYLES } from ${JSON.stringify(join(client, "styles-art.ts"))};\nwindow.renderExploreScreen = renderExploreScreen; window.fwStyles = STYLES + RESIDENT_STYLES + PRODUCTION_STYLES + INVITE_STYLES + STORY_STYLES + ART_STYLES;`,
  );
  await build({
    entryPoints: [entry],
    outfile: bundle,
    bundle: true,
    platform: "browser",
    format: "iife",
    logLevel: "silent",
    plugins: [
      {
        name: "host",
        setup(b) {
          b.onResolve({ filter: /^marinara:host$/ }, () => ({ path: "host", namespace: "test" }));
          b.onLoad({ filter: /.*/, namespace: "test" }, () => ({ contents: "export const host = {};", loader: "js" }));
        },
      },
    ],
  });
  browser = await chromium.launch({
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : {}),
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 740 }, isMobile: true, hasTouch: true });
  await page.setContent(
    '<meta name="viewport" content="width=device-width, initial-scale=1"><div id="host" style="height:740px;width:390px"></div>',
  );
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  await page.evaluate(() => {
    const root = document.querySelector("#host").attachShadow({ mode: "open" });
    const episodes = Array.from({ length: 3 }, (_, index) => ({
      index,
      title: `이야기 ${index + 1}`,
      status: index === 0 ? "available" : "locked",
      reasons: index ? ["이전 이야기 읽기"] : [],
      preparations: {},
      participants: [],
      minutes: 30,
    }));
    const pairs = ["a", "b"].map((pairId) => ({
      pairId,
      episodes,
      arc: { title: `모험 ${pairId}`, place: "숲", discovery: "새로운 풍경" },
      completed: Array.from({ length: 3 }, (_, index) => ({ title: `기록 ${index}`, storyIds: [`s${index}`] })),
    }));
    window.testState = {
      route: "explore",
      explore: { tab: "story", pairId: "a", overview: { state: "ready", value: { pairs } } },
      world: {
        state: "ready",
        value: {
          worldId: "world",
          state: {
            pairs: { a: { residentIds: ["r"], archived: false }, b: { residentIds: ["r"], archived: false } },
            residents: { r: { displayName: "주민" } },
            inventory: {},
            production: { protectedStock: {}, facilities: {} },
            stories: {
              expedition: null,
              pairs: { a: { current: { episodes: [{ state: "read", storyId: "current-0" }] } } },
            },
            wallet: { gold: 0, tickets: 0 },
          },
        },
      },
      content: { production: { absenceLimitMs: 259200000 }, items: [] },
      artReady: [
        "ui/title-sign.webp",
        "ui/paper-panel.webp",
        "ui/primary-button.webp",
        "backgrounds/workshop-base-spring.webp",
      ],
      seasonChoice: "spring",
      sheet: null,
      notice: null,
      busy: {},
    };
    const update = (patch) => {
      Object.assign(window.testState.explore, patch);
      window.testRender();
    };
    window.testController = {
      setExploreSection(section) {
        update({ section });
      },
      setExploreHistoryPage(historyPage) {
        update({ historyPage });
      },
      selectStoryPair(pairId) {
        update({ pairId, historyPage: 0 });
      },
      depart(pairId, episode) {
        window.departed = { pairId, episode };
      },
      openStory(pairId, episode, storyId) {
        window.openedStory = { pairId, episode, storyId };
      },
      navigate() {},
      openResidents() {},
      openDeliveries() {},
      notifyLocked() {},
    };
    window.testRender = () => {
      root.innerHTML = "";
      const style = document.createElement("style");
      style.textContent = window.fwStyles;
      root.append(style, window.renderExploreScreen(window.testState, window.testController));
    };
    window.testRender();
  });
  await page.getByRole("button", { name: "탐험 출발" }).click();
  assert.deepEqual(await page.evaluate(() => window.departed), { pairId: "a", episode: 0 });
  await page.getByRole("button", { name: "여정", exact: true }).click();
  assert.equal(await page.getByText("지금은 떠난 탐험이 없어요.").isVisible(), true);
  await page.getByRole("button", { name: "읽은 이야기", exact: true }).click();
  assert.equal(await page.getByText("기록 2", { exact: true }).isVisible(), true);
  await page.getByRole("button", { name: "1편 다시 읽기", exact: true }).click();
  assert.deepEqual(await page.evaluate(() => window.openedStory), { pairId: "a", episode: 0, storyId: "current-0" });
  await page.getByLabel("읽은 이야기 목록 고르기").selectOption("1");
  assert.equal(await page.getByText("기록 0", { exact: true }).isVisible(), true);
  await page.getByRole("button", { name: "기록 0 1편 다시 읽기" }).click();
  assert.deepEqual(await page.evaluate(() => window.openedStory), { pairId: "a", episode: 0, storyId: "s0" });
  await page.getByLabel("페어 고르기").selectOption("b");
  assert.equal(await page.getByText("기록 2", { exact: true }).isVisible(), true);
  console.log("Explore sections, history and actions: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
