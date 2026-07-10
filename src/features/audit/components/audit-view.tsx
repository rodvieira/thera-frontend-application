'use client';

import { PageHeader } from '@/components/layout/page-header';
import { useAuditEvents } from '../hooks';
import { AuditTrail } from './audit-trail';

export function AuditView() {
  const { data: events = [], isLoading } = useAuditEvents();

  return (
    <>
      <PageHeader
        title="Auditoria"
        description="Trilha dos eventos relevantes do sistema, para rastreabilidade."
      />
      <div className="max-w-2xl rounded-lg border bg-card p-6">
        <AuditTrail
          events={events}
          isLoading={isLoading}
          emptyMessage="Nenhum evento ainda. Ações em Ordens de Venda aparecerão aqui."
        />
      </div>
    </>
  );
}
