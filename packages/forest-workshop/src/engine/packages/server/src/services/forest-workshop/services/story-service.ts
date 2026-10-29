// Writing and reading scenes (plan §5 POST /generation · GET /stories/:id, §7.3, §7.4, §7.7).
//   generate  An unlocked episode's scene, written once from the stored plan and the participants' shared memory.
//             The world is read, the model is called outside any transaction (plan §6), the answer is checked
//             (prompts/story-scene.ts) and stored as an immutable `fw-story` document. A scene that already exists is
//             returned as it is. A refused or failed answer stores nothing: retrying uses the same plan, with no new
//             expedition and no cost. Two requests for the same scene share one model call (in-flight map).
//   get       A stored scene.
//
// ponytail: generation is a single request bounded by the Engine's agent-call timeout, not a resumable job. A lost
// request costs a retry of the same plan; the scene is either fully stored or not at all.
import { RELATION_STAGES } from "../content/relations";
import { arcDefinition } from "../content/stories";
import { FwError } from "../domain/errors";
import { assertWorldId } from "../domain/ids";
import { storyDocumentSchema, type StoryDocument } from "../domain/model/story-document";
import { arcView } from "../domain/stories/arcs";
import { sharedBy } from "../domain/stories/memory";
import type { HostPersistence, HostRuntime } from "../host/engine-adapter";
import { STORY_PROMPT_VERSION, SceneRefused, buildSceneMessages, parseScene } from "../prompts/story-scene";
import { createStory, findStory } from "../store/story-repository";
import { loadWorld } from "../store/world-repository";

const MAX_OUTPUT_TOKENS = 1600;
/** Input budget when the connection does not say its context size (plan §7.7: 보수적 설정값). */
const FALLBACK_INPUT_TOKENS = 6000;
const SOURCE_NOTES_MAX = 300;

function parseRequest(body: unknown) {
  const raw = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const episode = raw.episode;
  if (typeof raw.pairId !== "string" || typeof episode !== "number" || ![0, 1, 2].includes(episode)) {
    throw new FwError("invalid_request");
  }
  return { worldId: assertWorldId(raw.worldId), pairId: raw.pairId, episode };
}

