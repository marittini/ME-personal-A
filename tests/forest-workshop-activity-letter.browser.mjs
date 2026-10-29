import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
const temp = await mkdtemp(join(tmpdir(), "fw-activity-letter-"));
let browser;
try {
  const root = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop/app");
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import {createResidentActions} from ${JSON.stringify(join(root, "resident-actions.ts"))}; import {createStore} from ${JSON.stringify(join(root, "store.ts"))}; Object.assign(window,{createResidentActions,createStore});`,
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
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent("<html></html>");
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  const result = await page.evaluate(async () => {
    const letters = [
      { id: "unread", archived: false, readAt: null },
      { id: "archived", archived: true, readAt: "2026-10-29T00:00:00Z" },
    ];
    const store = window.createStore({ sheet: null });
    let commands = [],
      note = "",
      resolveRead;
    const core = {
      store,
      currentWorld: () => ({ state: { mailbox: { letters } } }),
      notify: (message) => {
        note = message;
      },
      runCommand: async (key, type, payload) => {
        commands.push({ key, type, payload });
        return { ok: true };
      },
    };
    const actions = window.createResidentActions(core);
    await actions.openActivityLetter("unread");
    const unread = store.get().sheet;
    await actions.openActivityLetter("archived");
    const archived = store.get().sheet;
    await actions.openActivityLetter("missing");
    const missing = store.get().sheet;
    core.runCommand = () =>
      new Promise((resolve) => {
        resolveRead = resolve;
      });
    const pending = actions.openActivityLetter("unread");
    store.set({ sheet: { kind: "memory" } });
    resolveRead({ ok: true });
    await pending;
    return { unread, archived, missing, note, commands, afterNavigation: store.get().sheet };
  });
  assert.deepEqual(result.unread, { kind: "mailbox", archived: false, id: "unread" });
  assert.deepEqual(result.archived, { kind: "mailbox", archived: true, id: "archived" });
  assert.deepEqual(result.missing, { kind: "mailbox" });
  assert.match(result.note, /찾을 수 없어요/);
  assert.deepEqual(result.commands, [{ key: "mail:unread", type: "mail.read", payload: { id: "unread" } }]);
  assert.deepEqual(result.afterNavigation, { kind: "memory" });
  console.log("Activity result opens correct letter, preserves archive and respects navigation: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
