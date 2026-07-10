## 1. Backend mockado (repositório + rotas)

- [x] 1.1 Funções de OV no repositório (list com filtros, get, create com regras + auditoria, updateStatus com máquina de estados + auditoria)
- [x] 1.2 Route Handlers `/api/sales-orders` (GET, POST), `/api/sales-orders/[id]` (GET), `/api/sales-orders/[id]/status` (PATCH)
- [x] 1.3 Handlers MSW espelhando as rotas (para testes)

## 2. Ponte de estado (saga ↔ React Query)

- [x] 2.1 Tornar o `queryClient` singleton no cliente (`getQueryClient`) e injetar no contexto do saga
- [x] 2.2 Slice de OV (seleção/estado de transição em andamento) + saga de transição de status
- [x] 2.3 Registrar a saga no root saga

## 3. Feature: dados e componentes

- [x] 3.1 API + hooks React Query (`features/orders`): lista, detalhe, criar
- [x] 3.2 Componente compartilhado `StatusBadge` (rótulo + cor do status)
- [x] 3.3 Schema Zod de criação de OV

## 4. Telas

- [x] 4.1 Formulário de criação (cliente → transportes autorizados → itens com quantidade)
- [x] 4.2 Página de listagem de OVs (tabela + status)
- [x] 4.3 Página de detalhe (dados + itens + ação de avançar status via saga)

## 5. Fechamento

- [x] 5.1 Teste de integração do fluxo de transição de status
- [x] 5.2 Rodar lint + typecheck + test + build
