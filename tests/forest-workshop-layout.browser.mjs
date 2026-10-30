// Shared viewport proof for every route and its reachable detail surfaces.
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { build } from "esbuild";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
const temp = await mkdtemp(join(tmpdir(), "fw-layout-"));
const client = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
const server = resolve("packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop");
const evidence = process.env.FW_LAYOUT_OUTPUT;
if (evidence) await mkdir(evidence, { recursive: true });
let browser;
try {
  const routeSource = await readFile(join(server, "http/game-routes.ts"), "utf8");
  const content = routeSource.slice(
    routeSource.indexOf("const CONTENT = {"),
    routeSource.indexOf("\n};", routeSource.indexOf("const CONTENT = {")) + 3,
  );
  const imports = [...routeSource.matchAll(/import\s+(?!type\b)[\s\S]*?from "([^"]+)";/g)]
    .filter((match) => /\.\.\/(content\/|domain\/model\/(production|residents)$)/.test(match[1]))
    .map((match) => match[0].replace(match[1], resolve(server, "http", match[1])))
    .join("\n");
  const screens = {
    worlds: ["renderWorldsScreen", "screens/worlds-screen.ts"],
    home: ["renderHomeScreen", "screens/home/home-screen.ts"],
    work: ["renderWorkScreen", "screens/work/work-screen.ts"],
    facilities: ["renderFacilitiesScreen", "screens/work/facilities-screen.ts"],
    settings: ["renderSettingsScreen", "screens/settings/settings-screen.ts"],
    backup: ["renderBackupScreen", "screens/settings/backup-screen.ts"],
    residents: ["renderResidentsScreen", "screens/residents/residents-screen.ts"],
    relations: ["renderRelationsScreen", "screens/residents/relations-screen.ts"],
    register: ["renderRegisterScreen", "screens/residents/register-screen.ts"],
    "resident-image": ["renderResidentImageScreen", "screens/residents/resident-image-screen.ts"],
    invite: ["renderInviteScreen", "screens/invite/invite-screen.ts"],
    explore: ["renderExploreScreen", "screens/explore/explore-screen.ts"],
    story: ["renderStoryReader", "screens/explore/story-reader.ts"],
  };
  const styles = [
    ["STYLES", "styles.ts"],
    ["PRODUCTION_STYLES", "styles-production.ts"],
    ["RESIDENT_STYLES", "styles-residents.ts"],
    ["STORY_STYLES", "styles-story.ts"],
    ["INVITE_STYLES", "styles-invite.ts"],
    ["ART_STYLES", "styles-art.ts"],
  ];
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  const fixtureEntry = join(temp, "fixture.ts"),
    fixtureBundle = join(temp, "fixture.cjs");
  await writeFile(
    fixtureEntry,
    imports +
      `\nconst MAX_INPUT_BYTES=20*1024*1024;\n${content.replace("const CONTENT", "export const CONTENT")}\nimport {createWorldState} from ${JSON.stringify(join(server, "domain/world-model.ts"))};\nexport const world=createWorldState({worldId:"11111111-1111-4111-8111-111111111111",worldName:"숲결 공방",playerNickname:"숲손님",now:"2026-10-30T12:00:00.000Z"});`,
  );
  await build({
    entryPoints: [fixtureEntry],
    outfile: fixtureBundle,
    bundle: true,
    platform: "node",
    format: "cjs",
    logLevel: "silent",
  });
  const fixture = (await import(pathToFileURL(fixtureBundle).href)).default;
  await writeFile(
    entry,
    `const CONTENT=${JSON.stringify(fixture.CONTENT)}; const createWorldState=()=>(${JSON.stringify(fixture.world)});` +
      `import {renderFrame} from ${JSON.stringify(join(client, "screens/chrome/frame.ts"))};\nimport {DiagnosticsPanel} from ${JSON.stringify(join(client, "screens/diagnostics-panel.ts"))};\nimport {createController} from ${JSON.stringify(join(client, "app/controller.ts"))};\n` +
      Object.values(screens)
        .map(([name, path]) => `import {${name}} from ${JSON.stringify(join(client, path))};`)
        .join("\n") +
      "\n" +
      styles.map(([name, path]) => `import {${name}} from ${JSON.stringify(join(client, path))};`).join("\n") +
      `\nwindow.fwAudit={CONTENT,createWorldState,createController,screens:{${Object.entries(screens)
        .map(([route, [name]]) => `${JSON.stringify(route)}:${name}`)
        .join(
          ",",
        )}},styles:${styles.map(([name]) => name).join("+")}}; window.fwAudit.screens.diagnostics=(state,controller)=>{const panel=new DiagnosticsPanel();panel.start();return renderFrame(state,controller,{top:{kind:"sub",title:"연결 점검",resources:false},backdrop:"wood",body:[panel.node],nav:true});};`,
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
          b.onLoad({ filter: /.*/, namespace: "test" }, () => ({ contents: "export const host={};", loader: "js" }));
        },
      },
    ],
  });
  browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  await page.route("http://forest.test/api/capability-packages/forest-workshop/assets/assets/**", async (route) => {
    const relative = new URL(route.request().url()).pathname.split("/assets/assets/")[1];
    await route.fulfill({
      contentType: "image/webp",
      body: await readFile(resolve("packages/forest-workshop/assets", relative)),
    });
  });
  await page.setContent(
    '<base href="http://forest.test/"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}</style><button id="fullscreen" style="position:fixed;top:0;right:0;opacity:0;width:1px;height:1px;z-index:9999">Fullscreen</button><div id="mount"></div>',
  );
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  await page.evaluate(() => {
    const api = window.fwAudit;
    customElements.define(
      "fw-audit-host",
      class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
        }
      },
    );
    const host = document.createElement("fw-audit-host");
    document.querySelector("#mount").append(host);
    document.querySelector("#fullscreen").onclick = () => host.requestFullscreen();
    const original = api.createController().store.get();
    const now = "2026-10-30T12:00:00.000Z";
    const world = api.createWorldState({
      worldId: "11111111-1111-4111-8111-111111111111",
      worldName: "숲결 공방",
      playerNickname: "숲손님",
      now,
    });
    world.wallet = { gold: 123456, tickets: 8, tokens: 3 };
    world.progress.starterKitClaimed = true;
    world.inventory = Object.fromEntries(api.CONTENT.items.map((item, i) => [item.id, 12345 + i]));
    world.production.protectedStock[api.CONTENT.items[0].id] = 20;
    for (const facility of Object.values(world.production.facilities)) facility.unlocked = true;
    const resident = (id, name) => ({
      residentId: id,
      kind: "character",
      displayName: name,
      registeredAt: now,
      recruited: true,
      field: "gather",
      fieldSeed: 1,
      talentId: null,
      breakthrough: 0,
      source: {
        name,
        kind: "character",
        id,
        takenAt: now,
        description: "함께 공방을 돌보는 조용한 이웃입니다. ".repeat(6),
        personality: "다정함",
        scenario: "숲길",
      },
      worldSetting: "함께 공방을 돌봐요.",
      changes: [],
      image: { current: null, history: [], placement: { scale: 100, offsetX: 0, markerHeight: 0 } },
    });
    world.residents = { r: resident("r", "긴 이름을 가진 숲길의 이웃"), b: resident("b", "두 번째 이웃") };
    world.progress.starterResidentId = "r";
    world.pairs = { p: { pairId: "p", residentIds: ["r", "b"], familiarity: 0, archived: false, createdAt: now } };
    const source = { kind: "character", id: "r", name: "숲길 이웃", summary: "이웃의 소개" };
    const register = {
      step: 1,
      kindTab: "character",
      query: "",
      sources: { state: "ready", value: [source] },
      selected: source,
      preview: {
        state: "ready",
        value: {
          ...world.residents.r.source,
          talent: { field: "gather", talentId: null },
          snapshot: world.residents.r.source,
        },
      },
      draft: "함께 공방을 돌봐요.",
      pendingImage: null,
      starterChoice: "r",
    };
    const base = {
      ...original,
      world: { state: "ready", value: { worldId: world.worldId, revision: 1, updatedAt: now, state: world } },
      worlds: { state: "ready", value: [] },
      content: api.CONTENT,
      starterSheetHidden: true,
      focusResidentId: "r",
      residentsView: { tab: "all", query: "", filter: "all", selectedId: "r" },
      register,
      storage: { state: "ready", value: { residentImagesBytes: 123456, backgroundsBytes: 34567, recordsBytes: 3000 } },
      deliveries: { state: "ready", value: { day: "2026-10-30", orders: [] } },
      seasonChoice: "spring",
      artReady: [
        "backgrounds/workshop-base-spring.webp",
        "ui/title-sign.webp",
        "ui/paper-panel.webp",
        "ui/primary-button.webp",
      ],
      reader: {
        pairId: "p",
        episode: 0,
        storyId: "s",
        index: 0,
        auto: false,
        backlog: false,
        from: "explore",
        story: {
          state: "ready",
          value: {
            storyId: "s",
            title: "숲길의 오후",
            participants: ["r", "b"],
            segments: [{ kind: "line", speakerId: "r", emotion: "joy", text: "오늘도 공방에서 따뜻한 차를 마셔요." }],
          },
        },
      },
    };
    window.auditBase = base;
    window.auditState = base;
    window.auditController = new Proxy(
      { store: { get: () => window.auditState } },
      { get: (target, key) => (key in target ? target[key] : () => {}) },
    );
    window.auditRender = (route, patch = {}) => {
      const state = structuredClone(base);
      Object.assign(state, { route }, patch);
      window.auditState = state;
      const root = host.shadowRoot;
      const style = document.createElement("style");
      style.textContent = api.styles;
      root.replaceChildren(style, api.screens[route](state, window.auditController));
    };
  });
  screens.diagnostics = ["diagnostics", ""];
  const firstItem = await page.evaluate(() => window.fwAudit.CONTENT.items[0].id);
  const cases = Object.keys(screens).map((route) => ({ name: route, route, patch: {} }));
  cases.push({ name: "storage", route: "facilities", patch: { facilitiesTab: "storage" } });
  for (const kind of ["protect-edit", "sell", "auto-sell"])
    cases.push({ name: kind, route: "facilities", patch: { sheet: { kind, itemId: firstItem } } });
  for (const kind of ["profile", "field", "image-history"])
    cases.push({
      name: kind,
      route: kind === "image-history" ? "resident-image" : "residents",
      patch: { sheet: { kind, residentId: "r" } },
    });
  for (const kind of ["guidelines", "memory", "mailbox", "deliveries", "work-report"])
    cases.push({ name: kind, route: "home", patch: { sheet: { kind } } });
  for (const kind of ["invite-chances", "invite-log", "invite-wish"])
    cases.push({ name: kind, route: "invite", patch: { sheet: { kind } } });
  for (const step of [2, 3])
    cases.push({
      name: `register-${step}`,
      route: "register",
      patch: { register: { ...(await page.evaluate(() => window.auditBase.register)), step } },
    });
  const base = await page.evaluate(() => window.auditBase);
  const withWorld = (mutate) => {
    const view = structuredClone(base.world);
    mutate(view.value.state);
    return { world: view };
  };
  for (const settingsSection of ["display", "manage"])
    cases.push({ name: `settings-${settingsSection}`, route: "settings", patch: { settingsSection } });
  cases.push({ name: "pair-add", route: "relations", patch: { sheet: { kind: "pair-add", residentId: "r" } } });
  cases.push({ name: "history-cleanup", route: "backup", patch: { sheet: { kind: "history-cleanup" } } });
  cases.push({
    name: "profile-source",
    route: "residents",
    patch: { sheet: { kind: "profile", residentId: "r", panel: 1 } },
  });
  cases.push({
    name: "invite-result",
    route: "invite",
    patch: {
      sheet: { kind: "invite-result", draws: [{ residentId: "r", outcome: "token", tokens: 1, via: "random" }] },
    },
  });
  cases.push({ name: "invite-exchange", route: "invite", patch: { inviteTab: "exchange" } });
  cases.push({
    name: "backup-preview",
    route: "backup",
    patch: { restore: { fileName: "숲결공방-백업.json", summary: { residents: 8, pairs: 5, pictures: 13 } } },
  });
  cases.push({
    name: "work-count",
    route: "work",
    patch: withWorld((world) => (world.production.facilities["gather-yard"].mode = "count")),
  });
  cases.push({
    name: "facility-locked",
    route: "facilities",
    patch: withWorld((world) => (world.production.facilities["gather-yard"].unlocked = false)),
  });
  cases.push({
    name: "home-starter",
    route: "home",
    patch: { ...withWorld((world) => (world.progress.starterKitClaimed = false)), starterSheetHidden: false },
  });
  cases.push({
    name: "mail-long",
    route: "home",
    patch: {
      ...withWorld(
        (world) => (world.mailbox.letters[0].body = "숲길에서 따 온 허브로 따뜻한 차를 준비했어요.\n".repeat(30)),
      ),
      sheet: { kind: "mailbox", id: base.world.value.state.mailbox.letters[0].id },
    },
  });
  cases.push({ name: "story-backlog", route: "story", patch: { reader: { ...base.reader, backlog: true } } });
  for (const tab of ["survey", "patrol"])
    cases.push({ name: `explore-${tab}`, route: "explore", patch: { explore: { ...base.explore, tab } } });
  for (const route of Object.keys(screens).filter((route) => route !== "diagnostics"))
    for (const status of ["loading", "error"]) {
      const load = { state: status, ...(status === "error" ? { message: "연결을 확인하고 다시 시도해 주세요." } : {}) };
      const patch =
        route === "worlds"
          ? { worlds: load }
          : route === "register"
            ? { register: { ...base.register, sources: load } }
            : route === "story"
              ? { reader: { ...base.reader, story: load } }
              : { world: load };
      cases.push({ name: `${route}-${status}`, route, patch });
    }
  const findings = [];
  for (const config of [
    { width: 320, height: 640, font: 22 },
    { width: 390, height: 844, font: 16 },
    { width: 390, height: 1200, font: 16 },
    { width: 844, height: 390, font: 16 },
    { width: 1280, height: 800, font: 22 },
  ]) {
    await page.setViewportSize({ width: config.width, height: config.height });
    await page.locator("fw-audit-host").evaluate((host, c) => {
      host.style.cssText = `width:${c.width}px;height:${c.height}px;--fw-font-size:${c.font}px`;
    }, config);
    for (const test of cases) {
      try {
        await page.evaluate((test) => window.auditRender(test.route, test.patch), test);
        const result = await page.locator("fw-audit-host").evaluate((host) => {
          const root = host.shadowRoot,
            shell = root.querySelector(".shell"),
            scroll = root.querySelector(".scroll"),
            sheet = root.querySelector(".sheet"),
            nav = root.querySelector(".tabbar");
          const panel = sheet ?? scroll;
          const invisible = [...panel.querySelectorAll("button,input,select,textarea")]
            .filter(
              (n) =>
                !n.classList.contains("visually-hidden") &&
                n.getClientRects().length &&
                n.checkVisibility() &&
                n.scrollWidth > n.clientWidth + 2,
            )
            .map((n) => n.getAttribute("aria-label") || n.textContent?.slice(0, 35));
          return {
            offenders: [...scroll.querySelectorAll("*")]
              .filter(
                (n) =>
                  n.getClientRects().length &&
                  n.checkVisibility() &&
                  n.getBoundingClientRect().right > scroll.getBoundingClientRect().right + 2,
              )
              .slice(0, 5)
              .map((n) => n.className),
            horizontal: panel.scrollWidth > panel.clientWidth + 1,
            controls: invisible,
            squeezed: [...panel.querySelectorAll("strong,span,label,dt,dd")]
              .filter((n) => {
                const text = n.textContent?.replace(/\s/g, "") ?? "";
                if (
                  n.childElementCount ||
                  !n.getClientRects().length ||
                  !n.checkVisibility() ||
                  text.length < 3 ||
                  !/[가-힣]/.test(text)
                )
                  return false;
                const range = document.createRange();
                range.selectNodeContents(n);
                return (
                  range.getClientRects().length > Math.ceil(text.length * 0.6) &&
                  n.getBoundingClientRect().width < parseFloat(getComputedStyle(n).fontSize) * 2
                );
              })
              .map((n) => n.textContent),
            background: getComputedStyle(shell).backgroundSize,
            homeGap: shell.classList.contains("home-layout")
              ? Math.max(
                  0,
                  Math.round(
                    scroll.getBoundingClientRect().bottom - root.querySelector(".page").getBoundingClientRect().bottom,
                  ),
                )
              : 0,
            navGap: nav ? Math.round(host.getBoundingClientRect().bottom - nav.getBoundingClientRect().bottom) : 0,
          };
        });
        const reachable = await page.locator("fw-audit-host").evaluate((host) => {
          const root = host.shadowRoot,
            panel = root.querySelector(".sheet") ?? root.querySelector(".scroll");
          const controls = [...panel.querySelectorAll("button,select,textarea,input,summary")].filter(
            (n) => n.getClientRects().length && n.checkVisibility() && !n.classList.contains("visually-hidden"),
          );
          const last = controls.at(-1);
          if (!last) return true;
          last.scrollIntoView({ block: "nearest" });
          const bounds = panel.getBoundingClientRect(),
            rect = last.getBoundingClientRect();
          return rect.top >= bounds.top - 2 && rect.bottom <= bounds.bottom + 2;
        });
        findings.push({ name: test.name, ...config, ...result, reachable });
        if (evidence && config.width === 320) {
          const scrollable = await page.locator("fw-audit-host").evaluate((host) => {
            const root = host.shadowRoot,
              panel = root.querySelector(".sheet") ?? root.querySelector(".scroll");
            const more = panel.scrollHeight > panel.clientHeight + 2;
            panel.scrollTop = 0;
            return more;
          });
          await page.screenshot({ path: join(evidence, `${test.name}-320.png`) });
          if (scrollable) {
            await page.locator("fw-audit-host").evaluate((host) => {
              const root = host.shadowRoot,
                panel = root.querySelector(".sheet") ?? root.querySelector(".scroll");
              panel.scrollTop = panel.scrollHeight;
            });
            await page.screenshot({ path: join(evidence, `${test.name}-320-end.png`) });
          }
        }
      } catch (error) {
        findings.push({ name: test.name, ...config, error: error.message.split("\n")[0] });
      }
    }
  }
  // Real Fullscreen API, entered from a user gesture; verify resizing without re-rendering.
  for (const size of [
    { width: 390, height: 1200 },
    { width: 1280, height: 800 },
  ]) {
    await page.setViewportSize(size);
    await page.locator("fw-audit-host").evaluate((host) => {
      host.style.cssText = "width:320px;height:520px;--fw-font-size:16px";
    });
    await page.evaluate(() => window.auditRender("home"));
    await page.locator("#fullscreen").click();
    await page.waitForFunction(() => !!document.fullscreenElement);
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const bounds = await page.locator("fw-audit-host").evaluate((host) => {
      const root = host.shadowRoot,
        scroll = root.querySelector(".scroll");
      return {
        height: host.getBoundingClientRect().height,
        hostWidth: host.getBoundingClientRect().width,
        gap: Math.max(
          0,
          scroll.getBoundingClientRect().bottom - root.querySelector(".page").getBoundingClientRect().bottom,
        ),
        navGap: host.getBoundingClientRect().bottom - root.querySelector(".tabbar").getBoundingClientRect().bottom,
      };
    });
    findings.push({
      name: "fullscreen-home",
      ...size,
      viewportHeight: size.height,
      viewportWidth: size.width,
      ...bounds,
    });
    if (evidence) await page.screenshot({ path: join(evidence, `fullscreen-${size.width}.png`) });
    if (size.width === 1280) {
      await page.setViewportSize({ width: 800, height: 1280 });
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const resized = await page.locator("fw-audit-host").evaluate((host) => {
        const root = host.shadowRoot,
          scroll = root.querySelector(".scroll");
        return {
          height: host.getBoundingClientRect().height,
          hostWidth: host.getBoundingClientRect().width,
          gap: Math.max(
            0,
            scroll.getBoundingClientRect().bottom - root.querySelector(".page").getBoundingClientRect().bottom,
          ),
        };
      });
      findings.push({ name: "fullscreen-resize", viewportHeight: 1280, viewportWidth: 800, ...resized });
    }
    await page.evaluate(() => document.exitFullscreen());
  }
  if (evidence) await writeFile(join(evidence, "layout-results.json"), JSON.stringify(findings, null, 2));
  const failures = findings.filter(
    (row) =>
      row.error ||
      row.horizontal ||
      row.controls?.length ||
      row.squeezed?.length ||
      row.reachable === false ||
      row.homeGap > 1 ||
      row.navGap > 1 ||
      row.gap > 1 ||
      (row.viewportHeight &&
        (Math.abs(row.height - row.viewportHeight) > 1 || Math.abs(row.hostWidth - row.viewportWidth) > 1)) ||
      (row.background && row.background !== "cover"),
  );
  console.log(
    JSON.stringify(
      { routes: Object.keys(screens).length, states: cases.length, cases: findings.length, failures },
      null,
      2,
    ),
  );
  assert.equal(failures.length, 0, "all audited layouts must remain usable");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
