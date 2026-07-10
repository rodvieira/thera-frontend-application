## ADDED Requirements

### Requirement: Cadastro de itens
O sistema SHALL permitir criar e consultar itens, cada um com um identificador
único (SKU).

#### Scenario: Listar itens
- **WHEN** o usuário acessa a listagem de itens
- **THEN** os itens cadastrados são exibidos com seu SKU

#### Scenario: Criar item
- **WHEN** o usuário submete um item com SKU e nome válidos
- **THEN** o item passa a constar na listagem

#### Scenario: SKU obrigatório e único
- **WHEN** o usuário tenta criar um item sem SKU ou com SKU já existente
- **THEN** a operação é rejeitada com mensagem apropriada
