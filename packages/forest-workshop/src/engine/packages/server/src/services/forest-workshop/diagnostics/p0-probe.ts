// P0 connection proof (plan §10, §14): runs each host contract Forest Workshop will build on and reports what the
// running Engine actually did. It writes only throwaway `fw-p0-probe` documents and removes them before returning.
// It never writes characters or personas and never calls a provider (fitContext only estimates tokens).
import { randomUUID } from "node:crypto";
import { PACKAGE_ID, type HostDocumentRecord, type HostRuntime } from "../host/engine-adapter";

export type ProbeStatus = "pass" | "fail" | "unavailable";

export interface ProbeCheck {
  id: string;
  label: string;
  status: ProbeStatus;
  detail: string;
}

export interface ProbeReport {
  ranAt: string;
  checks: ProbeCheck[];
}

const PROBE_KIND = "fw-p0-probe";

class RollbackSignal extends Error {}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function check(
  checks: ProbeCheck[],
  id: string,
  label: string,
  run: () => Promise<{ status: ProbeStatus; detail: string }>,
) {
  try {
    checks.push({ id, label, ...(await run()) });
  } catch (error) {
    checks.push({ id, label, status: "fail", detail: describeError(error) });
  }
}

function probeDocument(id: string, now: string, marker: string) {
  return {
    id,
    packageId: PACKAGE_ID,
    kind: PROBE_KIND,
    name: "Forest Workshop P0 probe",
    description: "Temporary document written and removed by the P0 connection check.",
    data: { marker },
    createdAt: now,
    updatedAt: now,
  };
}

