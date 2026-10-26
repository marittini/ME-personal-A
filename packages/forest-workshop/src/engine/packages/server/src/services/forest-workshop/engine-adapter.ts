// Forest Workshop's only door into the Engine. Every other server file talks to this adapter, never to an Engine
// path, so the package keeps an empty private-import inventory (engine-boundary.json).
//
// The plan (Development_Plan_FINAL_v1_6 §5) separates three kinds of host access. This file names them so a reader
// never mistakes one for another:
//   1. Capability runtime members Forest Workshop calls directly: resources, languageModels, persistence.
//      They exist in the Engine; Gacha Forge never proved them, so the P0 probe exercises each one.
//   2. Engine HTTP routes reached in-process with the caller's own credentials: only /api/global-gallery/upload
//      (and DELETE /api/global-gallery/:id to undo an upload whose save failed). See image-adapter.ts.
//   3. Routes Forest Workshop must never call: character avatar generation and integrations.images.save/stage
//      (they need a chatId). Nothing here references them; tests/forest-workshop-p0.regression.ts checks the bundle.

export const PACKAGE_ID = "forest-workshop";
export const API_PREFIX = `/api/${PACKAGE_ID}`;

/** Structural slices of the capability runtime this package reads. Kept local so the package does not bind to a
 *  vendored type snapshot; the P0 probe proves the live Engine matches them. */
export interface HostDocumentRecord {
  id: string;
  packageId: string;
  kind: string;
  name: string;
  description: string;
  data: unknown;
  revision: number;
  createdAt: string;
  updatedAt: string;
}

export interface HostDocumentStore {
  list(packageId: string, kind: string): Promise<HostDocumentRecord[]>;
  getById(packageId: string, id: string): Promise<HostDocumentRecord | null>;
  create(input: {
    id: string;
    packageId: string;
    kind: string;
    name: string;
    description: string;
    data: unknown;
    createdAt: string;
    updatedAt: string;
  }): Promise<HostDocumentRecord>;
  update(input: {
    id: string;
    packageId: string;
    expectedRevision: number;
    name: string;
    description: string;
    data: unknown;
    updatedAt: string;
  }): Promise<HostDocumentRecord | null>;
  remove(packageId: string, id: string, expectedRevision: number): Promise<boolean>;
}

export interface HostPersistenceSession {
  documents: HostDocumentStore;
}

export interface HostLanguageModelMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface HostResolvedLanguageModel {
  connectionId: string;
  model: string;
  maxContext: number | null;
  maxOutputTokens: number | null;
  fitContext(
    messages: HostLanguageModelMessage[],
    options?: { maxTokens?: number },
  ): { messages: unknown[]; estimatedTokensBefore: number; estimatedTokensAfter: number; trimmed: boolean };
}

export interface HostRuntime {
  resources?: {
    listCharacters?(ids?: string[]): Promise<Array<{ id: string; data: unknown }>>;
    listPersonas?(ids?: string[]): Promise<Array<{ id: string; data: unknown }>>;
  };
  languageModels?: {
    resolve?(connectionId?: string | null): Promise<HostResolvedLanguageModel>;
  };
  persistence?: HostPersistenceSession & {
    transaction?<T>(operation: (session: HostPersistenceSession) => Promise<T>): Promise<T>;
  };
  logger?: {
    info(message: string, ...args: unknown[]): void;
    warn(message: string, ...args: unknown[]): void;
    error(error: unknown, message: string, ...args: unknown[]): void;
  };
}

/** Host members Forest Workshop uses, in the order the status screen lists them. */
const HOST_MEMBERS: ReadonlyArray<{ name: string; required: boolean; present: (runtime: HostRuntime) => boolean }> = [
  { name: "persistence.documents", required: true, present: (r) => hasDocumentStore(r.persistence?.documents) },
  { name: "persistence.transaction", required: true, present: (r) => typeof r.persistence?.transaction === "function" },
  {
    name: "resources.listCharacters",
    required: false,
    present: (r) => typeof r.resources?.listCharacters === "function",
  },
  { name: "resources.listPersonas", required: false, present: (r) => typeof r.resources?.listPersonas === "function" },
  { name: "languageModels.resolve", required: false, present: (r) => typeof r.languageModels?.resolve === "function" },
];

function hasDocumentStore(store: HostDocumentStore | undefined): boolean {
  return Boolean(
    store &&
    ["list", "getById", "create", "update", "remove"].every(
      (method) => typeof (store as unknown as Record<string, unknown>)[method] === "function",
    ),
  );
}

export interface HostMemberStatus {
  name: string;
  required: boolean;
  available: boolean;
}

export function describeHost(runtime: HostRuntime | undefined): HostMemberStatus[] {
  return HOST_MEMBERS.map((member) => ({
    name: member.name,
    required: member.required,
    available: Boolean(runtime && member.present(runtime)),
  }));
}

/** Names of required members the running Engine lacks; activation refuses to run without them. */
export function missingRequiredHostMembers(runtime: HostRuntime | undefined): string[] {
  return describeHost(runtime)
    .filter((member) => member.required && !member.available)
    .map((member) => member.name);
}
