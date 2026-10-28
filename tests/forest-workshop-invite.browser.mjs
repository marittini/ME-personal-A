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
    `import { renderInviteScreen } from ${JSON.stringify(join(client, "screens/invite/invite-screen.ts"))};\nimport { STYLES } from ${JSON.stringify(join(client, "styles.ts"))};\nimport { RESIDENT_STYLES } from ${JSON.stringify(join(client, "styles-residents.ts"))};\nimport { PRODUCTION_STYLES } from ${JSON.stringify(join(client, "styles-production.ts"))};\nimport { INVITE_STYLES } from ${JSON.stringify(join(client, "styles-invite.ts"))};\nimport { STORY_STYLES } from ${JSON.stringify(join(client, "styles-story.ts"))};\nimport { ART_STYLES } from ${JSON.stringify(join(client, "styles-art.ts"))};\nwindow.renderInviteScreen = renderInviteScreen; window.fwStyles = STYLES + RESIDENT_STYLES + PRODUCTION_STYLES + INVITE_STYLES + STORY_STYLES + ART_STYLES;`,
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
      closeSheet() {},
      navigate() {},
      openResidents() {},
      openDeliveries() {},
    };
    window.testRender = () => {
      root.innerHTML = "";
      const style = document.createElement("style");
      style.textContent = window.fwStyles;
      root.append(style, window.renderInviteScreen(window.testState, window.testController));
    };
    window.testRender();
  });
  assert.equal(await page.getByText("주민 0", { exact: true }).isVisible(), true);
  assert.equal(await page.getByText("주민 2", { exact: true }).count(), 0);
  await page.getByRole("button", { name: "다음", exact: true }).click();
  await page.getByRole("button", { name: "주민 2와(과) 종표 교환" }).click();
  assert.equal(await page.evaluate(() => window.exchanged), "2");
  await page.evaluate(() => {
    window.testState.sheet = { kind: "invite-wish" };
    window.testRender();
  });
  const dialog = page.getByRole("dialog", { name: "희망 주민 설정" });
  assert.equal(await dialog.getByText("주민 2", { exact: true }).count(), 0);
  await dialog.getByRole("button", { name: "다음", exact: true }).click();
  await dialog.getByRole("button", { name: /주민 2/ }).click();
  assert.equal(await page.evaluate(() => window.wished), "2");
  console.log("Invite exchange pagination and target: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
