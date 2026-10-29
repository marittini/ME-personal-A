// Browser regression for resident list paging and navigation.
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";

const temp = await mkdtemp(join(tmpdir(), "forest-residents-"));
const client = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
let browser;
try {
  const entry = join(temp, "entry.ts");
  const bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import { renderResidentsScreen } from ${JSON.stringify(join(client, "screens/residents/residents-screen.ts"))};\nimport { STYLES } from ${JSON.stringify(join(client, "styles.ts"))};\nimport { RESIDENT_STYLES } from ${JSON.stringify(join(client, "styles-residents.ts"))};\nimport { PRODUCTION_STYLES } from ${JSON.stringify(join(client, "styles-production.ts"))};\nimport { INVITE_STYLES } from ${JSON.stringify(join(client, "styles-invite.ts"))};\nimport { STORY_STYLES } from ${JSON.stringify(join(client, "styles-story.ts"))};\nimport { ART_STYLES } from ${JSON.stringify(join(client, "styles-art.ts"))};\nimport { renderRelationsScreen } from ${JSON.stringify(join(client, "screens/residents/relations-screen.ts"))};\nimport { createResidentActions } from ${JSON.stringify(join(client, "app/resident-actions.ts"))};\nwindow.createResidentActions = createResidentActions; window.renderRelationsScreen = renderRelationsScreen; window.renderResidentsScreen = renderResidentsScreen; window.fwStyles = STYLES + RESIDENT_STYLES + PRODUCTION_STYLES + INVITE_STYLES + STORY_STYLES + ART_STYLES;`,
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
        setup(build) {
          build.onResolve({ filter: /^marinara:host$/ }, () => ({ path: "host", namespace: "test" }));
          build.onLoad({ filter: /.*/, namespace: "test" }, () => ({
            contents: "export const host = {};",
            loader: "js",
          }));
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
  const page = await browser.newPage({ viewport: { width: 390, height: 740 }, isMobile: false, hasTouch: true });
  await page.route("http://forest.test/api/capability-packages/forest-workshop/assets/assets/**", async (route) => {
    const path = new URL(route.request().url()).pathname.split("/assets/assets/")[1];
    await route.fulfill({
      contentType: "image/webp",
      body: await readFile(resolve("packages/forest-workshop/assets", path)),
    });
  });
  await page.setContent(
    '<base href="http://forest.test/"><meta name="viewport" content="width=device-width, initial-scale=1"><div id="host" style="height:740px;width:390px"></div>',
  );
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  await page.evaluate(() => {
    document.body.style.margin = "0";
    const root = document.querySelector("#host").attachShadow({ mode: "open" });
    const residents = Object.fromEntries(
      Array.from({ length: 7 }, (_, i) => {
        const id = String(i);
        return [
          id,
          {
            residentId: id,
            displayName: `주민 ${i}`,
            kind: "character",
            field: "gather",
            recruited: true,
            registeredAt: `2026-01-0${i + 1}`,
            source: { name: `주민 ${i}` },
            image: { current: null, placement: { scale: 100, offsetX: 0, markerHeight: 0 } },
            breakthrough: 0,
            talentId: "",
          },
        ];
      }),
    );
    window.testState = {
      route: "residents",
      residentsView: { tab: "all", query: "", filter: "all", selectedId: null },
      world: { state: "ready", value: { state: { residents, production: { facilities: {} } } } },
      content: null,
      sheet: null,
      notice: null,
      seasonChoice: "spring",
      artReady: [
        "ui/title-sign.webp",
        "ui/paper-panel.webp",
        "ui/primary-button.webp",
        "backgrounds/workshop-base-spring.webp",
      ],
      busy: {},
    };
    const update = (patch) => {
      Object.assign(window.testState.residentsView, patch);
      window.testRender();
    };
    window.testController = {
      setResidentsPage(page) {
        update({ page });
      },
      selectResident(id) {
        update({ selectedId: id, detailOpen: true });
      },
      showResidentsList() {
        update({ detailOpen: false });
      },
      setResidentsTab(tab) {
        update({ tab, page: 0 });
      },
      setResidentsQuery(query) {
        update({ query, page: 0 });
      },
      setResidentsFilter(filter) {
        update({ filter, page: 0 });
      },
      openRegister() {},
      navigate() {},
      openResidents() {},
      openSheet(sheet) {
        window.openedSheet = sheet;
      },
      openResidentImage(id) {
        window.imageResident = id;
      },
      openRelations(id) {
        window.relationResident = id;
      },
    };
    window.testRender = () => {
      root.innerHTML = "";
      const style = document.createElement("style");
      style.textContent = window.fwStyles;
      root.append(style, window.renderResidentsScreen(window.testState, window.testController));
    };
    window.testRender();
  });
  assert.equal(await page.getByRole("button", { name: "주민 0 자세히 보기" }).count(), 1);
  assert.equal(await page.getByRole("button", { name: "주민 2 자세히 보기" }).count(), 0);
  await page.getByLabel("주민 목록 고르기", { exact: true }).click();
  await page.getByLabel("주민 목록 고르기", { exact: true }).locator("..").locator("button").nth(1).click();
  assert.equal(await page.getByRole("button", { name: "주민 2 자세히 보기" }).count(), 1);
  await page.getByRole("button", { name: "주민 2 자세히 보기" }).click();
  assert.equal(await page.getByRole("button", { name: "프로필", exact: true }).isVisible(), true);
  assert.equal(await page.getByRole("button", { name: "주민 2 자세히 보기" }).getAttribute("aria-pressed"), "true");
  assert.equal(await page.getByLabel("주민 종류").count(), 1, "list remains alongside selected details");
  await page.getByRole("button", { name: "주민 그림", exact: true }).click();
  assert.equal(await page.evaluate(() => window.imageResident), "2");
  await page.getByRole("button", { name: "프로필", exact: true }).click();
  assert.deepEqual(await page.evaluate(() => window.openedSheet), { kind: "profile", residentId: "2" });
  await page.getByRole("button", { name: "관계", exact: true }).click();
  assert.equal(await page.evaluate(() => window.relationResident), "2");
  for (const [width, font] of [
    [390, 16],
    [320, 22],
  ]) {
    await page.setViewportSize({ width, height: 844 });
    await page.locator("#host").evaluate(
      (host, values) => {
        host.style.width = values.width + "px";
        host.style.height = "844px";
        host.style.setProperty("--fw-font-size", values.font + "px");
      },
      { width, font },
    );
    const size = await page.locator(".scroll").evaluate((n) => [n.scrollWidth, n.clientWidth]);
    assert.ok(size[0] <= size[1] + 1, JSON.stringify(size));
    await page.getByRole("button", { name: "주민 불러오기", exact: true }).scrollIntoViewIfNeeded();
    await page.locator(".scroll").evaluate((n) => (n.scrollTop = 0));
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: join(process.env.FW_ART_SCREENSHOTS ?? temp, `residents-art-${width}.png`) });
  }
  await page.evaluate(() => {
    const state = window.testState;
    state.residentsView.query = "없는 이름";
    const actions = window.createResidentActions({
      store: {
        get: () => state,
        set: (patch) => Object.assign(state, typeof patch === "function" ? patch(state) : patch),
      },
      currentWorld: () => state.world.value,
      navigate: (route) => (state.route = route),
    });
    actions.openResidents("6");
    window.testRender();
  });
  assert.equal(await page.evaluate(() => window.testState.residentsView.page), 3);
  assert.equal(await page.getByRole("button", { name: "주민 6 자세히 보기" }).getAttribute("aria-pressed"), "true");
  await page.evaluate(() => {
    const state = window.testState;
    state.route = "relations";
    state.focusResidentId = "2";
    state.world.value.state.pairs = {
      p: { pairId: "p", residentIds: ["2", "1"], archived: false, familiarity: 0, createdAt: "2026-10-29" },
    };
    window.testController.openMemory = (id) => (window.memoryPair = id);
    window.testController.openGuidelines = (id) => (window.guidelinesPair = id);
    const root = document.querySelector("#host").shadowRoot;
    root.replaceChildren();
    const style = document.createElement("style");
    style.textContent = window.fwStyles;
    root.append(style, window.renderRelationsScreen(state, window.testController));
  });
  await page.getByRole("button", { name: "기억 보기", exact: true }).click();
  assert.equal(await page.evaluate(() => window.memoryPair), "p");
  await page.getByRole("button", { name: "지침 관리", exact: true }).click();
  assert.equal(await page.evaluate(() => window.guidelinesPair), "p");
  const relationSize = await page.locator(".scroll").evaluate((n) => [n.scrollWidth, n.clientWidth]);
  assert.ok(relationSize[0] <= relationSize[1] + 1, JSON.stringify(relationSize));
  await page.locator(".scroll").evaluate((n) => (n.scrollTop = 0));
  await page.screenshot({ path: join(process.env.FW_ART_SCREENSHOTS ?? temp, "relations-art-320.png") });
  console.log("Resident pagination and detail navigation: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
