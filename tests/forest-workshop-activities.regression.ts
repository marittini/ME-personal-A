import assert from "node:assert/strict";
import { createResidentLetterService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/resident-letter-service";
import { saveResidentLetter } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/commands/mailbox";
import { settleActivities } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/activities";
import { createWorldDocument } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/store/world-repository";
import { FakeHost } from "./support/forest-workshop-fake-host";
import { createWorldService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/world-service";
import { createCommandService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/command-service";
import { createSettlementService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/settlement-service";
import { createBackupService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/backup-service";
async function main() {
  const host = new FakeHost(),
    start = Date.parse("2026-10-29T00:00:00Z");
  let now = start,
    seq = 0;
  const clock = () => new Date(now),
    worldId = "11111111-1111-4111-8111-111111111111",
    residentId = "22222222-2222-4222-8222-222222222222",
    other = "33333333-3333-4333-8333-333333333333",
    pairId = "44444444-4444-4444-8444-444444444444",
    id = "55555555-5555-4555-8555-555555555555";
  const worlds = createWorldService(host.persistence, clock),
    settlement = createSettlementService(host.persistence, clock);
  const commands = createCommandService(host.persistence, clock, {
    readSource: async (_kind, sourceId, at) => ({
      name: sourceId,
      description: "숲 주민",
      personality: "차분함",
      scenario: "",
      sourceHash: "1".repeat(64),
      takenAt: at,
    }),
  });
  const run = async (type: string, payload: unknown) =>
    commands.execute({
      worldId,
      commandId: `activity-test-${seq++}`,
      expectedRevision: (await worlds.get(worldId)).revision,
      type,
      payload,
    });
  await worlds.create({ worldId, worldName: "공방", playerNickname: "테스터" });
  await run("onboarding.claimStarterKit", {});
  for (const [index, r] of [residentId, other].entries())
    await run("residents.register", {
      residentId: r,
      source: { kind: "character", id: `source${index}` },
      worldSetting: "숲의 이웃",
    });
  await run("residents.chooseStarter", { residentId });
  await run("pairs.add", { pairId, residentIds: [residentId, other] });
  await run("production.assignResident", { facilityId: "gather-yard", residentId });
  const before = (await worlds.get(worldId)).state;
  await run("activities.start", { id, kind: "survey", placeId: "workshop-edge", residentId });
  const started = (await worlds.get(worldId)).state;
  assert.equal(started.production.facilities["gather-yard"].residentId, null);
  assert.deepEqual(started.production.facilities["gather-yard"].job, before.production.facilities["gather-yard"].job);
  await assert.rejects(run("production.assignResident", { facilityId: "gather-yard", residentId }), {
    code: "resident_busy",
  });
  await assert.rejects(run("stories.depart", { pairId, episode: 0 }), { code: "resident_busy" });
  await assert.rejects(run("activities.start", { id: other, kind: "patrol", placeId: "workshop-edge", residentId }), {
    code: "resident_busy",
  });
  now = start + 29 * 60000;
  assert.ok((await settlement.settle(worldId, { active: false })).state.activities.running);
  now = start + 30 * 60000;
  const completed = (await settlement.settle(worldId, { active: false })).state;
  assert.equal(completed.activities.running, null);
  assert.equal(completed.activities.completed.length, 1);
  assert.equal(completed.mailbox.letters.filter((l) => l.eventId === `activity-${id}`).length, 1);
  const again = (await settlement.settle(worldId, { active: false })).state;
  assert.equal(again.activities.completed.length, 1);
  assert.deepEqual(completed.wallet, before.wallet);
  await run("activities.start", { id: other, kind: "patrol", placeId: "workshop-edge", residentId });
  await run("activities.cancel", { id: other });
  now += 60 * 60000;
  assert.equal((await settlement.settle(worldId, { active: false })).state.activities.completed.length, 1);
  const failingLetters = createResidentLetterService(
    {
      languageModels: {
        resolve: async () => ({
          connectionId: "fail",
          model: "test",
          maxContext: 8000,
          maxOutputTokens: 1000,
          fitContext: (messages) => ({ messages, estimatedTokensBefore: 10, estimatedTokensAfter: 10, trimmed: false }),
          chatComplete: async () => {
            throw new Error("offline");
          },
        }),
      },
    },
    host.persistence,
    commands,
  );
  let missingConnection: string | null | undefined;
  const unavailableLetters = createResidentLetterService(
    {
      languageModels: {
        resolve: async (id) => {
          missingConnection = id;
          throw new Error("missing connection");
        },
      },
    },
    host.persistence,
    commands,
  );
  await assert.rejects(unavailableLetters.generate({ worldId, activityId: id, connectionId: "missing-model" }), {
    code: "lm_unavailable",
  });
  assert.equal(missingConnection, "missing-model");
  const beforeFailedLetter = (await worlds.get(worldId)).state;
  await assert.rejects(failingLetters.generate({ worldId, activityId: id }), { code: "generation_failed" });
  const afterFailedLetter = (await worlds.get(worldId)).state;
  assert.deepEqual(afterFailedLetter.mailbox, beforeFailedLetter.mailbox);
  assert.deepEqual(afterFailedLetter.activities, beforeFailedLetter.activities);
  assert.deepEqual(afterFailedLetter.wallet, beforeFailedLetter.wallet);
  const filling = Array.from({ length: 197 }, (_, i) => ({
    ...completed.mailbox.letters[0]!,
    id: `fill-${i}`,
    eventId: `fill-${i}`,
  }));
  const almostFull = {
    ...completed,
    activities: { ...completed.activities, running: started.activities.running },
    mailbox: { letters: [...completed.mailbox.letters, ...filling] },
  };
  assert.equal(almostFull.mailbox.letters.length, 199);
  const payload = { activityId: id, title: "편지", body: "안녕" };
  const context = { now: clock().toISOString(), commandId: "capacity-check" };
  assert.throws(() => saveResidentLetter.apply(almostFull, payload, context), { code: "invalid_payload" });
  const capacityHost = new FakeHost();
  await createWorldDocument(capacityHost.persistence.documents, almostFull, clock().toISOString(), "capacity test");
  let capacityModelCalls = 0;
  const capacityService = createResidentLetterService(
    {
      languageModels: {
        resolve: async () => {
          capacityModelCalls++;
          throw new Error("must not call");
        },
      },
    },
    capacityHost.persistence,
    createCommandService(capacityHost.persistence, clock),
  );
  await assert.rejects(capacityService.generate({ worldId, activityId: id }), { code: "invalid_payload" });
  assert.equal(capacityModelCalls, 0, "capacity is checked before a model call");
  const space = { ...almostFull, mailbox: { letters: almostFull.mailbox.letters.slice(1) } };
  const saved = saveResidentLetter.apply(space, payload, context).state;
  assert.equal(saved.mailbox.letters.length, 199);
  const finished = settleActivities(
    { ...saved, production: { ...saved.production, simMs: saved.activities.running!.endsSim } },
    clock().toISOString(),
  );
  assert.equal(finished.mailbox.letters.length, 200, "activity can finish using reserved slot");
  assert.equal(finished.activities.running, null);
  let calls = 0;
  let connection: string | null | undefined;
  const letters = createResidentLetterService(
    {
      languageModels: {
        resolve: async (id) => {
          connection = id;
          return {
            connectionId: id ?? "default",
            model: "test",
            maxContext: 8000,
            maxOutputTokens: 1000,
            fitContext: (messages) => ({
              messages,
              estimatedTokensBefore: 10,
              estimatedTokensAfter: 10,
              trimmed: false,
            }),
            chatComplete: async () => {
              calls++;
              return { content: JSON.stringify({ title: "숲에서 온 편지", body: "공방 주변을 살펴봤어요." }) };
            },
          };
        },
      },
    },
    host.persistence,
    commands,
  );
  const request = { worldId, activityId: id, connectionId: "letter-model" };
  const [letterOne, letterTwo] = await Promise.all([letters.generate(request), letters.generate(request)]);
  assert.equal(calls, 1);
  assert.equal(connection, "letter-model");
  assert.equal(letterOne.result.id, `resident-${id}`);
  assert.equal(letterTwo.result.id, letterOne.result.id);
  assert.equal((await letters.generate(request)).duplicate, true);
  assert.equal(calls, 1);
  await assert.rejects(run("mail.saveResidentLetter", { activityId: id, title: "x", body: "x" }), {
    code: "unknown_command",
  });
  assert.equal(
    (await worlds.get(worldId)).state.mailbox.letters.filter((item) => item.id === `resident-${id}`).length,
    1,
  );
  const backups = createBackupService(host.persistence, "test", clock);
  const { backup } = await backups.exportWorld(worldId, async () => {
    throw new Error("no assets");
  });
  const restored = await backups.restore(
    { newWorldId: "66666666-6666-4666-8666-666666666666", backup },
    {
      store: async () => {
        throw new Error("no assets");
      },
      remove: async () => {},
    },
  );
  assert.deepEqual(restored.state.activities.completed, again.activities.completed);
  assert.equal(
    restored.state.mailbox.letters.find((item) => item.id === `resident-${id}`)?.body,
    "공방 주변을 살펴봤어요.",
  );
  console.log("Activity timing, resident conflicts, cancellation, single result/mail and backup: OK");
}
void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
