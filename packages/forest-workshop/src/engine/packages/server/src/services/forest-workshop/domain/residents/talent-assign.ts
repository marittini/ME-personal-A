// A new resident's 전문 분야 and 특기, decided when they are registered (plan §3, §7.2-A). Pure and deterministic: read
// from what the character or persona's own text says (a baker leans to 제작, a scholar to 조사), and from a hash of the
// world and source when the text gives no hint, so the preview shown before registering and the stored result agree.
// The player does not pick them afterwards; the source text is only read.
import { FIELD_IDS, type FieldId } from "../../content/production";
import { talentsOf } from "../../content/talents";
import { sha256Hex } from "../ids";

/** Words that point to a field, in Korean and English. Each hit in the source text counts once. */
const FIELD_WORDS: Record<FieldId, readonly string[]> = {
  gather: [
    "사냥",
    "채집",
    "약초꾼",
    "나무꾼",
    "덫",
    "궁수",
    "숲지기",
    "hunter",
    "forager",
    "ranger",
    "woods",
    "archer",
  ],
  grow: [
    "농부",
    "농사",
    "정원",
    "꽃",
    "식물",
    "씨앗",
    "재배",
    "온실",
    "farmer",
    "garden",
    "plant",
    "flower",
    "herbalist",
  ],
  survey: [
    "학자",
    "연구",
    "조사",
    "서재",
    "지도",
    "탐험",
    "관찰",
    "도서관",
    "탐정",
    "scholar",
    "research",
    "librar",
    "explorer",
    "detective",
  ],
  process: [
    "요리",
    "주방",
    "찻잎",
    "다도",
    "약사",
    "연금",
    "양조",
    "제분",
    "발효",
    "cook",
    "chef",
    "kitchen",
    "alchemist",
    "brew",
    "apothecary",
  ],
  craft: [
    "장인",
    "대장장이",
    "목공",
    "목수",
    "공예",
    "재봉",
    "바느질",
    "뜨개",
    "제빵",
    "craft",
    "smith",
    "carpenter",
    "tailor",
    "baker",
    "artisan",
    "engineer",
  ],
};

export interface SourceText {
  name: string;
  description: string;
  personality: string;
  scenario: string;
}

export interface Talent {
  field: FieldId;
  talentId: string;
}

function hashNumber(seed: string): number {
  return parseInt(sha256Hex(seed).slice(0, 12), 16);
}

export function fieldFromText(source: SourceText, seed: string): FieldId {
  const text = `${source.name}\n${source.description}\n${source.personality}\n${source.scenario}`.toLowerCase();
  const scores = FIELD_IDS.map((field) => ({
    field,
    score: FIELD_WORDS[field].filter((word) => text.includes(word.toLowerCase())).length,
  }));
  const best = Math.max(...scores.map((entry) => entry.score));
  // No hint, or a tie: the hash chooses among the leading fields, the same way every time.
  const leading = scores.filter((entry) => entry.score === best).map((entry) => entry.field);
  return leading[hashNumber(`${seed}:field`) % leading.length]!;
}

/**
 * The field and talent for a resident registered from this source into this world. `field` keeps a field already
 * stored (a world from before talents existed); the talent is then drawn from that field.
 */
export function assignTalent(
  worldId: string,
  kind: string,
  sourceId: string,
  source: SourceText,
  field: FieldId = fieldFromText(source, `${worldId}:${kind}:${sourceId}`),
): Talent {
  const seed = `${worldId}:${kind}:${sourceId}`;
  const options = talentsOf(field);
  return { field, talentId: options[hashNumber(`${seed}:talent`) % options.length]!.id };
}
