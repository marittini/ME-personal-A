import { FwError } from "../domain/errors";
import { assertWorldId } from "../domain/ids";
import type { HostPersistence, HostRuntime } from "../host/engine-adapter";
import { buildResidentLetterMessages, parseResidentLetter } from "../prompts/resident-letter";
import { loadWorld } from "../store/world-repository";
import type { CommandResponse, CommandService } from "./command-service";

export function createResidentLetterService(
  runtime: HostRuntime,
  persistence: HostPersistence,
  commands: CommandService,
) {
  const inFlight = new Map<string, { connection: string | null; promise: Promise<CommandResponse> }>();
  return {
    async generate(body: unknown): Promise<CommandResponse> {
      const raw = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
      const worldId = assertWorldId(raw.worldId);
      const activityId = raw.activityId;
      if (
        typeof activityId !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(activityId)
      )
        throw new FwError("invalid_request");
      if (
        raw.connectionId != null &&
        (typeof raw.connectionId !== "string" || !raw.connectionId.length || raw.connectionId.length > 128)
      )
        throw new FwError("invalid_request");
      const connection = (raw.connectionId as string | null | undefined) ?? null;
      const key = `${worldId}:${activityId}`;
      const active = inFlight.get(key);
      if (active) {
        if (active.connection !== connection)
          throw new FwError("invalid_request", { message: "다른 연결로 편지를 작성 중이에요." });
        return active.promise;
      }
      const task = (async () => {
        const world = await loadWorld(persistence.documents, worldId);
        const activity = world.state.activities.completed.find((item) => item.id === activityId);
        if (!activity) throw new FwError("invalid_payload", { message: "완료된 활동을 찾지 못했어요." });
        const id = `resident-${activityId}`;
        if (world.state.mailbox.letters.some((letter) => letter.id === id))
          return {
            duplicate: true,
            type: "mail.saveResidentLetter",
            result: { id },
            revision: world.revision,
            state: world.state,
          };
        if (world.state.mailbox.letters.length + (world.state.activities.running ? 1 : 0) >= 200)
          throw new FwError("invalid_payload", { message: "우편 저장 한도에 도달했어요." });
        const resident = world.state.residents[activity.residentId];
        if (!resident) throw new FwError("invalid_payload");
        const resolve = runtime.languageModels?.resolve;
        if (!resolve) throw new FwError("lm_unavailable");
        let model;
        try {
          model = await resolve.call(runtime.languageModels, connection);
        } catch {
          throw new FwError("lm_unavailable");
        }
        const messages = buildResidentLetterMessages({
          residentId: resident.residentId,
          residentName: resident.displayName,
          worldSetting: resident.worldSetting,
          activitySummary: activity.summary,
          memory: world.state.memory,
          worldGuideline: world.state.guidelines.world.enabled ? world.state.guidelines.world.text : "",
        });
        if (model.maxContext && model.maxContext <= 600) throw new FwError("context_too_large");
        const fit = model.fitContext(messages, {
          maxTokens: model.maxContext ? Math.min(Math.floor(model.maxContext * 0.6), model.maxContext - 600) : 6000,
        });
        if (fit.trimmed) throw new FwError("context_too_large");
        let draft;
        try {
          draft = parseResidentLetter(
            (await model.chatComplete(messages, { temperature: 0.8, maxTokens: 600 })).content ?? "",
          );
        } catch {
          throw new FwError("generation_failed");
        }
        return commands.execute(
          {
            worldId,
            commandId: `resident-letter-${activityId}`,
            expectedRevision: world.revision,
            type: "mail.saveResidentLetter",
            payload: { activityId, ...draft },
          },
          { internal: true, identity: { activityId } },
        );
      })().finally(() => inFlight.delete(key));
      inFlight.set(key, { connection, promise: task });
      return task;
    },
  };
}
export type ResidentLetterService = ReturnType<typeof createResidentLetterService>;
