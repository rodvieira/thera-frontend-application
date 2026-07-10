## ADDED Requirements

### Requirement: Store global com Redux Toolkit
O sistema SHALL prover um store Redux Toolkit para estado de UI global (não de
servidor), acessível via hooks tipados `useAppDispatch` e `useAppSelector`.

#### Scenario: Estado de UI compartilhado entre features
- **WHEN** uma feature despacha uma action que altera estado de UI
- **THEN** outros componentes inscritos naquele slice recebem o novo estado

### Requirement: Orquestração de side-effects com Redux Saga
O sistema SHALL usar Redux Saga como middleware para orquestrar side-effects
multi-etapa, com um root saga registrado no store.

#### Scenario: Saga middleware ativo
- **WHEN** uma action observada por uma saga é despachada
- **THEN** a saga correspondente é executada

### Requirement: Notificações (toasts) como estado de UI
O sistema SHALL expor um slice de notificações para enfileirar e remover toasts,
servindo de feedback padrão para as features.

#### Scenario: Enfileirar notificação
- **WHEN** uma action de adicionar notificação é despachada
- **THEN** a notificação passa a constar na lista de notificações ativas
