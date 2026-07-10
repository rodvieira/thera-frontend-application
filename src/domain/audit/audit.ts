/**
 * Modelo de auditoria: eventos relevantes para rastreabilidade.
 */

export type AuditAction =
  'ORDER_CREATED' | 'STATUS_CHANGED' | 'SCHEDULE_CHANGED' | 'TRANSPORT_CHANGED';

/** Rótulos legíveis das ações auditadas. */
export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  ORDER_CREATED: 'Criação de OV',
  STATUS_CHANGED: 'Alteração de status',
  SCHEDULE_CHANGED: 'Alteração de agendamento',
  TRANSPORT_CHANGED: 'Alteração de transporte',
};

export interface AuditEvent {
  id: string;
  timestamp: string; // ISO 8601
  action: AuditAction;
  entity: string;
  entityId: string;
  previousState: string | null;
  nextState: string | null;
}

export interface CreateAuditEventInput {
  action: AuditAction;
  entity: string;
  entityId: string;
  previousState?: string | null;
  nextState?: string | null;
}

/** Metadados injetáveis para tornar a criação determinística em testes. */
export interface AuditEventMeta {
  id?: string;
  timestamp?: string;
}

/**
 * Cria um evento de auditoria. `id` e `timestamp` são gerados por padrão, mas
 * podem ser injetados (testes determinísticos).
 */
export function createAuditEvent(
  input: CreateAuditEventInput,
  meta: AuditEventMeta = {},
): AuditEvent {
  return {
    id: meta.id ?? crypto.randomUUID(),
    timestamp: meta.timestamp ?? new Date().toISOString(),
    action: input.action,
    entity: input.entity,
    entityId: input.entityId,
    previousState: input.previousState ?? null,
    nextState: input.nextState ?? null,
  };
}
