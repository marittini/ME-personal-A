import { z } from "zod";
export const activitySchema = z
  .object({
    id: z.string().uuid(),
    kind: z.enum(["survey", "patrol"]),
    placeId: z.literal("workshop-edge"),
    residentId: z.string().uuid(),
    startedSim: z.number().int().min(0),
    endsSim: z.number().int().min(0),
    startedAt: z.string().datetime(),
  })
  .strict()
  .refine((a) => a.endsSim > a.startedSim);
export const activityResultSchema = z
  .object({
    id: z.string().uuid(),
    kind: z.enum(["survey", "patrol"]),
    residentId: z.string().uuid(),
    completedAt: z.string().datetime(),
    summary: z.string().min(1).max(160),
    mailId: z.string().min(1).max(80),
  })
  .strict();
export const activitiesSchema = z
  .object({ running: activitySchema.nullable(), completed: z.array(activityResultSchema).max(100) })
  .strict()
  .refine((a) => new Set(a.completed.map((r) => r.id)).size === a.completed.length);
export const initialActivities = () => ({ running: null, completed: [] });
