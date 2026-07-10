@AGENTS.md

# OVGS — Convenções do projeto

Frontend do **Sistema de Gestão de Ordens de Venda**. Desafio técnico (vaga
Frontend Sênior). Apenas frontend; a API REST é **mockada com MSW**. Brief em
`docs/desafio-tecnico-ovgs.pdf`.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 + shadcn/ui · React Query ·
Redux Toolkit + Redux Saga · React Hook Form + Zod · MSW · Jest + RTL.

## Arquitetura (feature-based)

- `src/domain/` — regras de negócio **puras** (sem React/IO). Máquina de estados
  da OV, autorização de transporte, auditoria. É o núcleo testado.
- `src/features/<feature>/` — módulos por domínio. Subpastas usuais:
  `components/`, `hooks/` (React Query), `api/`, `store/` (slice + saga),
  `schemas/` (Zod), `__tests__/`.
- `src/components/` — design system (`ui/` = shadcn) e layout compartilhado.
- `src/lib/` — `api-client`, `query-client`, utils.
- `src/store/` — store Redux (config, root saga, hooks tipados, slices globais).
- `src/mocks/` — MSW (`handlers/`, `data/`, `browser.ts`, `server.ts`).
- `src/app/` — rotas do App Router. Páginas finas: apenas compõem features.

## Fronteira de estado (decisão-chave)

- **React Query** = server-state: todo fetch/cache/invalidação da API mockada.
- **Redux Toolkit** = client-state de UI: filtros, seleção, notificações.
- **Redux Saga** = orquestração de side-effects multi-etapa (transição de status
  da OV, agendamento): validar → chamar API → registrar auditoria → invalidar
  queries → notificar.
- Nunca guardar dados de servidor no Redux.

## Convenções de código

- Acesso a HTTP só via `apiClient` (`src/lib/api-client.ts`). Sem `fetch` solto.
- Validação de formulários com Zod + React Hook Form (`@hookform/resolvers/zod`).
- Estilização só com Tailwind; componha shadcn/ui em `src/components/ui`.
- Sem duplicação: extraia para `src/components` ou `src/lib` quando repetir.
- Português nos textos de UI e nas mensagens.

## Testes (Jest + RTL)

- Foco em **valor**, não em cobertura vazia. Não testar detalhe de implementação.
- Unitários: regras puras de `src/domain` (máquina de estados, autorização).
- Integração: fluxos reais via componentes + MSW (ex.: criar OV, transição).
- RTL: `getByRole`/`getByLabelText` > `getByText`; `userEvent` (não `fireEvent`);
  `findBy`/`waitFor` para assíncrono. MSW já ativo via `jest.setup.ts`.

## Workflow

- **OpenSpec** (`openspec/`) para documentar cada mudança: `/opsx:propose` →
  implementar → `/opsx:archive`. Specs em `openspec/changes/<change>/`.
- **Commits**: uma linha, Conventional Commits (`feat:`, `fix:`, `test:`,
  `chore:`, `docs:`, `ci:`). Um commit pequeno por task. Sem corpo, sem trailer.

## Comandos

- `npm run dev` · `npm run build`
- `npm run lint` · `npm run typecheck`
- `npm test` · `npm run test:coverage`
