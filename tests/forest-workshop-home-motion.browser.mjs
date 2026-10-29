import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";

const temp = await mkdtemp(join(tmpdir(), "forest-home-motion-"));
const client = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
let browser;
try {
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import { renderHomeScene } from ${JSON.stringify(join(client, "screens/home/home-scene.ts"))};\nimport { compactWorkReport } from ${JSON.stringify(join(client, "screens/home/work-report.ts"))};\nimport { STYLES } from ${JSON.stringify(join(client, "styles.ts"))};\nimport { RESIDENT_STYLES, HOME_REACTION_STYLES } from ${JSON.stringify(join(client, "styles-residents.ts"))};\nwindow.renderHomeScene=renderHomeScene;window.compactWorkReport=compactWorkReport;window.fwStyles=STYLES+RESIDENT_STYLES+HOME_REACTION_STYLES;`,
  );
  await build({
    entryPoints: [entry],
    outfile: bundle,
    bundle: true,
    format: "iife",
    platform: "browser",
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
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 740 }, isMobile: true, hasTouch: true });
  await page.setContent('<meta name="viewport" content="width=device-width, initial-scale=1"><div id="host"></div>');
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  await page.evaluate(() => {
    const root = document.querySelector("#host").attachShadow({ mode: "open" });
    const resident = {
      residentId: "r",
      displayName: "숲 주민",
      recruited: true,
      registeredAt: "2026-01-01",
      image: {
        current: {
          url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ccircle cx='50' cy='50' r='40' fill='gold'/%3E%3C/svg%3E",
          reference: "fixture",
          width: 100,
          height: 100,
        },
        placement: { scale: 100, offsetX: 0, markerHeight: 0 },
      },
    };
    const state = {
      world: {
        state: "ready",
        value: {
          state: {
            settings: { ground: { left: 12, right: 88, top: 58, bottom: 90 } },
            progress: { starterResidentId: "r" },
            residents: { r: resident },
            production: {
              simMs: 0,
              reports: [],
              reportsReadThrough: 0,
              facilities: {
                gather: { job: { recipeId: "berry", outputs: { berry: 1 }, startedSim: 0, endsSim: 60000 } },
              },
            },
          },
        },
      },
      worldReceivedAt: Date.now(),
      content: { recipes: [{ id: "berry", name: "산딸기" }] },
      seasonChoice: "spring",
    };
    window.homeTestState = state;
    const controller = {
      openResidents(id) {
        window.selected = id;
      },
      openSheet(sheet) {
        window.sheet = sheet;
      },
      selectFacility(id) {
        window.facility = id;
      },
      navigate(route) {
        window.route = route;
      },
      openRegister() {},
    };
    window.homeTestController = controller;
    const style = document.createElement("style");
    style.textContent = window.fwStyles + ".home-layout .scene { height: 300px; flex: none; }";
    const container = document.createElement("div");
    container.className = "home-layout";
    container.append(
      window.renderHomeScene(state, controller),
      window.compactWorkReport(state, state.world.value, controller),
    );
    root.append(style, container);
  });
  if (process.env.FW_HOME_SCREENSHOT) await page.screenshot({ path: process.env.FW_HOME_SCREENSHOT });
  assert.equal(await page.locator(".spot-name").count(), 0);
  const resident = page.getByRole("button", { name: "숲 주민에게 인사하기" });
  const before = await resident.evaluate((node) => node.getBoundingClientRect().x);
  await page.waitForTimeout(5000);
  assert.notEqual(await resident.evaluate((node) => node.getBoundingClientRect().x), before, "moves without touch");
  const bodies = await resident.locator(".figure-body").evaluate((node) => {
    const animation = node.getAnimations()[0];
    animation.pause();
    animation.currentTime = 3960;
    const moving = getComputedStyle(node).transform;
    animation.currentTime = 4320;
    const compressed = getComputedStyle(node).transform;
    animation.cancel();
    return moving !== compressed;
  });
  assert.equal(bodies, true, "walking changes body shape");
  const feet = await resident.locator("..").evaluate((node) => {
    const animation = node.getAnimations()[0];
    animation.pause();
    animation.currentTime = 0;
    const a = node.getBoundingClientRect();
    animation.currentTime = 9000;
    const b = node.getBoundingClientRect();
    const ground = node.parentElement.getBoundingClientRect();
    animation.cancel();
    return {
      xMoved: b.x !== a.x,
      yMoved: b.y !== a.y,
      inside:
        b.x + b.width / 2 >= ground.left &&
        b.x + b.width / 2 <= ground.right &&
        b.bottom >= ground.top &&
        b.bottom <= ground.bottom,
    };
  });
  assert.deepEqual(feet, { xMoved: true, yMoved: true, inside: true });

  await resident.click({ force: true });
  assert.equal(await page.evaluate(() => window.selected), undefined);
  assert.equal(await page.locator(".resident-reaction").isVisible(), true);
  await page.getByRole("button", { name: "프로필", exact: true }).click();
  assert.equal(await page.evaluate(() => window.selected), "r");
  assert.deepEqual(await page.evaluate(() => window.sheet), { kind: "profile", residentId: "r" });
  assert.equal(
    await resident.locator(".figure").evaluate((node) => getComputedStyle(node).animationName),
    "fw-facing-left",
  );
  await page.getByRole("button", { name: "산딸기 진행 중 · 작업 관리 열기" }).click();
  assert.equal(await page.evaluate(() => window.facility), "gather");
  assert.equal(await page.evaluate(() => window.route), "work");
  await page.evaluate(() => {
    const state = window.homeTestState;
    state.world.value.state.production.reports.push({ reportId: 1 });
    const root = document.querySelector("#host").shadowRoot;
    root
      .querySelector(".work-summary")
      .replaceWith(window.compactWorkReport(state, state.world.value, window.homeTestController));
  });
  assert.equal(await page.getByRole("button", { name: /새 보고 1개/ }).count(), 1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(await resident.locator(".figure").evaluate((node) => getComputedStyle(node).animationName), "none");
  assert.equal(await resident.locator("..").evaluate((node) => getComputedStyle(node).animationName), "none");
  console.log("Home motion, reduced motion and resident target: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
