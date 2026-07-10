## Context

A OV tem um campo `schedule: DeliverySchedule | null` ({ date, window, confirmed }).
O PDF pede definição de data, janela, confirmação e reagendamento, com regras de
disponibilidade simplificadas. O status `AGENDADA` já existe na máquina de estados.

## Goals / Non-Goals

**Goals:**
- Agendar (data + janela), confirmar e reagendar OVs, com auditoria.
- Integrar a confirmação ao fluxo de status (leva a OV a `AGENDADA`).
- Reusar o backend/rotas e os hooks já existentes de OV.

**Non-Goals:**
- Calendário de capacidade/disponibilidade real (simulado: janelas fixas).
- Cancelar agendamento.

## Decisions

- **Janelas fixas** (`MANHA`, `TARDE`, `INTEGRAL`). Disponibilidade simplificada,
  como permitido pelo PDF. Reagendar é apenas redefinir data/janela (volta a
  `confirmed: false`).

- **Confirmar agendamento avança o status quando aplicável.** Se a OV está em
  `PLANEJADA`, confirmar o agendamento a leva a `AGENDADA` (usa `canTransition`),
  registrando `STATUS_CHANGED` além de `SCHEDULE_CHANGED`. _Alternativa:_ manter
  agendamento e status totalmente independentes. Rejeitada por perder a coesão do
  domínio — “confirmar agendamento” é o gatilho natural de `AGENDADA`.

- **Endpoints dedicados**: `PATCH /api/sales-orders/:id/schedule` (definir/reagendar)
  e `POST /api/sales-orders/:id/schedule/confirm` (confirmar). Mantém verbos claros
  e auditoria por ação.

- **Feature `scheduling` consome OVs existentes.** A lista usa `useSalesOrders`; os
  mutations invalidam `orderKeys.all`. Sem duplicar dados.

## Risks / Trade-offs

- **Acoplamento agendamento↔status** → restrito a um único ponto (confirmar) e
  guardado por `canTransition`; não quebra a máquina de estados.
- **Datas no passado** → validadas no schema (data obrigatória; ≥ hoje).

## Open Questions

- Nenhuma; capacidade/disponibilidade fica fora de escopo por decisão explícita.
