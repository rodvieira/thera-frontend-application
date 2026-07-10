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
import { TextField } from '@/components/form/text-field';
import { ApiError } from '@/lib/api-client';
import { useNotify } from '@/store/use-notify';
import { itemSchema, type ItemFormValues } from '../schema';
import { useCreateItem } from '../hooks';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemFormDialog({ open, onOpenChange }: Props) {
  const create = useCreateItem();
  const notify = useNotify();

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: { sku: '', name: '', unit: 'UN' },
  });

  useEffect(() => {
    if (open) form.reset({ sku: '', name: '', unit: 'UN' });
  }, [open, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await create.mutateAsync(values);
      notify.success('Item criado');
      onOpenChange(false);
    } catch (error) {
      notify.error(
        error instanceof ApiError ? error.message : 'Erro ao salvar',
      );
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo item</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <TextField
            label="SKU"
            autoFocus
            error={form.formState.errors.sku?.message}
            {...form.register('sku')}
          />
          <TextField
            label="Nome"
            error={form.formState.errors.name?.message}
            {...form.register('name')}
          />
          <TextField
            label="Unidade"
            error={form.formState.errors.unit?.message}
            {...form.register('unit')}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? 'Salvando…' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
