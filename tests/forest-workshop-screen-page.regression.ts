import assert from "node:assert/strict";
import { screenPageKey } from "../packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop/app/screen-page";

const residentsView = { tab: "all" as const, query: "", filter: "all" as const, selectedId: null };
const work = { facilityId: "gather-yard", drafts: {}, selected: {}, queueRecipe: {} };
const state = { route: "residents" as const, residentsView, work, facilitiesTab: "facilities" as const };
assert.equal(screenPageKey(state), screenPageKey({ ...state, residentsView: { ...residentsView, query: "a" } }));
assert.notEqual(screenPageKey(state), screenPageKey({ ...state, residentsView: { ...residentsView, page: 1 } }));
assert.equal(
  screenPageKey(state),
  screenPageKey({ ...state, residentsView: { ...residentsView, selectedId: "a", detailOpen: true } }),
);
const workState = { ...state, route: "work" as const };
assert.notEqual(screenPageKey(workState), screenPageKey({ ...workState, work: { ...work, section: "recipe" } }));
assert.notEqual(screenPageKey(workState), screenPageKey({ ...workState, work: { ...work, facilityId: "other" } }));
console.log("Screen page scroll keys: OK");
