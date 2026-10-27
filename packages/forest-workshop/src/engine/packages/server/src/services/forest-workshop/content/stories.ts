// 이야기 탐험 (plan §7.3): a pair's stories come in arcs of three episodes. Each arc here is the stored plan — place,
// episode titles, abstract beats, who takes part, time, preparations and the relation change an episode may bring.
// The words of a scene are written when the player reads it (prompts/story-scene.ts), from the world's memory at that
// moment. Beats name roles ({lead}, {partner}) and never decide feelings, confessions or endings.
// Episode 1 needs one resident (the lead); 2 and 3 need both residents of the pair. Play-test values.
import { isKnownItem } from "./items";
export interface EpisodeDefinition {
  title: string;
  /** What happens, for the scene writer. Roles: {lead}, {partner}. Never shown to the player before reading. */
  beat: string;
  /** "lead" = the lead resident alone; "pair" = both residents of the pair. */
  cast: "lead" | "pair";
  minutes: number;
  /** Taken from usable stock when the expedition leaves; refunded in full if it is cancelled. At most two kinds. */
  preparations: Readonly<Record<string, number>>;
  /** The most the pair's values may change when this episode is read (plan §7.1: at most 1 per axis per episode). */
  relation: { familiarity: number; ease: number };
}

export interface ArcDefinition {
  id: string;
  title: string;
  place: string;
  /** What kind of discovery the arc holds, shown before departure without its content (plan §7.5). */
  discovery: string;
  episodes: readonly [EpisodeDefinition, EpisodeDefinition, EpisodeDefinition];
}

export const ARCS: readonly ArcDefinition[] = [
  {
    id: "trail-marks",
    title: "숲길에 남은 흔적",
    place: "안개 계곡",
    discovery: "옛 표식에 얽힌 단서",
    episodes: [
      {
        title: "숲길의 발자국",
        beat: "{lead}가 안개 낀 숲길에서 누군가 일부러 남긴 작은 표식을 발견하고, 그것을 따라갈지 잠시 망설인다.",
        cast: "lead",
        minutes: 30,
        preparations: { herb: 2 },
        relation: { familiarity: 0, ease: 0 },
      },
      {
        title: "익숙한 글씨",
        beat: "{lead}와 {partner}가 표식을 따라가다 나무 둥치에 새겨진 글씨를 보고, 둘 중 한 사람이 그 글씨체를 어디서 본 듯하다고 느낀다.",
        cast: "pair",
        minutes: 60,
        preparations: { "berry-jam": 1 },
        relation: { familiarity: 1, ease: 0 },
      },
      {
        title: "돌아가는 길",
        beat: "공방으로 돌아오는 길에 {lead}와 {partner}가 표식에 대해 각자 떠올린 것을 조금씩만 나눈다. 다 말하지 않은 것이 남는다.",
        cast: "pair",
        minutes: 90,
        preparations: { "dried-herb": 1 },
        relation: { familiarity: 0, ease: 1 },
      },
    ],
  },
  {
    id: "lantern-market",
    title: "등불 시장의 밤",
    place: "강가 등불 시장",
    discovery: "주민의 오래된 습관",
    episodes: [
      {
        title: "먼저 챙겨 둔 몫",
        beat: "{lead}가 시장에 낼 물건을 고르다가, 누군가를 위해 하나를 따로 챙겨 둔다. 왜 그랬는지는 말하지 않는다.",
        cast: "lead",
        minutes: 30,
        preparations: { "wild-berry": 6 },
        relation: { familiarity: 0, ease: 0 },
      },
      {
        title: "등불 아래 흥정",
        beat: "{lead}와 {partner}가 등불 시장에서 같은 물건을 두고 서로 다른 이유로 고민한다.",
        cast: "pair",
        minutes: 60,
        preparations: { herb: 3 },
        relation: { familiarity: 1, ease: 0 },
      },
      {
        title: "남은 등불",
        beat: "시장이 파할 무렵 {lead}와 {partner}가 마지막 등불이 꺼지기를 함께 기다린다. 말없이 있는 시간이 길다.",
        cast: "pair",
        minutes: 90,
        preparations: { "berry-jam": 1 },
        relation: { familiarity: 0, ease: 1 },
      },
    ],
  },
  {
    id: "rainy-workshop",
    title: "비 오는 날의 공방",
    place: "공방 작업대",
    discovery: "잊고 있던 제작법의 실마리",
    episodes: [
      {
        title: "젖은 장부",
        beat: "비가 들이친 날 {lead}가 젖은 공방 장부를 말리다가 낯선 메모 한 줄을 발견한다.",
        cast: "lead",
        minutes: 30,
        preparations: { wood: 2 },
        relation: { familiarity: 0, ease: 0 },
      },
      {
        title: "작업대에서 나눈 대화",
        beat: "{lead}와 {partner}가 작업대에 나란히 앉아 메모가 무엇을 뜻하는지 서로 다른 짐작을 내놓는다.",
        cast: "pair",
        minutes: 60,
        preparations: { "dried-herb": 1 },
        relation: { familiarity: 1, ease: 0 },
      },
      {
        title: "갠 뒤의 냄새",
        beat: "비가 그친 뒤 {lead}와 {partner}가 메모대로 무언가를 만들어 보고, 결과보다 함께 한 과정이 오래 남는다.",
        cast: "pair",
        minutes: 90,
        preparations: { herb: 2, "berry-jam": 1 },
        relation: { familiarity: 0, ease: 1 },
      },
    ],
  },
];

/** One expedition at a time (plan §7.3: 전용 슬롯 1개, separate from production). */
export const EXPEDITION_SLOTS = 1;
/** What a player choice in a scene adds to the asking resident's trust (once per scene). */
export const CHOICE_TRUST = 1;

const BY_ID = new Map(ARCS.map((arc) => [arc.id, arc]));

export function arcDefinition(arcId: string): ArcDefinition | undefined {
  return BY_ID.get(arcId);
}

/** Refuses broken story data on import: three episodes, known preparation items (at most two kinds), small changes. */
export function validateStories(arcs: readonly ArcDefinition[] = ARCS, isItem: (id: string) => boolean): void {
  const ids = new Set<string>();
  for (const arc of arcs) {
    if (ids.has(arc.id)) throw new Error(`Duplicate arc ${arc.id}`);
    ids.add(arc.id);
    if (arc.episodes[0].cast !== "lead") throw new Error(`Arc ${arc.id}: episode 1 must need one resident`);
    for (const episode of arc.episodes) {
      const items = Object.entries(episode.preparations);
      if (items.length > 2) throw new Error(`Arc ${arc.id}: more than two preparations`);
      for (const [itemId, amount] of items) {
        if (!isItem(itemId) || !Number.isInteger(amount) || amount < 1) throw new Error(`Arc ${arc.id}: bad ${itemId}`);
      }
      for (const value of Object.values(episode.relation)) {
        if (!Number.isInteger(value) || Math.abs(value) > 1) throw new Error(`Arc ${arc.id}: relation over 1`);
      }
      if (!(episode.minutes > 0)) throw new Error(`Arc ${arc.id}: time`);
    }
  }
}

validateStories(ARCS, isKnownItem);
