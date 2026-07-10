import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório'),
  document: z.string().trim(),
  authorizedTransportTypeIds: z
    .array(z.string())
    .min(1, 'Selecione ao menos um tipo de transporte autorizado'),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
