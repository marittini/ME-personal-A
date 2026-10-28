// Shapes the server sends. Structural copies of the server's types (the client bundle cannot import server code);
// the server is the authority, the client only renders them.

export interface WorldState {
  schemaVersion: number;
  worldId: string;
  createdAt: string;
  settings: {
    worldName: string;
    playerNickname: string;
    ground: { left: number; right: number; top: number; bottom: number };
  };
  /** gold · 초대권 · 종표 */
  wallet: { gold: number; tickets: number; tokens: number };
  inventory: Record<string, number>;
  progress: { starterKitClaimed: boolean; starterResidentId: string | null };
  residents: Record<string, Resident>;
  pairs: Record<string, Pair>;
  production: ProductionState;
  invite: InviteState;
  deliveries: { day: string | null; done: string[] };
  stories: {
    pairs: Record<string, { current: ArcProgress | null; completed: ArcProgress[] }>;
    expedition: Expedition | null;
  };
  memory: { facts: Fact[]; nextFactId: number };
}

export interface EpisodeProgress {
  state: "idle" | "running" | "unlocked" | "read";
  storyId: string;
  unlockedAt: string | null;
  readAt: string | null;
  choice: { optionId: string; at: string } | null;
}

export interface ArcProgress {
  arcId: string;
  leadId: string;
  startedAt: string;
  episodes: [EpisodeProgress, EpisodeProgress, EpisodeProgress];
}

export interface Expedition {
  pairId: string;
  episode: number;
  participants: string[];
  startedSim: number;
  endsSim: number;
  startedAt: string;
  preparations: Record<string, number>;
}

export interface Fact {
  factId: number;
  text: string;
  factType: "event" | "feeling" | "player";
  knowerIds: string[];
  subjectIds: string[];
  visibility: "knowers" | "public";
  pairId: string | null;
  storyId: string | null;
  occurredAt: string;
  status: "active" | "corrected" | "invalidated";
  supersedes: number | null;
}

export type Emotion = "none" | "joy" | "affection" | "curiosity" | "fluster" | "inspiration" | "annoyance";
/** Marks of scenes written by prompt v1 (0.6.0). */
export type LegacyEmotion = "calm" | "surprise" | "worry" | "thinking" | "shy";

export type Segment =
  | { kind: "line"; speakerId: string; text: string; emotion: Emotion | LegacyEmotion }
  | { kind: "narration"; text: string }
  | { kind: "choice"; askerId: string; question: string; options: Array<{ optionId: string; text: string }> };

export interface StoryDocument {
  storyId: string;
  pairId: string;
  arcId: string;
  episode: number;
  title: string;
  place: string;
  participants: string[];
  segments: Segment[];
  memories: Array<{ text: string; factType: "event" | "feeling"; knowerIds: string[] }>;
  generatedAt: string;
}

export type EpisodeStatus = "locked" | "available" | "running" | "unlocked" | "read";

export interface EpisodeView {
  index: number;
  title: string;
  cast: "lead" | "pair";
  minutes: number;
  preparations: Record<string, number>;
  status: EpisodeStatus;
  reasons: string[];
  participants: string[];
  storyId: string | null;
  written: boolean;
}

export interface PairStoryView {
  pairId: string;
  leadId: string | null;
  arc: { id: string; title: string; place: string; discovery: string };
  episodes: EpisodeView[];
  completed: Array<{ arcId: string; title: string; storyIds: string[] }>;
}

export interface StoryOverview {
  revision: number;
  pairs: PairStoryView[];
}

export type FieldId = "gather" | "grow" | "survey" | "process" | "craft";
export type InviteOutcome = "new" | "breakthrough" | "token";

export interface InviteLogEntry {
  logId: number;
  at: string;
  residentId: string;
  name: string;
  outcome: InviteOutcome;
  breakthrough: number;
  via: "draw" | "guarantee" | "exchange";
}

export interface InviteState {
  wishResidentId: string | null;
  sinceNew: number;
  log: InviteLogEntry[];
  nextLogId: number;
}

export interface DrawResult {
  residentId: string;
  outcome: InviteOutcome;
  breakthrough: number;
  via: InviteLogEntry["via"];
}

export interface DeliveryOrder {
  id: string;
  title: string;
  items: Record<string, number>;
  reward: { tickets: number; gold: number };
}

export interface DeliveryList {
  day: string;
  orders: DeliveryOrder[];
  done: string[];
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
  source: "rule" | "queue";
  startedSim: number;
  endsSim: number;
  consumed: Record<string, number>;
  outputs: Record<string, number>;
}

export interface Waiting {
  reason: "materials" | "target_reached" | "no_rules" | "queue_empty" | "locked";
  itemId?: string;
  needed?: number;
  usable?: number;
  protectedAmount?: number;
}

export interface QueueEntry {
  entryId: string;
  recipeId: string;
  total: number;
  started: number;
}

export type FacilityMode = "auto" | "count";

export interface FacilityState {
  unlocked: boolean;
  level: number;
  mode: FacilityMode;
  rules: Rule[];
  queue: QueueEntry[];
  residentId: string | null;
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
  sold: Record<string, number>;
  gold: number;
  offlineMs: number;
}

export interface AutoSell {
  enabled: boolean;
  keep: number;
  dailyMax: number;
  continuous?: boolean;
}

export interface ProductionState {
  simMs: number;
  facilities: Record<string, FacilityState>;
  protectedStock: Record<string, number>;
  autoSell: Record<string, AutoSell>;
  sales: { day: string | null; sold: Record<string, number> };
  made: Record<string, number>;
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
  field: FieldId;
  order: number;
  description: string;
  unlock: {
    facilityLevel?: { facilityId: string; level: number };
    made?: { itemId: string; amount: number };
  } | null;
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
  /** 전문 분야 and 특기, decided at registration. */
  field: FieldId;
  talentId: string;
  /** The player's trust with this resident; not a romance state. */
  trust: number;
  breakthrough: number;
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
  /** The field and talent registering this source would give. */
  talent: { field: FieldId; talentId: string };
}

export interface TalentDefinition {
  id: string;
  field: FieldId;
  name: string;
  description: string;
  effect:
    | { kind: "speed"; recipeId: string; bonus: number }
    | { kind: "save"; recipeId: string; itemId: string; amount: number };
}

export interface ItemDefinition {
  id: string;
  name: string;
  category: "material" | "processed" | "goods";
  sellPrice: number;
}

export interface GameContent {
  items: ItemDefinition[];
  starterKit: { gold: number; tickets: number; items: Record<string, number> };
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
    queueSlotLevels: number[];
    queueCount: { min: number; max: number };
  };
  crew: {
    passiveBase: number;
    passivePerBreakthrough: number;
    maxBreakthrough: number;
    setBonusPerPair: number;
    setBonusMax: number;
  };
  talents: TalentDefinition[];
  stories: {
    arcs: Array<{
      id: string;
      title: string;
      place: string;
      discovery: string;
      episodes: Array<{
        title: string;
        cast: "lead" | "pair";
        minutes: number;
        preparations: Record<string, number>;
        relation: { familiarity: number; ease: number };
      }>;
    }>;
    choiceTrust: number;
  };
  invite: {
    ticketsPerDraw: number;
    multiDraw: number;
    baseWeight: number;
    wishWeight: number;
    guaranteeAfter: number;
    tokensPerExchange: number;
    logLimit: number;
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
