// Forest Workshop art pack (handoff v1.7 §8, ASSET_APPLY_GUIDE). The client's one asset map (app/assets.ts) must agree
// with assets/asset-manifest.json, every mapped file must exist with the manifest's size and SHA-256, the builder's
// asset-paths.json must ship every picture, and every content item must have its picture.
// Run: npx tsx tests/forest-workshop-assets.regression.ts
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  BACKGROUND_ART,
  EMOTION_ART,
  FACILITY_ART,
  ITEM_ART,
  SEASONS,
  UI_ART,
  assetUrl,
  frameArt,
  itemArtPath,
} from "../packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop/app/assets";
import {
  resolveSeason,
  seasonForDate,
} from "../packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop/app/season";
import { ITEMS } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/content/items";
import { FACILITIES } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/content/production";
import { EMOTIONS } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/model/story-document";

const ROOT = join(import.meta.dirname, "../packages/forest-workshop/assets");
interface Entry {
  path: string;
  bytes: number;
  sha256: string;
  hasTransparency: boolean;
}
const manifest = JSON.parse(readFileSync(join(ROOT, "asset-manifest.json"), "utf8")) as {
  assets: Record<string, Entry>;
  itemMap: Record<string, string>;
  facilityMap: Record<string, string>;
  backgroundMap: Record<string, { base: string; scene: string }>;
  uiMap: Record<string, string>;
};
const byPath = new Map(Object.values(manifest.assets).map((entry) => [entry.path, entry]));
const keyPath = (key: string) => manifest.assets[key]?.path;

// 1. Every file on disk is in the manifest and matches it byte for byte; 82 pictures in all.
const files = readdirSync(ROOT, { recursive: true, encoding: "utf8" }).filter((file) => file.endsWith(".webp"));
assert.equal(files.length, 82, "82 WebP pictures");
assert.equal(byPath.size, 82, "the manifest lists 82 pictures");
for (const file of files) {
  const entry = byPath.get(file);
  assert.ok(entry, `${file} is in the manifest`);
  const bytes = readFileSync(join(ROOT, file));
  assert.equal(bytes.length, entry.bytes, `${file} size`);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), entry.sha256, `${file} sha256`);
  assert.equal(bytes.subarray(8, 12).toString("latin1"), "WEBP", `${file} is WebP`);
}

// 2. The client map agrees with the manifest maps.
assert.deepEqual([...ITEM_ART].sort(), Object.keys(manifest.itemMap).sort(), "58 item pictures");
for (const id of ITEM_ART) {
  assert.equal(itemArtPath(id), keyPath(manifest.itemMap[id]!), `item ${id}`);
  assert.ok(byPath.get(itemArtPath(id)!)?.hasTransparency, `item ${id} is transparent`);
}
assert.equal(itemArtPath("no-such-item"), null, "an unknown item has no picture (drawn icon instead)");
assert.deepEqual(
  Object.fromEntries(Object.entries(FACILITY_ART)),
  Object.fromEntries(Object.entries(manifest.facilityMap).map(([id, key]) => [id, keyPath(key)])),
  "facility pictures",
);
for (const season of SEASONS) {
  const mapped = manifest.backgroundMap[season]!;
  assert.deepEqual(BACKGROUND_ART[season], { base: keyPath(mapped.base), scene: keyPath(mapped.scene) }, season);
}
assert.equal(UI_ART.gift, keyPath(manifest.uiMap.gift!), "gift action icon");
for (const path of [...Object.values(UI_ART), ...Object.values(EMOTION_ART)]) assert.ok(byPath.has(path), path);
assert.deepEqual(
  Object.keys(EMOTION_ART).sort(),
  EMOTIONS.filter((emotion) => emotion !== "none").sort(),
  "one emotion picture per scene emotion the server accepts",
);

// 3. Every content item and facility has its picture.
for (const item of ITEMS) assert.ok(ITEM_ART.has(item.id), `item ${item.id} has a picture`);
for (const facility of FACILITIES) assert.ok(FACILITY_ART[facility.id], `facility ${facility.id} has a picture`);

// 4. The builder ships every picture (package-root paths, no source notes needed at runtime).
const shipped = JSON.parse(readFileSync(join(ROOT, "asset-paths.json"), "utf8")) as string[];
for (const file of files) assert.ok(shipped.includes(`assets/${file}`), `asset-paths.json ships ${file}`);
const builtManifest = join(ROOT, "../manifest.json");
if (statSync(builtManifest, { throwIfNoEntry: false })) {
  const built = JSON.parse(readFileSync(builtManifest, "utf8")) as {
    files?: Array<{ path: string }>;
    contributions?: { assets?: { paths?: string[] } };
  };
  const builtPaths = new Set((built.files ?? []).map((file) => file.path));
  // The Engine serves a package file at /assets/* only when contributions.assets.paths declares it.
  const servable = new Set(built.contributions?.assets?.paths ?? []);
  for (const file of files) {
    assert.ok(builtPaths.has(`assets/${file}`), `the built package carries ${file}`);
    assert.ok(servable.has(`assets/${file}`), `the built package declares ${file} servable`);
  }
}

// 5. One URL shape, under the Engine's package asset route.
assert.equal(assetUrl("items/apple.webp"), "/api/capability-packages/forest-workshop/assets/assets/items/apple.webp");

// 6. Seasons: auto follows the month (northern hemisphere); a chosen season wins. Frame art is one season only.
assert.equal(seasonForDate(new Date("2026-04-10T12:00:00Z")), "spring");
assert.equal(seasonForDate(new Date("2026-07-10T12:00:00Z")), "summer");
assert.equal(seasonForDate(new Date("2026-10-27T12:00:00Z")), "autumn");
assert.equal(seasonForDate(new Date("2026-01-10T12:00:00Z")), "winter");
assert.equal(resolveSeason("winter", new Date("2026-07-10T12:00:00Z")), "winter");
assert.equal(resolveSeason("auto", new Date("2026-07-10T12:00:00Z")), "summer");
for (const season of SEASONS) {
  const paths = frameArt(season).map((art) => art.path);
  const backgrounds = paths.filter((path) => path.startsWith("backgrounds/"));
  assert.deepEqual(backgrounds, [BACKGROUND_ART[season].base], `${season} frame asks for its own backdrop only`);
}

console.log("forest-workshop asset regressions: OK");
