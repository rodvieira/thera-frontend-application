## Why

A Central de Agendamento fecha o elo entre planejar e transportar: define a data e
a janela de entrega de uma OV, confirma o agendamento e permite reagendar. É a
etapa operacional que leva a OV ao status `AGENDADA`.

## What Changes

- Adicionar ao backend mockado: **definir agendamento** (data + janela) e
  **confirmar agendamento**, com auditoria `SCHEDULE_CHANGED`.
- Ao **confirmar**, se a OV está em `PLANEJADA`, avançá-la para `AGENDADA`
  (integra agendamento e fluxo de status), registrando `STATUS_CHANGED`.
- Feature **scheduling**: hooks (agendar/confirmar), schema Zod, diálogo de
  agendamento e a página **Central de Agendamento** (lista de OVs com estado do
  agendamento e ações agendar/confirmar/reagendar).
- Exibir o agendamento no detalhe da OV.

## Capabilities

### New Capabilities
- `scheduling`: definição de data/janela de entrega, confirmação e reagendamento
  de OVs, com auditoria.

## Impact

- **Código**: `src/mocks/data/repository.ts` (+ rotas/handlers), `src/features/scheduling`,
  rota `src/app/(dashboard)/agendamento`, ajuste no detalhe da OV.
- **Disponibilidade** simplificada (janelas fixas; sem calendário de capacidade).
