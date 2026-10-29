// Separate immutable archive records. Not wired to the active world until migration and backup are implemented.
import { z } from "zod";
import { activityResultSchema } from "../domain/model/activities";
import { letterSchema } from "../domain/model/mailbox";
import { assertWorldId, sha256Hex, stableStringify } from "../domain/ids";
import { PACKAGE_ID, type HostDocumentStore } from "../host/engine-adapter";

const KIND = "fw-history";
const archiveSchema = z.discriminatedUnion("type", [
  z
    .object({
      version: z.literal(1),
      worldId: z.string().uuid(),
      type: z.literal("activity"),
      value: activityResultSchema,
    })
    .strict(),
  z
    .object({ version: z.literal(1), worldId: z.string().uuid(), type: z.literal("letter"), value: letterSchema })
    .strict(),
]);
export type ArchiveRecord = z.infer<typeof archiveSchema>;
function idOf(record: ArchiveRecord): string {
  return `fw-history-${record.worldId}-${record.type}-${sha256Hex(record.value.id)}`;
}
export async function appendArchive(documents: HostDocumentStore, input: ArchiveRecord, now: string): Promise<void> {
  const record = archiveSchema.parse(input);
  assertWorldId(record.worldId);
  const id = idOf(record);
  const existing = await documents.getById(PACKAGE_ID, id);
  if (existing) {
    if (stableStringify(archiveSchema.parse(existing.data)) !== stableStringify(record))
      throw new Error("Archive identity collision");
    return;
  }
  try {
    await documents.create({
      id,
      packageId: PACKAGE_ID,
      kind: KIND,
      name: record.value.id,
      description: "Forest Workshop archived record",
      data: record,
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    const raced = await documents.getById(PACKAGE_ID, id);
    if (!raced || stableStringify(archiveSchema.parse(raced.data)) !== stableStringify(record)) throw error;
  }
}
export async function listArchive(documents: HostDocumentStore, worldId: string): Promise<ArchiveRecord[]> {
  assertWorldId(worldId);
  const prefix = `fw-history-${worldId}-`;
  const records = await documents.list(PACKAGE_ID, KIND);
  return records
    .filter((record) => record.id.startsWith(prefix))
    .map((record) => {
      const value = archiveSchema.parse(record.data);
      if (value.worldId !== worldId || idOf(value) !== record.id) throw new Error("Archive identity mismatch");
      return value;
    });
}
