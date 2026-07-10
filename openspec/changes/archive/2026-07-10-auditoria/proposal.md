## Why

O backend já registra eventos de auditoria (criação de OV, alteração de status,
alteração de agendamento). Falta **expor essa trilha** para rastreabilidade —
tanto uma visão global quanto por Ordem de Venda.

## What Changes

- Backend: `listAuditEvents(filters?)` e rota `GET /api/audit-events` (com filtro
  opcional por `entityId`), ordenando do mais recente para o mais antigo.
- Feature **audit**: hook `useAuditEvents`, componente de trilha (data/hora, ação,
  entidade, estado anterior → posterior).
- Página **Auditoria** (item de navegação) com a trilha completa e a trilha por OV
  no detalhe da Ordem de Venda.

## Capabilities

### New Capabilities
- `audit-trail`: consulta e exibição dos eventos de auditoria do sistema.

## Impact

- **Código**: `src/mocks/data/repository.ts` (+ rota/handler), `src/features/audit`,
  rota `src/app/(dashboard)/auditoria`, item de navegação, trilha no detalhe da OV.
