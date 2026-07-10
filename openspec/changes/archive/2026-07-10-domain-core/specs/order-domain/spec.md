## ADDED Requirements

### Requirement: Fluxo de status linear estrito
O sistema SHALL permitir apenas transições de status na sequência
CRIADA → PLANEJADA → AGENDADA → EM_TRANSPORTE → ENTREGUE, uma etapa por vez.

#### Scenario: Transição sequencial válida
- **WHEN** uma OV em `PLANEJADA` recebe transição para `AGENDADA`
- **THEN** a transição é permitida

#### Scenario: Transição que pula etapa é rejeitada
- **WHEN** uma OV em `CRIADA` recebe transição para `AGENDADA`
- **THEN** a transição é rejeitada com erro de transição inválida

#### Scenario: Transição de retrocesso é rejeitada
- **WHEN** uma OV em `AGENDADA` recebe transição para `PLANEJADA`
- **THEN** a transição é rejeitada com erro de transição inválida

#### Scenario: Status final não transiciona
- **WHEN** uma OV em `ENTREGUE` recebe qualquer transição
- **THEN** a transição é rejeitada e `ENTREGUE` é reconhecido como estado final

### Requirement: Autorização de transporte por cliente
O sistema SHALL permitir vincular a uma OV apenas um tipo de transporte que
esteja previamente autorizado para o cliente selecionado.

#### Scenario: Transporte autorizado
- **WHEN** o tipo de transporte informado consta na lista de autorizados do cliente
- **THEN** a associação é permitida

#### Scenario: Transporte não autorizado
- **WHEN** o tipo de transporte informado não consta na lista do cliente
- **THEN** a associação é rejeitada com erro de transporte não autorizado

### Requirement: Registro de evento de auditoria
O sistema SHALL registrar eventos de auditoria contendo data/hora, tipo de ação,
entidade afetada e, quando aplicável, estado anterior e posterior.

#### Scenario: Evento de mudança de status
- **WHEN** um evento de auditoria de mudança de status é criado com estado
  anterior e posterior
- **THEN** o evento contém timestamp, ação, entidade, estado anterior e posterior
