// Browser regression for the unified work plan, art, and reachable controls.
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
    `import { renderWorkScreen } from ${JSON.stringify(join(client, "screens/work/work-screen.ts"))};\nimport { STYLES } from ${JSON.stringify(join(client, "styles.ts"))};\nimport { RESIDENT_STYLES } from ${JSON.stringify(join(client, "styles-residents.ts"))};\nimport { PRODUCTION_STYLES } from ${JSON.stringify(join(client, "styles-production.ts"))};\nimport { INVITE_STYLES } from ${JSON.stringify(join(client, "styles-invite.ts"))};\nimport { STORY_STYLES } from ${JSON.stringify(join(client, "styles-story.ts"))};\nimport { ART_STYLES } from ${JSON.stringify(join(client, "styles-art.ts"))};\nimport { renderHomeScreen } from ${JSON.stringify(join(client, "screens/home/home-screen.ts"))};\nwindow.renderHomeScreen = renderHomeScreen; window.renderWorkScreen = renderWorkScreen; window.fwStyles = STYLES + RESIDENT_STYLES + PRODUCTION_STYLES + INVITE_STYLES + STORY_STYLES + ART_STYLES;`,
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
  const page = await browser.newPage({ viewport: { width: 390, height: 740 }, isMobile: false, hasTouch: true });
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
    document.body.style.margin = "0";
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
            wallet: { gold: 100, tickets: 0 },
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
            outputs: { "wild-berry": 1 },
            minutes: 1,
            description: "",
          },
        ],
        items: [{ id: "wild-berry", name: "산딸기" }],
        production: { speedBonusPerLevel: 0, maxLevel: 5, upgradeCosts: [50, 100, 200, 400] },
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
      setFacilitiesTab(tab) {
        window.facilitiesTab = tab;
      },
      navigate(route) {
        window.destination = route;
      },
      openGroundEditor() {
        window.groundOpened = true;
      },
      openResidents() {},
      changeTarget() {},
      recommendRules() {},
      applyRules() {
        window.appliedRules = true;
      },
      upgradeFacility(facilityId, level) {
        window.upgraded = { facilityId, level };
      },
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
  const alignment = await page.getByRole("tab", { name: "채집", exact: true }).evaluate((button) => {
    const b = button.getBoundingClientRect(),
      i = button.querySelector(".field-art").getBoundingClientRect(),
      t = button.querySelector("span:not(.lock-tag)").getBoundingClientRect();
    return [Math.abs((i.left + i.right - b.left - b.right) / 2), Math.abs((t.left + t.right - b.left - b.right) / 2)];
  });
  assert.ok(
    alignment.every((d) => d < 1),
    JSON.stringify(alignment),
  );
  const titleBounds = await page.locator(".sign").evaluate((sign) => {
    const b = sign.getBoundingClientRect(),
      range = document.createRange();
    range.selectNodeContents(sign.querySelector(".sign-title"));
    const t = range.getBoundingClientRect();
    return {
      inside:
        t.left >= b.left + b.width * 0.17 &&
        t.right <= b.left + b.width * 0.83 &&
        t.top >= b.top + b.height * 0.33 &&
        t.bottom <= b.top + b.height * 0.81,
    };
  });
  assert.ok(titleBounds.inside, "title stays within wooden board, clear of ropes and leaves");
  assert.equal(await page.getByText("변경한 설정은 적용 후 사용돼요.", { exact: true }).isVisible(), true);
  await page.getByRole("button", { name: "재고 보호", exact: true }).click();
  assert.equal(await page.evaluate(() => window.facilitiesTab), "protection");
  assert.equal(await page.evaluate(() => window.destination), "facilities");
  await page.getByRole("button", { name: "창고 · 판매", exact: true }).click();
  assert.equal(await page.evaluate(() => window.facilitiesTab), "storage");
  await page.getByRole("button", { name: "채집터 — 시설과 창고 열기" }).click();
  assert.equal(await page.evaluate(() => window.facilitiesTab), "facilities");
  assert.equal(await page.evaluate(() => window.destination), "facilities");
  await page.getByRole("button", { name: "채집터 강화 50 골드" }).click();
  assert.deepEqual(await page.evaluate(() => window.upgraded), { facilityId: "gather-yard", level: 1 });
  await page.getByRole("button", { name: "운영 규칙 적용" }).click();
  assert.equal(await page.evaluate(() => window.appliedRules), true);
  assert.equal(await page.getByRole("button", { name: "현재 작업", exact: true }).count(), 0);
  assert.equal(await page.getByRole("heading", { name: "생산 설정" }).count(), 1);
  assert.equal(await page.getByRole("heading", { name: "제작 우선순위" }).count(), 1);
  for (const [width, height] of [
    [390, 740],
    [320, 640],
  ]) {
    await page.setViewportSize({ width, height });
    await page.locator("#host").evaluate(
      (host, size) => {
        host.style.width = size.width + "px";
        host.style.height = size.height + "px";
      },
      { width, height },
    );
    const size = await page.locator("#host").evaluate((host) => {
      const s = host.shadowRoot.querySelector(".scroll");
      return { width: s.clientWidth, content: s.scrollWidth };
    });
    assert.ok(size.content <= size.width + 1, JSON.stringify(size));
    await page.getByRole("button", { name: "추천 설정", exact: true }).scrollIntoViewIfNeeded();
    assert.equal(await page.getByRole("button", { name: "추천 설정", exact: true }).isVisible(), true);
  }
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
  await page.getByLabel("대기 중인 작업").selectOption("q2");
  await page.getByRole("button", { name: "선택한 작업 빼기" }).click();
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
      outputs: { "wild-berry": 1 },
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
  assert.equal(await page.locator(".recipe-choices .recipe-choice").count(), 3);
  await page.getByRole("button", { name: "제작 1 생산 설정", exact: true }).click();
  assert.equal(
    await page.getByRole("button", { name: "제작 1 생산 설정", exact: true }).getAttribute("aria-pressed"),
    "true",
  );
  assert.equal(
    await page.locator(".production-slots li").count(),
    1,
    "state summary must retain applied rules, not unsaved draft choices",
  );
  await page.evaluate(() => {
    const state = window.testState;
    const facility = state.world.value.state.production.facilities["gather-yard"];
    facility.rules = [
      { policyId: "second", recipeId: "r2", enabled: true, priority: 2, targetStock: 5 },
      { policyId: "disabled", recipeId: "r1", enabled: false, priority: 0, targetStock: 5 },
      { policyId: "first", recipeId: "r0", enabled: true, priority: 1, targetStock: 5 },
    ];
    window.testRender();
  });
  assert.deepEqual(await page.locator(".production-slots li").allTextContents(), ["제작 0", "제작 2"]);
  await page.evaluate(() => {
    const state = window.testState;
    state.worldReceivedAt = Date.now();
    state.world.value.state.production.simMs = 0;
    state.world.value.state.production.facilities["gather-yard"].job = {
      recipeId: "r0",
      startedSim: 0,
      endsSim: 60000,
      outputs: { "wild-berry": 1 },
    };
    window.testRender();
  });
  assert.match(await page.locator(".production-summary .current-work").innerText(), /제작 0 만드는 중/);
  assert.ok(await page.locator(".production-summary [data-countdown-end]").count());
  await page.screenshot({ path: join(process.env.FW_ART_SCREENSHOTS ?? temp, "work-active-320.png") });
  await page.evaluate(() => {
    window.testState.world.value.state.production.facilities["gather-yard"].job = null;
    window.testRender();
  });
  await page.getByLabel("순서와 켜짐을 바꿀 생산 물품").selectOption("p2");
  assert.equal(await page.getByRole("button", { name: /제작 2 목표 5/ }).count(), 1);
  await page.getByLabel("추가할 제작법").selectOption("r3");
  await page.getByRole("button", { name: "제작법 추가" }).click();
  assert.deepEqual(await page.evaluate(() => window.addedRule), { facilityId: "gather-yard", recipeId: "r3" });
  await page.evaluate(() => {
    const state = window.testState;
    state.work.section = "status";
    state.world.value.state.production.facilities["gather-yard"].waiting = { reason: "no_rules" };
    window.testRender();
  });
  await page.getByRole("button", { name: "생산 순서 설정하기" }).click();
  assert.equal(await page.evaluate(() => window.testState.work.section), "priority");
  await page.evaluate(() => {
    const state = window.testState;
    state.work.section = "status";
    state.world.value.state.production.facilities["gather-yard"].mode = "count";
    state.world.value.state.production.facilities["gather-yard"].waiting = { reason: "queue_empty" };
    window.testRender();
  });
  await page.getByRole("button", { name: "작업 추가하기" }).click();
  assert.deepEqual(await page.evaluate(() => [window.testState.work.section, window.testState.work.queueView]), [
    "recipe",
    "add",
  ]);
  await page.evaluate(() => {
    const state = window.testState;
    state.work.section = "status";
    state.world.value.state.production.facilities["gather-yard"].waiting = {
      reason: "materials",
      itemId: "wood",
      needed: 2,
      usable: 0,
    };
    state.world.value.state.production.facilities["other-yard"] = { unlocked: false };
    state.content.items.push({ id: "wood", name: "나무" });
    state.content.facilities.push({ id: "other-yard", name: "다른 작업대", field: "grow" });
    state.content.recipes.push({
      id: "wood-recipe",
      name: "나무",
      facilityId: "other-yard",
      outputs: { wood: 1 },
      inputs: {},
    });
    window.testController.selectFacility = (id) => {
      window.chosenFacility = id;
    };
    window.testRender();
  });
  await page.getByRole("button", { name: "나무 얻는 곳 · 다른 작업대 (열기 필요)" }).click();
  assert.equal(await page.evaluate(() => window.chosenFacility), "other-yard");
  await page.evaluate(() => {
    const state = window.testState;
    state.content.facilities.push({ id: "survey-desk", name: "조사대", field: "survey" });
    state.world.value.state.production.facilities["survey-desk"] = { unlocked: false };
    window.testRender();
  });
  assert.equal(await page.getByRole("tab", { name: "조사 (해금 전)" }).count(), 1);
  await page.evaluate(() => {
    for (const [id, field, name] of [
      ["process-bench", "process", "가공대"],
      ["craft-bench", "craft", "제작대"],
    ]) {
      window.testState.content.facilities.push({ id, field, name });
      window.testState.world.value.state.production.facilities[id] = { unlocked: false };
    }
  });
  // Capture all five fields at default and enlarged mobile sizes.
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.evaluate((width) => {
      const host = document.querySelector("#host");
      host.style.width = width + "px";
      host.style.height = "844px";
      const state = window.testState;
      state.fontSize = width === 320 ? 22 : 16;
      host.style.setProperty("--fw-font-size", state.fontSize + "px");
      const facility = state.world.value.state.production.facilities["gather-yard"];
      facility.mode = "auto";
      facility.waiting = null;
      state.work.facilityId = "gather-yard";
      window.testRender();
    }, width);
    await page
      .locator(".field-art")
      .first()
      .evaluate((i) => i.decode());
    await page.locator(".scroll").evaluate((n) => (n.scrollTop = 0));
    await page.screenshot({ path: join(process.env.FW_ART_SCREENSHOTS ?? temp, `work-unified-${width}.png`) });
    const size = await page.locator(".scroll").evaluate((n) => [n.scrollWidth, n.clientWidth]);
    assert.ok(size[0] <= size[1] + 1, JSON.stringify(size));
    await page.getByRole("button", { name: "운영 규칙 적용" }).scrollIntoViewIfNeeded();
  }
  await page.evaluate(() => {
    const state = window.testState;
    state.route = "home";
    state.fontSize = 16;
    const w = state.world.value;
    Object.assign(w.state, {
      progress: { starterKitClaimed: true, starterResidentId: null },
      stories: { pairs: {}, expedition: null },
      settings: { ground: { left: 0, right: 100, top: 0, bottom: 100 } },
    });
    Object.assign(w.state.production, {
      reports: [{ reportId: 1, produced: { "wild-berry": 3 }, consumed: {}, sold: {} }],
      reportsReadThrough: 0,
      activity: { lastAbsence: null },
    });
    const host = document.querySelector("#host");
    host.style.width = "390px";
    host.style.setProperty("--fw-font-size", "16px");
    const root = host.shadowRoot;
    root.innerHTML = "";
    const style = document.createElement("style");
    style.textContent = window.fwStyles;
    window.renderHomePreview = () => {
      root.replaceChildren(style, window.renderHomeScreen(state, window.testController));
    };
    window.renderHomePreview();
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#host").evaluate(async (host) => {
    await Promise.all([...host.shadowRoot.querySelectorAll("img")].map((i) => i.decode()));
  });
  await page.waitForLoadState("networkidle");
  await page.locator(".scroll").evaluate((n) => (n.scrollTop = n.scrollHeight));
  await page.screenshot({ path: join(process.env.FW_ART_SCREENSHOTS ?? temp, "home-art-report.png") });
  assert.equal(await page.getByText("+3", { exact: true }).count(), 1);
  await page.getByRole("button", { name: "작업 보고", exact: false }).click();
  const edit = page.getByRole("button", { name: "지면 편집", exact: true });
  assert.equal(await edit.innerText(), "");
  const editBox = await edit.boundingBox();
  assert.ok(editBox.width >= 44 && editBox.width <= 46 && editBox.height >= 44);
  await edit.click();
  assert.equal(await page.evaluate(() => window.groundOpened), true);
  for (const [season, label] of [
    ["spring", "봄"],
    ["summer", "여름"],
    ["autumn", "가을"],
    ["winter", "겨울"],
  ]) {
    await page.evaluate((season) => {
      const state = window.testState;
      state.seasonChoice = season;
      state.artReady.push(`backgrounds/workshop-base-${season}.webp`);
      window.renderHomePreview();
    }, season);
    await page.locator(".scene img.scene-art").evaluate((i) => i.decode());
    assert.equal(await page.getByLabel(`현재 계절 ${label}`, { exact: true }).count(), 1);
    await page.locator(".scroll").evaluate((n) => (n.scrollTop = 0));
    await page.screenshot({ path: join(process.env.FW_ART_SCREENSHOTS ?? temp, `home-calm-${season}.png`) });
  }
  assert.equal(await page.locator(".mail-unread").count(), 0);
  assert.equal(await page.locator(".mail-new").count(), 0);
  await page.evaluate(() => {
    window.testState.world.value.state.mailbox = { letters: [{ id: "l", readAt: null, archived: false }] };
    window.renderHomePreview();
  });
  assert.equal(await page.getByRole("button", { name: "우편함 · 새 편지 있음", exact: true }).count(), 1);
  assert.equal(await page.locator(".mail-new").count(), 1);
  await page.evaluate(() => {
    window.testState.world.value.state.mailbox.letters[0].readAt = "now";
    window.renderHomePreview();
  });
  assert.equal(await page.locator(".mail-new").count(), 0);
  for (const kind of ["clear", "cloudy", "rain", "snow"]) {
    await page.evaluate((kind) => {
      window.testState.weatherEffects = { enabled: true, kind };
      window.renderHomePreview();
    }, kind);
    await page
      .locator(".weather-layer img")
      .first()
      .evaluate((i) => i.decode());
    assert.equal(await page.locator(".weather-layer").evaluate((n) => getComputedStyle(n).pointerEvents), "none");
    await page.screenshot({ path: join(process.env.FW_ART_SCREENSHOTS ?? temp, `home-weather-${kind}.png`) });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page
      .locator(".weather-particle")
      .first()
      .evaluate((n) => getComputedStyle(n).animationName),
    "none",
  );
  await page.evaluate(() => {
    window.testState.weatherEffects.enabled = false;
    window.renderHomePreview();
  });
  assert.equal(await page.locator(".weather-layer").count(), 0);
  console.log("Work alignment, title bounds, compact ground edit, seasons, mail indicator and weather effects: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
