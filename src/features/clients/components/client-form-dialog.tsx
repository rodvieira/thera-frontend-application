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
import { Label } from '@/components/ui/label';
import { TextField } from '@/components/form/text-field';
import { cn } from '@/lib/utils';
import { ApiError } from '@/lib/api-client';
import { useNotify } from '@/store/use-notify';
import type { Client } from '@/domain/types';
import { useTransportTypes } from '@/features/transport-types/hooks';
import { clientSchema, type ClientFormValues } from '../schema';
import { useCreateClient, useUpdateClient } from '../hooks';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Client | null;
}

const EMPTY: ClientFormValues = {
  name: '',
  document: '',
  authorizedTransportTypeIds: [],
};

export function ClientFormDialog({ open, onOpenChange, editing }: Props) {
  const { data: transportTypes = [] } = useTransportTypes();
  const create = useCreateClient();
  const update = useUpdateClient();
  const notify = useNotify();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(
      editing
        ? {
            name: editing.name,
            document: editing.document,
            authorizedTransportTypeIds: editing.authorizedTransportTypeIds,
          }
        : EMPTY,
    );
  }, [open, editing, form]);

  const selected = form.watch('authorizedTransportTypeIds');

  const toggleTransport = (id: string) => {
    const set = new Set(selected);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    form.setValue('authorizedTransportTypeIds', [...set], {
      shouldValidate: true,
    });
  };

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, input: values });
        notify.success('Cliente atualizado');
      } else {
        await create.mutateAsync(values);
        notify.success('Cliente criado');
      }
      onOpenChange(false);
    } catch (error) {
      notify.error(
        error instanceof ApiError ? error.message : 'Erro ao salvar',
      );
    }
  });

  const pending = create.isPending || update.isPending;
  const transportError =
    form.formState.errors.authorizedTransportTypeIds?.message;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? 'Editar cliente' : 'Novo cliente'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <TextField
            label="Nome"
            autoFocus
            error={form.formState.errors.name?.message}
            {...form.register('name')}
          />
          <TextField
            label="Documento (CNPJ)"
            error={form.formState.errors.document?.message}
            {...form.register('document')}
          />

          <div className="space-y-2">
            <Label>Transportes autorizados</Label>
            <div className="flex flex-wrap gap-2">
              {transportTypes.map((transport) => {
                const active = selected.includes(transport.id);
                return (
                  <button
                    key={transport.id}
                    type="button"
                    onClick={() => toggleTransport(transport.id)}
                    aria-pressed={active}
                    className={cn(
                      'rounded-full border px-3 py-1 text-sm transition-colors',
                      active
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border hover:bg-accent',
                    )}
                  >
                    {transport.name}
                  </button>
                );
              })}
            </div>
            {transportError && (
              <p className="text-sm text-destructive">{transportError}</p>
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
