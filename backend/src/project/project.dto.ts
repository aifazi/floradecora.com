import { z } from 'zod';

export const createProjectSchema = z.object({
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/, 'slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(2).max(120),
  type: z.string().min(2).max(80),
  year: z.string().min(4).max(20),
  location: z.string().min(2).max(120),
  area: z.string().min(1).max(80),
  client: z.string().min(1).max(120),
  img: z.string().min(1).max(500),
  gallery: z.array(z.string().min(1).max(500)).max(30).default([]),
  description: z.string().min(10).max(10000),
  services: z.array(z.string().min(1).max(80)).max(20).default([]),
  featured: z.boolean().optional(),
  built: z.boolean().optional(),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
