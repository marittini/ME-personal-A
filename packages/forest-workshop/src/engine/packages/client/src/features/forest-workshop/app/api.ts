// One function per package route. Paths are relative to the Engine API root (`/api`).
import { hostApi } from "./host-api";
import type { BackupDocument, CommandResponse, GameContent, WorldSummary, WorldView } from "./types";

const ROOT = "/forest-workshop";

export interface CommandInput {
  worldId: string;
  commandId: string;
  expectedRevision: number;
  type: string;
  payload: Record<string, unknown>;
}

export const gameApi = {
  listWorlds: () => hostApi().get<{ worlds: WorldSummary[] }>(`${ROOT}/worlds`),
  createWorld: (input: { worldId: string; worldName: string; playerNickname: string }) =>
    hostApi().post<WorldView & { created: boolean; content: GameContent }>(`${ROOT}/worlds`, input),
  getState: (worldId: string) =>
    hostApi().get<WorldView & { content: GameContent }>(`${ROOT}/state?worldId=${encodeURIComponent(worldId)}`),
  sendCommand: (input: CommandInput) => hostApi().post<CommandResponse>(`${ROOT}/commands`, input),
  getBackup: (worldId: string) =>
    hostApi().get<BackupDocument>(`${ROOT}/backup?worldId=${encodeURIComponent(worldId)}`),
  restore: (newWorldId: string, backup: unknown) =>
    hostApi().post<WorldView & { created: boolean; restoredFrom: string; content: GameContent }>(`${ROOT}/restore`, {
      newWorldId,
      backup,
    }),
};
