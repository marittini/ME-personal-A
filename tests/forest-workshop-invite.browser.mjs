// Browser regression for work section navigation and unapplied rule visibility.
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
const temp = await mkdtemp(join(tmpdir(), "forest-invite-"));
const client = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
let browser;
try {
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import { renderInviteScreen } from ${JSON.stringify(join(client, "screens/invite/invite-screen.ts"))};\nimport { renderDeliveriesSheet } from ${JSON.stringify(join(client, "screens/invite/deliveries-sheet.ts"))};\nimport { STYLES } from ${JSON.stringify(join(client, "styles.ts"))};\nimport { RESIDENT_STYLES } from ${JSON.stringify(join(client, "styles-residents.ts"))};\nimport { PRODUCTION_STYLES } from ${JSON.stringify(join(client, "styles-production.ts"))};\nimport { INVITE_STYLES } from ${JSON.stringify(join(client, "styles-invite.ts"))};\nimport { STORY_STYLES } from ${JSON.stringify(join(client, "styles-story.ts"))};\nimport { ART_STYLES } from ${JSON.stringify(join(client, "styles-art.ts"))};\nwindow.renderInviteScreen = renderInviteScreen; window.renderDeliveriesSheet = renderDeliveriesSheet; window.fwStyles = STYLES + RESIDENT_STYLES + PRODUCTION_STYLES + INVITE_STYLES + STORY_STYLES + ART_STYLES;`,
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
  await page.route("http://forest.test/api/capability-packages/forest-workshop/assets/assets/**", async (route) => {
    const relative = new URL(route.request().url()).pathname.split("/assets/assets/")[1];
    await route.fulfill({
      contentType: "image/webp",
      body: await readFile(resolve("packages/forest-workshop/assets", relative)),
    });
  });
  await page.setContent(
    '<base href="http://forest.test/"><meta name="viewport" content="width=device-width, initial-scale=1"><div id="host" style="height:740px;width:390px"></div>',
  );
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  await page.evaluate(() => {
    const root = document.querySelector("#host").attachShadow({ mode: "open" });
    const residents = Object.fromEntries(
      Array.from({ length: 5 }, (_, i) => {
        const id = String(i);
        return [
          id,
          {
            residentId: id,
            displayName: `주민 ${i}`,
            kind: "character",
            recruited: false,
            breakthrough: 0,
            image: { current: null },
          },
        ];
      }),
    );
    window.testState = {
      route: "invite",
      inviteTab: "exchange",
      invitePage: 0,
      world: {
        state: "ready",
        value: {
          worldId: "world",
          state: {
            residents,
            wallet: { tickets: 3, tokens: 10 },
            invite: { wishResidentId: null },
            progress: { starterResidentId: "0" },
          },
        },
      },
      content: { crew: { maxBreakthrough: 5 }, invite: { tokensPerExchange: 5 } },
      artReady: [
        "ui/title-sign.webp",
        "ui/paper-panel.webp",
        "ui/primary-button.webp",
        "backgrounds/workshop-base-spring.webp",
      ],
      seasonChoice: "spring",
      sheet: null,
      notice: null,
      busy: {},
    };
    window.testController = {
      setInvitePage(page) {
        window.testState.invitePage = page;
        window.testRender();
      },
      setInviteTab(tab) {
        window.testState.inviteTab = tab;
        window.testState.invitePage = 0;
        window.testRender();
      },
      exchange(residentId) {
        window.exchanged = residentId;
      },
      setInviteSheetPage(page) {
        window.testState.sheet.page = page;
        window.testRender();
      },
      setWish(residentId) {
        window.wished = residentId;
      },
      selectDelivery(id) {
        window.testState.sheet.selectedOrderId = id;
        window.testRender();
      },
      deliver(id) {
        window.delivered = id;
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
      root.append(
        style,
        window.testState.sheet?.kind === "deliveries"
          ? window.renderDeliveriesSheet(window.testState, window.testController)
          : window.renderInviteScreen(window.testState, window.testController),
      );
    };
    window.testRender();
  });
  await page.evaluate(() => {
    window.testState.inviteTab = "invite";
    Object.assign(window.testState.content.invite, { ticketsPerDraw: 1, guaranteeAfter: 10, multiDraw: 10 });
    window.testState.world.value.state.invite.sinceNew = 0;
    window.testRender();
  });
  await page.locator(".invite-scene").evaluate((i) => i.decode());
  await page.screenshot({ path: join(process.env.FW_ART_SCREENSHOTS ?? temp, "invite-art.png") });
  await page.evaluate(() => {
    window.testState.inviteTab = "exchange";
    window.testRender();
  });

  assert.equal(await page.getByText("주민 0", { exact: true }).isVisible(), true);
  assert.equal(await page.getByText("주민 2", { exact: true }).count(), 0);
  await page.getByLabel("교환 주민 목록 고르기", { exact: true }).click();
  await page.getByLabel("교환 주민 목록 고르기", { exact: true }).locator("..").locator("button").nth(1).click();
  await page.getByRole("button", { name: "주민 2와(과) 종표 교환" }).click();
  assert.equal(await page.evaluate(() => window.exchanged), "2");
  await page.evaluate(() => {
    window.testState.sheet = { kind: "invite-wish" };
    window.testRender();
  });
  const dialog = page.getByRole("dialog", { name: "희망 주민 설정" });
  assert.equal(await dialog.getByText("주민 2", { exact: true }).count(), 0);
  await dialog.getByLabel("초대 목록 고르기", { exact: true }).click();
  await dialog.getByLabel("초대 목록 고르기", { exact: true }).locator("..").locator("button").nth(1).click();
  await dialog.getByRole("button", { name: /주민 2/ }).click();
  assert.equal(await page.evaluate(() => window.wished), "2");
  await page.evaluate(() => {
    window.testState.world.value.state.inventory = { wood: 5, leaf: 4 };
    window.testState.world.value.state.production = { protectedStock: { wood: 3 } };
    window.testState.content.items = [
      { id: "wood", name: "나무" },
      { id: "leaf", name: "잎" },
    ];
    window.testState.deliveries = {
      state: "ready",
      value: {
        orders: [
          { id: "a", title: "나무 의뢰", items: { wood: 3 }, reward: { tickets: 1, gold: 5 } },
          { id: "b", title: "잎 의뢰", items: { leaf: 2 }, reward: { tickets: 2, gold: 10 } },
          { id: "c", title: "완료 의뢰", items: { leaf: 1 }, reward: { tickets: 1, gold: 3 } },
        ],
        done: ["c"],
      },
    };
    window.testState.sheet = { kind: "deliveries" };
    window.testRender();
  });
  const orders = page.getByRole("dialog", { name: "초대권 받기 · 오늘의 납품" });
  assert.equal(await orders.getByText("보유 5 · 보호 3").isVisible(), true);
  assert.equal(await orders.getByRole("button", { name: "재료가 부족해요" }).isDisabled(), true);
  await orders.getByRole("button", { name: "잎 의뢰", exact: true }).click();
  await orders.getByRole("button", { name: "납품하기" }).click();
  assert.equal(await page.evaluate(() => window.delivered), "b");
  await orders.getByRole("button", { name: "완료 의뢰 납품 완료" }).click();
  assert.equal(await orders.getByText("납품 완료", { exact: true }).isVisible(), true);
  console.log("Invite exchange and delivery selection: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
