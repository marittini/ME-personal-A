import assert from "node:assert/strict";
import { FakeHost } from "./support/forest-workshop-fake-host";
import {
  appendArchive,
  listArchive,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/store/archive-repository";

async function main() {
  const host = new FakeHost();
  const worldId = "11111111-1111-4111-8111-111111111111",
    other = "22222222-2222-4222-8222-222222222222",
    now = "2026-10-29T00:00:00.000Z";
  const letter = {
    version: 1 as const,
    worldId,
    type: "letter" as const,
    value: {
      id: "letter-1",
      eventId: "event-1",
      sender: "주민",
      title: "안녕",
      body: "숲 이야기",
      createdAt: now,
      readAt: null,
      archived: false,
    },
  };
  await Promise.all([appendArchive(host.documents, letter, now), appendArchive(host.documents, letter, now)]);
  assert.equal((await listArchive(host.documents, worldId)).length, 1);
  await assert.rejects(appendArchive(host.documents, { ...letter, value: { ...letter.value, body: "바뀐 글" } }, now));
  await appendArchive(host.documents, { ...letter, worldId: other }, now);
  assert.equal((await listArchive(host.documents, worldId)).length, 1);
  assert.equal((await listArchive(host.documents, other)).length, 1);
  await assert.rejects(
    host.persistence.transaction(async ({ documents }) => {
      await appendArchive(documents, { ...letter, value: { ...letter.value, id: "failed" } }, now);
      throw new Error("rollback");
    }),
  );
  assert.equal((await listArchive(host.documents, worldId)).length, 1);
  console.log("Archive: idempotency, conflict, world isolation and transaction rollback OK");
}
void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
