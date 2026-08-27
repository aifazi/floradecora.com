import { z } from 'zod';

export const createContactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  phone: z.string().max(30).optional().or(z.literal('')),
  projectType: z.string().max(80).optional().or(z.literal('')),
  message: z.string().min(10).max(3000),
  botcheck: z.string().optional(),
});

export type CreateContactDto = z.infer<typeof createContactSchema>;
