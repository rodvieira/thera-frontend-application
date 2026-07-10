'use client';

import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2, Plus } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldError } from '@/components/field-error';
import { ApiError } from '@/lib/api-client';
import { useNotify } from '@/store/use-notify';
import { useClients } from '@/features/clients/hooks';
import { useTransportTypes } from '@/features/transport-types/hooks';
import { useItems } from '@/features/items/hooks';
import { salesOrderSchema, type SalesOrderFormValues } from '../schema';
import { useCreateSalesOrder } from '../hooks';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EMPTY: SalesOrderFormValues = {
  clientId: '',
  transportTypeId: '',
  items: [],
};

export function OrderFormDialog({ open, onOpenChange }: Props) {
  const { data: clients = [] } = useClients();
  const { data: transportTypes = [] } = useTransportTypes();
  const { data: items = [] } = useItems();
  const create = useCreateSalesOrder();
  const notify = useNotify();

  const form = useForm<SalesOrderFormValues>({
    resolver: zodResolver(salesOrderSchema),
    defaultValues: EMPTY,
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const [itemToAdd, setItemToAdd] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (open) {
      form.reset(EMPTY);
      setItemToAdd('');
      setQuantity(1);
    }
  }, [open, form]);

  const clientId = form.watch('clientId');
  const selectedClient = clients.find((c) => c.id === clientId);
  const authorizedTransports = transportTypes.filter((t) =>
    selectedClient?.authorizedTransportTypeIds.includes(t.id),
  );

  // Ao trocar de cliente, limpa transporte que deixou de ser autorizado.
  useEffect(() => {
    const current = form.getValues('transportTypeId');
    if (current && !authorizedTransports.some((t) => t.id === current)) {
      form.setValue('transportTypeId', '');
    }
  }, [clientId, authorizedTransports, form]);

  const itemName = (id: string) => items.find((it) => it.id === id)?.name ?? id;

  const addItem = () => {
    if (!itemToAdd || quantity < 1) return;
    if (fields.some((f) => f.itemId === itemToAdd)) {
      notify.error('Item já adicionado');
      return;
    }
    append({ itemId: itemToAdd, quantity });
    setItemToAdd('');
    setQuantity(1);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await create.mutateAsync(values);
      notify.success('Ordem de Venda criada');
      onOpenChange(false);
    } catch (error) {
      notify.error(error instanceof ApiError ? error.message : 'Erro ao criar');
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova Ordem de Venda</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Cliente</Label>
            <Controller
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={form.formState.errors.clientId?.message} />
          </div>

          <div className="space-y-2">
            <Label>Tipo de transporte</Label>
            <Controller
              control={form.control}
              name="transportTypeId"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!selectedClient}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        selectedClient
                          ? 'Selecione o transporte'
                          : 'Selecione um cliente primeiro'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {authorizedTransports.map((transport) => (
                      <SelectItem key={transport.id} value={transport.id}>
                        {transport.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-xs text-muted-foreground">
              Apenas transportes autorizados para o cliente são listados.
            </p>
            <FieldError
              message={form.formState.errors.transportTypeId?.message}
            />
          </div>

          <div className="space-y-2">
            <Label>Itens</Label>
            <div className="flex gap-2">
              <Select
                value={itemToAdd}
                onValueChange={(value) => setItemToAdd(value ?? '')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um item" />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.sku} — {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20"
                aria-label="Quantidade"
              />
              <Button type="button" variant="outline" onClick={addItem}>
                <Plus className="size-4" />
              </Button>
            </div>

            {fields.length > 0 && (
              <ul className="divide-y rounded-md border">
                {fields.map((field, index) => (
                  <li
                    key={field.id}
                    className="flex items-center justify-between px-3 py-2 text-sm"
                  >
                    <span>{itemName(field.itemId)}</span>
                    <span className="flex items-center gap-3">
                      <span className="text-muted-foreground">
                        {field.quantity} un
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        aria-label="Remover item"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <FieldError message={form.formState.errors.items?.message} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? 'Criando…' : 'Criar OV'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
