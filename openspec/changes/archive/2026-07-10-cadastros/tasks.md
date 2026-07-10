## 1. Mock API (dados + handlers)

- [x] 1.1 Criar store em memória `src/mocks/data/db.ts` com seed (transportes, itens, clientes)
- [x] 1.2 Handlers CRUD de tipos de transporte em `src/mocks/handlers`
- [x] 1.3 Handlers CRUD de itens
- [x] 1.4 Handlers CRUD de clientes e registrar todos no `handlers/index.ts`

## 2. Componentes de UI compartilhados

- [x] 2.1 Adicionar componentes shadcn necessários (input, label, table, dialog, badge, select)
- [x] 2.2 Criar `DataTable`/estado vazio reutilizável em `src/components`

## 3. Feature: Tipos de Transporte

- [x] 3.1 API + hooks React Query (`features/transport-types`)
- [x] 3.2 Schema Zod + formulário (criar/editar) em diálogo
- [x] 3.3 Página de listagem com ação de criar/editar

## 4. Feature: Itens

- [x] 4.1 API + hooks React Query (`features/items`)
- [x] 4.2 Schema Zod + formulário de criação
- [x] 4.3 Página de listagem com ação de criar

## 5. Feature: Clientes

- [x] 5.1 API + hooks React Query (`features/clients`)
- [x] 5.2 Schema Zod + formulário com seleção de transportes autorizados
- [x] 5.3 Página de listagem com criar/editar

## 6. Integração e fechamento

- [x] 6.1 Página índice de Cadastros com navegação para os três recursos
- [x] 6.2 Teste de integração (criar um cadastro via MSW)
- [x] 6.3 Rodar lint + typecheck + test + build
