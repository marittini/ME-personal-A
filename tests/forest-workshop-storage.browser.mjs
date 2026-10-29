// Browser regression for work section navigation and unapplied rule visibility.
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
const temp = await mkdtemp(join(tmpdir(), "forest-storage-"));
const client = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
let browser;
try {
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import { renderFacilitiesScreen } from ${JSON.stringify(join(client, "screens/work/facilities-screen.ts"))};\nimport { STYLES } from ${JSON.stringify(join(client, "styles.ts"))};\nimport { RESIDENT_STYLES } from ${JSON.stringify(join(client, "styles-residents.ts"))};\nimport { PRODUCTION_STYLES } from ${JSON.stringify(join(client, "styles-production.ts"))};\nimport { INVITE_STYLES } from ${JSON.stringify(join(client, "styles-invite.ts"))};\nimport { STORY_STYLES } from ${JSON.stringify(join(client, "styles-story.ts"))};\nimport { ART_STYLES } from ${JSON.stringify(join(client, "styles-art.ts"))};\nwindow.renderFacilitiesScreen = renderFacilitiesScreen; window.fwStyles = STYLES + RESIDENT_STYLES + PRODUCTION_STYLES + INVITE_STYLES + STORY_STYLES + ART_STYLES;`,
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
    const items = Array.from({ length: 7 }, (_, i) => ({ id: `item-${i}`, name: `물건 ${i}`, sellPrice: 1 }));
    window.testState = {
      route: "facilities",
      facilitiesTab: "storage",
      work: { facilityId: "gather-yard", inventoryPage: 0, drafts: {}, selected: {}, queueRecipe: {} },
      world: {
        state: "ready",
        value: {
          state: {
            inventory: Object.fromEntries(items.map((item) => [item.id, 3])),
            production: { protectedStock: {}, autoSell: {}, facilities: {} },
            wallet: { gold: 0, tickets: 0 },
          },
        },
      },
      content: { items, production: { protectedStock: { min: 0, max: 999 } } },
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
    window.testController = {
      setInventoryPage(page) {
        window.testState.work.inventoryPage = page;
        window.testRender();
      },
      setFacilitiesTab(tab) {
        window.testState.facilitiesTab = tab;
        window.testState.work.inventoryPage = 0;
        window.testRender();
      },
      openSheet(sheet) {
        window.openedSheet = sheet;
        if (sheet.kind === "protect-edit") {
          window.testState.sheet = sheet;
          window.testRender();
        }
      },
      rememberProtection(patch) {
        const sheet = window.testState.sheet;
        if (sheet?.kind !== "protect-edit") return;
        sheet.page = patch.page ?? sheet.page;
        if (patch.itemId !== undefined) sheet.drafts = { ...sheet.drafts, [patch.itemId]: patch.amount };
      },
      setProtected(itemId, amount) {
        window.protectedSave = { itemId, amount };
      },
      closeSheet() {},
      navigate() {},
      openResidents() {},
      openDeliveries() {},
    };
    window.testRender = () => {
      root.innerHTML = "";
      const style = document.createElement("style");
      style.textContent = window.fwStyles;
      root.append(style, window.renderFacilitiesScreen(window.testState, window.testController));
    };
    window.testRender();
  });
  assert.equal(await page.getByText("물건 0", { exact: true }).count(), 1);
  const size = await page.locator("#host").evaluate((host) => {
    const scroller = host.shadowRoot.querySelector(".scroll");
    return { content: scroller.scrollHeight, available: scroller.clientHeight };
  });
  assert.ok(size.content <= size.available + 1, `storage should fit: ${JSON.stringify(size)}`);
  assert.equal(await page.getByText("물건 3", { exact: true }).count(), 0);
  await page.getByLabel("재고 목록 고르기", { exact: true }).click();
  await page.getByLabel("재고 목록 고르기", { exact: true }).locator("..").locator("button").nth(2).click();
  assert.equal(await page.getByText("물건 6", { exact: true }).count(), 1);
  await page.getByLabel("재고 목록 고르기", { exact: true }).click();
  await page.getByLabel("재고 목록 고르기", { exact: true }).locator("..").locator("button").nth(1).click();
  assert.equal(await page.getByText("물건 3", { exact: true }).count(), 1);
  await page.setViewportSize({ width: 320, height: 640 });
  await page.locator("#host").evaluate((host) => {
    host.style.width = "320px";
    host.style.height = "640px";
  });
  const smallSize = await page.locator("#host").evaluate((host) => {
    const scroller = host.shadowRoot.querySelector(".scroll");
    return { content: scroller.scrollHeight, available: scroller.clientHeight };
  });
  assert.ok(smallSize.content <= smallSize.available + 1, `small storage should fit: ${JSON.stringify(smallSize)}`);
  await page.getByRole("button", { name: "물건 3 팔기" }).click();
  assert.deepEqual(await page.evaluate(() => window.openedSheet), { kind: "sell", itemId: "item-3" });
  await page.getByRole("tab", { name: "시설", exact: true }).click();
  assert.equal(await page.getByText("물건 0", { exact: true }).count(), 1);
  await page.getByLabel("재고 목록 고르기", { exact: true }).click();
  await page.getByLabel("재고 목록 고르기", { exact: true }).locator("..").locator("button").nth(1).click();
  assert.equal(await page.getByText("물건 3", { exact: true }).count(), 1);
  await page.getByRole("button", { name: "편집하기" }).click();
  await page.getByRole("button", { name: "늘리기 1", exact: true }).click();
  await page.getByLabel("보호할 아이템").selectOption("3");
  await page.getByLabel("보호할 아이템").selectOption("0");
  await page.evaluate(() => window.testRender());
  await page.getByRole("button", { name: "물건 0 보호 수량 저장" }).click();
  assert.deepEqual(await page.evaluate(() => window.protectedSave), { itemId: "item-0", amount: 1 });
  console.log("Inventory paging and actions: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
