## 1. Backend mockado (repositório + rotas)

- [ ] 1.1 Funções de OV no repositório (list com filtros, get, create com regras + auditoria, updateStatus com máquina de estados + auditoria)
- [ ] 1.2 Route Handlers `/api/sales-orders` (GET, POST), `/api/sales-orders/[id]` (GET), `/api/sales-orders/[id]/status` (PATCH)
- [ ] 1.3 Handlers MSW espelhando as rotas (para testes)

## 2. Ponte de estado (saga ↔ React Query)

- [ ] 2.1 Tornar o `queryClient` singleton no cliente (`getQueryClient`) e injetar no contexto do saga
- [ ] 2.2 Slice de OV (seleção/estado de transição em andamento) + saga de transição de status
- [ ] 2.3 Registrar a saga no root saga

## 3. Feature: dados e componentes

- [ ] 3.1 API + hooks React Query (`features/orders`): lista, detalhe, criar
- [ ] 3.2 Componente compartilhado `StatusBadge` (rótulo + cor do status)
- [ ] 3.3 Schema Zod de criação de OV

## 4. Telas

- [ ] 4.1 Formulário de criação (cliente → transportes autorizados → itens com quantidade)
- [ ] 4.2 Página de listagem de OVs (tabela + status)
- [ ] 4.3 Página de detalhe (dados + itens + ação de avançar status via saga)

## 5. Fechamento

- [ ] 5.1 Teste de integração do fluxo de transição de status
- [ ] 5.2 Rodar lint + typecheck + test + build
