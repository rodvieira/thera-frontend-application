'use client';

import { useState } from 'react';
import { CalendarPlus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable, type Column } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import type { SalesOrder } from '@/domain/types';
import { ApiError } from '@/lib/api-client';
import { useNotify } from '@/store/use-notify';
import { useClients } from '@/features/clients/hooks';
import { useSalesOrders } from '@/features/orders/hooks';
import { DELIVERY_WINDOW_LABELS } from '../schema';
import { useConfirmSchedule } from '../hooks';
import { ScheduleDialog } from './schedule-dialog';

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR');
}

export function SchedulingView() {
  const { data: orders = [], isLoading } = useSalesOrders();
  const { data: clients = [] } = useClients();
  const confirm = useConfirmSchedule();
  const notify = useNotify();
  const [selected, setSelected] = useState<SalesOrder | null>(null);
  const [open, setOpen] = useState(false);

  const clientName = (id: string) =>
    clients.find((c) => c.id === id)?.name ?? id;

  const openSchedule = (order: SalesOrder) => {
    setSelected(order);
    setOpen(true);
  };

  const onConfirm = async (order: SalesOrder) => {
    try {
      await confirm.mutateAsync(order.id);
      notify.success('Agendamento confirmado');
    } catch (error) {
      notify.error(
        error instanceof ApiError ? error.message : 'Erro ao confirmar',
      );
    }
  };

  const columns: Column<SalesOrder>[] = [
    {
      header: 'OV',
      className: 'font-mono text-xs',
      cell: (row) => row.id.slice(0, 8),
    },
    { header: 'Cliente', cell: (row) => clientName(row.clientId) },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Agendamento',
      cell: (row) =>
        row.schedule ? (
          <span className="flex items-center gap-2">
            {formatDate(row.schedule.date)} ·{' '}
            {DELIVERY_WINDOW_LABELS[row.schedule.window].split(' ')[0]}
            {row.schedule.confirmed ? (
              <Badge variant="secondary">Confirmado</Badge>
            ) : (
              <Badge variant="outline">Pendente</Badge>
            )}
          </span>
        ) : (
          <span className="text-muted-foreground">Sem agendamento</span>
        ),
    },
    {
      header: '',
      className: 'w-56 text-right',
      cell: (row) => (
        <span className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => openSchedule(row)}>
            <CalendarPlus className="size-4" />
            {row.schedule ? 'Reagendar' : 'Agendar'}
          </Button>
          {row.schedule && !row.schedule.confirmed && (
            <Button
              size="sm"
              onClick={() => onConfirm(row)}
              disabled={confirm.isPending}
            >
              <Check className="size-4" />
              Confirmar
            </Button>
          )}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Central de Agendamento"
        description="Defina data e janela de entrega, confirme e reagende as Ordens de Venda."
      />
      <DataTable
        columns={columns}
        data={orders}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="Nenhuma Ordem de Venda para agendar."
      />
      <ScheduleDialog open={open} onOpenChange={setOpen} order={selected} />
    </>
  );
}
