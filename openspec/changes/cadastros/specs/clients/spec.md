## ADDED Requirements

### Requirement: Cadastro de clientes
O sistema SHALL permitir criar, editar e consultar clientes, cada um com uma
lista de tipos de transporte autorizados.

#### Scenario: Listar clientes
- **WHEN** o usuário acessa a listagem de clientes
- **THEN** os clientes cadastrados são exibidos

#### Scenario: Criar cliente com transportes autorizados
- **WHEN** o usuário submete um cliente com nome e ao menos um transporte autorizado
- **THEN** o cliente passa a constar na listagem com seus transportes autorizados

#### Scenario: Editar transportes autorizados
- **WHEN** o usuário altera a lista de transportes autorizados de um cliente
- **THEN** a alteração é persistida e refletida na listagem
