// Story commands (plan §7.3, board 02-1 탐사 · 02-2 공방 이야기):
//   stories.depart   탐험 출발: the episode's conditions hold, the one slot is free, preparations come from usable
//                    stock (never protected). Participants placed in a facility leave it; the facility keeps working at
//                    its base speed, and the run in progress keeps the speed it started with (nothing is cancelled).
//   stories.cancel   탐험 취소: everything taken is returned; the time spent is not kept (plan §7.3).
//   stories.choose   선택지: the player's answer to a resident's question, once per scene. Trust +1 with the asker;
//                    the answer becomes a memory only the asker holds.
//   stories.markRead 다 읽음: the episode is read; the scene's memories enter the ledger for the residents who were
//                    there, and the pair's values change by at most the plan's caps (plan §7.1). Reading again
//                    changes nothing.
// choose and markRead read the written scene first (prepare), so the rules never trust scene text from the client.
import { z } from "zod";
import { CHOICE_TRUST, arcDefinition } from "../../content/stories";
import { FwError } from "../errors";
import type { Fact } from "../model/memory";
import { RELATION_RANGE } from "../model/pairs";
import { MAX_COMPLETED_ARCS, type ArcProgress } from "../model/stories";
import { storyDocumentSchema, type StoryDocument } from "../model/story-document";
import { usableAmount } from "../production/stock";
import { arcView, planArc } from "../stories/arcs";
import { appendFacts } from "../stories/memory";
import { addItems, type WorldState } from "../world-model";
import { defineCommand } from "./command";

const episodeRef = z.object({ pairId: z.string().uuid(), episode: z.number().int().min(0).max(2) }).strict();

function putArc(state: WorldState, pairId: string, current: ArcProgress | null, completed?: ArcProgress[]) {
  const previous = state.stories.pairs[pairId] ?? { current: null, completed: [] };
  return {
    ...state,
    stories: {
      ...state.stories,
      pairs: { ...state.stories.pairs, [pairId]: { current, completed: completed ?? previous.completed } },
    },
  };
}

function setEpisode(arc: ArcProgress, index: number, patch: Partial<ArcProgress["episodes"][number]>): ArcProgress {
  const episodes = arc.episodes.map((episode, i) => (i === index ? { ...episode, ...patch } : episode));
  return { ...arc, episodes: episodes as ArcProgress["episodes"] };
}

/** choose / markRead name the scene; prepare() reads it, and the rule checks it is this episode's scene. */
const sceneRef = episodeRef.extend({ storyId: z.string().uuid() }).strict();

async function readScene(
  payload: { pairId: string; episode: number; storyId: string },
  host: { readStory?(worldId: string, storyId: string): Promise<StoryDocument | null> },
  worldId: string,
) {
  if (!host.readStory) throw new FwError("story_not_ready");
  const story = await host.readStory(worldId, payload.storyId);
  if (!story || story.pairId !== payload.pairId || story.episode !== payload.episode) {
    throw new FwError("story_not_ready");
  }
  return { story };
}

