import assert from "node:assert/strict";
import {
  buildResidentLetterMessages,
  parseResidentLetter,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/prompts/resident-letter";
import type { Fact } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/model/memory";

const base: Fact = {
  factId: 1,
  text: "나만 아는 사건",
  factType: "event",
  knowerIds: ["alice"],
  subjectIds: [],
  visibility: "knowers",
  pairId: null,
  storyId: null,
  occurredAt: "2026-10-29T00:00:00.000Z",
  status: "active",
  supersedes: null,
};
const messages = buildResidentLetterMessages({
  residentId: "alice",
  residentName: "앨리스",
  worldSetting: "차분함",
  activitySummary: "공방 주변을 조사했다",
  worldGuideline: "짧게",
  memory: {
    nextFactId: 4,
    facts: [
      base,
      { ...base, factId: 2, text: "남의 비밀", knowerIds: ["bob"] },
      { ...base, factId: 3, text: "중지된 기억", status: "invalidated" },
    ],
  },
});
const prompt = JSON.stringify(messages);
assert.ok(prompt.includes("나만 아는 사건"));
assert.ok(!prompt.includes("남의 비밀"));
assert.ok(!prompt.includes("중지된 기억"));
assert.deepEqual(parseResidentLetter('{"title":" 안녕 ","body":" 오늘은 맑았어요. "}'), {
  title: "안녕",
  body: "오늘은 맑았어요.",
});
assert.throws(() => parseResidentLetter('{"title":"안녕","body":"내용","reward":999}'));
assert.throws(() => parseResidentLetter(JSON.stringify({ title: "안녕", body: "x".repeat(1001) })));
assert.throws(() => parseResidentLetter("잘못된 응답"));
console.log("Resident letter draft: memory scope and response validation OK");
