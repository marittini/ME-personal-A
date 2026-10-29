import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";

const temp = await mkdtemp(join(tmpdir(), "fw-reading-layout-"));
let browser;
try {
  const root = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
  const entry = join(temp, "entry.ts");
  const bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import {measureStoryPages} from ${JSON.stringify(join(root, "app/story-pages.ts"))}; import {STORY_STYLES} from ${JSON.stringify(join(root, "styles-story.ts"))}; window.measureStoryPages=measureStoryPages; window.styles=STORY_STYLES;`,
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
  const page = await browser.newPage({ viewport: { width: 390, height: 740 }, isMobile: true, hasTouch: true });
  await page.setContent(
    '<meta name="viewport" content="width=device-width, initial-scale=1"><div class="story-layout"><div class="dialogue-box"><span class="speaker-tag">주민</span><p class="line">표시 중</p></div></div>',
  );
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  await page.evaluate(() => {
    const style = document.createElement("style");
    style.textContent =
      ":root{--fs:16px;--line:2px;--ink:#432;--fw-surface-3:#fff;--drop:none} *{box-sizing:border-box}" + window.styles;
    document.head.append(style);
  });
  const inspect = (text) =>
    page.evaluate((value) => {
      const box = document.querySelector(".dialogue-box");
      const line = box.querySelector(".line");
      const before = line.textContent;
      const pages = window.measureStoryPages(box, value);
      return { pages, before, after: line.textContent };
    }, text);
  const short = "숲길을 함께 걸으며 작은 꽃을 구경해요. ".repeat(2).slice(0, 56);
  const shortResult = await inspect(short);
  assert.equal(shortResult.pages.length, 1, "text that fits must not be split at 52 characters");
  assert.equal(shortResult.after, shortResult.before, "measurement must restore visible text");
  const long = "숲길을 함께 걸으며 작은 꽃을 구경해요. 나뭇잎이 바람에 흔들려요. ".repeat(15) + "🌲";
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 640 });
    for (const font of [16, 22]) {
      await page.evaluate((size) => document.documentElement.style.setProperty("--fs", `${size}px`), font);
      const result = await inspect(long);
      assert.ok(result.pages.length > 1);
      assert.equal(result.pages.join(""), long, `all text must be preserved at ${width}px and ${font}px`);
      for (const text of result.pages) {
        const fits = await page.evaluate((value) => {
          const box = document.querySelector(".dialogue-box"),
            line = box.querySelector(".line");
          line.textContent = value;
          return box.scrollHeight <= box.clientHeight + 1;
        }, text);
        assert.ok(fits, `page must fit at ${width}px and ${font}px`);
      }
    }
  }
  console.log("Story pages use measured space and preserve text across viewport and font sizes: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
