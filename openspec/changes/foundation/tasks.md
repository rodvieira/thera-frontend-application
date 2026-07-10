## 1. Data layer (React Query + API client)

- [ ] 1.1 Criar `src/lib/api-client.ts` (wrapper fino sobre fetch com baseURL e erro)
- [ ] 1.2 Criar `src/lib/query-client.ts` (QueryClient com defaults) e provider

## 2. UI state (Redux Toolkit + Saga)

- [ ] 2.1 Criar store base em `src/store` (configureStore + saga middleware + root saga)
- [ ] 2.2 Criar slice de `notifications` (toasts) como primeiro estado de UI global
- [ ] 2.3 Criar hooks tipados `useAppDispatch`/`useAppSelector`

## 3. Mock API (MSW)

- [ ] 3.1 Criar `src/mocks/data` (seed inicial vazio/base) e `src/mocks/handlers`
- [ ] 3.2 Criar `src/mocks/browser.ts` (worker) e `src/mocks/server.ts` (node/Jest)
- [ ] 3.3 Integrar MSW no bootstrap client e no `jest.setup.ts`

## 4. App shell

- [ ] 4.1 Criar `src/app/providers.tsx` compondo React Query + Redux providers
- [ ] 4.2 Criar componentes de layout (sidebar + header) em `src/components/layout`
- [ ] 4.3 Atualizar `src/app/layout.tsx` e `src/app/page.tsx` com o shell e navegação

## 5. Convenções e qualidade

- [ ] 5.1 Escrever `CLAUDE.md` com convenções (arquitetura, testes Jest+RTL, commits)
- [ ] 5.2 Configurar hooks de qualidade (typecheck/lint/test) no harness
- [ ] 5.3 Rodar lint + typecheck + test e verificar o shell no browser
