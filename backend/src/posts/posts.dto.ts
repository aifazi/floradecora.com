import { z } from 'zod';

export const createPostSchema = z.object({
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/, 'slug must be lowercase hyphenated'),
  title: z.string().min(2).max(200),
  excerpt: z.string().min(10).max(300),
  content: z.array(z.string().min(1).max(5000)).min(1).max(20),
  date: z.string().min(4).max(20),
  read: z.string().min(1).max(20),
  tags: z.array(z.string().min(1).max(30)).max(10).default([]),
  cover: z.string().max(500).optional().or(z.literal('')),
  published: z.boolean().optional(),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostDto = z.infer<typeof createPostSchema>;
export type UpdatePostDto = z.infer<typeof updatePostSchema>;
