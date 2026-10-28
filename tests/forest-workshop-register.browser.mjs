// Browser regression for work section navigation and unapplied rule visibility.
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
const temp = await mkdtemp(join(tmpdir(), "forest-register-"));
const client = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
let browser;
try {
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import { renderRegisterScreen } from ${JSON.stringify(join(client, "screens/residents/register-screen.ts"))};\nimport { STYLES } from ${JSON.stringify(join(client, "styles.ts"))};\nimport { RESIDENT_STYLES } from ${JSON.stringify(join(client, "styles-residents.ts"))};\nimport { PRODUCTION_STYLES } from ${JSON.stringify(join(client, "styles-production.ts"))};\nwindow.renderRegisterScreen = renderRegisterScreen; window.fwStyles = STYLES + RESIDENT_STYLES + PRODUCTION_STYLES;`,
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
      route: "register",
      register: {
        step: 2,
        selected: { kind: "character", id: "r", name: "주민" },
        preview: { state: "ready", value: { summary: "원본 이야기" } },
        draft: "",
        pendingImage: null,
      },
      world: { state: "ready", value: { worldId: "world", state: { residents: {} } } },
      content: null,
      seasonChoice: "spring",
      artReady: [],
      sheet: null,
      notice: null,
      busy: {},
    };
    window.testController = {
      setRegisterPanel(panel) {
        window.testState.register.panel = panel;
        window.testRender();
      },
      setDraft(draft) {
        window.testState.register.draft = draft;
      },
      backToSources() {},
      suggestSetting() {},
      pickPendingImage() {},
      clearPendingImage() {},
      confirmRegister(withImage) {
        window.confirmed = withImage;
      },
      uploadResidentImage() {},
      closeRegister() {},
      notify() {},
      navigate() {},
      openResidents() {},
    };
    window.testRender = () => {
      root.innerHTML = "";
      const style = document.createElement("style");
      style.textContent = window.fwStyles;
      root.append(style, window.renderRegisterScreen(window.testState, window.testController));
    };
    window.testRender();
  });
  assert.equal(await page.getByText("원본 이야기").isVisible(), true);
  await page.getByRole("button", { name: "다음: 공방 설정" }).click();
  assert.equal(await page.getByRole("button", { name: "다음: 주민 그림" }).isDisabled(), true);
  await page.getByLabel("공방 세계 설정").fill("공방 주민 설정");
  await page.getByRole("button", { name: "다음: 주민 그림" }).click();
  await page.getByRole("button", { name: "이전: 공방 설정" }).click();
  assert.equal(await page.getByLabel("공방 세계 설정").inputValue(), "공방 주민 설정");
  await page.getByRole("button", { name: "다음: 주민 그림" }).click();
  await page.getByRole("button", { name: "나중에 그림 등록" }).click();
  assert.equal(await page.evaluate(() => window.confirmed), false);
  await page.evaluate(() => {
    const residents = Object.fromEntries(
      Array.from({ length: 3 }, (_, i) => {
        const id = String(i);
        return [
          id,
          {
            residentId: id,
            displayName: `주민 ${i}`,
            kind: "character",
            image: { current: null, placement: { scale: 100, offsetX: 0, markerHeight: 0 } },
          },
        ];
      }),
    );
    window.testState.world.value.state.residents = residents;
    Object.assign(window.testState.register, {
      step: 1,
      kindTab: "character",
      query: "",
      sourcePage: 0,
      sources: {
        state: "ready",
        value: Object.values(residents).map((resident) => ({
          id: resident.residentId,
          name: resident.displayName,
          kind: "character",
          summary: "설명",
          residentId: null,
        })),
      },
    });
    Object.assign(window.testController, {
      setRegisterSourcePage(sourcePage) {
        window.testState.register.sourcePage = sourcePage;
        window.testRender();
      },
      setRegisterStarterPage(starterPage) {
        window.testState.register.starterPage = starterPage;
        window.testRender();
      },
      setStarterChoice(starterChoice) {
        window.testState.register.starterChoice = starterChoice;
        window.testRender();
      },
      setRegisterKind() {},
      setRegisterQuery() {},
      chooseSource(source) {
        window.selectedSource = source.id;
      },
      registerAnother() {},
      confirmStarter() {},
    });
    window.testRender();
  });
  assert.equal(await page.getByText("주민 2", { exact: true }).count(), 0);
  await page.getByRole("button", { name: "다음", exact: true }).click();
  await page.getByRole("button", { name: /주민 2/ }).click();
  assert.equal(await page.evaluate(() => window.selectedSource), "2");
  await page.evaluate(() => {
    window.testState.register.step = 3;
    window.testRender();
  });
  await page.getByRole("button", { name: "다음", exact: true }).click();
  await page.getByRole("radio", { name: /주민 1/ }).click();
  assert.equal(await page.getByRole("button", { name: /주민 1과\(와\) 시작하기/ }).isEnabled(), true);
  console.log("Registration step navigation and draft preservation: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
