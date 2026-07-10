'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TextField } from '@/components/form/text-field';
import { ApiError } from '@/lib/api-client';
import { useNotify } from '@/store/use-notify';
import type { SalesOrder } from '@/domain/types';
import {
  scheduleSchema,
  type ScheduleFormValues,
  DELIVERY_WINDOW_LABELS,
} from '../schema';
import { useScheduleDelivery } from '../hooks';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: SalesOrder | null;
}

export function ScheduleDialog({ open, onOpenChange, order }: Props) {
  const schedule = useScheduleDelivery();
  const notify = useNotify();

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: { date: '', window: 'MANHA' },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        date: order?.schedule?.date ?? '',
        window: order?.schedule?.window ?? 'MANHA',
      });
    }
  }, [open, order, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!order) return;
    try {
      await schedule.mutateAsync({ id: order.id, input: values });
      notify.success('Agendamento salvo');
      onOpenChange(false);
    } catch (error) {
      notify.error(
        error instanceof ApiError ? error.message : 'Erro ao agendar',
      );
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {order?.schedule ? 'Reagendar entrega' : 'Agendar entrega'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <TextField
            label="Data de entrega"
            type="date"
            error={form.formState.errors.date?.message}
            {...form.register('date')}
          />

          <div className="space-y-2">
            <Label>Janela de atendimento</Label>
            <Controller
              control={form.control}
              name="window"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DELIVERY_WINDOW_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={schedule.isPending}>
              {schedule.isPending ? 'Salvando…' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
