// `fw-command` documents: one per accepted command, written in the same transaction as the world change it caused.
// They make every command idempotent: a resent command finds its record and gets the original result back, and the
// record's payload hash refuses a reused command ID that carries a different request.
import { PACKAGE_ID, type HostDocumentStore } from "../host/engine-adapter";
import { DOCUMENT_KIND, documentId } from "../domain/ids";

export interface CommandRecord {
  schemaVersion: 1;
  worldId: string;
  commandId: string;
  type: string;
  payloadHash: string;
  /** World revision the command produced. */
  revision: number;
  result: Record<string, unknown>;
  acceptedAt: string;
}

function isCommandRecord(value: unknown): value is CommandRecord {
  const record = value as Partial<CommandRecord> | null;
  return Boolean(
    record &&
    record.schemaVersion === 1 &&
    typeof record.commandId === "string" &&
    typeof record.payloadHash === "string" &&
    typeof record.revision === "number" &&
    record.result &&
    typeof record.result === "object",
  );
}

export async function findCommandRecord(
  documents: HostDocumentStore,
  worldId: string,
  commandId: string,
): Promise<CommandRecord | null> {
  const document = await documents.getById(PACKAGE_ID, documentId.command(worldId, commandId));
  if (!document) return null;
  if (!isCommandRecord(document.data)) throw new Error(`Command record ${document.id} is malformed`);
  return document.data;
}

/** Throws if the record already exists (the host refuses a duplicate ID), which rolls the transaction back. */
export async function createCommandRecord(documents: HostDocumentStore, record: CommandRecord): Promise<void> {
  await documents.create({
    id: documentId.command(record.worldId, record.commandId),
    packageId: PACKAGE_ID,
    kind: DOCUMENT_KIND.command,
    name: record.type,
    description: `Forest Workshop command ${record.commandId}`,
    data: record,
    createdAt: record.acceptedAt,
    updatedAt: record.acceptedAt,
  });
}
