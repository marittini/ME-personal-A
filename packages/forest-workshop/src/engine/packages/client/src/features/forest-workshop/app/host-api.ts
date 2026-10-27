// The Engine's own API client (`__MARINARA_HOST__.api`): admin secret, CSRF and error classes are the Engine's.
// Every request of the package goes through here; nothing calls fetch() itself.
import { host } from "marinara:host";

export interface HostApiClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body?: unknown): Promise<T>;
  upload<T>(path: string, formData: FormData): Promise<T>;
}

interface HostApiModule {
  api: HostApiClient;
  getApiErrorMessage(value: unknown, fallback: string): string;
}

function hostApiModule(): HostApiModule {
  const module = (host as Record<string, unknown>).api as HostApiModule | undefined;
  if (!module?.api) throw new Error("이 Marinara Engine은 패키지 API 클라이언트를 제공하지 않습니다.");
  return module;
}

export function hostApi(): HostApiClient {
  return hostApiModule().api;
}

/** The server's Korean message when it sent one, otherwise the Engine's wording, otherwise the fallback. */
export function errorMessage(error: unknown, fallback: string): string {
  try {
    const payload = (error as { payload?: { message?: unknown } }).payload;
    if (typeof payload?.message === "string" && payload.message) return payload.message;
    return hostApiModule().getApiErrorMessage(error, fallback);
  } catch {
    return error instanceof Error && error.message ? error.message : fallback;
  }
}

/** The stable error code the server sent (`save_conflict`, `stale_view`, …), if any. */
export function errorCode(error: unknown): string | null {
  const payload = (error as { payload?: { error?: unknown } }).payload;
  return typeof payload?.error === "string" ? payload.error : null;
}

/** IDs for idempotent requests: a retry reuses the same one, a new action makes a new one. */
export function newRequestId(): string {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/** World IDs must be UUIDs on the server. */
export function newWorldId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
