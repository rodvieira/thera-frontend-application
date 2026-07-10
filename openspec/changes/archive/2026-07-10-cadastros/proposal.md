## Why

As Ordens de Venda dependem de dados-mestre pré-existentes: clientes (com seus
transportes autorizados), tipos de transporte e itens. Estes cadastros precisam
existir antes de qualquer fluxo de OV. Também exercitam o padrão de integração
(React Query + MSW) e de formulários (React Hook Form + Zod) que as demais
features reutilizarão.

## What Changes

- Criar a **API mockada** (MSW) com store em memória e seed para clientes, tipos
  de transporte e itens, incluindo CRUD REST.
- Adicionar os **componentes de UI** compartilhados necessários (tabela, diálogo,
  formulário, input, select, badge) via shadcn/ui.
- Implementar a feature **Tipos de Transporte**: listar, criar, editar.
- Implementar a feature **Itens**: listar, criar.
- Implementar a feature **Clientes**: listar, criar, editar, com seleção dos
  tipos de transporte autorizados.
- Cobrir com **teste de integração** um fluxo relevante (criar cadastro via MSW).

## Capabilities

### New Capabilities
- `transport-types`: cadastro de tipos de transporte (criar, editar, consultar).
- `items`: cadastro de itens com SKU (criar, consultar).
- `clients`: cadastro de clientes com transportes autorizados (criar, editar, consultar).

## Impact

- **Código**: `src/mocks/data`, `src/mocks/handlers`, `src/features/{transport-types,items,clients}`, `src/components/ui`, rotas em `src/app/(dashboard)/cadastros`.
- **Padrões estabelecidos**: hooks de query/mutation por recurso, schemas Zod,
  formulários com RHF, invalidação de cache no sucesso.
