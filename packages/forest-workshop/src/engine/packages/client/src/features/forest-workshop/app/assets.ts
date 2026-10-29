// Forest Workshop art (packages/forest-workshop/assets, handoff v1.7 §8). One place knows every path and builds every
// URL: the Engine serves an active package's files at /api/capability-packages/<id>/assets/<path>, and the pack's
// files live under assets/, so the URL carries "assets" twice. Nothing here preloads: an image is requested only when
// a screen draws it (lists use loading="lazy"; only the current season's backgrounds are ever referenced).
// A file that fails to load is replaced by the drawn icon the caller passes, and is not requested again this session.
// tests/forest-workshop-assets.regression.ts checks these maps against asset-manifest.json and the files on disk.
import type { Emotion, FacilityDefinition } from "./types";

const PACKAGE_ID = "forest-workshop";
const ROOT = `/api/capability-packages/${PACKAGE_ID}/assets/assets/`;

export type Season = "spring" | "summer" | "autumn" | "winter";
export const SEASONS: readonly Season[] = ["spring", "summer", "autumn", "winter"];

/** Item IDs that have their own picture (items/<id>.webp). Every item of the content has one. */
export const ITEM_ART: ReadonlySet<string> = new Set([
  "wild-berry",
  "herb",
  "wood",
  "pinecone",
  "acorn",
  "wheat",
  "flower",
  "pumpkin",
  "cotton",
  "tea-leaf",
  "honey",
  "mushroom",
  "beeswax",
  "feather",
  "clover",
  "berry-jam",
  "dried-herb",
  "flour",
  "plank",
  "thread",
  "herb-tea",
  "pumpkin-puree",
  "acorn-flour",
  "herb-sachet",
  "berry-pie",
  "wooden-tray",
  "beeswax-candle",
  "knit-scarf",
  "flower-wreath",
  "pumpkin-soup",
  "honey-cake",
  "birdhouse",
  "acorn-cookie",
  "tea-gift",
  "apple",
  "reed",
  "carrot",
  "flax",
  "clay",
  "salt",
  "dried-apple",
  "apple-jam",
  "linen",
  "reed-cord",
  "prepared-clay",
  "herb-salt",
  "apple-bread",
  "carrot-potage",
  "mushroom-skewer",
  "linen-handkerchief",
  "herb-pillow",
  "reed-basket",
  "wooden-spoon",
  "desk-organizer",
  "clay-planter",
  "wind-chime",
  "apple-gift",
  "picnic-wrap",
]);

export const FACILITY_ART: Readonly<Record<string, string>> = {
  "gather-yard": "facilities/gather-yard.webp",
  "grow-plot": "facilities/grow-plot.webp",
  "survey-desk": "facilities/survey-desk.webp",
  "process-bench": "facilities/process-bench.webp",
  "craft-bench": "facilities/craft-bench.webp",
};

/** base: the full portrait backdrop of a screen · scene: the home workshop scene the residents stand in. */
export const BACKGROUND_ART: Readonly<Record<Season, { base: string; scene: string }>> = {
  spring: { base: "backgrounds/workshop-base-spring.webp", scene: "backgrounds/workshop-scene-spring.webp" },
  summer: { base: "backgrounds/workshop-base-summer.webp", scene: "backgrounds/workshop-scene-summer.webp" },
  autumn: { base: "backgrounds/workshop-base-autumn.webp", scene: "backgrounds/workshop-scene-autumn.webp" },
  winter: { base: "backgrounds/workshop-base-winter.webp", scene: "backgrounds/workshop-scene-winter.webp" },
};

/** The six agreed emotion marks (plan §8). "none" has no mark. */
export const EMOTION_ART: Readonly<Record<Exclude<Emotion, "none">, string>> = {
  joy: "emotions/joy.webp",
  affection: "emotions/affection.webp",
  curiosity: "emotions/curiosity.webp",
  fluster: "emotions/fluster.webp",
  inspiration: "emotions/inspiration.webp",
  annoyance: "emotions/annoyance.webp",
};

/** Illustrated bottom navigation icons; their corresponding SVG remains the fallback. */
export const NAV_ART = {
  home: "ui/nav-home.webp",
  work: "ui/nav-work.webp",
  explore: "ui/nav-explore.webp",
  residents: "ui/nav-residents.webp",
  invite: "ui/nav-invite.webp",
} as const;

export const UI_ART = {
  gift: "ui/gift.webp",
  letterPaper: "ui/letter-paper.webp",
  storyVignette: "ui/story-vignette.webp",
  inviteScene: "ui/invite-scene.webp",
  trail: "backgrounds/forest-trail.webp",
  interior: "backgrounds/workshop-interior.webp",
  titleSign: "ui/title-sign.webp",
  primaryButton: "ui/primary-button.webp",
  paperPanel: "ui/paper-panel.webp",
  woodPanel: "ui/wood-panel.webp",
} as const;

export function assetUrl(path: string): string {
  return `${ROOT}${path}`;
}

export function itemArtPath(itemId: string): string | null {
  return ITEM_ART.has(itemId) ? `items/${itemId}.webp` : null;
}

export function facilityArtPath(facility: Pick<FacilityDefinition, "id">): string | null {
  return FACILITY_ART[facility.id] ?? null;
}

const failed = new Set<string>();

/**
 * An <img> for a pack file; if it cannot load (missing file, wrong path, offline), `fallback()` takes its place, and
 * later calls for the same file go straight to the fallback. Decorative by default (alt="").
 */
export function assetImage(
  path: string | null,
  options: { className: string; fallback: () => Element; lazy?: boolean; alt?: string },
): Element {
  if (!path || failed.has(path)) return options.fallback();
  const image = document.createElement("img");
  image.className = options.className;
  image.alt = options.alt ?? "";
  image.decoding = "async";
  image.draggable = false;
  if (options.lazy) image.loading = "lazy";
  image.addEventListener(
    "error",
    () => {
      failed.add(path);
      image.replaceWith(options.fallback());
    },
    { once: true },
  );
  image.src = assetUrl(path);
  return image;
}

/** CSS url() for a pack file (backgrounds and nine-slice panels). A failed CSS image leaves the flat colour beneath. */
export function cssAssetUrl(path: string): string {
  return `url("${assetUrl(path)}")`;
}

const probes = new Map<string, Promise<boolean>>();

/**
 * Loads one pack file once and says whether it arrived. CSS art (season backdrops, nine-slice panels, the sign) is
 * switched on with a class only after this resolves true, so a missing file leaves the drawn CSS look instead of an
 * empty or transparent box.
 */
export function probeAsset(path: string): Promise<boolean> {
  let probe = probes.get(path);
  if (!probe) {
    probe = new Promise<boolean>((resolve) => {
      if (failed.has(path)) return resolve(false);
      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve(true);
      image.onerror = () => {
        failed.add(path);
        resolve(false);
      };
      image.src = assetUrl(path);
    });
    probes.set(path, probe);
  }
  return probe;
}

/** The frame art a screen in `season` uses, with the shell class that turns each one on. */
export function frameArt(season: Season): Array<{ path: string; flag: string }> {
  return [
    { path: BACKGROUND_ART[season].base, flag: "art-base" },
    { path: UI_ART.titleSign, flag: "art-sign" },
    { path: UI_ART.primaryButton, flag: "art-button" },
    { path: UI_ART.paperPanel, flag: "art-paper" },
  ];
}