export const departExpedition = defineCommand({
  type: "stories.depart",
  payloadSchema: episodeRef,
  requiresFreshView: false,
  apply(state, payload, context) {
    const view = arcView(state, payload.pairId);
    if (!view) throw new FwError("pair_not_found");
    if (state.stories.expedition) throw new FwError("expedition_busy");
    const savedStories = state.stories.pairs[payload.pairId];
    if (!savedStories?.current && (savedStories?.completed.length ?? 0) >= MAX_COMPLETED_ARCS)
      throw new FwError("story_archive_full");
    const episode = view.episodes[payload.episode]!;
    if (episode.status !== "available") {
      throw new FwError("story_locked", { details: { reasons: episode.reasons, status: episode.status } });
    }
    if (state.activities.running && episode.participants.includes(state.activities.running.residentId))
      throw new FwError("resident_busy");
    const current = view.stored ?? planArc(state, payload.pairId, view.leadId!, context.now);
    // Preparations from usable stock only.
    const inventory = { ...state.inventory };
    for (const [itemId, amount] of Object.entries(episode.definition.preparations)) {
      if (usableAmount(inventory, state.production, itemId) < amount) {
        throw new FwError("not_enough_stock", { details: { itemId } });
      }
      inventory[itemId] = (inventory[itemId] ?? 0) - amount;
      if (inventory[itemId] === 0) delete inventory[itemId];
    }
    // Participants leave their facilities; those keep working without them.
    const facilities = Object.fromEntries(
      Object.entries(state.production.facilities).map(([id, facility]) => [
        id,
        facility.residentId && episode.participants.includes(facility.residentId)
          ? { ...facility, residentId: null }
          : facility,
      ]),
    );
    const simMs = state.production.simMs;
    const next = putArc(
      { ...state, inventory, production: { ...state.production, facilities } },
      payload.pairId,
      setEpisode(current, payload.episode, { state: "running" }),
    );
    return {
      state: {
        ...next,
        stories: {
          ...next.stories,
          expedition: {
            pairId: payload.pairId,
            episode: payload.episode,
            participants: episode.participants,
            startedSim: simMs,
            endsSim: simMs + episode.definition.minutes * 60_000,
            startedAt: context.now,
            preparations: { ...episode.definition.preparations },
          },
        },
      },
      result: { pairId: payload.pairId, episode: payload.episode, minutes: episode.definition.minutes },
    };
  },
});

export const cancelExpedition = defineCommand({
  type: "stories.cancel",
  payloadSchema: z.object({}).strict(),
  requiresFreshView: false,
  apply(state) {
    const expedition = state.stories.expedition;
    if (!expedition) throw new FwError("expedition_not_found");
    const current = state.stories.pairs[expedition.pairId]?.current;
    let next: WorldState = { ...state, inventory: addItems(state.inventory, expedition.preparations) };
    if (current) next = putArc(next, expedition.pairId, setEpisode(current, expedition.episode, { state: "idle" }));
    return {
      state: { ...next, stories: { ...next.stories, expedition: null } },
      result: { returned: expedition.preparations },
    };
  },
});

function requireUnlocked(state: WorldState, pairId: string, episode: number, storyId?: string) {
  const stored = state.stories.pairs[pairId];
  // A finished arc moved to `completed`: reading it again (도감) still finds its episode.
  const current =
    stored?.current?.episodes[episode]?.storyId === storyId || !storyId
      ? (stored?.current ?? null)
      : (stored?.completed.find((arc) => arc.episodes[episode]?.storyId === storyId) ?? stored?.current ?? null);
  const progress = current?.episodes[episode];
  if (!current || !progress || (progress.state !== "unlocked" && progress.state !== "read")) {
    throw new FwError("story_locked");
  }
  return { current, progress };
}

