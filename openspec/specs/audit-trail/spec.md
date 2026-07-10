# audit-trail Specification

## Purpose
TBD - created by archiving change auditoria. Update Purpose after archive.
## Requirements
### Requirement: Consulta da trilha de auditoria
O sistema SHALL disponibilizar a trilha de eventos de auditoria, ordenada do mais
recente para o mais antigo, com filtro opcional por entidade.

#### Scenario: Trilha global
- **WHEN** o usuário acessa a Auditoria
- **THEN** vê os eventos com data/hora, tipo de ação, entidade e estados anterior/posterior

#### Scenario: Trilha por Ordem de Venda
- **WHEN** o usuário consulta a auditoria de uma OV específica
- **THEN** vê apenas os eventos daquela OV

### Requirement: Registro dos eventos relevantes
O sistema SHALL exibir os eventos das ações relevantes já registradas: criação de
OV, alteração de status e alteração de agendamento.

#### Scenario: Evento de criação aparece na trilha
- **WHEN** uma OV é criada
- **THEN** um evento de criação passa a constar na trilha

