// One error type for every rule the package enforces. A thrown FwError carries a stable code (for tests, logs and the
// client), the HTTP status the routes answer with, and the Korean sentence the player reads. Anything else that
// escapes a handler is an unexpected failure and is answered as `internal` without leaking its message.

export type FwErrorCode =
  // Requests
  | "invalid_request"
  | "invalid_payload"
  | "unknown_command"
  | "world_not_found"
  | "world_exists"
  // Concurrency and idempotency
  | "command_id_reused"
  | "stale_view"
  | "save_conflict"
  // Game rules
  | "already_claimed"
  // Stored data
  | "unsupported_schema"
  | "corrupt_world"
  | "invalid_backup";

const STATUS: Record<FwErrorCode, number> = {
  invalid_request: 400,
  invalid_payload: 400,
  unknown_command: 400,
  world_not_found: 404,
  world_exists: 409,
  command_id_reused: 409,
  stale_view: 409,
  save_conflict: 409,
  already_claimed: 409,
  unsupported_schema: 422,
  corrupt_world: 500,
  invalid_backup: 400,
};

const MESSAGES: Record<FwErrorCode, string> = {
  invalid_request: "요청 형식이 올바르지 않습니다.",
  invalid_payload: "입력값이 올바르지 않습니다.",
  unknown_command: "알 수 없는 동작입니다. 패키지를 최신 버전으로 업데이트해 주세요.",
  world_not_found: "세계를 찾을 수 없습니다.",
  world_exists: "같은 ID의 세계가 이미 있습니다.",
  command_id_reused: "이미 다른 내용으로 처리된 요청 번호입니다. 화면을 새로고침한 뒤 다시 시도해 주세요.",
  stale_view: "다른 화면에서 먼저 바뀐 내용이 있습니다. 최신 상태로 다시 확인해 주세요.",
  save_conflict: "동시에 여러 변경이 겹쳤습니다. 잠시 후 다시 시도해 주세요. 재화는 바뀌지 않았습니다.",
  already_claimed: "이미 받은 보상입니다.",
  unsupported_schema: "이 저장 데이터는 더 새로운 패키지 버전에서 만들어졌습니다. 패키지를 업데이트해 주세요.",
  corrupt_world: "세계 저장 데이터를 읽을 수 없습니다. 원본은 그대로 두었습니다. 백업에서 복원할 수 있습니다.",
  invalid_backup: "백업 파일 형식이 올바르지 않습니다. 기존 세계는 바뀌지 않았습니다.",
};

export class FwError extends Error {
  readonly code: FwErrorCode;
  readonly status: number;
  /** Extra machine-readable context for the client (never secrets or private story text). */
  readonly details: Readonly<Record<string, unknown>> | undefined;

  constructor(code: FwErrorCode, options: { message?: string; details?: Record<string, unknown> } = {}) {
    super(options.message ?? MESSAGES[code]);
    this.name = "FwError";
    this.code = code;
    this.status = STATUS[code];
    this.details = options.details;
  }
}

export function isFwError(error: unknown): error is FwError {
  return error instanceof FwError;
}

/** The JSON body every route sends for a failure. */
export function errorBody(error: FwError) {
  return { error: error.code, message: error.message, ...(error.details ? { details: error.details } : {}) };
}
