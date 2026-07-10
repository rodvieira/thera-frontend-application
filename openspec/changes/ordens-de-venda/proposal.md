## Why

A Ordem de Venda é o núcleo do sistema: amarra clientes, transportes e itens sob
um fluxo de status com regras de negócio. É aqui que o domínio (máquina de
estados, autorização de transporte, auditoria) e os cadastros ganham propósito, e
onde o Redux Saga orquestra o efeito multi-etapa da transição de status.

## What Changes

- Adicionar **repositório + Route Handlers** para Ordens de Venda: listar (com
  filtros), consultar detalhe, criar e atualizar status.
- Na **criação**, aplicar as regras do domínio: transporte autorizado para o
  cliente, ao menos um item; status inicial `CRIADA`; registrar auditoria
  `ORDER_CREATED`.
- Na **transição de status**, validar via máquina de estados; registrar auditoria
  `STATUS_CHANGED` com estado anterior/posterior.
- Implementar a feature **ordens-de-venda**: hooks React Query (lista/detalhe/criar),
  **slice + saga** para orquestrar a transição (validar → API → notificar →
  invalidar queries), formulário de criação e telas de lista e detalhe.
- Componente compartilhado **StatusBadge** (rótulos + escala de cores do status).
- **Teste de integração** do fluxo de transição de status.

## Capabilities

### New Capabilities
- `sales-orders`: criação, consulta (lista e detalhe) e atualização de status das
  Ordens de Venda, com regras de domínio e auditoria.

## Impact

- **Código**: `src/mocks/data/repository.ts` (+ handlers/rotas), `src/features/orders`,
  `src/components` (StatusBadge), rotas em `src/app/(dashboard)/ordens`.
- **Estado**: novo slice + saga registrados no store; ponte saga → React Query via
  contexto do saga (queryClient compartilhado).
