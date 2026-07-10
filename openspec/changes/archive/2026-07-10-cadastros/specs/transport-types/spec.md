## ADDED Requirements

### Requirement: Cadastro de tipos de transporte
O sistema SHALL permitir criar, editar e consultar tipos de transporte. Novos
tipos SHALL poder ser incluídos sem alterar regras de negócio existentes.

#### Scenario: Listar tipos de transporte
- **WHEN** o usuário acessa a listagem de tipos de transporte
- **THEN** os tipos cadastrados são exibidos

#### Scenario: Criar tipo de transporte
- **WHEN** o usuário submete um novo tipo com nome válido
- **THEN** o tipo passa a constar na listagem

#### Scenario: Nome obrigatório
- **WHEN** o usuário tenta criar um tipo sem nome
- **THEN** a validação impede o envio e informa o campo obrigatório
