## 1. Backend

- [x] 1.1 `listAuditEvents(filters?)` no repositório (ordena desc; filtro por entityId) + rota `GET /api/audit-events`
- [x] 1.2 Handler MSW

## 2. Feature audit

- [x] 2.1 API + hook `useAuditEvents(entityId?)`
- [x] 2.2 Componente `AuditTrail` (data/hora, ação, entidade, anterior → posterior)

## 3. UI

- [x] 3.1 Página Auditoria + item de navegação
- [x] 3.2 Trilha por OV no detalhe da Ordem de Venda

## 4. Fechamento

- [x] 4.1 Rodar lint + typecheck + test + build (verificação por curl)