export const chooseAnswer = defineCommand({
  type: "stories.choose",
  payloadSchema: sceneRef.extend({ optionId: z.string().min(1).max(16) }).strict(),
  requiresFreshView: false,
  prepare: (payload, host, _now, worldId) => readScene(payload, host, worldId),
  apply(state, payload, context) {
    const { current, progress } = requireUnlocked(state, payload.pairId, payload.episode, payload.storyId);
    const story = storyDocumentSchema.parse((context.prepared as { story: unknown }).story);
    if (story.storyId !== progress.storyId || payload.storyId !== progress.storyId)
      throw new FwError("story_not_ready");
    if (progress.choice || progress.state === "read") {
      // Answered already, or the scene was finished without an answer: a re-read changes nothing.
      return { state, result: { optionId: progress.choice?.optionId ?? null, alreadyChosen: true } };
    }
    const choice = story.segments.find((segment) => segment.kind === "choice");
    const option = choice?.kind === "choice" ? choice.options.find((o) => o.optionId === payload.optionId) : undefined;
    if (!choice || choice.kind !== "choice" || !option) throw new FwError("invalid_payload");
    const asker = state.residents[choice.askerId];
    if (!asker) throw new FwError("resident_not_found");
    const fact: Omit<Fact, "factId"> = {
      text: `${state.settings.playerNickname}에게 "${choice.question}"라고 묻자 "${option.text}"라는 답을 들었다.`.slice(
        0,
        160,
      ),
      factType: "player",
      knowerIds: [asker.residentId],
      subjectIds: [asker.residentId],
      visibility: "knowers",
      pairId: payload.pairId,
      storyId: story.storyId,
      occurredAt: context.now,
      status: "active",
      supersedes: null,
    };
    const next = putArc(
      {
        ...state,
        residents: {
          ...state.residents,
          [asker.residentId]: { ...asker, trust: Math.min(100, asker.trust + CHOICE_TRUST) },
        },
        memory: appendFacts(state.memory, [fact]),
      },
      payload.pairId,
      setEpisode(current, payload.episode, { choice: { optionId: option.optionId, at: context.now } }),
    );
    return { state: next, result: { optionId: option.optionId, alreadyChosen: false } };
  },
});

export const markStoryRead = defineCommand({
  type: "stories.markRead",
  payloadSchema: sceneRef,
  requiresFreshView: false,
  prepare: (payload, host, _now, worldId) => readScene(payload, host, worldId),
  apply(state, payload, context) {
    const { current, progress } = requireUnlocked(state, payload.pairId, payload.episode, payload.storyId);
    if (progress.state === "read") return { state, result: { alreadyRead: true, arcDone: false } };
    const story = storyDocumentSchema.parse((context.prepared as { story: unknown }).story);
    if (story.storyId !== progress.storyId || payload.storyId !== progress.storyId)
      throw new FwError("story_not_ready");
    const arc = arcDefinition(current.arcId)!;
    const definition = arc.episodes[payload.episode]!;
    const pair = state.pairs[payload.pairId];
    if (!pair) throw new FwError("pair_not_found");
    const clamp = (value: number) => Math.min(RELATION_RANGE.max, Math.max(RELATION_RANGE.min, value));
    const nextPair = {
      ...pair,
      familiarity: clamp(pair.familiarity + definition.relation.familiarity),
      ease: clamp(pair.ease + definition.relation.ease),
      lastEvent: { at: context.now, summary: definition.title },
    };
    const facts = story.memories.map((memory): Omit<Fact, "factId"> => ({
      text: memory.text,
      factType: memory.factType,
      knowerIds: memory.knowerIds.filter((id) => story.participants.includes(id)),
      subjectIds: memory.subjectIds,
      visibility: "knowers",
      pairId: payload.pairId,
      storyId: story.storyId,
      occurredAt: context.now,
      status: "active",
      supersedes: null,
    }));
    const arcProgress = setEpisode(current, payload.episode, { state: "read", readAt: context.now });
    const arcDone = arcProgress.episodes.every((episode) => episode.state === "read");
    let next: WorldState = {
      ...state,
      pairs: { ...state.pairs, [payload.pairId]: nextPair },
      memory: appendFacts(
        state.memory,
        facts.filter((fact) => fact.knowerIds.length > 0),
      ),
    };
    if (arcDone) {
      const previous = state.stories.pairs[payload.pairId]?.completed ?? [];
      if (previous.length >= MAX_COMPLETED_ARCS) throw new FwError("story_archive_full");
      const completed = [...previous, arcProgress];
      next = putArc(next, payload.pairId, null, completed);
    } else {
      next = putArc(next, payload.pairId, arcProgress);
    }
    return {
      state: next,
      result: {
        alreadyRead: false,
        arcDone,
        familiarity: nextPair.familiarity,
        ease: nextPair.ease,
        memories: facts.length,
      },
    };
  },
});
