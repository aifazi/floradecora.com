import { z } from 'zod';

export const createTemplateSchema = z.object({
  key: z.string().min(2).max(80).regex(/^[a-z0-9._-]+$/),
  name: z.string().min(2).max(120),
  subject: z.string().min(2).max(300),
  body: z.string().min(10).max(10000),
});

export const updateTemplateSchema = createTemplateSchema.partial();

export type CreateTemplateDto = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateDto = z.infer<typeof updateTemplateSchema>;
