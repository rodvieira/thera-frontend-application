import { cn } from '@/lib/utils';
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from '@/domain/order-status';
import type { OrderStatus } from '@/domain/types';

const BAR_CLASS: Record<OrderStatus, string> = {
  CRIADA: 'bg-status-criada',
  PLANEJADA: 'bg-status-planejada',
  AGENDADA: 'bg-status-agendada',
  EM_TRANSPORTE: 'bg-status-em-transporte',
  ENTREGUE: 'bg-status-entregue',
};

/**
 * Distribuição de OVs por status (barras horizontais). Rótulo + valor tornam a
 * leitura acessível (a cor é reforço, não a única informação).
 */
export function StatusDistribution({
  counts,
}: {
  counts: Record<OrderStatus, number>;
}) {
  const max = Math.max(1, ...ORDER_STATUSES.map((status) => counts[status]));

  return (
    <ul className="space-y-3">
      {ORDER_STATUSES.map((status) => {
        const value = counts[status];
        const pct = value > 0 ? Math.max((value / max) * 100, 4) : 0;
        return (
          <li key={status} className="flex items-center gap-3 text-sm">
            <span className="w-28 shrink-0 text-muted-foreground">
              {ORDER_STATUS_LABELS[status]}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn('h-full rounded-full', BAR_CLASS[status])}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-6 text-right font-medium tabular-nums">
              {value}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
