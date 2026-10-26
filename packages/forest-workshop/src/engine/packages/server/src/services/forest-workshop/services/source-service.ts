// The characters and personas a player can register as residents (board 05-3 ① 자료 선택), read through the
// capability runtime's resources. Read-only: nothing here writes a character, a persona or the active persona.
// Also the CommandHost that residents.register uses to take its snapshot, so the snapshot is always the server's
// own reading of the source, never something the client sent.
import type { CommandHost } from "../domain/commands/command";
import { FwError } from "../domain/errors";
import { assertWorldId, sha256Hex, stableStringify } from "../domain/ids";
import type { ResidentKind, SourceSnapshot } from "../domain/model/residents";
import { readSourceProfile, sourceSummary, type SourceProfile } from "../domain/source-profile";
import type { HostPersistence, HostRuntime } from "../host/engine-adapter";
import { loadWorld } from "../store/world-repository";

export interface SourceEntry {
  kind: ResidentKind;
  id: string;
  name: string;
  /** 원래 설정 at a glance. */
  summary: string;
  /** Set when this source is already a resident of the world (the same source is one resident). */
  residentId: string | null;
}

interface RawRecord {
  id: string;
  data: unknown;
}

export function createSourceService(runtime: HostRuntime, persistence: HostPersistence) {
  const resources = runtime.resources;

  async function records(kind: ResidentKind, ids?: string[]): Promise<RawRecord[] | null> {
    const read = kind === "character" ? resources?.listCharacters : resources?.listPersonas;
    if (typeof read !== "function") return null;
    return read.call(resources, ids);
  }

  async function readProfiles(kind: ResidentKind): Promise<Array<{ profile: SourceProfile; raw: RawRecord }> | null> {
    const list = await records(kind);
    if (!list) return null;
    return list.flatMap((raw) => {
      const profile = typeof raw.id === "string" ? readSourceProfile(kind, raw.id, raw.data) : null;
      return profile ? [{ profile, raw }] : [];
    });
  }

  const host: CommandHost = {
    async readSource(kind, sourceId, now): Promise<SourceSnapshot> {
      const list = await records(kind, [sourceId]);
      if (!list) throw new FwError("sources_unavailable");
      const raw = list.find((record) => record.id === sourceId);
      const profile = raw ? readSourceProfile(kind, sourceId, raw.data) : null;
      if (!raw || !profile) throw new FwError("source_not_found");
      return {
        name: profile.name,
        description: profile.description,
        personality: profile.personality,
        scenario: profile.scenario,
        sourceHash: sha256Hex(stableStringify(raw.data)),
        takenAt: now,
      };
    },
  };

  return {
    host,

    async list(worldId: unknown) {
      const world = await loadWorld(persistence.documents, assertWorldId(worldId));
      const registered = new Map(
        Object.values(world.state.residents).map((resident) => [`${resident.kind}:${resident.sourceId}`, resident]),
      );
      const [characters, personas] = await Promise.all([readProfiles("character"), readProfiles("persona")]);
      if (!characters && !personas) throw new FwError("sources_unavailable");
      const entries: SourceEntry[] = [...(characters ?? []), ...(personas ?? [])].map(({ profile }) => ({
        kind: profile.kind,
        id: profile.id,
        name: profile.name,
        summary: sourceSummary(profile),
        residentId: registered.get(`${profile.kind}:${profile.id}`)?.residentId ?? null,
      }));
      entries.sort((a, b) => a.name.localeCompare(b.name, "ko"));
      return { sources: entries, available: { characters: characters !== null, personas: personas !== null } };
    },

    /** The snapshot a registration would take, for the 원래 설정 box before anything is saved. */
    async preview(worldId: unknown, kind: unknown, sourceId: unknown) {
      assertWorldId(worldId);
      if ((kind !== "character" && kind !== "persona") || typeof sourceId !== "string" || !sourceId) {
        throw new FwError("invalid_request");
      }
      const snapshot = await host.readSource(kind, sourceId, new Date().toISOString());
      return { kind, id: sourceId, snapshot, summary: sourceSummary(snapshot, 400) };
    },
  };
}

export type SourceService = ReturnType<typeof createSourceService>;
