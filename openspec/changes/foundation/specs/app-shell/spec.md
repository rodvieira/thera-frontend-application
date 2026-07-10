## ADDED Requirements

### Requirement: Composição de providers na raiz
O sistema SHALL compor os providers de estado (React Query e Redux) em um único
componente cliente, mantido separado do `layout.tsx` para preservar Server
Components.

#### Scenario: Providers aplicados à aplicação
- **WHEN** qualquer página é renderizada
- **THEN** ela tem acesso ao React Query e ao store Redux

### Requirement: Layout com navegação
O sistema SHALL prover um shell com navegação lateral para as áreas principais
(Ordens de Venda, Monitoramento, Agendamento, Cadastros) e uma área de conteúdo.

#### Scenario: Navegar entre áreas
- **WHEN** o usuário seleciona um item de navegação
- **THEN** a área de conteúdo exibe a rota correspondente

#### Scenario: Item de navegação ativo
- **WHEN** o usuário está em uma rota
- **THEN** o item de navegação correspondente é destacado como ativo
