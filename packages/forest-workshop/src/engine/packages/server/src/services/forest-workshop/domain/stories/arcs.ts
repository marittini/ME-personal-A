// Which arc a pair is on and what each episode needs (plan §7.3). Pure. "locked" and "available" are derived here
// from the conditions, so the screen and the commands always agree and nothing stale is stored:
//   - episode 1 needs the lead (a resident of the pair who came to the workshop);
//   - episodes 2 and 3 need both residents of the pair, and the episode before read;
//   - an archived pair starts nothing new; only one expedition is out at a time.
// Conditions are stated exactly; the beat (what will happen) is never shown before reading.
import { ARCS, arcDefinition, type ArcDefinition, type EpisodeDefinition } from "../../content/stories";
import { seededUuid, sha256Hex } from "../ids";
import type { ArcProgress } from "../model/stories";
import type { WorldState } from "../world-model";

export type EpisodeStatus = "locked" | "available" | "running" | "unlocked" | "read";

export interface EpisodeView {
  index: number;
  definition: EpisodeDefinition;
  status: EpisodeStatus;
  /** Why it is locked, in the player's words. */
  reasons: string[];
  participants: string[];
  storyId: string;
}

/** The lead: the pair's first resident (ascending ID) who came to the workshop; null if neither has. */
export function leadOf(state: WorldState, pairId: string): string | null {
  const pair = state.pairs[pairId];
  if (!pair) return null;
  return pair.residentIds.find((id) => state.residents[id]?.recruited) ?? null;
}

function partnerOf(state: WorldState, pairId: string, leadId: string): string {
  const pair = state.pairs[pairId]!;
  return pair.residentIds[0] === leadId ? pair.residentIds[1] : pair.residentIds[0];
}

/** The arc a pair starts next: one it has not finished, picked the same way every time; all over again when done. */
export function nextArc(state: WorldState, pairId: string): ArcDefinition {
  const done = new Set(state.stories.pairs[pairId]?.completed.map((arc) => arc.arcId) ?? []);
  const open = ARCS.filter((arc) => !done.has(arc.id));
  const pool = open.length ? open : ARCS;
  const round = state.stories.pairs[pairId]?.completed.length ?? 0;
  return pool[parseInt(sha256Hex(`${state.worldId}:arc:${pairId}:${round}`).slice(0, 8), 16) % pool.length]!;
}

/** A new arc's stored plan: its episodes' scene IDs are fixed now, so a retried generation writes the same scene. */
export function planArc(state: WorldState, pairId: string, leadId: string, now: string): ArcProgress {
  const arc = nextArc(state, pairId);
  const round = state.stories.pairs[pairId]?.completed.length ?? 0;
  const episode = (index: number) => ({
    state: "idle" as const,
    // Old versions reused round 50 after truncation; use a separate namespace from that point onward.
    storyId: seededUuid(`${state.worldId}:story:${pairId}:${round >= 50 ? "v2:" : ""}${round}:${arc.id}:${index}`),
    unlockedAt: null,
    readAt: null,
    choice: null,
  });
  return { arcId: arc.id, leadId, startedAt: now, episodes: [episode(0), episode(1), episode(2)] };
}

export function participantsFor(state: WorldState, pairId: string, leadId: string, episode: EpisodeDefinition) {
  return episode.cast === "lead" ? [leadId] : [leadId, partnerOf(state, pairId, leadId)];
}

/** The pair's current arc (stored, or the one it would start) and the state of each episode. */
export function arcView(state: WorldState, pairId: string) {
  const pair = state.pairs[pairId];
  if (!pair) return null;
  const stored = state.stories.pairs[pairId]?.current ?? null;
  const leadId = stored?.leadId ?? leadOf(state, pairId);
  const arc = stored ? arcDefinition(stored.arcId)! : nextArc(state, pairId);
  const plan = stored ?? (leadId ? planArc(state, pairId, leadId, "1970-01-01T00:00:00.000Z") : null);
  const busy = state.stories.expedition;
  const episodes: EpisodeView[] = arc.episodes.map((definition, index) => {
    const progress = plan?.episodes[index];
    const participants = leadId ? participantsFor(state, pairId, leadId, definition) : pair.residentIds.slice(0, 1);
    const storyId = progress?.storyId ?? "";
    if (progress && progress.state !== "idle") {
      return { index, definition, status: progress.state, reasons: [], participants, storyId };
    }
    const reasons: string[] = [];
    if (!leadId) reasons.push("두 주민 중 한 명이 먼저 공방에 와야 해요");
    if (index > 0 && plan?.episodes[index - 1]?.state !== "read") reasons.push("앞 이야기를 읽은 뒤에 열려요");
    if (definition.cast === "pair" && !pair.residentIds.every((id) => state.residents[id]?.recruited)) {
      reasons.push("두 주민이 모두 공방에 와야 해요");
    }
    if (pair.archived) reasons.push("보관한 페어예요");
    if (busy && reasons.length === 0) reasons.push("다른 탐험이 진행 중이에요");
    return { index, definition, status: reasons.length ? "locked" : "available", reasons, participants, storyId };
  });
  return { pair, arc, leadId, stored, episodes };
}
