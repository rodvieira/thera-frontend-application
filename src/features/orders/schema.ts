import { z } from 'zod';

export const salesOrderSchema = z.object({
  clientId: z.string().min(1, 'Selecione um cliente'),
  transportTypeId: z.string().min(1, 'Selecione um tipo de transporte'),
  items: z
    .array(
      z.object({
        itemId: z.string().min(1, 'Selecione um item'),
        quantity: z
          .number()
          .int()
          .positive('Quantidade deve ser maior que zero'),
      }),
    )
    .min(1, 'Adicione ao menos um item'),
});

export type SalesOrderFormValues = z.infer<typeof salesOrderSchema>;
