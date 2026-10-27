// Identifier rules and document IDs. Every stored document is named from the world UUID plus a content ID, so two
// worlds never share a document and nothing collides with Gacha Forge's `${runId}:unit:*` records (plan §6).
import { createHash } from "node:crypto";
import { FwError } from "./errors";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/u;
/** Client-made request IDs: UUIDs from crypto.randomUUID, or the fallback the client uses without it. */
const REQUEST_ID = /^[A-Za-z0-9-]{8,64}$/u;

export function assertWorldId(value: unknown): string {
  if (typeof value !== "string" || !UUID.test(value)) {
    throw new FwError("invalid_request", { message: "세계 ID 형식이 올바르지 않습니다." });
  }
  return value;
}

export function assertRequestId(value: unknown, label = "요청 번호"): string {
  if (typeof value !== "string" || !REQUEST_ID.test(value)) {
    throw new FwError("invalid_request", { message: `${label} 형식이 올바르지 않습니다.` });
  }
  return value;
}

export const DOCUMENT_KIND = {
  world: "fw-world",
  command: "fw-command",
  story: "fw-story",
} as const;

export const documentId = {
  world: (worldId: string) => `fw-world-${worldId}`,
  command: (worldId: string, commandId: string) => `fw-command-${worldId}-${commandId}`,
  story: (worldId: string, storyId: string) => `fw-story-${worldId}-${storyId}`,
};

/** JSON with object keys sorted, so equal values always hash the same regardless of key order. */
export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, nested]) => nested !== undefined)
    .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0));
  return `{${entries.map(([key, nested]) => `${JSON.stringify(key)}:${stableStringify(nested)}`).join(",")}}`;
}

export function sha256Hex(value: string | Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

/** A UUID-shaped ID derived from a seed, for content-made records (starter rules) that must be the same on retry. */
export function seededUuid(seed: string): string {
  const hex = sha256Hex(seed);
  const variant = ((parseInt(hex[16]!, 16) & 0x3) | 0x8).toString(16);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-${variant}${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}
