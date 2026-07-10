## 1. Mock API (dados + handlers)

- [ ] 1.1 Criar store em memória `src/mocks/data/db.ts` com seed (transportes, itens, clientes)
- [ ] 1.2 Handlers CRUD de tipos de transporte em `src/mocks/handlers`
- [ ] 1.3 Handlers CRUD de itens
- [ ] 1.4 Handlers CRUD de clientes e registrar todos no `handlers/index.ts`

## 2. Componentes de UI compartilhados

- [ ] 2.1 Adicionar componentes shadcn necessários (input, label, table, dialog, badge, select)
- [ ] 2.2 Criar `DataTable`/estado vazio reutilizável em `src/components`

## 3. Feature: Tipos de Transporte

- [ ] 3.1 API + hooks React Query (`features/transport-types`)
- [ ] 3.2 Schema Zod + formulário (criar/editar) em diálogo
- [ ] 3.3 Página de listagem com ação de criar/editar

## 4. Feature: Itens

- [ ] 4.1 API + hooks React Query (`features/items`)
- [ ] 4.2 Schema Zod + formulário de criação
- [ ] 4.3 Página de listagem com ação de criar

## 5. Feature: Clientes

- [ ] 5.1 API + hooks React Query (`features/clients`)
- [ ] 5.2 Schema Zod + formulário com seleção de transportes autorizados
- [ ] 5.3 Página de listagem com criar/editar

## 6. Integração e fechamento

- [ ] 6.1 Página índice de Cadastros com navegação para os três recursos
- [ ] 6.2 Teste de integração (criar um cadastro via MSW)
- [ ] 6.3 Rodar lint + typecheck + test + build
