// Browser regression for work section navigation and unapplied rule visibility.
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
const temp = await mkdtemp(join(tmpdir(), "forest-reader-"));
const client = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
let browser;
try {
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import { renderStoryReader } from ${JSON.stringify(join(client, "screens/explore/story-reader.ts"))};\nimport { STYLES } from ${JSON.stringify(join(client, "styles.ts"))};\nimport { RESIDENT_STYLES } from ${JSON.stringify(join(client, "styles-residents.ts"))};\nimport { STORY_STYLES } from ${JSON.stringify(join(client, "styles-story.ts"))};\nimport { ART_STYLES } from ${JSON.stringify(join(client, "styles-art.ts"))};\nwindow.renderStoryReader = renderStoryReader; window.fwStyles = STYLES + RESIDENT_STYLES + STORY_STYLES + ART_STYLES;`,
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
    const segments = [
      { kind: "line", speakerId: "r", text: "가나다라마바사아자차카타파하".repeat(8), emotion: "joy" },
      {
        kind: "choice",
        askerId: "r",
        question: "이럴 때 우리 함께 어떤 일을 하면 좋을까요? ".repeat(4),
        options: [
          { optionId: "a", text: "함께 공방에 가서 따뜻한 차를 마시며 쉬어요" },
          { optionId: "b", text: "잠시 여기서 쉬면서 오늘 있었던 일을 이야기해요" },
          { optionId: "c", text: "다른 길을 찾아보고 이웃에게 인사를 건네봐요" },
        ],
      },
    ];
    window.testState = {
      route: "story",
      reader: {
        pairId: "p",
        episode: 0,
        storyId: "s",
        story: { state: "ready", value: { title: "첫 이야기", participants: [], segments } },
        index: 0,
        auto: false,
        backlog: false,
        from: "explore",
      },
      world: {
        state: "ready",
        value: { worldId: "w", state: { residents: { r: { displayName: "주민" } }, stories: { pairs: {} } } },
      },
      content: null,
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
      toggleBacklog() {
        window.testState.reader.backlog = !window.testState.reader.backlog;
        window.testState.reader.backlogPage = undefined;
        window.testRender();
      },
      setBacklogPage(backlogPage) {
        window.testState.reader.backlogPage = backlogPage;
        window.testRender();
      },
      toggleAuto() {},
      closeStory() {},
      advanceStory() {
        const reader = window.testState.reader;
        const segment = reader.story.value.segments[reader.index];
        const count = segment.kind === "choice" ? 0 : Math.ceil(Array.from(segment.text).length / 52);
        if ((reader.textPage ?? 0) + 1 < count) reader.textPage = (reader.textPage ?? 0) + 1;
        else {
          reader.index++;
          reader.textPage = 0;
        }
        window.testRender();
      },
      setChoiceView(choiceView) {
        window.testState.reader.choiceView = choiceView;
        window.testRender();
      },
      finishStory() {
        window.finished = true;
      },
      chooseAnswer(id) {
        window.chosen = id;
      },
      notifyLocked() {},
      navigate() {},
    };
    window.testRender = () => {
      root.innerHTML = "";
      const style = document.createElement("style");
      style.textContent = window.fwStyles;
      root.append(style, window.renderStoryReader(window.testState, window.testController));
    };
    window.testRender();
  });
  const fit = async () =>
    page.locator("#host").evaluate((host) => {
      const s = host.shadowRoot.querySelector(".scroll");
      return { content: s.scrollHeight, available: s.clientHeight };
    });
  const lineSize = await fit();
  assert.ok(lineSize.content <= lineSize.available + 1, `story line should fit: ${JSON.stringify(lineSize)}`);
  const firstBox = await page.locator("#host").evaluate((host) => {
    const rect = host.shadowRoot.querySelector(".dialogue-box").getBoundingClientRect();
    return { top: rect.top, height: rect.height };
  });
  await page.getByRole("button", { name: "계속" }).click();
  const secondBox = await page.locator("#host").evaluate((host) => {
    const rect = host.shadowRoot.querySelector(".dialogue-box").getBoundingClientRect();
    return { top: rect.top, height: rect.height };
  });
  assert.deepEqual(secondBox, firstBox);
  await page.getByRole("button", { name: "계속" }).click();
  await page.getByRole("button", { name: "계속" }).click();
  assert.equal(await page.getByRole("button", { name: "다 읽고 보관" }).isDisabled(), true);
  const choiceSize = await fit();
  assert.ok(choiceSize.content <= choiceSize.available + 1, `story choice should fit: ${JSON.stringify(choiceSize)}`);
  await page.getByRole("button", { name: "답변 고르기" }).click();
  await page.getByRole("button", { name: "질문 다시 보기" }).click();
  assert.equal(
    await page.getByText("이럴 때 우리 함께 어떤 일을 하면 좋을까요? ".repeat(4), { exact: true }).isVisible(),
    true,
  );
  await page.getByRole("button", { name: "답변 고르기" }).click();
  await page.getByRole("button", { name: "잠시 여기서 쉬면서 오늘 있었던 일을 이야기해요" }).click();
  assert.equal(await page.evaluate(() => window.chosen), "b");
  await page.setViewportSize({ width: 320, height: 640 });
  await page.locator("#host").evaluate((host) => {
    host.style.width = "320px";
    host.style.height = "640px";
  });
  const smallChoiceSize = await fit();
  assert.ok(
    smallChoiceSize.content <= smallChoiceSize.available + 1,
    `small story choice should fit: ${JSON.stringify(smallChoiceSize)}`,
  );
  await page.getByRole("button", { name: "기록", exact: true }).click();
  const backlog = page.getByRole("dialog", { name: "기록" });
  assert.equal(
    await backlog.getByText("이럴 때 우리 함께 어떤 일을 하면 좋을까요? ".repeat(4), { exact: true }).isVisible(),
    true,
  );
  await backlog.getByRole("button", { name: "이전", exact: true }).click();
  assert.equal(await backlog.getByText("가나다라마바사아자차카타파하".repeat(8), { exact: true }).isVisible(), true);
  await page.getByRole("button", { name: "닫기", exact: true }).click();
  await page.evaluate(() => {
    const reader = window.testState.reader;
    reader.index = 1;
    reader.choiceView = "question";
    reader.story.value.segments[1].question = "어떤 일을 하면 좋을까요?";
    window.testRender();
  });
  assert.equal(await page.getByRole("button", { name: "답변 고르기" }).count(), 0);
  const compactChoice = await fit();
  assert.ok(
    compactChoice.content <= compactChoice.available + 1,
    `short choice should fit: ${JSON.stringify(compactChoice)}`,
  );

  await page.evaluate(() => {
    window.testState.reader.story.value.segments = [{ kind: "line", speakerId: "r", text: "끝", emotion: "none" }];
    window.testState.reader.index = 0;
    window.testRender();
  });
  await page.evaluate(() => {
    const state = window.testState;
    state.world.value.state.residents.r.image = {
      current: null,
      placement: { scale: 60, offsetX: 20, markerHeight: 0 },
    };
    state.reader.story.value.participants = ["r"];
    state.reader.story.value.segments[0].emotion = "joy";
    window.testRender();
  });
  const mark = await page.locator("#host").evaluate((host) => {
    const marker = host.shadowRoot.querySelector(".emotion-bubble");
    return {
      bottom: getComputedStyle(marker).bottom,
      left: getComputedStyle(marker).left,
      spot: marker.parentElement.style.cssText,
    };
  });
  assert.match(mark.spot, /--mark-bottom: 46%;/);
  assert.match(mark.spot, /--mark-left: 60%;/);
  await page.getByRole("button", { name: "다 읽고 보관" }).click();
  assert.equal(await page.evaluate(() => window.finished), true);
  console.log("Story viewport, choice and final action: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
