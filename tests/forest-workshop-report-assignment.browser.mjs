import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";

const temp = await mkdtemp(join(tmpdir(), "fw-report-"));
let browser;
try {
  const root = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import {renderAssignSheet} from ${JSON.stringify(join(root, "screens/work/assign-sheet.ts"))}; import {workReportSheet} from ${JSON.stringify(join(root, "screens/home/work-report.ts"))}; Object.assign(window,{renderAssignSheet,workReportSheet});`,
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
  const page = await browser.newPage({ viewport: { width: 320, height: 640 } });
  await page.setContent("<div id='host'></div>");
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  await page.evaluate(() => {
    window.state = {
      busy: {},
      content: {
        items: [{ id: "wild-berry", name: "산딸기" }],
        facilities: [{ id: "gather-yard", field: "gather", name: "채집터" }],
        crew: { setBonusMax: 0, setBonusPerPair: 0 },
        talents: [],
      },
    };
    window.world = {
      state: {
        residents: {},
        pairs: {},
        progress: { starterResidentId: null },
        production: {
          facilities: { "gather-yard": { residentId: null } },
          reportsReadThrough: 0,
          reports: [
            {
              reportId: 1,
              at: "2026-10-29T00:00:00Z",
              produced: { "wild-berry": 3 },
              consumed: {},
              sold: {},
              runs: 1,
              gold: 0,
            },
          ],
        },
      },
    };
    window.controller = {
      openRegister(step) {
        window.step = step;
      },
      navigate(route) {
        window.route = route;
      },
      closeSheet() {},
      readReports() {},
    };
    window.renderAssign = () =>
      document
        .querySelector("#host")
        .replaceChildren(
          window.renderAssignSheet(window.state, window.world, window.state.content, window.controller, "gather-yard"),
        );
    window.renderAssign();
  });
  await page.getByRole("button", { name: "첫 주민 맞이하기" }).click();
  assert.equal(await page.evaluate(() => window.step), 1);
  await page.evaluate(() => {
    window.world.state.residents.r = { recruited: false };
    window.renderAssign();
  });
  await page.getByRole("button", { name: "시작 주민 고르기" }).click();
  assert.equal(await page.evaluate(() => window.step), 3);
  await page.evaluate(() => {
    window.world.state.progress.starterResidentId = "r";
    window.renderAssign();
  });
  await page.getByRole("button", { name: "주민 초대하기" }).click();
  assert.equal(await page.evaluate(() => window.route), "invite");
  await page.evaluate(() =>
    document
      .querySelector("#host")
      .replaceChildren(window.workReportSheet(window.state, window.world, window.controller)),
  );
  assert.ok((await page.locator(".report-item .item-tile").count()) >= 1);
  assert.ok((await page.getByText("산딸기 +3").count()) >= 1);
  console.log("Assignment next steps and report item pictures: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
