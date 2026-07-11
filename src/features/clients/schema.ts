import { z } from 'zod';
import { onlyDigits } from '@/lib/utils';

export const clientSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório'),
  document: z
    .string()
    .trim()
    .min(1, 'Documento é obrigatório')
    .refine(
      (value) => onlyDigits(value).length === 14,
      'CNPJ inválido — informe os 14 dígitos',
    ),
  authorizedTransportTypeIds: z
    .array(z.string())
    .min(1, 'Selecione ao menos um tipo de transporte autorizado'),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
