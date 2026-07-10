## 1. Backend (repositório + rotas)

- [ ] 1.1 `scheduleDelivery(id, {date, window})` e `confirmSchedule(id)` no repositório (auditoria; confirmar avança PLANEJADA→AGENDADA)
- [ ] 1.2 Rotas `PATCH /api/sales-orders/[id]/schedule` e `POST /api/sales-orders/[id]/schedule/confirm`
- [ ] 1.3 Handlers MSW espelhando as rotas

## 2. Feature scheduling

- [ ] 2.1 API + hooks (`useScheduleDelivery`, `useConfirmSchedule`) invalidando `orderKeys`
- [ ] 2.2 Schema Zod (data ≥ hoje, janela) + rótulos de janela

## 3. UI

- [ ] 3.1 Diálogo de agendamento (data + janela)
- [ ] 3.2 Página Central de Agendamento (lista de OVs + estado do agendamento + ações)
- [ ] 3.3 Exibir agendamento no detalhe da OV

## 4. Fechamento

- [ ] 4.1 Rodar lint + typecheck + test + build (verificação por curl do fluxo)
