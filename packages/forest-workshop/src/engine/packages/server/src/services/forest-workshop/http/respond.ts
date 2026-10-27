// Turns a route's work into an HTTP answer. A rule failure (FwError) becomes its status and Korean message; anything
// else is logged with its stack and answered as `internal`, so private details never reach the client.
import type { FastifyReply } from "fastify";
import { errorBody, isFwError } from "../domain/errors";
import type { HostRuntime } from "../host/engine-adapter";

export type RouteLogger = NonNullable<HostRuntime["logger"]>;

export async function respond<T>(
  reply: FastifyReply,
  logger: RouteLogger | undefined,
  label: string,
  work: () => Promise<T>,
) {
  try {
    return await work();
  } catch (error) {
    if (isFwError(error)) {
      if (error.status >= 500) logger?.error(error, "[forest-workshop] %s failed: %s", label, error.code);
      return reply.status(error.status).send(errorBody(error));
    }
    logger?.error(error, "[forest-workshop] %s failed unexpectedly", label);
    return reply.status(500).send({
      error: "internal",
      message: "처리 중 문제가 생겨 저장하지 않았습니다. 잠시 후 다시 시도해 주세요.",
    });
  }
}
