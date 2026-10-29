import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
const temp = await mkdtemp(join(tmpdir(), "fw-nav-art-"));
let browser;
try {
  const root = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import {renderBottomNav} from ${JSON.stringify(join(root, "screens/chrome/bottom-nav.ts"))}; import {STYLES} from ${JSON.stringify(join(root, "styles.ts"))}; Object.assign(window,{renderBottomNav,styles:STYLES});`,
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
  const page = await browser.newPage({ viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true });
  await page.route("http://forest.test/api/capability-packages/forest-workshop/assets/assets/**", async (route) => {
    const relative = new URL(route.request().url()).pathname.split("/assets/assets/")[1];
    await route.fulfill({
      body: await readFile(resolve("packages/forest-workshop/assets", relative)),
      contentType: "image/webp",
    });
  });
  await page.route("http://forest.test/", (route) =>
    route.fulfill({
      body: `<meta name="viewport" content="width=device-width,initial-scale=1"><div id="host"></div>`,
      contentType: "text/html",
    }),
  );
  await page.goto("http://forest.test/");
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  await page.evaluate(() => {
    const host = document.querySelector("#host");
    host.style.cssText = "width:100%;height:640px";
    const root = host.attachShadow({ mode: "open" }),
      style = document.createElement("style");
    style.textContent = window.styles;
    const container = document.createElement("div");
    container.className = "shell";
    container.append(
      window.renderBottomNav(
        { route: "home" },
        {
          navigate(route) {
            window.route = route;
          },
          openResidents() {
            window.route = "residents";
          },
          notifyLocked() {},
        },
      ),
    );
    root.append(style, container);
  });
  const images = page.locator(".tab-art");
  assert.equal(await images.count(), 5);
  for (const img of await images.all()) {
    await img.evaluate((el) => el.decode());
    assert.equal(await img.getAttribute("alt"), "");
  }
  for (const label of ["홈", "작업", "탐사", "주민", "초대"]) {
    const tab = page.getByRole("button", { name: label, exact: true });
    const box = await tab.boundingBox();
    assert.ok(box.width >= 44 && box.height >= 44, `${label} touch target`);
  }
  assert.equal(await page.getByRole("button", { name: "홈", exact: true }).getAttribute("aria-current"), "page");
  await page.screenshot({ path: "/workspace/forest-ux-review/nav-icons-320.png" });
  await page.getByRole("button", { name: "탐사", exact: true }).click();
  assert.equal(await page.evaluate(() => window.route), "explore");
  await images.first().evaluate((img) => img.dispatchEvent(new Event("error")));
  assert.equal(await page.getByRole("button", { name: "홈", exact: true }).locator("svg").count(), 1);
  console.log("Illustrated navigation loads, retains labels and touch targets, and falls back: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
