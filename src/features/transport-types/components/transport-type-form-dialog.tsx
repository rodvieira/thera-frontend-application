'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiError } from '@/lib/api-client';
import { useNotify } from '@/store/use-notify';
import type { TransportType } from '@/domain/types';
import { transportTypeSchema, type TransportTypeFormValues } from '../schema';
import { useCreateTransportType, useUpdateTransportType } from '../hooks';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: TransportType | null;
}

export function TransportTypeFormDialog({
  open,
  onOpenChange,
  editing,
}: Props) {
  const create = useCreateTransportType();
  const update = useUpdateTransportType();
  const notify = useNotify();

  const form = useForm<TransportTypeFormValues>({
    resolver: zodResolver(transportTypeSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (open) form.reset({ name: editing?.name ?? '' });
  }, [open, editing, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, input: values });
        notify.success('Tipo de transporte atualizado');
      } else {
        await create.mutateAsync(values);
        notify.success('Tipo de transporte criado');
      }
      onOpenChange(false);
    } catch (error) {
      notify.error(
        error instanceof ApiError ? error.message : 'Erro ao salvar',
      );
    }
  });

  const pending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? 'Editar tipo de transporte' : 'Novo tipo de transporte'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tt-name">Nome</Label>
            <Input id="tt-name" autoFocus {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Salvando…' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
