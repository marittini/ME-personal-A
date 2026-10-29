import assert from "node:assert/strict";
import { FakeHost } from "./support/forest-workshop-fake-host";
import { createWorldService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/world-service";
import { createCommandService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/command-service";
import { createBackupService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/backup-service";
import { migrateWorld } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/migrations";
import { mailboxSchema } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/model/mailbox";
async function main() {
  const host = new FakeHost(),
    clock = () => new Date("2026-10-29T00:00:00Z");
  const worlds = createWorldService(host.persistence, clock),
    commands = createCommandService(host.persistence, clock),
    backups = createBackupService(host.persistence, "test", clock);
  const worldId = "11111111-1111-4111-8111-111111111111",
    restoredId = "22222222-2222-4222-8222-222222222222";
  const created = await worlds.create({ worldId, worldName: "공방", playerNickname: "테스터" });
  assert.equal(created.state.mailbox.letters.length, 1);
  assert.equal(
    (await worlds.create({ worldId, worldName: "공방", playerNickname: "테스터" })).state.mailbox.letters.length,
    1,
  );
  const request = {
    worldId,
    commandId: "mail-read-0001",
    expectedRevision: created.revision,
    type: "mail.read",
    payload: { id: "welcome-v1" },
  };
  const read = await commands.execute(request);
  assert.ok(read.state.mailbox.letters[0].readAt);
  assert.equal((await commands.execute(request)).duplicate, true);
  const archived = await commands.execute({
    ...request,
    commandId: "mail-archive-0001",
    expectedRevision: read.revision,
    type: "mail.archive",
    payload: { id: "welcome-v1", archived: true },
  });
  assert.equal(archived.state.mailbox.letters[0].archived, true);
  assert.deepEqual(archived.state.wallet, created.state.wallet);
  const { backup } = await backups.exportWorld(worldId, async () => {
    throw new Error("no pictures");
  });
  const restored = await backups.restore(
    { newWorldId: restoredId, backup: JSON.parse(JSON.stringify(backup)) },
    {
      store: async () => {
        throw new Error("no pictures");
      },
      remove: async () => {},
    },
  );
  assert.deepEqual(restored.state.mailbox, archived.state.mailbox);
  assert.equal(
    (
      await backups.restore(
        { newWorldId: restoredId, backup },
        {
          store: async () => {
            throw new Error("no pictures");
          },
          remove: async () => {},
        },
      )
    ).created,
    false,
  );
  const old = JSON.parse(JSON.stringify(created.state));
  old.schemaVersion = 9;
  delete old.mailbox;
  assert.equal(migrateWorld(old).mailbox.letters.length, 1);
  assert.equal(
    mailboxSchema.safeParse({ letters: [created.state.mailbox.letters[0], created.state.mailbox.letters[0]] }).success,
    false,
  );
  console.log("Mail welcome deduplication, read/archive, no rewards, migration and backup restore: OK");
}
void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
