import { z } from 'zod';

export const transportTypeSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório'),
});

export type TransportTypeFormValues = z.infer<typeof transportTypeSchema>;
