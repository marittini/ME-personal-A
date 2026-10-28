// `fw-story` documents: one written scene each, created once and never updated (a retry that finds it returns it).
import { PACKAGE_ID, type HostDocumentStore } from "../host/engine-adapter";
import { DOCUMENT_KIND, documentId } from "../domain/ids";
import { storyDocumentSchema, type StoryDocument } from "../domain/model/story-document";

export async function findStory(
  documents: HostDocumentStore,
  worldId: string,
  storyId: string,
): Promise<StoryDocument | null> {
  const record = await documents.getById(PACKAGE_ID, documentId.story(worldId, storyId));
  if (!record) return null;
  const parsed = storyDocumentSchema.safeParse(record.data);
  if (!parsed.success) throw new Error(`Story ${record.id} is malformed`);
  return parsed.data;
}

export async function listStories(documents: HostDocumentStore, worldId: string): Promise<StoryDocument[]> {
  const records = await documents.list(PACKAGE_ID, DOCUMENT_KIND.story);
  return records
    .filter((record) => record.id.startsWith(`fw-story-${worldId}-`))
    .flatMap((record) => {
      const parsed = storyDocumentSchema.safeParse(record.data);
      if (!parsed.success) throw new Error(`Story ${record.id} is malformed`);
      return [parsed.data];
    });
}

/** Creates the scene; when another request created it first, returns that one (the first write wins). */
export async function createStory(documents: HostDocumentStore, story: StoryDocument): Promise<StoryDocument> {
  try {
    await documents.create({
      id: documentId.story(story.worldId, story.storyId),
      packageId: PACKAGE_ID,
      kind: DOCUMENT_KIND.story,
      name: story.title,
      description: "Forest Workshop scene",
      data: story,
      createdAt: story.generatedAt,
      updatedAt: story.generatedAt,
    });
    return story;
  } catch (error) {
    const existing = await findStory(documents, story.worldId, story.storyId).catch(() => null);
    if (existing) return existing;
    throw error;
  }
}
