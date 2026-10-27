// Forest Workshop client world gate (handoff v1.7 §1, mid-review defect 1, acceptance D "revision12 → heartbeat11",
// "A 열기 → B 열기 역순 응답"). Run: npx tsx tests/forest-workshop-client-gate.regression.ts
import assert from "node:assert/strict";
import { WorldGate } from "../packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop/app/world-gate";

const A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const gate = new WorldGate();

// A command answer at revision 12, then a heartbeat that left earlier and answers with 11: not applied.
assert.equal(gate.acceptsUpdate({ worldId: A, revision: 12 }, { worldId: A, revision: 11 }), false);
assert.equal(gate.acceptsUpdate({ worldId: A, revision: 12 }, { worldId: A, revision: 12 }), true, "same revision");
assert.equal(gate.acceptsUpdate({ worldId: A, revision: 12 }, { worldId: A, revision: 13 }), true);
// An answer for A while B is on screen, or while nothing is: never an update.
assert.equal(gate.acceptsUpdate({ worldId: B, revision: 1 }, { worldId: A, revision: 99 }), false);
assert.equal(gate.acceptsUpdate(null, { worldId: A, revision: 1 }), false);
// Open A, then open B before A answers: A's ticket is stale.
const openA = gate.beginNavigation();
const openB = gate.beginNavigation();
assert.equal(gate.isCurrentNavigation(openA), false, "A's late answer is dropped");
assert.equal(gate.isCurrentNavigation(openB), true);

console.log("forest-workshop client gate regressions: OK");
