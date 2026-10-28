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
    `import { renderProfileSheet } from ${JSON.stringify(join(client, "screens/residents/profile-sheet.ts"))};\nimport { STYLES } from ${JSON.stringify(join(client, "styles.ts"))};\nimport { RESIDENT_STYLES } from ${JSON.stringify(join(client, "styles-residents.ts"))};\nwindow.renderProfileSheet = renderProfileSheet; window.fwStyles = STYLES + RESIDENT_STYLES;`,
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
      kind: "character",
      worldSetting: "기존 설정",
      source: { name: "원본", takenAt: "2026-10-27", description: "원본 설명", personality: "", scenario: "" },
      changes: [],
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
  await page.locator("#host").locator("textarea").fill("새 설정");
  await page.getByRole("button", { name: "원래 설정", exact: true }).click();
  assert.equal(await page.getByText("원본 설명").isVisible(), true);
  await page.evaluate(() => window.testRender());
  assert.equal(await page.getByText("원본 설명").isVisible(), true);
  await page.getByRole("button", { name: "공방 설정", exact: true }).click();
  assert.equal(await page.locator("#host").locator("textarea").inputValue(), "새 설정");
  await page.getByRole("button", { name: "변경 이력", exact: true }).click();
  assert.equal(await page.getByText("아직 변경 이력이 없어요.").isVisible(), true);
  console.log("Profile panels and draft preservation: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
