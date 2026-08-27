import { z } from 'zod';

export const upsertSettingSchema = z.object({
  key: z.string().min(2).max(80).regex(/^[a-z0-9._-]+$/),
  value: z.unknown(),
});

export type UpsertSettingDto = z.infer<typeof upsertSettingSchema>;
