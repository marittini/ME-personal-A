// Browser regression for work section navigation and unapplied rule visibility.
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
const temp = await mkdtemp(join(tmpdir(), "forest-worlds-"));
const client = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
let browser;
try {
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import { renderWorldsScreen } from ${JSON.stringify(join(client, "screens/worlds-screen.ts"))};\nimport { STYLES } from ${JSON.stringify(join(client, "styles.ts"))};\nimport { RESIDENT_STYLES } from ${JSON.stringify(join(client, "styles-residents.ts"))};\nimport { PRODUCTION_STYLES } from ${JSON.stringify(join(client, "styles-production.ts"))};\nwindow.renderWorldsScreen = renderWorldsScreen; window.fwStyles = STYLES + RESIDENT_STYLES + PRODUCTION_STYLES;`,
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
    const worlds = Array.from({ length: 5 }, (_, i) => ({
      worldId: String(i),
      worldName: `세계 ${i}`,
      updatedAt: "2026-10-28",
      readable: true,
    }));
    window.testState = {
      route: "worlds",
      worlds: { state: "ready", value: worlds },
      world: null,
      restore: null,
      busy: {},
      artReady: [],
      seasonChoice: "spring",
      sheet: null,
      notice: null,
    };
    window.testController = {
      setWorldsPage(page) {
        window.testState.worldsPage = page;
        window.testRender();
      },
      rememberWorldDraft(draft) {
        window.testState.worldDraft = draft;
      },
      rememberWorldCreateOpen(open) {
        window.testState.worldCreateOpen = open;
      },
      openWorld(id) {
        window.openedWorld = id;
      },
      createWorld() {},
      loadWorlds() {},
      selectRestoreFile() {},
      confirmRestore() {},
      navigate() {},
    };
    window.testRender = () => {
      root.innerHTML = "";
      const style = document.createElement("style");
      style.textContent = window.fwStyles;
      root.append(style, window.renderWorldsScreen(window.testState, window.testController));
    };
    window.testRender();
  });
  assert.equal(await page.getByText("세계 0", { exact: true }).isVisible(), true);
  assert.equal(await page.getByText("세계 2", { exact: true }).count(), 0);
  await page.getByText("새 세계 만들기", { exact: true }).first().click();
  await page.getByLabel("세계 이름").fill("새 공방");
  await page.getByLabel("내 닉네임").fill("관리자");
  await page.getByRole("button", { name: "다음", exact: true }).click();
  assert.equal(await page.getByLabel("세계 이름").inputValue(), "새 공방");
  assert.equal(await page.getByLabel("내 닉네임").inputValue(), "관리자");
  await page.getByRole("button", { name: /세계 2/ }).click();
  assert.equal(await page.evaluate(() => window.openedWorld), "2");
  console.log("World pagination and creation draft preservation: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
