import { z } from 'zod';

export const createServiceSchema = z.object({
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
  title: z.string().min(2).max(120),
  body: z.string().min(10).max(2000),
  icon: z.string().min(1).max(20),
  accent: z.string().max(100).optional(),
  order: z.number().int().min(0).max(100).optional(),
  enabled: z.boolean().optional(),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceDto = z.infer<typeof createServiceSchema>;
export type UpdateServiceDto = z.infer<typeof updateServiceSchema>;
