'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable, type Column } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import type { SalesOrder } from '@/domain/types';
import { useClients } from '@/features/clients/hooks';
import { useTransportTypes } from '@/features/transport-types/hooks';
import { useSalesOrders } from '../hooks';
import { OrderFormDialog } from './order-form-dialog';

export function OrdersView() {
  const { data: orders = [], isLoading } = useSalesOrders();
  const { data: clients = [] } = useClients();
  const { data: transportTypes = [] } = useTransportTypes();
  const [open, setOpen] = useState(false);

  const clientName = (id: string) =>
    clients.find((c) => c.id === id)?.name ?? id;
  const transportName = (id: string) =>
    transportTypes.find((t) => t.id === id)?.name ?? id;

  const columns: Column<SalesOrder>[] = [
    {
      header: 'OV',
      className: 'font-mono text-xs',
      cell: (row) => row.id.slice(0, 8),
    },
    { header: 'Cliente', cell: (row) => clientName(row.clientId) },
    { header: 'Transporte', cell: (row) => transportName(row.transportTypeId) },
    { header: 'Itens', className: 'w-16', cell: (row) => row.items.length },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      header: '',
      className: 'w-20 text-right',
      cell: (row) => (
        <Link
          href={`/ordens/${row.id}`}
          className="text-sm underline-offset-4 hover:underline"
        >
          Detalhes
        </Link>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Ordens de Venda"
        description="Criar, consultar e acompanhar o status das Ordens de Venda."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Nova OV
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={orders}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="Nenhuma Ordem de Venda ainda. Crie a primeira."
      />
      <OrderFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
