import { ORDER_STATUSES, type OrderStatus } from './types';

/**
 * Máquina de estados da Ordem de Venda (linear estrita).
 *
 * Cada status aponta para seu único sucessor válido. Concentrar a regra neste
 * mapa torna trivial evoluir o fluxo sem tocar nos consumidores.
 */
const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  CRIADA: 'PLANEJADA',
  PLANEJADA: 'AGENDADA',
  AGENDADA: 'EM_TRANSPORTE',
  EM_TRANSPORTE: 'ENTREGUE',
  ENTREGUE: null,
};

/** Rótulos legíveis para exibição na UI. */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  CRIADA: 'Criada',
  PLANEJADA: 'Planejada',
  AGENDADA: 'Agendada',
  EM_TRANSPORTE: 'Em transporte',
  ENTREGUE: 'Entregue',
};

/** Erro de negócio: tentativa de transição fora da sequência permitida. */
export class InvalidTransitionError extends Error {
  constructor(
    public readonly from: OrderStatus,
    public readonly to: OrderStatus,
  ) {
    super(`Transição inválida: ${from} → ${to}`);
    this.name = 'InvalidTransitionError';
  }
}

/** Próximo status válido, ou `null` se for estado final. */
export function nextStatus(status: OrderStatus): OrderStatus | null {
  return NEXT_STATUS[status];
}

/** `true` se `status` é o estado final do fluxo (ENTREGUE). */
export function isFinalStatus(status: OrderStatus): boolean {
  return NEXT_STATUS[status] === null;
}

/** `true` se a transição `from → to` é permitida. */
export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return NEXT_STATUS[from] === to;
}

/** Lança `InvalidTransitionError` se a transição não for permitida. */
export function assertTransition(from: OrderStatus, to: OrderStatus): void {
  if (!canTransition(from, to)) {
    throw new InvalidTransitionError(from, to);
  }
}

export { ORDER_STATUSES };
