'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { StatusBadge } from '@/components/status-badge';
import { nextStatus, ORDER_STATUS_LABELS } from '@/domain/order-status';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useClients } from '@/features/clients/hooks';
import { useTransportTypes } from '@/features/transport-types/hooks';
import { useItems } from '@/features/items/hooks';
import { DELIVERY_WINDOW_LABELS } from '@/features/scheduling/schema';
import { useSalesOrder } from '../hooks';
import {
  statusTransitionRequested,
  selectTransitioningId,
} from '../store/orders-slice';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
    </div>
  );
}

export function OrderDetailView({ id }: { id: string }) {
  const { data: order, isLoading, isError } = useSalesOrder(id);
  const { data: clients = [] } = useClients();
  const { data: transportTypes = [] } = useTransportTypes();
  const { data: items = [] } = useItems();
  const dispatch = useAppDispatch();
  const transitioningId = useAppSelector(selectTransitioningId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando…</p>;
  }
  if (isError || !order) {
    return (
      <p className="text-sm text-muted-foreground">
        Ordem de Venda não encontrada.
      </p>
    );
  }

  const clientName = clients.find((c) => c.id === order.clientId)?.name ?? '—';
  const transportName =
    transportTypes.find((t) => t.id === order.transportTypeId)?.name ?? '—';
  const itemName = (itemId: string) =>
    items.find((it) => it.id === itemId)?.name ?? itemId;

  const next = nextStatus(order.status);
  const isTransitioning = transitioningId === order.id;

  const advance = () => {
    if (!next) return;
    dispatch(
      statusTransitionRequested({
        id: order.id,
        currentStatus: order.status,
        nextStatus: next,
      }),
    );
  };

  return (
    <>
      <Link
        href="/ordens"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Ordens de Venda
      </Link>

      <PageHeader
        title={`OV ${order.id.slice(0, 8)}`}
        description="Detalhes e evolução do status da Ordem de Venda."
        action={
          next ? (
            <Button onClick={advance} disabled={isTransitioning}>
              {isTransitioning
                ? 'Avançando…'
                : `Avançar para ${ORDER_STATUS_LABELS[next]}`}
              {!isTransitioning && <ArrowRight className="size-4" />}
            </Button>
          ) : (
            <StatusBadge status={order.status} />
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-lg border bg-card p-5 lg:col-span-2">
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Cliente" value={clientName} />
            <Field label="Transporte" value={transportName} />
            <div>
              <dt className="text-xs text-muted-foreground">Status</dt>
              <dd className="mt-1">
                <StatusBadge status={order.status} />
              </dd>
            </div>
            <Field
              label="Criada em"
              value={new Date(order.createdAt).toLocaleString('pt-BR')}
            />
            <div className="col-span-2">
              <dt className="text-xs text-muted-foreground">Agendamento</dt>
              <dd className="mt-0.5 text-sm font-medium">
                {order.schedule
                  ? `${new Date(
                      `${order.schedule.date}T00:00:00`,
                    ).toLocaleDateString('pt-BR')} · ${
                      DELIVERY_WINDOW_LABELS[order.schedule.window]
                    } ${order.schedule.confirmed ? '(confirmado)' : '(pendente)'}`
                  : 'Sem agendamento'}
              </dd>
            </div>
          </dl>

          <h2 className="mt-6 mb-2 font-display text-sm font-semibold">
            Itens
          </h2>
          <ul className="divide-y rounded-md border">
            {order.items.map((item) => (
              <li
                key={item.itemId}
                className="flex justify-between px-3 py-2 text-sm"
              >
                <span>{itemName(item.itemId)}</span>
                <span className="text-muted-foreground">
                  {item.quantity} un
                </span>
              </li>
            ))}
          </ul>
        </section>

        <aside className="rounded-lg border bg-card p-5">
          <h2 className="mb-3 font-display text-sm font-semibold">
            Fluxo operacional
          </h2>
          <ol className="space-y-2 text-sm">
            {(
              [
                'CRIADA',
                'PLANEJADA',
                'AGENDADA',
                'EM_TRANSPORTE',
                'ENTREGUE',
              ] as const
            ).map((status) => {
              const active = status === order.status;
              return (
                <li
                  key={status}
                  className={
                    active
                      ? 'font-medium text-foreground'
                      : 'text-muted-foreground'
                  }
                >
                  {active ? '→ ' : '   '}
                  {ORDER_STATUS_LABELS[status]}
                </li>
              );
            })}
          </ol>
        </aside>
      </div>
    </>
  );
}
