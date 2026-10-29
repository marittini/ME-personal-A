import { z } from "zod";
export const writingGuidelineSchema = z
  .object({
    enabled: z.boolean(),
    text: z.string().max(1000),
    revision: z.number().int().min(0),
    updatedAt: z.string().datetime().nullable(),
  })
  .strict();
export const emptyGuideline = () => ({ enabled: false, text: "", revision: 0, updatedAt: null });
export const guidelinesSchema = z
  .object({ world: writingGuidelineSchema, pairs: z.record(z.string().uuid(), writingGuidelineSchema) })
  .strict();
export const initialGuidelines = () => ({ world: emptyGuideline(), pairs: {} });
