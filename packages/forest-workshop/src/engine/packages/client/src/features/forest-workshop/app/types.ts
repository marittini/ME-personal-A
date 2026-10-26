// Shapes the server sends. Structural copies of the server's types (the client bundle cannot import server code);
// the server is the authority, the client only renders them.

export interface WorldState {
  schemaVersion: number;
  worldId: string;
  createdAt: string;
  settings: { worldName: string; playerNickname: string };
  wallet: { gold: number };
  inventory: Record<string, number>;
  progress: { starterKitClaimed: boolean };
}

export interface ItemDefinition {
  id: string;
  name: string;
  category: "material" | "product";
}

export interface GameContent {
  items: ItemDefinition[];
  starterKit: { gold: number; items: Record<string, number> };
}

export interface WorldView {
  worldId: string;
  revision: number;
  updatedAt: string;
  state: WorldState;
}

export interface WorldSummary {
  worldId: string;
  worldName: string;
  updatedAt: string;
  readable: boolean;
}

export interface CommandResponse {
  duplicate: boolean;
  type: string;
  result: Record<string, unknown>;
  revision: number;
  state: WorldState;
}

export interface StorageUsage {
  residentImagesBytes: number;
  backgroundsBytes: number;
  recordsBytes: number;
}

export interface BackupDocument {
  format: string;
  formatVersion: number;
  exportedAt: string;
  world: unknown;
  assets: unknown[];
}
