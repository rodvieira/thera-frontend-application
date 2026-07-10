## ADDED Requirements

### Requirement: Verificação automatizada no CI
O sistema SHALL executar lint, verificação de tipos e testes automaticamente em
cada push e pull request, falhando o pipeline se qualquer etapa falhar.

#### Scenario: Pipeline em pull request
- **WHEN** um pull request é aberto ou atualizado
- **THEN** o CI executa lint, typecheck e testes

#### Scenario: Falha bloqueia
- **WHEN** qualquer etapa (lint, typecheck ou teste) falha
- **THEN** o pipeline é marcado como falho
