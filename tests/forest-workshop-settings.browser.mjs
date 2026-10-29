// Browser regression for work section navigation and unapplied rule visibility.
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
const temp = await mkdtemp(join(tmpdir(), "forest-settings-"));
const client = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
let browser;
try {
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import { renderSettingsScreen } from ${JSON.stringify(join(client, "screens/settings/settings-screen.ts"))};\nimport { STYLES } from ${JSON.stringify(join(client, "styles.ts"))};\nimport { RESIDENT_STYLES } from ${JSON.stringify(join(client, "styles-residents.ts"))};\nimport { PRODUCTION_STYLES } from ${JSON.stringify(join(client, "styles-production.ts"))};\nimport { INVITE_STYLES } from ${JSON.stringify(join(client, "styles-invite.ts"))};\nimport { STORY_STYLES } from ${JSON.stringify(join(client, "styles-story.ts"))};\nimport { ART_STYLES } from ${JSON.stringify(join(client, "styles-art.ts"))};\nwindow.renderSettingsScreen = renderSettingsScreen; window.fwStyles = STYLES + RESIDENT_STYLES + PRODUCTION_STYLES + INVITE_STYLES + STORY_STYLES + ART_STYLES;`,
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
    window.testState = {
      route: "settings",
      world: { state: "ready", value: { worldId: "world", state: { settings: { playerNickname: "기존" } } } },
      fontSize: 16,
      seasonChoice: "spring",
      artReady: [
        "ui/title-sign.webp",
        "ui/paper-panel.webp",
        "ui/primary-button.webp",
        "backgrounds/workshop-base-spring.webp",
      ],
      sheet: null,
      notice: null,
      busy: {},
    };
    window.testController = {
      setSettingsSection(section) {
        window.testState.settingsSection = section;
        window.testRender();
      },
      rememberSettingsNickname(worldId, value) {
        window.testState.settingsNicknameDraft = { worldId, value };
      },
      setAutoReading(value) {
        window.testState.autoReading = value;
        window.testRender();
      },
      openGroundEditor() {
        window.groundOpened = true;
      },
      rememberGround(worldId, value) {
        window.testState.settingsGroundDraft = { worldId, value: { ...value } };
      },
      saveGround(ground) {
        window.savedGround = ground;
      },
      saveSettingsNickname(worldId, value) {
        window.saved = { worldId, value };
      },
      setFontSize() {},
      setSeasonChoice() {},
      notifyLocked() {},
      navigate() {},
      openResidents() {},
      openDeliveries() {},
    };
    window.testRender = () => {
      root.innerHTML = "";
      const style = document.createElement("style");
      style.textContent = window.fwStyles;
      root.append(style, window.renderSettingsScreen(window.testState, window.testController));
    };
    window.testRender();
  });
  await page.getByLabel("닉네임").fill("새 이름");
  await page.getByRole("button", { name: "표시", exact: true }).click();
  assert.equal(await page.getByText("글자 크기").isVisible(), true);
  await page.getByRole("switch", { name: "이야기 자동 넘기기" }).click();
  assert.equal(await page.getByRole("switch", { name: "이야기 자동 넘기기" }).getAttribute("aria-checked"), "true");
  await page.getByLabel("이야기 자동 넘기기 간격").selectOption("7");
  assert.equal(await page.evaluate(() => window.testState.autoReading.seconds), 7);

  await page.getByRole("button", { name: "내 공방", exact: true }).click();
  assert.equal(await page.getByLabel("닉네임").inputValue(), "새 이름");
  await page.getByRole("button", { name: "수정", exact: true }).click();
  assert.deepEqual(await page.evaluate(() => window.saved), { worldId: "world", value: "새 이름" });
  await page.getByRole("button", { name: "관리", exact: true }).click();
  assert.equal(await page.getByText("저장 · 백업").isVisible(), true);
  await page.getByRole("button", { name: "내 공방", exact: true }).click();
  await page.getByRole("button", { name: "홈에서 영역 편집", exact: true }).click();
  assert.equal(await page.evaluate(() => window.groundOpened), true);
  console.log("Settings sections and draft preservation: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
