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
    `import {renderGuidelinesSheet} from ${JSON.stringify(join(client, "screens/residents/guidelines-sheet.ts"))}; import {STYLES} from ${JSON.stringify(join(client, "styles.ts"))}; import {RESIDENT_STYLES} from ${JSON.stringify(join(client, "styles-residents.ts"))}; Object.assign(window,{renderGuidelinesSheet,fwStyles:STYLES+RESIDENT_STYLES});`,
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
      sheet: { kind: "guidelines" },
      world: {
        state: "ready",
        value: {
          state: { guidelines: { world: { enabled: false, text: "", revision: 0, updatedAt: null }, pairs: {} } },
        },
      },
      busy: {},
    };
    const controller = {
      rememberGuidelines: (draft) => {
        state.sheet.draft = { ...draft };
      },
      saveGuidelines: (pairId, draft) => {
        window.savedGuidelines = { pairId: pairId ?? null, ...draft };
      },
      closeSheet() {},
      notify: (message) => {
        window.message = message;
      },
    };
    window.guidelineState = state;
    window.renderGuidelines = () => {
      root.replaceChildren();
      const style = document.createElement("style");
      style.textContent = window.fwStyles;
      root.append(style, window.renderGuidelinesSheet(state, controller));
    };
    window.renderGuidelines();
  });
  await page.getByLabel("지침 사용").check();
  await page.getByRole("button", { name: "지침 저장" }).click();
  assert.match(await page.evaluate(() => window.message), /작성/);
  await page.getByLabel("AI 서술 지침").fill("차분한 말투로 써 주세요.");
  await page.evaluate(() => window.renderGuidelines());
  assert.equal(await page.getByLabel("AI 서술 지침").inputValue(), "차분한 말투로 써 주세요.");
  assert.equal(await page.getByLabel("지침 사용").isChecked(), true);
  await page.getByRole("button", { name: "지침 저장" }).click();
  assert.deepEqual(await page.evaluate(() => window.savedGuidelines), {
    pairId: null,
    enabled: true,
    text: "차분한 말투로 써 주세요.",
  });
  await page.getByRole("button", { name: "초기화", exact: true }).click();
  assert.equal(await page.getByLabel("AI 서술 지침").inputValue(), "");
  assert.equal(await page.getByLabel("지침 사용").isChecked(), false);
  await page.evaluate(() => {
    window.guidelineState.sheet = { kind: "guidelines", pairId: "p" };
    window.renderGuidelines();
  });
  assert.equal(await page.getByLabel("AI 서술 지침").getAttribute("maxlength"), "500");
  await page.getByLabel("AI 서술 지침").fill("이 페어의 대화는 짧게.");
  await page.getByRole("button", { name: "지침 저장" }).click();
  assert.equal((await page.evaluate(() => window.savedGuidelines)).pairId, "p");
  if (process.env.FW_GUIDELINES_SCREENSHOT) await page.screenshot({ path: process.env.FW_GUIDELINES_SCREENSHOT });
  console.log("Guideline UI scope, draft preservation, empty validation and reset: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
