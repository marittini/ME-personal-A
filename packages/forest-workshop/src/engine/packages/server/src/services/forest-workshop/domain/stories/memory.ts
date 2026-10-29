// Reading and writing the memory ledger by perspective (plan §7.7). Pure.
//   - knownBy(): the facts one resident may use — active, and known by them or public. Filtering happens before any
//     prompt is assembled; nothing is taken out of a combined list afterwards.
//   - sharedBy(): what every participant of a scene knows. A scene prompt reads only this (plus public facts), so one
//     resident's private memories never reach a scene with someone who does not know them.
//   - appendFacts(): new facts, numbered; refuses when full so history is never silently discarded.
import { FwError } from "../errors";
import { MEMORY_LIMIT, type Fact, type Memory } from "../model/memory";

export function knownBy(memory: Memory, residentId: string): Fact[] {
  return memory.facts.filter(
    (fact) => fact.status === "active" && (fact.visibility === "public" || fact.knowerIds.includes(residentId)),
  );
}

export function sharedBy(memory: Memory, residentIds: readonly string[]): Fact[] {
  return memory.facts.filter(
    (fact) =>
      fact.status === "active" &&
      (fact.visibility === "public" || residentIds.every((id) => fact.knowerIds.includes(id))),
  );
}

export function appendFacts(memory: Memory, facts: ReadonlyArray<Omit<Fact, "factId">>): Memory {
  let nextFactId = memory.nextFactId;
  const added = facts.map((fact) => ({ ...fact, factId: nextFactId++ }));
  const all = [...memory.facts, ...added];
  if (all.length > MEMORY_LIMIT)
    throw new FwError("invalid_payload", { message: "기억 저장 한도에 도달했어요. 기존 기억은 삭제하지 않았어요." });
  return { facts: all, nextFactId };
}
