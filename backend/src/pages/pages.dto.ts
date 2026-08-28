import { z } from "zod";

export const createPageSchema = z.object({
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/, "slug must be lowercase hyphenated"),
  title: z.string().min(2).max(120),
  blocks: z.any(),
  published: z.boolean().optional(),
});

export const updatePageSchema = createPageSchema.partial();

export type CreatePageDto = z.infer<typeof createPageSchema>;
export type UpdatePageDto = z.infer<typeof updatePageSchema>;