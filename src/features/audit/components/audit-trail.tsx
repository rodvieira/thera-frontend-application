import { AUDIT_ACTION_LABELS, type AuditEvent } from '@/domain/audit';

function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString('pt-BR');
}

interface Props {
  events: AuditEvent[];
  isLoading?: boolean;
  emptyMessage?: string;
}

/** Trilha de eventos de auditoria (reusada na página global e no detalhe da OV). */
export function AuditTrail({ events, isLoading, emptyMessage }: Props) {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando…</p>;
  }
  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {emptyMessage ?? 'Nenhum evento registrado.'}
      </p>
    );
  }

  return (
    <ol className="space-y-4">
      {events.map((event) => (
        <li key={event.id} className="flex gap-3 text-sm">
          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-foreground/40" />
          <div className="min-w-0">
            <p className="font-medium">{AUDIT_ACTION_LABELS[event.action]}</p>
            <p className="text-xs text-muted-foreground">
              {formatTimestamp(event.timestamp)} · {event.entity}{' '}
              <span className="font-mono">{event.entityId.slice(0, 8)}</span>
            </p>
            {(event.previousState || event.nextState) && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {event.previousState ?? '—'} → {event.nextState ?? '—'}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
