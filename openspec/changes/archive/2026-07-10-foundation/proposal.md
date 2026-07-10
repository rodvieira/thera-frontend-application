## Why

O OVGS precisa de uma base técnica coesa antes de qualquer feature de negócio:
providers de estado (servidor e cliente), uma API mockada realista e um shell de
aplicação consistente. Estabelecer isso primeiro evita retrabalho e garante que
todas as features (cadastros, OVs, agendamento, monitoramento, auditoria)
compartilhem os mesmos padrões de dados, layout e navegação.

## What Changes

- Configurar o **React Query** (QueryClient + provider) como camada de server-state.
- Configurar o **Redux Toolkit** (store) + **Redux Saga** (root saga) para estado
  global de UI e orquestração de side-effects.
- Bootstrap do **MSW** (Mock Service Worker) para servir a API REST mockada em dev
  e testes, com um cliente HTTP central (`apiClient`).
- Criar o **app shell**: layout raiz com providers, navegação lateral e área de
  conteúdo, usando Tailwind + shadcn/ui.
- Adicionar `CLAUDE.md` com convenções do projeto e hooks de qualidade
  (lint/typecheck/test) via configuração do harness.

## Capabilities

### New Capabilities
- `app-shell`: layout raiz, navegação e composição dos providers de estado.
- `data-layer`: integração com API REST via React Query + MSW + cliente HTTP central.
- `ui-state`: store Redux Toolkit + Redux Saga para estado de UI e orquestração.

### Modified Capabilities
<!-- Nenhuma: primeira change do projeto. -->

## Impact

- **Código**: `src/app/layout.tsx`, `src/app/providers.tsx`, `src/lib/*`
  (query client, api client), `src/store/*`, `src/mocks/*`, `src/components/layout/*`.
- **Dependências**: já instaladas (React Query, Redux Toolkit, Redux Saga, MSW).
- **Dev/Test**: MSW passa a interceptar requisições em dev (browser) e em Jest (node).
- **Sem breaking changes** (projeto novo).
