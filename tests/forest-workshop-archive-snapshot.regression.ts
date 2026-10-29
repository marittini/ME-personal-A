import assert from "node:assert/strict";
import { FakeHost } from "./support/forest-workshop-fake-host";
import { createWorldService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/world-service";
import { snapshotWorldHistory } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/archive-snapshot-service";
import {
  loadWorld,
  updateWorldDocument,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/store/world-repository";
import { listArchive } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/store/archive-repository";

async function main() {
  const host = new FakeHost();
  const now = "2026-10-29T00:00:00.000Z";
  const worldId = "11111111-1111-4111-8111-111111111111";
  const worlds = createWorldService(host.persistence, () => new Date(now));
  await worlds.create({ worldId, worldName: "숲", playerNickname: "테스터" });
  const stored = await loadWorld(host.documents, worldId);
  const extra = { ...stored.state.mailbox.letters[0]!, id: "second", eventId: "second" };
  await updateWorldDocument(
    host.documents,
    stored,
    { ...stored.state, mailbox: { letters: [...stored.state.mailbox.letters, extra] } },
    now,
  );
  const before = await worlds.get(worldId);
  let writes = 0;
  host.hooks.beforeCreate = (input) => {
    if (input.kind === "fw-history" && ++writes === 2) throw new Error("storage failure");
  };
  await assert.rejects(snapshotWorldHistory(host.persistence, worldId, now));
  assert.deepEqual(await listArchive(host.documents, worldId), []);
  assert.deepEqual((await worlds.get(worldId)).state, before.state);
  host.hooks.beforeCreate = undefined;
  const result = await snapshotWorldHistory(host.persistence, worldId, now);
  assert.equal(result.letters, 2);
  assert.equal((await listArchive(host.documents, worldId)).length, 2);
  assert.deepEqual((await worlds.get(worldId)).state, before.state);
  await snapshotWorldHistory(host.persistence, worldId, now);
  assert.equal((await listArchive(host.documents, worldId)).length, 2);
  console.log("Archive snapshot: rollback, original preservation and retry OK");
}
void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
