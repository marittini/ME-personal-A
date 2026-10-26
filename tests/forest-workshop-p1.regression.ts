// Forest Workshop P1 regressions: worlds, idempotent commands, concurrency, failed saves, backup/restore, migration.
// Plan §10 P1 bar: multi-tab, retries, save failures and restore never duplicate or lose currency.
// Run: npx tsx tests/forest-workshop-p1.regression.ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FakeHost } from "./support/forest-workshop-fake-host";

import { STARTER_KIT } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/content/starter-kit";
import { FwError } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/errors";
import { stableStringify } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/ids";
import { migrateWorld } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/migrations";
import { PACKAGE_VERSION } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/package-info";
import { createBackupService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/backup-service";
import {
  MAX_COMMAND_ATTEMPTS,
  createCommandService,
  parseCommandRequest,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/command-service";
import { createWorldService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/world-service";

const WORLD = "11111111-1111-4111-8111-111111111111";
const RESTORED = "22222222-2222-4222-8222-222222222222";
let tick = 0;
const clock = () => new Date(Date.UTC(2026, 9, 26, 12, 0, tick++));

async function rejects(promise: Promise<unknown>, code: string, label: string) {
  try {
    await promise;
  } catch (error) {
    assert.ok(error instanceof FwError, `${label}: expected FwError, got ${String(error)}`);
    assert.equal(error.code, code, label);
    return;
  }
  assert.fail(`${label}: expected ${code}`);
}

function setup() {
  const host = new FakeHost();
  return {
    host,
    worlds: createWorldService(host.persistence, clock),
    commands: createCommandService(host.persistence, clock),
    backups: createBackupService(host.persistence, PACKAGE_VERSION, clock),
  };
}

async function newWorld(env: ReturnType<typeof setup>) {
  return env.worlds.create({ worldId: WORLD, worldName: "숲결 마을", playerNickname: "  공방지기  " });
}

const claim = (commandId: string, expectedRevision = 1) => ({
  worldId: WORLD,
  commandId,
  expectedRevision,
  type: "onboarding.claimStarterKit",
  payload: {},
});

/** P1 worlds hold no pictures: any picture read or store here is a test failure. */
const NO_PICTURES = {
  read: async (): Promise<Buffer> => {
    throw new Error("P1 worlds reference no pictures");
  },
  store: {
    store: async (): Promise<{ reference: string; url: string }> => {
      throw new Error("P1 backups carry no pictures");
    },
    remove: async () => undefined,
  },
};

async function main() {
  // Worlds: creation is idempotent on the world ID and normalizes text.
  {
    const env = setup();
    const created = await newWorld(env);
    assert.equal(created.created, true);
    assert.equal(created.revision, 1);
    assert.equal(created.state.settings.playerNickname, "공방지기");
    assert.equal(created.state.wallet.gold, 0);
    const again = await newWorld(env);
    assert.equal(again.created, false, "retried creation returns the same world");
    await rejects(
      env.worlds.create({ worldId: WORLD, worldName: "다른 이름", playerNickname: "공방지기" }),
      "world_exists",
      "same ID, different world",
    );
    await rejects(
      env.worlds.create({ worldId: "not-a-uuid", worldName: "a", playerNickname: "b" }),
      "invalid_request",
      "bad id",
    );
    await rejects(
      env.worlds.create({ worldId: WORLD, worldName: "   ", playerNickname: "b" }),
      "invalid_payload",
      "blank name",
    );
    assert.equal(env.host.count("fw-world"), 1);
    assert.deepEqual(
      (await env.worlds.list()).map((w) => w.worldId),
      [WORLD],
    );
    await rejects(env.worlds.get("33333333-3333-4333-8333-333333333333"), "world_not_found", "missing world");
  }

  // A command is applied once; a resend with the same ID replays the original result and grants nothing again.
  {
    const env = setup();
    await newWorld(env);
    const first = await env.commands.execute(claim("cmd-claim-0001"));
    assert.equal(first.duplicate, false);
    assert.equal(first.state.wallet.gold, STARTER_KIT.gold);
    assert.equal(first.state.inventory["wild-berry"], STARTER_KIT.items["wild-berry"]);
    assert.equal(first.revision, 2);
    const resent = await env.commands.execute(claim("cmd-claim-0001"));
    assert.equal(resent.duplicate, true);
    assert.deepEqual(resent.result, first.result);
    assert.equal(resent.state.wallet.gold, STARTER_KIT.gold, "no second grant");
    assert.equal(env.host.count("fw-command"), 1);
    // A new ID cannot claim twice either.
    await rejects(env.commands.execute(claim("cmd-claim-0002", 2)), "already_claimed", "second claim");
    // Reusing an ID for a different request is refused.
    await rejects(
      env.commands.execute({ ...claim("cmd-claim-0001"), type: "settings.update", payload: { worldName: "x" } }),
      "command_id_reused",
      "reused id",
    );
    assert.equal((await env.worlds.get(WORLD)).state.wallet.gold, STARTER_KIT.gold);
  }

  // Two tabs send the same command at the same time: exactly one grant.
  {
    const env = setup();
    await newWorld(env);
    const results = await Promise.all([1, 2, 3, 4].map(() => env.commands.execute(claim("cmd-same-tab"))));
    assert.equal(results.filter((r) => !r.duplicate).length, 1);
    assert.equal((await env.worlds.get(WORLD)).state.wallet.gold, STARTER_KIT.gold);
    assert.equal(env.host.count("fw-command"), 1);
  }

  // Two tabs claim with different IDs at the same time: one succeeds, the other is refused, gold granted once.
  {
    const env = setup();
    await newWorld(env);
    const settled = await Promise.allSettled([
      env.commands.execute(claim("cmd-tab-a-01")),
      env.commands.execute(claim("cmd-tab-b-01")),
    ]);
    assert.equal(settled.filter((s) => s.status === "fulfilled").length, 1);
    const rejected = settled.find((s) => s.status === "rejected") as PromiseRejectedResult;
    assert.equal(rejected.reason.code, "already_claimed");
    assert.equal((await env.worlds.get(WORLD)).state.wallet.gold, STARTER_KIT.gold);
  }

  // Another tab writes between our read and our write: we re-evaluate against its result.
  {
    const env = setup();
    await newWorld(env);
    let interfered = false;
    env.host.hooks.beforeUpdate = async (input, host) => {
      if (interfered || !input.id.startsWith("fw-world-")) return;
      interfered = true;
      const other = createCommandService(host.persistence, clock);
      await other.execute({
        worldId: WORLD,
        commandId: "cmd-other-tab",
        expectedRevision: 1,
        type: "settings.update",
        payload: { worldName: "다른 탭" },
      });
    };
    const result = await env.commands.execute(claim("cmd-after-race"));
    assert.equal(result.duplicate, false);
    assert.equal(result.state.settings.worldName, "다른 탭", "kept the other tab's change");
    assert.equal(result.state.wallet.gold, STARTER_KIT.gold);
    assert.equal(result.revision, 3);
    assert.equal(env.host.count("fw-command"), 2);
  }

  // Conflicts on every attempt end in save_conflict with nothing granted.
  {
    const env = setup();
    await newWorld(env);
    let writes = 0;
    env.host.hooks.beforeUpdate = async (input, host) => {
      if (!input.id.startsWith("fw-world-")) return;
      writes += 1;
      const record = await host.documents.getById(input.packageId, input.id);
      await host.documents.update({ ...input, expectedRevision: record!.revision, data: record!.data });
    };
    await rejects(env.commands.execute(claim("cmd-always-lose")), "save_conflict", "persistent conflict");
    assert.equal(writes, MAX_COMMAND_ATTEMPTS);
    env.host.hooks = {};
    const world = await env.worlds.get(WORLD);
    assert.equal(world.state.wallet.gold, 0);
    assert.equal(env.host.count("fw-command"), 0);
  }

  // The save of the command record fails: the world change is rolled back with it.
  {
    const env = setup();
    await newWorld(env);
    env.host.hooks.beforeCreate = (input) => {
      if (input.kind === "fw-command") throw new Error("disk full");
    };
    await assert.rejects(env.commands.execute(claim("cmd-disk-full")), /disk full/u);
    env.host.hooks = {};
    const world = await env.worlds.get(WORLD);
    assert.equal(world.state.wallet.gold, 0, "no gold without its record");
    assert.equal(world.revision, 1);
    // A retry of the same command after the failure succeeds once.
    const retried = await env.commands.execute(claim("cmd-disk-full"));
    assert.equal(retried.duplicate, false);
    assert.equal(retried.state.wallet.gold, STARTER_KIT.gold);
  }

  // The same command commits from another tab after our read, just before our transaction: ours replays its result.
  {
    const env = setup();
    await newWorld(env);
    env.host.hooks.beforeTransaction = async (host) => {
      await createCommandService(host.persistence, clock).execute(claim("cmd-raced"));
    };
    const result = await env.commands.execute(claim("cmd-raced"));
    assert.equal(result.duplicate, true);
    assert.equal(result.state.wallet.gold, STARTER_KIT.gold);
    assert.equal(env.host.count("fw-command"), 1);
  }

  // Settings edits refuse an outdated screen; game actions do not need one.
  {
    const env = setup();
    await newWorld(env);
    await env.commands.execute(claim("cmd-claim-x1"));
    await rejects(
      env.commands.execute({
        worldId: WORLD,
        commandId: "cmd-rename-01",
        expectedRevision: 1,
        type: "settings.update",
        payload: { playerNickname: "새 이름" },
      }),
      "stale_view",
      "stale rename",
    );
    const renamed = await env.commands.execute({
      worldId: WORLD,
      commandId: "cmd-rename-02",
      expectedRevision: 2,
      type: "settings.update",
      payload: { playerNickname: "새 이름" },
    });
    assert.equal(renamed.state.settings.playerNickname, "새 이름");
    assert.equal(renamed.state.wallet.gold, STARTER_KIT.gold);
    await rejects(
      env.commands.execute({
        worldId: WORLD,
        commandId: "cmd-rename-03",
        expectedRevision: 3,
        type: "settings.update",
        payload: {},
      }),
      "invalid_payload",
      "empty rename",
    );
    await rejects(
      env.commands.execute({
        worldId: WORLD,
        commandId: "cmd-gold-hack",
        expectedRevision: 3,
        type: "settings.update",
        payload: { gold: 999 },
      }),
      "invalid_payload",
      "client cannot set gold",
    );
    await rejects(
      env.commands.execute({ ...claim("cmd-unknown-1"), type: "wallet.add" }),
      "unknown_command",
      "unknown type",
    );
  }

  // Request parsing.
  assert.throws(
    () => parseCommandRequest({ worldId: WORLD, commandId: "cmd-abc-123", type: "x" }),
    (e: unknown) => e instanceof FwError && e.code === "invalid_request",
  );
  assert.throws(
    () => parseCommandRequest({ worldId: WORLD, commandId: "../../etc", expectedRevision: 1, type: "x" }),
    (e: unknown) => e instanceof FwError && e.code === "invalid_request",
  );

  // Backup → restore makes a new world with the same progress and leaves the original as it was.
  {
    const env = setup();
    await newWorld(env);
    await env.commands.execute(claim("cmd-claim-b1"));
    const { backup, fileName } = await env.backups.exportWorld(WORLD, NO_PICTURES.read);
    assert.match(fileName, /^forest-workshop-11111111-.*\.json$/u);
    assert.equal(backup.packageVersion, PACKAGE_VERSION);
    const json = JSON.parse(JSON.stringify(backup));
    assert.ok(!stableStringify(json).includes("fw-command"), "no command records in a backup");

    const restored = await env.backups.restore({ newWorldId: RESTORED, backup: json }, NO_PICTURES.store);
    assert.equal(restored.created, true);
    assert.equal(restored.restoredFrom, WORLD);
    assert.equal(restored.state.worldId, RESTORED);
    assert.equal(restored.state.wallet.gold, STARTER_KIT.gold);
    assert.deepEqual(restored.state.inventory, (await env.worlds.get(WORLD)).state.inventory);
    assert.equal(
      (await env.backups.restore({ newWorldId: RESTORED, backup: json }, NO_PICTURES.store)).created,
      false,
      "retried restore",
    );
    assert.equal(env.host.count("fw-world"), 2);
    // The restored world keeps the claim: a backup cannot be used to claim the starter kit again.
    await rejects(
      env.commands.execute({ ...claim("cmd-claim-b2"), worldId: RESTORED }),
      "already_claimed",
      "claim after restore",
    );

    const other = "44444444-4444-4444-8444-444444444444";
    await rejects(
      env.backups.restore(
        { newWorldId: other, backup: { ...json, world: { ...json.world, wallet: { gold: -5 } } } },
        NO_PICTURES.store,
      ),
      "invalid_backup",
      "negative gold",
    );
    await rejects(
      env.backups.restore(
        { newWorldId: other, backup: { ...json, world: { ...json.world, schemaVersion: 99 } } },
        NO_PICTURES.store,
      ),
      "unsupported_schema",
      "future schema",
    );
    await rejects(
      env.backups.restore({ newWorldId: other, backup: { ...json, assets: [{}] } }, NO_PICTURES.store),
      "invalid_backup",
      "malformed asset",
    );
    await rejects(
      env.backups.restore({ newWorldId: other, backup: { ...json, format: "something-else" } }, NO_PICTURES.store),
      "invalid_backup",
      "wrong format",
    );
    await rejects(
      env.backups.restore(
        {
          newWorldId: other,
          backup: { ...json, world: { ...json.world, inventory: { "gold-bar": 1 } } },
        },
        NO_PICTURES.store,
      ),
      "invalid_backup",
      "unknown item",
    );
    assert.equal(env.host.count("fw-world"), 2, "failed restores write nothing");
  }

  // Migration and unreadable data.
  {
    assert.throws(
      () => migrateWorld(null),
      (e: unknown) => e instanceof FwError && e.code === "corrupt_world",
    );
    assert.throws(
      () => migrateWorld({ schemaVersion: 99 }),
      (e: unknown) => e instanceof FwError && e.code === "unsupported_schema",
    );
    const env = setup();
    await newWorld(env);
    const row = [...env.host.rows.values()].find((r) => r.kind === "fw-world")!;
    row.data = { ...(row.data as object), wallet: "broken" };
    const listed = await env.worlds.list();
    assert.equal(listed[0]!.readable, false, "an unreadable world is still listed");
    await rejects(env.worlds.get(WORLD), "corrupt_world", "corrupt read");
    assert.deepEqual((row.data as { wallet: unknown }).wallet, "broken", "reading never rewrote the stored data");
  }

  // Package version stays in step with the builder.
  {
    const manifest = JSON.parse(readFileSync(join(__dirname, "../packages/forest-workshop/manifest.json"), "utf8"));
    assert.equal(manifest.version, PACKAGE_VERSION, "package-info.ts PACKAGE_VERSION matches the built manifest");
  }

  console.log("forest-workshop P1 regressions: OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
