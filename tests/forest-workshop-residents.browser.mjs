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
    `import { renderResidentsScreen } from ${JSON.stringify(join(client, "screens/residents/residents-screen.ts"))};\nimport { STYLES } from ${JSON.stringify(join(client, "styles.ts"))};\nimport { RESIDENT_STYLES } from ${JSON.stringify(join(client, "styles-residents.ts"))};\nimport { PRODUCTION_STYLES } from ${JSON.stringify(join(client, "styles-production.ts"))};\nimport { INVITE_STYLES } from ${JSON.stringify(join(client, "styles-invite.ts"))};\nimport { STORY_STYLES } from ${JSON.stringify(join(client, "styles-story.ts"))};\nimport { ART_STYLES } from ${JSON.stringify(join(client, "styles-art.ts"))};\nwindow.renderResidentsScreen = renderResidentsScreen; window.fwStyles = STYLES + RESIDENT_STYLES + PRODUCTION_STYLES + INVITE_STYLES + STORY_STYLES + ART_STYLES;`,
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
  const page = await browser.newPage({ viewport: { width: 390, height: 740 }, isMobile: true, hasTouch: true });
  await page.setContent(
    '<meta name="viewport" content="width=device-width, initial-scale=1"><div id="host" style="height:740px;width:390px"></div>',
  );
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  await page.evaluate(() => {
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
      openSheet() {},
      openResidentImage() {},
      openRelations() {},
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
  const listFits = await page.locator("#host").evaluate((host) => {
    const scroller = host.shadowRoot.querySelector(".scroll");
    return { content: scroller.scrollHeight, available: scroller.clientHeight };
  });
  assert.ok(listFits.content <= listFits.available + 1, `resident list should fit: ${JSON.stringify(listFits)}`);
  await page.getByLabel("주민 목록 고르기").selectOption("1");
  assert.equal(await page.getByRole("button", { name: "주민 2 자세히 보기" }).count(), 1);
  await page.getByRole("button", { name: "주민 2 자세히 보기" }).click();
  assert.equal(await page.getByRole("button", { name: "프로필", exact: true }).isVisible(), true);
  const detailFits = await page.locator("#host").evaluate((host) => {
    const scroller = host.shadowRoot.querySelector(".scroll");
    return { content: scroller.scrollHeight, available: scroller.clientHeight };
  });
  assert.ok(
    detailFits.content <= detailFits.available + 1,
    `resident detail should fit: ${JSON.stringify(detailFits)}`,
  );
  await page.getByRole("button", { name: "← 주민 목록" }).click();
  assert.equal(await page.getByRole("button", { name: "주민 2 자세히 보기" }).count(), 1);
  await page.setViewportSize({ width: 320, height: 640 });
  await page.locator("#host").evaluate((host) => {
    host.style.width = "320px";
    host.style.height = "640px";
  });
  const compactListFits = await page.locator("#host").evaluate((host) => {
    const scroller = host.shadowRoot.querySelector(".scroll");
    return { content: scroller.scrollHeight, available: scroller.clientHeight };
  });
  assert.ok(
    compactListFits.content <= compactListFits.available + 1,
    `compact resident list should fit: ${JSON.stringify(compactListFits)}`,
  );
  console.log("Resident pagination and detail navigation: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
