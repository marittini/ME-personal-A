import assert from "node:assert/strict";
import { createWorldState } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/world-model";
import {
  correctMemory,
  setMemoryStatus,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/commands/memory";
import {
  sharedBy,
  knownBy,
  appendFacts,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/stories/memory";
import {
  MEMORY_LIMIT,
  type Fact,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/model/memory";
const now = "2026-10-29T00:00:00.000Z";
const state = createWorldState({
  worldId: "11111111-1111-4111-8111-111111111111",
  worldName: "숲",
  playerNickname: "테스터",
  now,
});
const fact: Fact = {
  factId: 1,
  text: "A가 혼자 본 일",
  factType: "event",
  knowerIds: ["a"],
  subjectIds: ["a"],
  visibility: "knowers",
  pairId: null,
  storyId: null,
  occurredAt: now,
  status: "active",
  supersedes: null,
};
state.memory = { facts: [fact], nextFactId: 2 };
const next = correctMemory.apply(state, { factId: 1, text: "A가 다시 확인한 일" }, { now, commandId: "correct" }).state;
assert.equal(next.memory.facts[0].status, "corrected");
assert.equal(next.memory.facts[0].text, fact.text);
assert.equal(next.memory.facts[1].supersedes, 1);
assert.deepEqual(next.memory.facts[1].knowerIds, ["a"]);
assert.equal(sharedBy(next.memory, ["a", "b"]).length, 0);
assert.equal(knownBy(next.memory, "a")[0].text, "A가 다시 확인한 일");
assert.equal(state.memory.facts[0].status, "active");
assert.throws(() => correctMemory.apply(next, { factId: 1, text: "중복 정정" }, { now, commandId: "again" }));
assert.throws(() => setMemoryStatus.apply(next, { factId: 1, active: true }, { now, commandId: "restore-old" }));
const disabled = setMemoryStatus.apply(next, { factId: 2, active: false }, { now, commandId: "off" }).state;
assert.equal(knownBy(disabled.memory, "a").length, 0);
const restored = setMemoryStatus.apply(disabled, { factId: 2, active: true }, { now, commandId: "on" }).state;
assert.equal(knownBy(restored.memory, "a").length, 1);
assert.deepEqual(JSON.parse(JSON.stringify(restored.memory)), restored.memory);
const full = {
  ...state,
  memory: {
    facts: Array.from({ length: MEMORY_LIMIT }, (_, i) => ({ ...fact, factId: i + 1 })),
    nextFactId: MEMORY_LIMIT + 1,
  },
};
assert.throws(() => correctMemory.apply(full, { factId: 1, text: "overflow" }, { now, commandId: "full" }));
assert.throws(() => appendFacts(full.memory, [{ ...fact }]));
assert.equal(full.memory.facts.length, MEMORY_LIMIT);
assert.equal(correctMemory.payloadSchema.safeParse({ factId: 1, text: " ", knowerIds: ["b"] }).success, false);
console.log("Memory correction history, scope, disable/restore and capacity: OK");
