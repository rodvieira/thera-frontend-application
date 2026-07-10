## 1. Data layer (React Query + API client)

- [x] 1.1 Criar `src/lib/api-client.ts` (wrapper fino sobre fetch com baseURL e erro)
- [x] 1.2 Criar `src/lib/query-client.ts` (QueryClient com defaults) e provider

## 2. UI state (Redux Toolkit + Saga)

- [x] 2.1 Criar store base em `src/store` (configureStore + saga middleware + root saga)
- [x] 2.2 Criar slice de `notifications` (toasts) como primeiro estado de UI global
- [x] 2.3 Criar hooks tipados `useAppDispatch`/`useAppSelector`

## 3. Mock API (MSW)

- [x] 3.1 Criar `src/mocks/data` (seed inicial vazio/base) e `src/mocks/handlers`
- [x] 3.2 Criar `src/mocks/browser.ts` (worker) e `src/mocks/server.ts` (node/Jest)
- [x] 3.3 Integrar MSW no bootstrap client e no `jest.setup.ts`

## 4. App shell

- [x] 4.1 Criar `src/app/providers.tsx` compondo React Query + Redux providers
- [x] 4.2 Criar componentes de layout (sidebar + header) em `src/components/layout`
- [x] 4.3 Atualizar `src/app/layout.tsx` e as rotas do dashboard com o shell e navegação

## 5. Convenções e qualidade

- [x] 5.1 Escrever `CLAUDE.md` com convenções (arquitetura, testes Jest+RTL, commits)
- [x] 5.2 Configurar gate de qualidade (Prettier + Husky + lint-staged)
- [x] 5.3 Rodar lint + typecheck + test + build e verificar o shell no browser
