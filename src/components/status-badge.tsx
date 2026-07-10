import { cn } from '@/lib/utils';
import { ORDER_STATUS_LABELS } from '@/domain/order-status';
import type { OrderStatus } from '@/domain/types';

const STATUS_CLASS: Record<OrderStatus, string> = {
  CRIADA: 'bg-status-criada/15 text-status-criada',
  PLANEJADA: 'bg-status-planejada/15 text-status-planejada',
  AGENDADA: 'bg-status-agendada/15 text-status-agendada',
  EM_TRANSPORTE: 'bg-status-em-transporte/15 text-status-em-transporte',
  ENTREGUE: 'bg-status-entregue/15 text-status-entregue',
};

/** Selo do status da OV: usa a escala de cores do fluxo operacional. */
export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_CLASS[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
