import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
const temp = await mkdtemp(join(tmpdir(), "fw-starter-art-"));
let browser;
try {
  const root = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import {renderStarterKitSheet} from ${JSON.stringify(join(root, "screens/home/starter-kit-sheet.ts"))}; import {STYLES} from ${JSON.stringify(join(root, "styles.ts"))}; import {ART_STYLES} from ${JSON.stringify(join(root, "styles-art.ts"))}; Object.assign(window,{renderStarterKitSheet,styles:STYLES+ART_STYLES});`,
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
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({ viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true });
  await page.route("http://forest.test/api/capability-packages/forest-workshop/assets/assets/**", async (route) => {
    const name = new URL(route.request().url()).pathname.split("/assets/assets/")[1];
    const body = await readFile(resolve("packages/forest-workshop/assets", name));
    await route.fulfill({ body, contentType: "image/webp" });
  });
  await page.route("http://forest.test/", (route) =>
    route.fulfill({ body: "<div id='host'></div>", contentType: "text/html" }),
  );
  await page.goto("http://forest.test/");
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  await page.evaluate(() => {
    const root = document.querySelector("#host").attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = window.styles;
    const state = {
      world: { state: "ready", value: { state: { progress: { starterKitClaimed: false } } } },
      content: {
        starterKit: { gold: 200, tickets: 3, items: { "wild-berry": 4, wood: 2 } },
        items: [
          { id: "wild-berry", name: "산딸기" },
          { id: "wood", name: "나무" },
        ],
      },
      busy: {},
    };
    root.append(style, window.renderStarterKitSheet(state, { runCommand() {}, hideStarterSheet() {} }));
  });
  const gift = page.locator(".kit-gift");
  const berry = page.locator(".item-wild-berry img");
  assert.equal(await gift.getAttribute("alt"), "");
  assert.match(await gift.getAttribute("src"), /ui\/gift\.webp$/);
  assert.match(await berry.getAttribute("src"), /items\/wild-berry\.webp$/);
  await assert.doesNotReject(() => berry.evaluate((img) => img.decode()));
  assert.equal(await page.getByText("산딸기", { exact: true }).isVisible(), true);
  await berry.evaluate((img) => img.dispatchEvent(new Event("error")));
  await gift.evaluate((img) => img.dispatchEvent(new Event("error")));
  assert.equal(await page.locator(".item-wild-berry svg").count(), 1);
  assert.equal(await page.locator("svg.kit-gift").count(), 1);
  assert.equal(await page.getByRole("button", { name: "받기", exact: true }).isVisible(), true);
  console.log("Starter kit shows gift and item artwork with readable fallbacks: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
