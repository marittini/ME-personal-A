// Stored worlds are upgraded one schema version at a time when they are read (plan §6: sequential migration; on
// failure the original stays untouched and the player is told how to restore). Migration never writes by itself:
// the upgraded state is saved only by the next successful command, so a failed read changes nothing on disk.
import { FwError } from "./errors";
import { STARTER_KIT } from "../content/starter-kit";
import { FACILITIES } from "../content/production";
import { initialInvite } from "./model/invite";
import { initialFacility, initialProduction } from "./production/initial";
import { assignTalent, type SourceText } from "./residents/talent-assign";
import type { FieldId } from "../content/production";
import { CURRENT_SCHEMA_VERSION, worldStateSchema, type WorldState } from "./world-model";

type RawWorld = Record<string, unknown>;

/** `MIGRATIONS[n]` turns a version-n document into version n+1. Add one entry per schema bump; never edit old ones. */
const MIGRATIONS: Readonly<Record<number, (world: RawWorld) => RawWorld>> = {
  // v1 → v2 (P2): residents and pairs arrive, empty; no starting resident chosen yet.
  1: (world) => ({
    ...world,
    schemaVersion: 2,
    progress: { ...(world.progress as RawWorld), starterResidentId: null },
    residents: {},
    pairs: {},
  }),
  // v2 → v3: a pair is any two residents, stored as an ascending couple (it was character × persona).
  2: (world) => ({
    ...world,
    schemaVersion: 3,
    pairs: Object.fromEntries(
      Object.entries((world.pairs ?? {}) as Record<string, RawWorld>).map(([id, pair]) => {
        const { characterResidentId, personaResidentId, ...rest } = pair;
        const ids = [String(characterResidentId), String(personaResidentId)].sort();
        return [id, { ...rest, residentIds: ids }];
      }),
    ),
  }),
  // v3 → v4 (P3): production starts with level-1 facilities and the recommended rules. Time starts counting at the
  // first settlement after the upgrade, so no time before it is credited.
  3: (world) => ({ ...world, schemaVersion: 4, production: initialProduction(String(world.worldId)) }),
  // v4 → v5 (P3b): fields and 돌파 on residents (none chosen yet), every facility of the content (the new ones closed
  // until their 해금), 자동 운영 kept as it was with an empty 지정 횟수 queue, 자동 판매 off, 초대 and 납품 empty.
  // Worlds that already claimed the starter kit get the 초대권 the kit now includes, once, here.
  4: (world) => {
    const production = world.production as RawWorld;
    const worldId = String(world.worldId);
    const facilities = production.facilities as Record<string, RawWorld>;
    const progress = world.progress as RawWorld;
    const wallet = world.wallet as RawWorld;
    return {
      ...world,
      schemaVersion: 5,
      wallet: { ...wallet, tickets: progress.starterKitClaimed ? STARTER_KIT.tickets : 0, tokens: 0 },
      residents: Object.fromEntries(
        Object.entries((world.residents ?? {}) as Record<string, RawWorld>).map(([id, resident]) => [
          id,
          { ...resident, field: null, breakthrough: 0 },
        ]),
      ),
      production: {
        ...production,
        facilities: Object.fromEntries(
          FACILITIES.map((definition) => {
            const old = facilities[definition.id];
            if (!old) return [definition.id, initialFacility(worldId, definition.id)];
            const job = old.job as RawWorld | null;
            return [
              definition.id,
              {
                ...old,
                // A v3 world reaches here through step 3, which already builds today's facility shape.
                unlocked: typeof old.unlocked === "boolean" ? old.unlocked : true,
                queue: old.queue ?? [],
                residentId: old.residentId ?? null,
                job: job ? { source: "rule", ...job } : null,
              },
            ];
          }),
        ),
        autoSell: {},
        sales: { day: null, sold: {} },
        made: {},
        reports: ((production.reports ?? []) as RawWorld[]).map((report) => ({ sold: {}, gold: 0, ...report })),
      },
      invite: initialInvite(),
      deliveries: { day: null, done: [] },
    };
  },
  // v5 → v6: every resident gets the field and talent a registration now decides. A field the player already chose in
  // v5 is kept; otherwise it is read from the stored source snapshot, the same way a new registration does.
  5: (world) => ({
    ...world,
    schemaVersion: 6,
    residents: Object.fromEntries(
      Object.entries((world.residents ?? {}) as Record<string, RawWorld>).map(([id, resident]) => {
        const talent = assignTalent(
          String(world.worldId),
          String(resident.kind),
          String(resident.sourceId),
          resident.source as SourceText,
          (resident.field as FieldId | null) ?? undefined,
        );
        return [id, { ...resident, field: talent.field, talentId: talent.talentId }];
      }),
    ),
  }),
  // v6 → v7 (P4): no stories or memories yet; every resident starts at trust 0.
  6: (world) => ({
    ...world,
    schemaVersion: 7,
    residents: Object.fromEntries(
      Object.entries((world.residents ?? {}) as Record<string, RawWorld>).map(([id, resident]) => [
        id,
        { ...resident, trust: 0 },
      ]),
    ),
    stories: { pairs: {}, expedition: null },
    memory: { facts: [], nextFactId: 1 },
  }),
};

export function migrateWorld(raw: unknown): WorldState {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new FwError("corrupt_world");
  let world = raw as RawWorld;
  let version = world.schemaVersion;
  if (typeof version !== "number" || !Number.isInteger(version) || version < 1) throw new FwError("corrupt_world");
  if (version > CURRENT_SCHEMA_VERSION) {
    throw new FwError("unsupported_schema", { details: { schemaVersion: version } });
  }
  while (version < CURRENT_SCHEMA_VERSION) {
    const step = MIGRATIONS[version];
    if (!step) throw new FwError("corrupt_world", { details: { missingMigrationFrom: version } });
    world = step(structuredClone(world));
    version += 1;
    if (world.schemaVersion !== version)
      throw new FwError("corrupt_world", { details: { brokenMigrationTo: version } });
  }
  const parsed = worldStateSchema.safeParse(world);
  if (!parsed.success) {
    throw new FwError("corrupt_world", {
      details: { issues: parsed.error.issues.slice(0, 5).map((i) => i.path.join(".")) },
    });
  }
  return parsed.data;
}
