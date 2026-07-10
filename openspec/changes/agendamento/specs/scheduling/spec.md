## ADDED Requirements

### Requirement: Definição de agendamento
O sistema SHALL permitir definir a data de entrega e a janela de atendimento de
uma OV, registrando auditoria de alteração de agendamento.

#### Scenario: Definir data e janela
- **WHEN** o usuário define data e janela para uma OV
- **THEN** o agendamento é salvo como não confirmado e um evento de auditoria é registrado

#### Scenario: Data obrigatória
- **WHEN** o usuário tenta agendar sem data
- **THEN** a operação é rejeitada informando que a data é obrigatória

### Requirement: Confirmação de agendamento
O sistema SHALL permitir confirmar o agendamento de uma OV que já tenha data e
janela definidas. Confirmar uma OV em `PLANEJADA` a avança para `AGENDADA`.

#### Scenario: Confirmar agendamento
- **WHEN** o usuário confirma o agendamento de uma OV `PLANEJADA` com data definida
- **THEN** o agendamento fica confirmado e a OV passa para `AGENDADA`

#### Scenario: Confirmar sem data
- **WHEN** o usuário tenta confirmar uma OV sem agendamento definido
- **THEN** a operação é rejeitada

### Requirement: Reagendamento
O sistema SHALL permitir redefinir data/janela de uma OV já agendada.

#### Scenario: Reagendar
- **WHEN** o usuário altera a data/janela de uma OV agendada
- **THEN** o novo agendamento é salvo como não confirmado e auditado
