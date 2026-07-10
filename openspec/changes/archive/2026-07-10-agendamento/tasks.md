## 1. Backend (repositório + rotas)

- [x] 1.1 `scheduleDelivery(id, {date, window})` e `confirmSchedule(id)` no repositório (auditoria; confirmar avança PLANEJADA→AGENDADA)
- [x] 1.2 Rotas `PATCH /api/sales-orders/[id]/schedule` e `POST /api/sales-orders/[id]/schedule/confirm`
- [x] 1.3 Handlers MSW espelhando as rotas

## 2. Feature scheduling

- [x] 2.1 API + hooks (`useScheduleDelivery`, `useConfirmSchedule`) invalidando `orderKeys`
- [x] 2.2 Schema Zod (data ≥ hoje, janela) + rótulos de janela

## 3. UI

- [x] 3.1 Diálogo de agendamento (data + janela)
- [x] 3.2 Página Central de Agendamento (lista de OVs + estado do agendamento + ações)
- [x] 3.3 Exibir agendamento no detalhe da OV

## 4. Fechamento

- [x] 4.1 Rodar lint + typecheck + test + build (verificação por curl do fluxo)
