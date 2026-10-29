// Focused browser regression for profile navigation and draft retention.
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";

const temp = await mkdtemp(join(tmpdir(), "forest-profile-"));
const client = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
let browser;
try {
  const entry = join(temp, "entry.ts");
  const bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import { renderProfileSheet } from ${JSON.stringify(join(client, "screens/residents/profile-sheet.ts"))};\nimport { STYLES } from ${JSON.stringify(join(client, "styles.ts"))};\nimport { RESIDENT_STYLES } from ${JSON.stringify(join(client, "styles-residents.ts"))};\nimport { ART_STYLES } from ${JSON.stringify(join(client, "styles-art.ts"))};\nwindow.renderProfileSheet = renderProfileSheet; window.fwStyles = STYLES + RESIDENT_STYLES + ART_STYLES;`,
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
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : {}),
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 740 }, isMobile: true, hasTouch: true });
  await page.setContent('<meta name="viewport" content="width=device-width, initial-scale=1"><div id="host"></div>');
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  await page.evaluate(() => {
    const root = document.querySelector("#host").attachShadow({ mode: "open" });
    const resident = {
      residentId: "r",
      displayName: "주민",
      recruited: true,
      image: { current: null },
      kind: "character",
      worldSetting: "기존 설정",
      source: { name: "원본", takenAt: "2026-10-27", description: "원본 설명", personality: "", scenario: "" },
      changes: [
        { kind: "name", detail: "첫 기록", at: "2026-10-27" },
        { kind: "name", detail: "둘째 기록", at: "2026-10-27" },
        { kind: "name", detail: "셋째 기록", at: "2026-10-27" },
      ],
    };
    window.testState = {
      sheet: { kind: "profile", residentId: "r" },
      busy: {},
      content: { residents: { worldSettingMax: 200 } },
    };
    window.testController = {
      rememberProfile(patch) {
        Object.assign(window.testState.sheet, patch);
      },
      notify(message) {
        window.profileNotice = message;
      },
      openRelations(id) {
        window.related = id;
      },
      closeSheet() {},
      updateWorldSetting() {},
    };
    window.testRender = () => {
      root.innerHTML = "";
      const style = document.createElement("style");
      style.textContent = window.fwStyles;
      root.append(
        style,
        window.renderProfileSheet(
          { state: { residents: { r: resident } } },
          window.testState,
          window.testController,
          "r",
        ),
      );
    };
    window.testRender();
  });
  await page.getByRole("button", { name: "관계 보기" }).click();
  assert.equal(await page.evaluate(() => window.related), "r");
  await page.locator("#host").locator("textarea").fill("새 설정");
  await page.getByRole("button", { name: "관계 보기" }).click();
  assert.match(await page.evaluate(() => window.profileNotice), /저장/);
  await page.getByRole("button", { name: "원래 설정", exact: true }).click();
  assert.equal(await page.getByText("원본 설명").isVisible(), true);
  await page.evaluate(() => window.testRender());
  assert.equal(await page.getByText("원본 설명").isVisible(), true);
  await page.getByRole("button", { name: "공방 설정", exact: true }).click();
  assert.equal(await page.locator("#host").locator("textarea").inputValue(), "새 설정");
  assert.equal(await page.getByRole("button", { name: "변경 이력", exact: true }).count(), 0);
  await page.setViewportSize({ width: 320, height: 640 });
  await page.evaluate(() => {
    document.querySelector("#host").style.cssText = "width:320px;height:640px;--fw-font-size:22px";
    window.testState.sheet.panel = 2; // A stale view must fall back to the editable setting.
    window.testRender();
    const root = document.querySelector("#host").shadowRoot;
    const wrap = document.createElement("div");
    wrap.className = "shell art-paper art-button";
    wrap.style.cssText = "height:640px;position:relative";
    wrap.append(root.querySelector(".sheet-backdrop"));
    root.append(wrap);
  });
  assert.equal(await page.locator("#host").locator("textarea").inputValue(), "새 설정");
  const geometry = await page.getByRole("button", { name: "관계 보기" }).evaluate((button) => {
    const box = button.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(button);
    return { width: box.width, height: box.height, lines: range.getClientRects().length };
  });
  assert.ok(geometry.width >= 44 && geometry.height >= 44 && geometry.lines === 1, JSON.stringify(geometry));
  await page
    .locator("#host")
    .locator(".sheet")
    .evaluate((sheet) => {
      sheet.scrollTop = sheet.scrollHeight;
    });
  const close = await page.getByRole("button", { name: "닫기", exact: true }).boundingBox();
  assert.ok(close.y >= 0 && close.y + close.height <= 640);
  console.log("Profile panels and draft preservation: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
