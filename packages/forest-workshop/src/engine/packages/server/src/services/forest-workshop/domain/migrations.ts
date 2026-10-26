// Stored worlds are upgraded one schema version at a time when they are read (plan §6: sequential migration; on
// failure the original stays untouched and the player is told how to restore). Migration never writes by itself:
// the upgraded state is saved only by the next successful command, so a failed read changes nothing on disk.
import { FwError } from "./errors";
import { CURRENT_SCHEMA_VERSION, worldStateSchema, type WorldState } from "./world-model";

type RawWorld = Record<string, unknown>;

/** `MIGRATIONS[n]` turns a version-n document into version n+1. Add one entry per schema bump; never edit old ones. */
const MIGRATIONS: Readonly<Record<number, (world: RawWorld) => RawWorld>> = {};

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
