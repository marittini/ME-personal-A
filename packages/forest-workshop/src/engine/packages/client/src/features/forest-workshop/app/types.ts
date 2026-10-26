// Shapes the server sends. Structural copies of the server's types (the client bundle cannot import server code);
// the server is the authority, the client only renders them.

export interface WorldState {
  schemaVersion: number;
  worldId: string;
  createdAt: string;
  settings: { worldName: string; playerNickname: string };
  wallet: { gold: number };
  inventory: Record<string, number>;
  progress: { starterKitClaimed: boolean; starterResidentId: string | null };
  residents: Record<string, Resident>;
  pairs: Record<string, Pair>;
  production: ProductionState;
}

export interface Rule {
  policyId: string;
  enabled: boolean;
  recipeId: string;
  targetStock: number;
  priority: number;
}

export interface Job {
  jobId: number;
  recipeId: string;
  policyId: string;
  startedSim: number;
  endsSim: number;
  consumed: Record<string, number>;
  outputs: Record<string, number>;
}

export interface Waiting {
  reason: "materials" | "target_reached" | "no_rules";
  itemId?: string;
  needed?: number;
  usable?: number;
  protectedAmount?: number;
}

export interface FacilityState {
  level: number;
  mode: "auto";
  rules: Rule[];
  job: Job | null;
  waiting: Waiting | null;
}

export interface ProductionReport {
  reportId: number;
  at: string;
  simFrom: number;
  simTo: number;
  produced: Record<string, number>;
  consumed: Record<string, number>;
  runs: number;
  offlineMs: number;
}

export interface ProductionState {
  simMs: number;
  facilities: Record<string, FacilityState>;
  protectedStock: Record<string, number>;
  reports: ProductionReport[];
  reportsReadThrough: number;
  nextJobId: number;
  nextReportId: number;
  activity: {
    settledAt: string | null;
    lastActiveAt: string | null;
    leaseUntil: string | null;
    absenceUsedMs: number;
    lastAbsence: { creditedMs: number; totalMs: number } | null;
  };
}

export interface FacilityDefinition {
  id: string;
  name: string;
  field: "gather" | "grow" | "survey" | "process" | "craft";
  order: number;
  description: string;
}

export interface RecipeDefinition {
  id: string;
  name: string;
  facilityId: string;
  description: string;
  inputs: Record<string, number>;
  outputs: Record<string, number>;
  minutes: number;
}

export type ResidentKind = "character" | "persona";

export interface ResidentImage {
  reference: string;
  url: string;
  width: number;
  height: number;
  bytes: number;
  hasTransparency: boolean;
  fileName: string;
  uploadKey: string;
  uploadedAt: string;
}

export interface Placement {
  scale: number;
  offsetX: number;
  markerHeight: number;
}

export interface ResidentChange {
  at: string;
  kind: string;
  detail: string;
}

export interface Resident {
  residentId: string;
  kind: ResidentKind;
  sourceId: string;
  source: { name: string; description: string; personality: string; scenario: string; takenAt: string };
  displayName: string;
  worldSetting: string;
  recruited: boolean;
  registeredAt: string;
  image: { current: ResidentImage | null; history: ResidentImage[]; placement: Placement };
  changes: ResidentChange[];
}

export interface Pair {
  pairId: string;
  /** Two different residents of any kind, in ascending order (a pair has no direction). */
  residentIds: [string, string];
  createdAt: string;
  archived: boolean;
  archivedAt: string | null;
  familiarity: number;
  ease: number;
  lastEvent: { at: string; summary: string } | null;
}

export interface SourceEntry {
  kind: ResidentKind;
  id: string;
  name: string;
  summary: string;
  residentId: string | null;
}

export interface SourcePreview {
  kind: ResidentKind;
  id: string;
  snapshot: { name: string; description: string; personality: string; scenario: string };
  summary: string;
}

export interface ItemDefinition {
  id: string;
  name: string;
  category: "material" | "product";
  sellPrice: number;
}

export interface GameContent {
  items: ItemDefinition[];
  starterKit: { gold: number; items: Record<string, number> };
  relationStages: Array<{ from: number; label: string }>;
  facilities: FacilityDefinition[];
  recipes: RecipeDefinition[];
  production: {
    maxLevel: number;
    maxRules: number;
    speedBonusPerLevel: number;
    targetStock: { min: number; max: number };
    protectedStock: { min: number; max: number };
    /** upgradeCosts[level - 1]: gold from that level to the next. */
    upgradeCosts: number[];
    recommendedRules: Record<string, Array<{ recipeId: string; targetStock: number; priority: number }>>;
    absenceLimitMs: number;
  };
  residents: {
    worldSettingMax: number;
    maxImageBytes: number;
    placement: Record<keyof Placement, { min: number; max: number; default: number }>;
  };
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
