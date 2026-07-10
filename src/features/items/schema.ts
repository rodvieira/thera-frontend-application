import { z } from 'zod';

export const itemSchema = z.object({
  sku: z.string().trim().min(1, 'SKU é obrigatório'),
  name: z.string().trim().min(1, 'Nome é obrigatório'),
  unit: z.string().trim().min(1, 'Unidade é obrigatória'),
});

export type ItemFormValues = z.infer<typeof itemSchema>;
