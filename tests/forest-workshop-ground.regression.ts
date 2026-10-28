import assert from "node:assert/strict";
import {
  createWorldState,
  DEFAULT_GROUND,
  groundSchema,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/world-model";
import { migrateWorld } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/migrations";
import { updateSettings } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/commands/settings";
const state = createWorldState({
  worldId: "11111111-1111-4111-8111-111111111111",
  worldName: "공방",
  playerNickname: "주민",
  now: "2026-10-28T00:00:00.000Z",
});
const old = JSON.parse(JSON.stringify(state));
old.schemaVersion = 7;
delete old.settings.ground;
assert.deepEqual(migrateWorld(old).settings.ground, DEFAULT_GROUND);
const ground = { left: 20, right: 80, top: 60, bottom: 85 };
const next = updateSettings.apply(state, { ground }, { now: state.createdAt, commandId: "ground" }).state;
assert.deepEqual(next.settings.ground, ground);
assert.equal(next.settings.worldName, state.settings.worldName);
assert.deepEqual(migrateWorld(JSON.parse(JSON.stringify(next))).settings.ground, ground);
assert.deepEqual(state.settings.ground, DEFAULT_GROUND);
assert.equal(groundSchema.safeParse({ ...ground, right: 21 }).success, false);
assert.equal(groundSchema.safeParse({ ...ground, top: 86 }).success, false);
assert.equal(groundSchema.safeParse({ ...ground, left: -1 }).success, false);
assert.equal(groundSchema.safeParse({ ...ground, left: NaN }).success, false);
console.log("Ground migration, validation and serialization: OK");
