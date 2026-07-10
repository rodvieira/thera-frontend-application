## ADDED Requirements

### Requirement: Criação de Ordem de Venda
O sistema SHALL permitir criar uma OV vinculada a um único cliente, com
exatamente um tipo de transporte autorizado para o cliente e ao menos um item. A
OV nasce com status `CRIADA` e gera um evento de auditoria de criação.

#### Scenario: Criação válida
- **WHEN** o usuário cria uma OV com cliente, um transporte autorizado e ≥1 item
- **THEN** a OV é criada com status `CRIADA` e registrada na listagem

#### Scenario: Transporte não autorizado
- **WHEN** o usuário tenta criar uma OV com transporte não autorizado para o cliente
- **THEN** a criação é rejeitada com mensagem de transporte não autorizado

#### Scenario: Sem itens
- **WHEN** o usuário tenta criar uma OV sem itens
- **THEN** a criação é rejeitada informando que ao menos um item é obrigatório

### Requirement: Consulta de Ordens de Venda
O sistema SHALL permitir listar as OVs e consultar o detalhe de uma OV.

#### Scenario: Listar OVs
- **WHEN** o usuário acessa a listagem de OVs
- **THEN** as OVs são exibidas com cliente, transporte e status

#### Scenario: Detalhe da OV
- **WHEN** o usuário abre uma OV
- **THEN** vê cliente, transporte, itens e status atual

### Requirement: Atualização de status
O sistema SHALL permitir avançar o status da OV apenas por transições válidas da
máquina de estados, registrando auditoria com estado anterior e posterior.

#### Scenario: Transição válida
- **WHEN** o usuário avança uma OV de `CRIADA` para `PLANEJADA`
- **THEN** o status é atualizado e um evento de auditoria de mudança de status é registrado

#### Scenario: Transição inválida
- **WHEN** o usuário tenta uma transição fora da sequência (ex.: `CRIADA` → `ENTREGUE`)
- **THEN** a operação é rejeitada e o status permanece inalterado
