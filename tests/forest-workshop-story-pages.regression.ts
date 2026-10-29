import assert from "node:assert/strict";
import {
  paginateStoryText,
  storyTextPages,
} from "../packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop/app/story-pages";

const text = "숲에서 함께 만든 물건을 보며 이야기해요. 나무 아래에서 쉬어요. ".repeat(8) + "🌲";
const fits = (value: string) => Array.from(value).length <= 60;
const pages = paginateStoryText(text, fits);
assert.ok(pages.length > 1);
assert.equal(pages.join(""), text, "text must not be lost between pages");
assert.ok(pages.every(fits));
assert.ok(pages[0]!.includes(". "), "prefer natural boundaries");
assert.deepEqual(paginateStoryText("가".repeat(56), fits), ["가".repeat(56)]);
assert.equal(paginateStoryText("🌲".repeat(12), (value) => Array.from(value).length <= 3).join(""), "🌲".repeat(12));
const family = "👨‍👩‍👧‍👦";
assert.deepEqual(
  paginateStoryText(family.repeat(3), (value) => value.length <= family.length),
  [family, family, family],
);
assert.deepEqual(storyTextPages({ kind: "narration", text }), [text]);
assert.deepEqual(storyTextPages(undefined), []);
console.log("Story paging preserves text and uses available space: OK");
