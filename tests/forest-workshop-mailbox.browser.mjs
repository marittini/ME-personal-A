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
    `import {renderMailboxSheet} from ${JSON.stringify(join(client, "screens/home/mailbox-sheet.ts"))}; import {STYLES} from ${JSON.stringify(join(client, "styles.ts"))}; import {RESIDENT_STYLES} from ${JSON.stringify(join(client, "styles-residents.ts"))}; import {ART_STYLES} from ${JSON.stringify(join(client, "styles-art.ts"))}; Object.assign(window,{renderMailboxSheet,fwStyles:STYLES+RESIDENT_STYLES+ART_STYLES});`,
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
  await page.route("http://forest.test/api/capability-packages/forest-workshop/assets/assets/**", async (route) => {
    const relative = new URL(route.request().url()).pathname.split("/assets/assets/")[1];
    await route.fulfill({
      contentType: "image/webp",
      body: await readFile(resolve("packages/forest-workshop/assets", relative)),
    });
  });
  await page.setContent(
    '<base href="http://forest.test/"><meta name="viewport" content="width=device-width,initial-scale=1"><div id="host" style="width:320px;height:640px"></div>',
  );
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  await page.evaluate(() => {
    const root = document.querySelector("#host").attachShadow({ mode: "open" });
    const state = {
      sheet: { kind: "mailbox" },
      world: {
        state: "ready",
        value: {
          state: {
            activities: { completed: [{ id: "test-activity", mailId: "activity-test-activity" }] },
            mailbox: {
              letters: [
                {
                  id: "welcome-v1",
                  eventId: "welcome-v1",
                  sender: "공방 안내",
                  title: "환영해요",
                  body: "편지 본문이에요.",
                  createdAt: "2026-10-29T00:00:00Z",
                  readAt: null,
                  archived: false,
                },
              ],
            },
          },
        },
      },
      busy: {},
    };
    const controller = {
      setMailboxView: (patch) => {
        Object.assign(state.sheet, patch);
        render();
      },
      openLetter: (id) => {
        state.sheet.id = id;
        state.world.value.state.mailbox.letters[0].readAt = "2026-10-29T00:00:00Z";
        render();
      },
      archiveLetter: (id, archived) => {
        state.world.value.state.mailbox.letters[0].archived = archived;
        state.sheet.id = undefined;
        render();
      },
      generateResidentLetter: (id) => {
        window.requestedActivity = id;
      },
      openActivityLetter: (id) => {
        window.openedLetter = id;
      },
      closeSheet() {},
    };
    function render() {
      root.replaceChildren();
      const style = document.createElement("style");
      style.textContent = window.fwStyles;
      const shell = document.createElement("div");
      shell.className = "shell art-paper";
      shell.append(window.renderMailboxSheet(state, controller));
      root.append(style, shell);
    }
    render();
  });
  await page.getByRole("button", { name: /새 편지/ }).click();
  assert.equal(await page.getByText("편지 본문이에요.").isVisible(), true);
  if (process.env.FW_MAIL_SCREENSHOT) await page.screenshot({ path: process.env.FW_MAIL_SCREENSHOT });
  await page.getByRole("button", { name: "보관하기", exact: true }).click();
  assert.equal(await page.getByText("받은 편지가 없어요.").isVisible(), true);
  await page.getByRole("button", { name: "보관함", exact: true }).click();
  await page.getByRole("button", { name: /읽음/ }).click();
  await page.getByRole("button", { name: "받은 편지로", exact: true }).click();
  assert.equal(await page.getByText("보관한 편지가 없어요.").isVisible(), true);
  await page.getByRole("button", { name: "받은 편지", exact: true }).click();
  assert.equal(await page.getByRole("button", { name: /읽음/ }).count(), 1);
  await page.evaluate(() => {
    const root = document.querySelector("#host").shadowRoot;
    const state = {
      sheet: { kind: "mailbox", id: "activity-test-activity" },
      world: {
        state: "ready",
        value: {
          state: {
            activities: { completed: [{ id: "test-activity", mailId: "activity-test-activity" }] },
            mailbox: {
              letters: [
                {
                  id: "activity-test-activity",
                  eventId: "activity-test-activity",
                  sender: "주민",
                  title: "조사 기록",
                  body: "활동 결과",
                  createdAt: "2026-10-29T00:00:00Z",
                  readAt: null,
                  archived: false,
                },
              ],
            },
          },
        },
      },
      busy: {},
    };
    const controller = {
      generateResidentLetter(id) {
        window.requestedActivity = id;
      },
      setMailboxView() {},
      archiveLetter() {},
      closeSheet() {},
    };
    root.replaceChildren(window.renderMailboxSheet(state, controller));
  });
  await page.getByRole("button", { name: "주민 편지 쓰기 · AI 사용" }).click();
  assert.equal(await page.evaluate(() => window.requestedActivity), "test-activity");
  console.log("Inbox, letter reading, archive and return to inbox: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
