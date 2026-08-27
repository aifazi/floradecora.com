import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email().max(120),
  password: z.string().min(8).max(128),
});

export type LoginDto = z.infer<typeof loginSchema>;
