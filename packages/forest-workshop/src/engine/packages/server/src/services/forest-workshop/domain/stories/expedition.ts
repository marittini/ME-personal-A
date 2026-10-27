// The expedition timer (plan §7.3, §7.6). It runs on workshop time, so it obeys the same 72-hour rule as production:
// time away past the cap does not move it, and a timer cut at the edge keeps what is left. Reaching the end unlocks
// the episode at once (the scene may still need writing — that is generation, not the expedition). The next episode
// never leaves by itself.
import type { WorldState } from "../world-model";

export function settleExpedition(state: WorldState, now: string): WorldState {
  const expedition = state.stories.expedition;
  if (!expedition || state.production.simMs < expedition.endsSim) return state;
  const pairStories = state.stories.pairs[expedition.pairId];
  const current = pairStories?.current;
  if (!pairStories || !current) return { ...state, stories: { ...state.stories, expedition: null } };
  const episodes = current.episodes.map((episode, index) =>
    index === expedition.episode && episode.state === "running"
      ? { ...episode, state: "unlocked" as const, unlockedAt: now }
      : episode,
  ) as typeof current.episodes;
  return {
    ...state,
    stories: {
      pairs: { ...state.stories.pairs, [expedition.pairId]: { ...pairStories, current: { ...current, episodes } } },
      expedition: null,
    },
  };
}
