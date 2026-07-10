import { z } from 'zod';
import type { DeliveryWindow } from '@/domain/types';

export const DELIVERY_WINDOW_LABELS: Record<DeliveryWindow, string> = {
  MANHA: 'Manhã (08h–12h)',
  TARDE: 'Tarde (13h–18h)',
  INTEGRAL: 'Integral (08h–18h)',
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export const scheduleSchema = z.object({
  date: z
    .string()
    .min(1, 'Data é obrigatória')
    .refine((value) => value >= todayIso(), 'A data não pode ser no passado'),
  window: z.enum(['MANHA', 'TARDE', 'INTEGRAL']),
});

export type ScheduleFormValues = z.infer<typeof scheduleSchema>;
