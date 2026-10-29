import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
const temp = await mkdtemp(join(tmpdir(), "fw-picker-"));
let browser;
try {
  const root = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import {pagePicker} from ${JSON.stringify(join(root, "screens/chrome/page-picker.ts"))}; import {STYLES} from ${JSON.stringify(join(root, "styles.ts"))}; Object.assign(window,{pagePicker,styles:STYLES});`,
  );
  await build({
    entryPoints: [entry],
    outfile: bundle,
    bundle: true,
    format: "iife",
    platform: "browser",
    logLevel: "silent",
  });
  browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({ viewport: { width: 320, height: 640 } });
  await page.setContent('<meta name="viewport" content="width=device-width,initial-scale=1"><div id="host"></div>');
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  await page.evaluate(() => {
    const style = document.createElement("style");
    style.textContent = window.styles;
    document.head.append(style);
    const picker = window.pagePicker("목록 고르기", 0, ["첫 번째", "두 번째 항목", "세 번째"], (index) => {
      window.selected = index;
    });
    document.querySelector("#host").append(picker);
  });
  const summary = page.getByLabel("목록 고르기", { exact: true });
  await summary.focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.getByRole("button", { name: "첫 번째" }).getAttribute("aria-pressed"), "true");
  await page.keyboard.press("Escape");
  assert.equal(await summary.locator("..").evaluate((node) => node.open), false);
  assert.equal(await summary.evaluate((node) => node === document.activeElement), true);
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "두 번째 항목" }).focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => window.selected), 1);
  assert.equal(await summary.locator("..").evaluate((node) => node.open), false);
  assert.equal(await summary.evaluate((node) => node === document.activeElement), true);
  console.log("Game-style page picker supports keyboard, selection, Escape and focus return: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
