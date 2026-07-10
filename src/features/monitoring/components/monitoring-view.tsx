'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/card';
import { DataTable, type Column } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { ORDER_STATUSES } from '@/domain/order-status';
import type { OrderStatus, SalesOrder } from '@/domain/types';
import { useAppSelector } from '@/store/hooks';
import { useSalesOrders } from '@/features/orders/hooks';
import { useClients } from '@/features/clients/hooks';
import { useTransportTypes } from '@/features/transport-types/hooks';
import { selectMonitoringFilters } from '../store/monitoring-slice';
import { StatusDistribution } from './status-distribution';
import { MonitoringFilters } from './monitoring-filters';

export function MonitoringView() {
  const filters = useAppSelector(selectMonitoringFilters);
  const { data: orders = [], isLoading } = useSalesOrders();
  const { data: clients = [] } = useClients();
  const { data: transportTypes = [] } = useTransportTypes();

  const clientName = (id: string) =>
    clients.find((c) => c.id === id)?.name ?? id;
  const transportName = (id: string) =>
    transportTypes.find((t) => t.id === id)?.name ?? id;

  // Agregados: filtra por cliente/transporte/data (não por status), para o
  // gráfico de distribuição por status permanecer informativo.
  const aggregateSet = useMemo(
    () =>
      orders.filter(
        (o) =>
          (!filters.clientId || o.clientId === filters.clientId) &&
          (!filters.transportTypeId ||
            o.transportTypeId === filters.transportTypeId) &&
          (!filters.date || o.schedule?.date === filters.date),
      ),
    [orders, filters.clientId, filters.transportTypeId, filters.date],
  );

  const counts = useMemo(
    () =>
      ORDER_STATUSES.reduce(
        (acc, status) => {
          acc[status] = aggregateSet.filter((o) => o.status === status).length;
          return acc;
        },
        {} as Record<OrderStatus, number>,
      ),
    [aggregateSet],
  );

  const tableRows = useMemo(
    () =>
      filters.status
        ? aggregateSet.filter((o) => o.status === filters.status)
        : aggregateSet,
    [aggregateSet, filters.status],
  );

  const columns: Column<SalesOrder>[] = [
    {
      header: 'OV',
      className: 'font-mono text-xs',
      cell: (row) => row.id.slice(0, 8),
    },
    { header: 'Cliente', cell: (row) => clientName(row.clientId) },
    { header: 'Transporte', cell: (row) => transportName(row.transportTypeId) },
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
        title="Monitoramento Operacional"
        description="Acompanhe o fluxo das Ordens de Venda com filtros e indicadores."
      />

      <MonitoringFilters />

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <p className="text-xs text-muted-foreground">Total (filtrado)</p>
          <p className="mt-1 font-display text-3xl font-semibold tabular-nums">
            {aggregateSet.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            de {orders.length} no total
          </p>
        </Card>
        <Card className="lg:col-span-2">
          <p className="mb-4 text-xs text-muted-foreground">
            Distribuição por status
          </p>
          <StatusDistribution counts={counts} />
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={tableRows}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="Nenhuma Ordem de Venda para os filtros selecionados."
      />
    </>
  );
}
