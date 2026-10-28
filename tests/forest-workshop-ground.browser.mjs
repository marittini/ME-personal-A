import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
const temp = await mkdtemp(join(tmpdir(), "fw-ground-"));
const client = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
let browser;
try {
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import {groundOverlay,groundActions} from ${JSON.stringify(join(client, "screens/home/ground-editor.ts"))}; import {STYLES} from ${JSON.stringify(join(client, "styles.ts"))}; import {RESIDENT_STYLES} from ${JSON.stringify(join(client, "styles-residents.ts"))}; Object.assign(window,{groundOverlay,groundActions,fwStyles:STYLES+RESIDENT_STYLES});`,
  );
  await build({
    entryPoints: [entry],
    outfile: bundle,
    bundle: true,
    platform: "browser",
    format: "iife",
    logLevel: "silent",
  });
  browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({ viewport: { width: 320, height: 640 }, hasTouch: true });
  await page.setContent('<div id="host" style="width:320px;height:640px"></div>');
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  await page.evaluate(() => {
    const root = document.querySelector("#host").attachShadow({ mode: "open" });
    const state = {
      world: {
        state: "ready",
        value: { worldId: "w", state: { settings: { ground: { left: 12, right: 88, top: 58, bottom: 90 } } } },
      },
      settingsGroundDraft: { worldId: "w", value: { left: 12, right: 88, top: 58, bottom: 90 } },
      busy: {},
    };
    const controller = {
      store: { get: () => state },
      rememberGround: (worldId, value) => {
        state.settingsGroundDraft = { worldId, value: { ...value } };
      },
      saveGround: (value) => {
        window.saved = { ...value };
      },
      cancelGroundEditor: () => {
        window.cancelled = true;
      },
      resetGroundEditor: () => {
        state.settingsGroundDraft.value = { left: 12, right: 88, top: 58, bottom: 90 };
        render();
      },
    };
    function render() {
      root.replaceChildren();
      const style = document.createElement("style");
      style.textContent = window.fwStyles;
      const scene = document.createElement("div");
      scene.style.cssText = "position:relative;width:320px;height:380px";
      scene.append(window.groundOverlay(state, controller, null));
      root.append(style, scene, window.groundActions(state, controller));
    }
    render();
  });
  assert.equal(await page.locator('input[type="range"]').count(), 0);
  const handle = page.getByRole("button", { name: /이동영역 왼쪽 경계/ });
  await handle.focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator(".ground-selection").evaluate((n) => n.style.left), "13%");
  const bounds = await handle.boundingBox();
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await page.mouse.down();
  await page.mouse.move(100, bounds.y + bounds.height / 2);
  await page.mouse.up();
  await page.getByRole("button", { name: "저장", exact: true }).click();
  assert.ok((await page.evaluate(() => window.saved)).left >= 25, "drag changes saved range, not a stale render value");
  await page.getByRole("button", { name: "기본 범위" }).click();
  assert.equal(await page.locator(".ground-selection").evaluate((n) => n.style.left), "12%");
  await page.getByRole("button", { name: "취소", exact: true }).click();
  assert.equal(await page.evaluate(() => window.cancelled), true);
  console.log("Home ground drag, keyboard, save, reset and cancel: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
