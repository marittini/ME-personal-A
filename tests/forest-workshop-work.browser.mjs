// Browser regression for work section navigation and unapplied rule visibility.
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
const temp = await mkdtemp(join(tmpdir(), "forest-work-"));
const client = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
let browser;
try {
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import { renderWorkScreen } from ${JSON.stringify(join(client, "screens/work/work-screen.ts"))};\nimport { STYLES } from ${JSON.stringify(join(client, "styles.ts"))};\nimport { RESIDENT_STYLES } from ${JSON.stringify(join(client, "styles-residents.ts"))};\nimport { PRODUCTION_STYLES } from ${JSON.stringify(join(client, "styles-production.ts"))};\nimport { INVITE_STYLES } from ${JSON.stringify(join(client, "styles-invite.ts"))};\nimport { STORY_STYLES } from ${JSON.stringify(join(client, "styles-story.ts"))};\nimport { ART_STYLES } from ${JSON.stringify(join(client, "styles-art.ts"))};\nwindow.renderWorkScreen = renderWorkScreen; window.fwStyles = STYLES + RESIDENT_STYLES + PRODUCTION_STYLES + INVITE_STYLES + STORY_STYLES + ART_STYLES;`,
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
    const rule = { policyId: "p", recipeId: "berry", targetStock: 5, priority: 1, enabled: true };
    const facility = {
      unlocked: true,
      level: 1,
      residentId: null,
      mode: "auto",
      rules: [rule],
      queue: [],
      job: null,
      waiting: null,
    };
    window.testState = {
      route: "work",
      work: {
        facilityId: "gather-yard",
        drafts: { "gather-yard": [{ ...rule, targetStock: 6 }] },
        selected: {},
        queueRecipe: {},
      },
      world: {
        state: "ready",
        value: {
          state: {
            production: { facilities: { "gather-yard": facility }, protectedStock: {} },
            inventory: {},
            wallet: { gold: 0, tickets: 0 },
            residents: {},
            pairs: {},
          },
        },
      },
      content: {
        facilities: [{ id: "gather-yard", field: "gather", name: "채집터", description: "", unlock: null }],
        recipes: [
          {
            id: "berry",
            name: "산딸기",
            facilityId: "gather-yard",
            inputs: {},
            outputs: { berry: 1 },
            minutes: 1,
            description: "",
          },
        ],
        items: [{ id: "berry", name: "산딸기" }],
        production: { speedBonusPerLevel: 0 },
        crew: { setBonusMax: 0, setBonusPerPair: 0 },
        talents: [],
      },
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
      Object.assign(window.testState.work, patch);
      window.testRender();
    };
    window.testController = {
      setWorkSection(section) {
        update({ section });
      },
      selectRule(facilityId, policyId) {
        update({ selected: { [facilityId]: policyId } });
      },
      discardDraft() {},
      selectFacility() {},
      setMode() {},
      openSheet() {},
      navigate() {},
      openResidents() {},
      changeTarget() {},
      recommendRules() {},
      applyRules() {},
      toggleRule() {},
      moveRule() {},
      addRule() {},
    };
    window.testRender = () => {
      root.innerHTML = "";
      const style = document.createElement("style");
      style.textContent = window.fwStyles;
      root.append(style, window.renderWorkScreen(window.testState, window.testController));
    };
    window.testRender();
  });
  assert.equal(await page.getByText("바꾼 규칙은 아직 적용 전이에요.", { exact: false }).isVisible(), true);
  const statusSize = await page.locator("#host").evaluate((host) => {
    const scroller = host.shadowRoot.querySelector(".scroll");
    return { content: scroller.scrollHeight, available: scroller.clientHeight };
  });
  assert.ok(statusSize.content <= statusSize.available + 1, `work status should fit: ${JSON.stringify(statusSize)}`);
  await page.getByRole("button", { name: "순서·적용", exact: true }).click();
  assert.equal(await page.getByRole("button", { name: "운영 규칙 적용", exact: true }).isVisible(), true);
  await page.getByRole("button", { name: /산딸기 목표 6/ }).click();
  assert.equal(await page.getByText("재료 사용 설정").isVisible(), true);
  assert.equal(await page.getByText("바꾼 규칙은 아직 적용 전이에요.", { exact: false }).isVisible(), true);
  await page.getByRole("button", { name: "순서·적용", exact: true }).click();
  assert.equal(await page.getByRole("button", { name: "운영 규칙 적용", exact: true }).isEnabled(), true);
  await page.evaluate(() => {
    const state = window.testState;
    state.work.section = "recipe";
    const facility = state.world.value.state.production.facilities["gather-yard"];
    facility.mode = "count";
    facility.queue = Array.from({ length: 3 }, (_, i) => ({
      entryId: `q${i}`,
      recipeId: "berry",
      started: 0,
      total: 1,
    }));
    state.content.production.queueSlotLevels = [1, 1, 1, 1, 1];
    state.content.production.queueCount = { min: 1, max: 99 };
    Object.assign(window.testController, {
      setQueueView(queueView) {
        state.work.queueView = queueView;
        window.testRender();
      },
      setQueuePage(queuePage) {
        state.work.queuePage = queuePage;
        window.testRender();
      },
      rememberQueueCount(facilityId, count) {
        state.work.queueCounts = { ...state.work.queueCounts, [facilityId]: count };
      },
      selectQueueRecipe(facilityId, recipeId) {
        state.work.queueRecipe[facilityId] = recipeId;
        window.testRender();
      },
      removeQueue(facilityId, entryId) {
        window.removedQueue = { facilityId, entryId };
      },
      addQueue(facilityId, recipeId, count) {
        window.addedQueue = { facilityId, recipeId, count };
      },
    });
    window.testRender();
  });
  await page.getByRole("button", { name: "다음", exact: true }).click();
  await page.getByRole("button", { name: "산딸기 남은 횟수 빼기" }).click();
  assert.deepEqual(await page.evaluate(() => window.removedQueue), { facilityId: "gather-yard", entryId: "q2" });
  await page.getByRole("button", { name: "작업 추가" }).click();
  await page.getByRole("button", { name: "횟수 늘리기 1", exact: true }).click();
  await page.getByRole("button", { name: "대기열 보기" }).click();
  await page.getByRole("button", { name: "작업 추가" }).click();
  await page.getByRole("button", { name: "대기열에 추가" }).click();
  assert.deepEqual(await page.evaluate(() => window.addedQueue), {
    facilityId: "gather-yard",
    recipeId: "berry",
    count: 2,
  });
  await page.evaluate(() => {
    const state = window.testState;
    const facility = state.world.value.state.production.facilities["gather-yard"];
    facility.mode = "auto";
    state.work.section = "priority";
    state.work.priorityPage = 0;
    state.content.recipes = Array.from({ length: 4 }, (_, i) => ({
      id: `r${i}`,
      name: `제작 ${i}`,
      facilityId: "gather-yard",
      inputs: {},
      outputs: { berry: 1 },
      minutes: 1,
      description: "",
    }));
    state.work.drafts["gather-yard"] = state.content.recipes
      .slice(0, 3)
      .map((recipe, i) => ({ policyId: `p${i}`, recipeId: recipe.id, targetStock: 5, priority: i + 1, enabled: true }));
    window.testController.setPriorityPage = (priorityPage) => {
      state.work.priorityPage = priorityPage;
      window.testRender();
    };
    window.testController.addRule = (facilityId, recipeId) => {
      window.addedRule = { facilityId, recipeId };
    };
    window.testRender();
  });
  assert.equal(await page.getByRole("button", { name: /제작 2 목표 5/ }).count(), 0);
  await page.getByRole("button", { name: "다음", exact: true }).click();
  assert.equal(await page.getByRole("button", { name: /제작 2 목표 5/ }).count(), 1);
  await page.getByLabel("추가할 제작법").selectOption("r3");
  await page.getByRole("button", { name: "제작법 추가" }).click();
  assert.deepEqual(await page.evaluate(() => window.addedRule), { facilityId: "gather-yard", recipeId: "r3" });
  console.log("Work sections and draft visibility: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