export function createStoryService(runtime: HostRuntime, persistence: HostPersistence) {
  const documents = persistence.documents;
  const logger = runtime.logger;
  const inFlight = new Map<string, Promise<StoryDocument>>();

  async function write(worldId: string, pairId: string, episode: number): Promise<StoryDocument> {
    const world = await loadWorld(documents, worldId);
    const state = world.state;
    const view = arcView(state, pairId);
    if (!view || !view.stored) throw new FwError("story_locked");
    const progress = view.stored.episodes[episode]!;
    if (progress.state !== "unlocked" && progress.state !== "read") throw new FwError("story_locked");
    const existing = await findStory(documents, worldId, progress.storyId);
    if (existing) return existing;

    const arc = arcDefinition(view.stored.arcId)!;
    const definition = arc.episodes[episode]!;
    const participants = view.episodes[episode]!.participants;
    const residents = participants.map((id) => state.residents[id]!);
    const [lead, partner] = residents;
    const beat = definition.beat
      .replaceAll("{lead}", lead!.displayName)
      .replaceAll("{partner}", partner?.displayName ?? lead!.displayName);
    const shared = sharedBy(state.memory, participants).slice(-30);
    const familiarity = state.pairs[pairId]?.familiarity ?? 0;
    const relationLabel =
      participants.length > 1
        ? ([...RELATION_STAGES].reverse().find((stage) => familiarity >= stage.from)?.label ?? null)
        : null;
    const messages = buildSceneMessages({
      worldName: state.settings.worldName,
      playerNickname: state.settings.playerNickname,
      place: arc.place,
      title: definition.title,
      beat,
      participants: residents.map((resident) => ({
        residentId: resident.residentId,
        name: resident.displayName,
        kind: resident.kind,
        worldSetting: resident.worldSetting,
        sourceNotes: (resident.source.personality || resident.source.description).slice(0, SOURCE_NOTES_MAX),
      })),
      relationLabel,
      sharedFacts: shared,
      writingPreferences: {
        world: state.guidelines.world.enabled ? state.guidelines.world.text : "",
        pair: state.guidelines.pairs[pairId]?.enabled ? state.guidelines.pairs[pairId]!.text : "",
      },
    });

    const resolve = runtime.languageModels?.resolve;
    if (typeof resolve !== "function") throw new FwError("lm_unavailable");
    let model;
    try {
      model = await resolve.call(runtime.languageModels, null);
    } catch {
      throw new FwError("lm_unavailable");
    }
    if (typeof model.chatComplete !== "function") throw new FwError("lm_unavailable");
    // Token budget (plan §7.7): the whole prompt is required; if it does not fit, refuse instead of trimming rules.
    const budget = model.maxContext
      ? Math.min(Math.floor(model.maxContext * 0.6), model.maxContext - MAX_OUTPUT_TOKENS)
      : FALLBACK_INPUT_TOKENS;
    const fitted = typeof model.fitContext === "function" ? model.fitContext(messages, { maxTokens: budget }) : null;
    if (fitted?.trimmed) throw new FwError("context_too_large");

    const debug = process.env.DEBUG_AGENTS === "true" || process.env.DEBUG_AGENTS === "1";
    const log = debug ? logger?.info.bind(logger) : logger?.debug?.bind(logger);
    log?.(
      "[forest-workshop] story prompt v%d → %s:%s\n%s",
      STORY_PROMPT_VERSION,
      model.connectionId,
      model.model,
      JSON.stringify(messages),
    );
    let content: string;
    try {
      const completion = await model.chatComplete(messages, {
        temperature: 0.9,
        maxTokens: MAX_OUTPUT_TOKENS,
        debugMode: debug,
      });
      content = completion.content ?? "";
    } catch (error) {
      logger?.warn(
        "[forest-workshop] story generation failed: %s",
        error instanceof Error ? error.message : String(error),
      );
      throw new FwError("story_generation_failed");
    }
    let scene;
    try {
      scene = parseScene(content, participants);
    } catch (error) {
      // Not published; the reason (no text) goes to the log for the developer.
      logger?.warn(
        "[forest-workshop] story refused: %s",
        error instanceof SceneRefused ? error.message : String(error),
      );
      throw new FwError("story_generation_failed");
    }
    const story = storyDocumentSchema.parse({
      schemaVersion: 1,
      worldId,
      storyId: progress.storyId,
      pairId,
      arcId: arc.id,
      episode,
      title: definition.title,
      place: arc.place,
      participants,
      segments: scene.segments,
      memories: scene.memories,
      manifest: {
        promptVersion: STORY_PROMPT_VERSION,
        connectionId: model.connectionId,
        model: model.model,
        perspective: "shared",
        participantIds: participants,
        factIds: shared.map((fact) => fact.factId),
        estimatedTokens: fitted?.estimatedTokensAfter ?? 0,
        worldRevision: world.revision,
        guidelineRevisions: {
          world: state.guidelines.world.revision,
          pair: state.guidelines.pairs[pairId]?.revision ?? 0,
        },
      },
      generatedAt: new Date().toISOString(),
    });
    return createStory(documents, story);
  }

  return {
    async generate(body: unknown): Promise<StoryDocument> {
      const { worldId, pairId, episode } = parseRequest(body);
      // Same world, pair and episode → one model call shared by every waiting request (plan §7.4 중복 키).
      const key = `${worldId}:${pairId}:${episode}:${STORY_PROMPT_VERSION}`;
      const running = inFlight.get(key);
      if (running) return running;
      const work = write(worldId, pairId, episode).finally(() => inFlight.delete(key));
      inFlight.set(key, work);
      return work;
    },

    /**
     * What 탐사 → 이야기 탐험 shows for every pair: its arc (without beats), each episode's status, the exact reasons
     * a locked one waits, participants and scene IDs, and which scenes are already written. Derived on the server
     * (domain/stories/arcs.ts) so the screen and the commands never disagree.
     */
    async overview(worldIdRaw: unknown) {
      const worldId = assertWorldId(worldIdRaw);
      const world = await loadWorld(documents, worldId);
      const state = world.state;
      const pairs = [];
      for (const pairId of Object.keys(state.pairs)) {
        const view = arcView(state, pairId);
        if (!view) continue;
        const written = await Promise.all(
          view.episodes.map(async (episode) =>
            episode.status === "unlocked" || episode.status === "read"
              ? Boolean(await findStory(documents, worldId, episode.storyId))
              : false,
          ),
        );
        pairs.push({
          pairId,
          leadId: view.leadId,
          arc: {
            id: view.arc.id,
            title: view.arc.title,
            place: view.arc.place,
            discovery: view.arc.discovery,
          },
          episodes: view.episodes.map((episode, index) => ({
            index,
            title: episode.definition.title,
            cast: episode.definition.cast,
            minutes: episode.definition.minutes,
            preparations: episode.definition.preparations,
            status: episode.status,
            reasons: episode.reasons,
            participants: episode.participants,
            storyId: episode.storyId || null,
            written: written[index]!,
          })),
          completed: (state.stories.pairs[pairId]?.completed ?? []).map((arc) => ({
            arcId: arc.arcId,
            title: arcDefinition(arc.arcId)?.title ?? arc.arcId,
            storyIds: arc.episodes.map((episode) => episode.storyId),
          })),
        });
      }
      return { revision: world.revision, pairs };
    },

    async get(worldIdRaw: unknown, storyIdRaw: unknown): Promise<StoryDocument> {
      const worldId = assertWorldId(worldIdRaw);
      if (typeof storyIdRaw !== "string") throw new FwError("invalid_request");
      const story = await findStory(documents, worldId, storyIdRaw);
      if (!story) throw new FwError("story_not_found");
      return story;
    },
  };
}

export type StoryService = ReturnType<typeof createStoryService>;
