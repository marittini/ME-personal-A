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
    `import {renderMemorySheet} from ${JSON.stringify(join(client, "screens/residents/memory-sheet.ts"))}; import {STYLES} from ${JSON.stringify(join(client, "styles.ts"))}; import {RESIDENT_STYLES} from ${JSON.stringify(join(client, "styles-residents.ts"))}; Object.assign(window,{renderMemorySheet,fwStyles:STYLES+RESIDENT_STYLES});`,
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
  await page.setContent('<div id="host" style="width:320px;height:640px"></div>');
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  await page.evaluate(() => {
    const root = document.querySelector("#host").attachShadow({ mode: "open" });
    const base = {
      factType: "event",
      subjectIds: [],
      visibility: "knowers",
      pairId: "p",
      storyId: "s",
      occurredAt: "2026-10-29T00:00:00Z",
      status: "active",
      supersedes: null,
    };
    const state = {
      world: {
        state: "ready",
        value: {
          state: {
            residents: { a: { displayName: "A" }, b: { displayName: "B" } },
            pairs: { p: { residentIds: ["a", "b"] } },
            memory: {
              facts: [
                { ...base, factId: 1, text: "둘의 기억", knowerIds: ["a", "b"] },
                { ...base, factId: 2, text: "A만의 비밀", knowerIds: ["a"] },
                { ...base, factId: 3, text: "공개된 일", knowerIds: ["a"], visibility: "public" },
              ],
            },
          },
        },
      },
      sheet: { kind: "memory", pairId: "p" },
      busy: {},
    };
    const controller = {
      store: { get: () => state },
      updateMemoryView: (patch) => {
        Object.assign(state.sheet, patch);
        render();
      },
      rememberMemoryDraft: (draft) => {
        state.sheet.draft = draft;
      },
      correctMemory: (factId, text) => {
        window.corrected = { factId, text };
      },
      setMemoryStatus: (factId, active) => {
        window.statusChange = { factId, active };
      },
      closeSheet() {},
      notify() {},
    };
    function render() {
      root.replaceChildren();
      const style = document.createElement("style");
      style.textContent = window.fwStyles;
      root.append(style, window.renderMemorySheet(state, controller));
    }
    window.memoryRender = render;
    render();
  });
  async function choose(label, index) {
    const summary = page.getByLabel(label, { exact: true });
    await summary.click();
    await summary.locator("..").locator("button").nth(index).click();
  }
  assert.equal(await page.getByText("A만의 비밀", { exact: true }).count(), 0);
  await choose("기억 상태 필터", 3);
  assert.equal(await page.getByText("아직 기록된 기억이 없어요.").isVisible(), true);
  await choose("기억 상태 필터", 0);
  await choose("기억 인지 주민 필터", 2);
  await page.getByRole("button", { name: "둘의 기억 · 사용 중", exact: true }).click();
  await page.getByLabel("기억 정정문").fill("정정한 기억");
  await page.evaluate(() => window.memoryRender());
  assert.equal(await page.getByLabel("기억 정정문").inputValue(), "정정한 기억");
  await page.getByRole("button", { name: "정정 저장" }).click();
  assert.deepEqual(await page.evaluate(() => window.corrected), { factId: 1, text: "정정한 기억" });
  await page.getByRole("button", { name: "사용 중지", exact: true }).click();
  assert.deepEqual(await page.evaluate(() => window.statusChange), { factId: 1, active: false });
  if (process.env.FW_MEMORY_SCREENSHOT) await page.screenshot({ path: process.env.FW_MEMORY_SCREENSHOT });
  console.log("Memory shared scope, correction draft and actions: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
