import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
const temp = await mkdtemp(join(tmpdir(), "fw-auto-"));
const client = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop/app");
let browser;
try {
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import {createStoryActions} from ${JSON.stringify(join(client, "story-actions.ts"))}; import {createStore} from ${JSON.stringify(join(client, "store.ts"))}; import {gameApi} from ${JSON.stringify(join(client, "api.ts"))}; import * as preferences from ${JSON.stringify(join(client, "preferences.ts"))}; Object.assign(window,{createStoryActions,createStore,gameApi,preferences});`,
  );
  await build({
    entryPoints: [entry],
    outfile: bundle,
    bundle: true,
    format: "iife",
    platform: "browser",
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
  await page.route("http://forest.test/**", (route) =>
    route.fulfill({ body: "<html></html>", contentType: "text/html" }),
  );
  await page.goto("http://forest.test/");
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  const result = await page.evaluate(async () => {
    let tick = null,
      delay = 0,
      commands = 0;
    window.setInterval = (fn, ms) => {
      tick = fn;
      delay = ms;
      return 1;
    };
    window.clearInterval = () => {
      tick = null;
    };
    document.hasFocus = () => true;
    const state = {
      route: "home",
      autoReading: { enabled: true, seconds: 6 },
      world: {
        state: "ready",
        value: {
          worldId: "w",
          revision: 1,
          state: { stories: { pairs: { p: { current: { episodes: [{ storyId: "s", state: "unlocked" }] } } } } },
        },
      },
      reader: null,
      explore: { tab: "story", pairId: "p", overview: null },
    };
    const store = window.createStore(state);
    window.gameApi.getStory = async () => ({
      segments: [
        { kind: "narration", text: "시작" },
        { kind: "choice", askerId: "r", question: "질문", options: [] },
        { kind: "narration", text: "끝" },
      ],
    });
    window.gameApi.getStoryOverview = async () => ({ pairs: [] });
    const core = {
      store,
      currentWorld: () => store.get().world.value,
      navigate: (route) => store.set({ route }),
      runCommand: async () => {
        commands++;
        return null;
      },
      notify() {},
    };
    const actions = window.createStoryActions(core);
    actions.openStory("p", 0, "s");
    await Promise.resolve();
    await Promise.resolve();
    const started = store.get().reader.auto && delay === 6000;
    tick();
    const atQuestion = store.get().reader.index === 1 && !store.get().reader.auto && tick === null;
    actions.toggleAuto();
    const noAnswer = store.get().reader.index === 1 && tick === null && commands === 0;
    store.set({ reader: { ...store.get().reader, index: 2 } });
    actions.toggleAuto();
    tick();
    const atEnd = store.get().reader.index === 3 && !store.get().reader.auto && commands === 0;
    store.set({ reader: { ...store.get().reader, index: 0 } });
    actions.toggleAuto();
    actions.toggleBacklog();
    const backlog = !store.get().reader.auto && tick === null;
    actions.toggleBacklog();
    actions.toggleAuto();
    actions.pauseAutoReading();
    const paused = !store.get().reader.auto && tick === null;
    actions.toggleAuto();
    core.navigate("home");
    const left = tick === null && !store.get().reader.auto;
    window.preferences.writeAutoReading({ enabled: true, seconds: 7 });
    const persisted = window.preferences.readAutoReading();
    localStorage.setItem("forest-workshop:auto-reading", "broken");
    const malformed = window.preferences.readAutoReading();
    Storage.prototype.getItem = () => {
      throw new Error("blocked");
    };
    Storage.prototype.setItem = () => {
      throw new Error("blocked");
    };
    window.preferences.writeAutoReading({ enabled: true, seconds: 7 });
    const blocked = window.preferences.readAutoReading();
    const defaults = window.preferences.normalizeAutoReading(null);
    const clamp = window.preferences.normalizeAutoReading({ enabled: true, seconds: 999 });
    return {
      started,
      atQuestion,
      noAnswer,
      atEnd,
      backlog,
      paused,
      left,
      defaults,
      clamp,
      persisted,
      malformed,
      blocked,
    };
  });
  assert.deepEqual(result, {
    started: true,
    atQuestion: true,
    noAnswer: true,
    atEnd: true,
    backlog: true,
    paused: true,
    left: true,
    persisted: { enabled: true, seconds: 7 },
    malformed: { enabled: false, seconds: 4 },
    blocked: { enabled: false, seconds: 4 },
    defaults: { enabled: false, seconds: 4 },
    clamp: { enabled: true, seconds: 10 },
  });
  console.log("Auto reading defaults, interval, question, backlog, pause and explicit completion: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
