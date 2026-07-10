## Context

Os eventos já são gravados no `db.auditEvents` pelo repositório (`createAuditEvent`
do domínio) nas ações de OV e agendamento. Esta change apenas expõe e exibe.

## Goals / Non-Goals

**Goals:**
- Consultar a trilha (global e por entidade) e exibi-la de forma legível.
- Reusar o modelo de auditoria do domínio (rótulos de ação).

**Non-Goals:**
- Edição/remoção de eventos (auditoria é append-only).
- Retenção/paginação avançada.

## Decisions

- **Ordenação desc por timestamp** no repositório, para a leitura mais recente
  primeiro. Filtro opcional por `entityId` reusado na trilha por OV.
- **Componente `AuditTrail` reutilizável** entre a página global e o detalhe da
  OV, evitando duplicar a renderização.
- **Rótulos de ação vêm do domínio** (`AUDIT_ACTION_LABELS`), mantendo uma única
  fonte de verdade.

## Risks / Trade-offs

- **Volume** cresce em memória durante a sessão → aceitável para demo; em produção
  seria persistência dedicada. Registrado no README.

## Open Questions

- Nenhuma.
