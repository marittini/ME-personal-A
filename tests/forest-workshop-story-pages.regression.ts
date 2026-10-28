import assert from "node:assert/strict";
import { storyTextPages } from "../packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop/app/story-pages";

const longText = "숲에서 함께 만든 물건을 보며 이야기해요. ".repeat(8) + "🌲";
const pages = storyTextPages({ kind: "narration", text: longText });
assert.ok(pages.length > 1);
assert.equal(pages.join(""), longText, "text must not be lost between pages");
assert.ok(pages.every((page) => Array.from(page).length <= 52));
assert.deepEqual(storyTextPages(undefined), []);
console.log("Story text paging retains text: OK");