export async function runP0Probe(runtime: HostRuntime): Promise<ProbeReport> {
  const checks: ProbeCheck[] = [];
  const resources = runtime.resources;
  const persistence = runtime.persistence;

  await check(checks, "resources.characters", "캐릭터 목록 읽기 (읽기 전용)", async () => {
    if (typeof resources?.listCharacters !== "function") return { status: "unavailable", detail: "호스트에 없음" };
    const records = await resources.listCharacters();
    const withData = records.filter((record) => typeof record.id === "string" && record.data != null).length;
    return { status: "pass", detail: `${records.length}명, ID·원본 자료가 있는 항목 ${withData}명` };
  });

  await check(checks, "resources.personas", "페르소나 목록 읽기 (읽기 전용)", async () => {
    if (typeof resources?.listPersonas !== "function") return { status: "unavailable", detail: "호스트에 없음" };
    const records = await resources.listPersonas();
    const withData = records.filter((record) => typeof record.id === "string" && record.data != null).length;
    return { status: "pass", detail: `${records.length}명, ID·원본 자료가 있는 항목 ${withData}명` };
  });

  await check(checks, "languageModels.fitContext", "언어 모델 연결 선택·컨텍스트 맞춤 (생성 호출 없음)", async () => {
    if (typeof runtime.languageModels?.resolve !== "function")
      return { status: "unavailable", detail: "호스트에 없음" };
    let model;
    try {
      model = await runtime.languageModels.resolve(null);
    } catch (error) {
      return { status: "unavailable", detail: `기본 연결을 고르지 못함: ${describeError(error)}` };
    }
    const fit = model.fitContext(
      [
        { role: "system", content: "Forest Workshop connection check." },
        { role: "user", content: "숲속 공방 연결 점검" },
      ],
      { maxTokens: 64 },
    );
    if (!Number.isFinite(fit.estimatedTokensBefore) || !Array.isArray(fit.messages)) {
      return { status: "fail", detail: "fitContext 결과 형식이 예상과 다름" };
    }
    const context = model.maxContext ? `${model.maxContext} 토큰` : "한도 미상";
    return {
      status: "pass",
      detail: `연결 ${model.connectionId} · 모델 ${model.model} · 컨텍스트 ${context} · 추정 ${fit.estimatedTokensBefore}→${fit.estimatedTokensAfter} 토큰`,
    };
  });

  const documents = persistence?.documents;
  const transaction = persistence?.transaction?.bind(persistence);
  if (!documents || !transaction) {
    checks.push({
      id: "persistence",
      label: "문서 저장·트랜잭션",
      status: "unavailable",
      detail: "호스트에 없음",
    });
    return { ranAt: new Date().toISOString(), checks };
  }

  const primaryId = `fw-p0-probe-${randomUUID()}`;
  const rolledBackId = `fw-p0-probe-${randomUUID()}`;
  let current: HostDocumentRecord | null = null;
  try {
    await check(checks, "documents.create", "패키지 문서 생성", async () => {
      const now = new Date().toISOString();
      current = await documents.create(probeDocument(primaryId, now, "created"));
      return current.revision === 1
        ? { status: "pass", detail: `revision ${current.revision}` }
        : { status: "fail", detail: `revision이 1이 아님: ${current.revision}` };
    });

    await check(checks, "documents.cas", "expectedRevision 갱신과 충돌 감지", async () => {
      if (!current) return { status: "fail", detail: "생성 단계가 실패해 확인할 수 없음" };
      const base = current.revision;
      const updated = await documents.update({
        id: primaryId,
        packageId: PACKAGE_ID,
        expectedRevision: base,
        name: current.name,
        description: current.description,
        data: { marker: "updated" },
        updatedAt: new Date().toISOString(),
      });
      if (!updated || updated.revision !== base + 1) return { status: "fail", detail: "정상 revision 갱신 실패" };
      current = updated;
      const stale = await documents.update({
        id: primaryId,
        packageId: PACKAGE_ID,
        expectedRevision: base,
        name: updated.name,
        description: updated.description,
        data: { marker: "stale-write" },
        updatedAt: new Date().toISOString(),
      });
      if (stale !== null) return { status: "fail", detail: "오래된 revision 쓰기가 거절되지 않음" };
      const reread = await documents.getById(PACKAGE_ID, primaryId);
      const marker = (reread?.data as { marker?: unknown } | undefined)?.marker;
      if (reread?.revision !== base + 1 || marker !== "updated") {
        return { status: "fail", detail: "충돌 쓰기 후 저장 내용이 바뀜" };
      }
      return { status: "pass", detail: `revision ${base}→${base + 1}, 오래된 쓰기는 null로 거절` };
    });

    await check(checks, "persistence.transaction", "트랜잭션 원자성 (실패 시 되돌림)", async () => {
      if (!current) return { status: "fail", detail: "생성 단계가 실패해 확인할 수 없음" };
      const before = current;
      try {
        await transaction(async (session) => {
          const now = new Date().toISOString();
          await session.documents.create(probeDocument(rolledBackId, now, "must-roll-back"));
          const inside = await session.documents.update({
            id: primaryId,
            packageId: PACKAGE_ID,
            expectedRevision: before.revision,
            name: before.name,
            description: before.description,
            data: { marker: "must-roll-back" },
            updatedAt: now,
          });
          if (!inside) throw new Error("트랜잭션 안의 갱신이 실패함");
          throw new RollbackSignal("rollback");
        });
        return { status: "fail", detail: "트랜잭션이 의도한 오류를 전달하지 않음" };
      } catch (error) {
        if (!(error instanceof RollbackSignal)) throw error;
      }
      const leaked = await documents.getById(PACKAGE_ID, rolledBackId);
      const primary = await documents.getById(PACKAGE_ID, primaryId);
      const marker = (primary?.data as { marker?: unknown } | undefined)?.marker;
      if (leaked) return { status: "fail", detail: "실패한 트랜잭션의 새 문서가 남음" };
      if (primary?.revision !== before.revision || marker !== "updated") {
        return { status: "fail", detail: "실패한 트랜잭션의 갱신이 남음" };
      }
      return { status: "pass", detail: "생성·갱신 모두 되돌려짐" };
    });

    await check(checks, "documents.remove", "revision 확인 삭제", async () => {
      if (!current) return { status: "fail", detail: "생성 단계가 실패해 확인할 수 없음" };
      const staleRemoved = await documents.remove(PACKAGE_ID, primaryId, current.revision - 1);
      if (staleRemoved) return { status: "fail", detail: "오래된 revision으로 삭제됨" };
      const removed = await documents.remove(PACKAGE_ID, primaryId, current.revision);
      if (!removed) return { status: "fail", detail: "현재 revision으로 삭제 실패" };
      current = null;
      return { status: "pass", detail: "오래된 revision 삭제 거절, 현재 revision 삭제 성공" };
    });
  } finally {
    // Leave nothing behind even when a check failed midway.
    for (const id of [primaryId, rolledBackId]) {
      const leftover = await documents.getById(PACKAGE_ID, id).catch(() => null);
      if (leftover) await documents.remove(PACKAGE_ID, id, leftover.revision).catch(() => false);
    }
  }

  return { ranAt: new Date().toISOString(), checks };
}
