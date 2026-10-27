// Reading and writing the memory ledger by perspective (plan §7.7). Pure.
//   - knownBy(): the facts one resident may use — active, and known by them or public. Filtering happens before any
//     prompt is assembled; nothing is taken out of a combined list afterwards.
//   - sharedBy(): what every participant of a scene knows. A scene prompt reads only this (plus public facts), so one
//     resident's private memories never reach a scene with someone who does not know them.
//   - appendFacts(): new facts, numbered, capped (oldest corrected/invalidated go first, then oldest).
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
  let all = [...memory.facts, ...added];
  if (all.length > MEMORY_LIMIT) {
    const overflow = all.length - MEMORY_LIMIT;
    const retired = new Set(
      all
        .filter((fact) => fact.status !== "active")
        .slice(0, overflow)
        .map((fact) => fact.factId),
    );
    all = all.filter((fact) => !retired.has(fact.factId));
    if (all.length > MEMORY_LIMIT) all = all.slice(all.length - MEMORY_LIMIT);
  }
  return { facts: all, nextFactId };
}
