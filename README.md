# OVGS — Sistema de Gestão de Ordens de Venda (Frontend)

Interface para gerenciar o ciclo de vida de **Ordens de Venda (OV)** — cadastros,
criação e acompanhamento de OVs, agendamento de entregas, monitoramento
operacional e auditoria. Desafio técnico para vaga de **Frontend Sênior**.

Apenas frontend: a API REST é **mockada** (ver [Persistência](#estratégia-de-persistência)).
O brief do desafio está em [`docs/desafio-tecnico-ovgs.pdf`](docs/desafio-tecnico-ovgs.pdf).

## Sumário

- [Como executar](#como-executar)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Modelagem do domínio](#estratégia-de-modelagem-do-domínio)
- [Persistência](#estratégia-de-persistência)
- [Testes](#testes)
- [Escalabilidade](#considerações-sobre-escalabilidade)
- [Performance](#considerações-sobre-performance)
- [Trade-offs](#trade-offs-assumidos)
- [Workflow](#workflow-de-desenvolvimento)

## Como executar

Requisitos: **Node 22+** e npm.

```bash
npm install
npm run dev        # http://localhost:3000
```

Outros comandos:

```bash
npm run build      # build de produção
npm start          # sobe o build de produção
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm test           # Jest + React Testing Library
npm run test:coverage
```

Não há variáveis de ambiente obrigatórias: a API é mockada e roda junto da app.

## Tecnologias

| Tecnologia | Papel |
|---|---|
| **Next.js 16** (App Router) + **TypeScript** | Base da aplicação e rotas |
| **Tailwind CSS v4** + **shadcn/ui** | Design system |
| **React Query** (`@tanstack/react-query`) | Server-state: fetch/cache/invalidação |
| **Redux Toolkit** + **Redux Saga** | Client-state de UI e orquestração de side-effects |
| **React Hook Form** + **Zod** | Formulários e validação |
| **Next Route Handlers** | Backend mockado (`src/app/api`) |
| **MSW** | Mock da API nos testes |
| **Jest** + **React Testing Library** | Testes unitários e de integração |

## Arquitetura

Organização **feature-based**, separando regras puras, módulos de feature e
infraestrutura:

```
src/
  domain/       # regras de negócio PURAS (sem React/IO) — o núcleo testado
  features/     # módulos por domínio (api, hooks, store, schema, components)
    orders/ clients/ transport-types/ items/ scheduling/ monitoring/ audit/
  components/   # design system (ui/) e componentes compartilhados
  lib/          # api-client, query-client, route-handler, utils
  store/        # store Redux (config, root saga, hooks tipados, slices globais)
  mocks/        # backend mockado: data/ (db + repository) e handlers/ (MSW)
  app/          # App Router — páginas finas + Route Handlers (api/)
```

### Fronteira de estado (decisão-chave)

React Query e Redux têm sobreposição (ambos guardam dados). A decisão consciente
foi **separar por natureza do estado**, evitando duplicação:

- **React Query** = _server-state_: todo fetch/cache/invalidação da API.
- **Redux Toolkit** = _client-state de UI_: filtros do monitoramento, notificações.
- **Redux Saga** = _orquestração de side-effects multi-etapa_: a **transição de
  status da OV** (validar no domínio → chamar API → invalidar queries → notificar).
  A saga acessa o `queryClient` via **contexto do saga middleware**, fazendo a
  ponte com o React Query sem guardar dados de servidor no Redux.

## Estratégia de modelagem do domínio

O núcleo de negócio vive em `src/domain` como **funções puras**, independentes de
UI/IO e cobertas por testes unitários:

- **Máquina de estados da OV** (`order-status.ts`): fluxo linear estrito
  `CRIADA → PLANEJADA → AGENDADA → EM_TRANSPORTE → ENTREGUE`. As transições válidas
  ficam em um único mapa; `canTransition`/`assertTransition` centralizam a regra e
  um `InvalidTransitionError` dedicado distingue falha de negócio de erro técnico.
- **Autorização de transporte** (`transport-authorization.ts`): uma OV só pode usar
  um transporte **autorizado para o cliente**. Novos tipos de transporte não exigem
  mudança de regra.
- **Auditoria** (`audit.ts`): fábrica pura de eventos (data/hora, ação, entidade,
  estado anterior/posterior), com metadados injetáveis para testes determinísticos.

As regras são revalidadas no backend mockado (fonte de verdade); a UI valida por UX.

## Estratégia de persistência

Não há backend real. A API é servida por **Next.js Route Handlers**
(`src/app/api/**`), um backend mockado que roda no dev e na Vercel (inclusive SSR),
lastreado por um **store em memória** (`src/mocks/data/db.ts`) através de uma
**camada de serviço** (`src/mocks/data/repository.ts`).

- **MSW** é usado **apenas nos testes** (intercepta `fetch` no ambiente Node do
  Jest). Route Handlers e MSW chamam **a mesma** `repository.ts` — sem lógica
  duplicada.
- _Nota:_ a implementação inicial usava o service worker do MSW no navegador, mas
  ele não interceptava de forma confiável no ambiente Next 16; os Route Handlers
  são código de servidor comum, verificáveis via `curl` e mais robustos.

Em produção, esse store em memória **reinicia por instância serverless** (a leitura
do seed sempre funciona; escritas persistem dentro de uma instância aquecida). Num
sistema real, essa camada seria substituída por um banco relacional (o
`repository.ts` já isola essa fronteira).

## Testes

Foco em **valor**, não em cobertura vazia:

- **Unitários** (`src/domain`): máquina de estados, autorização de transporte e
  auditoria — as regras que mais importam.
- **Integração** (RTL + MSW): criar cadastro (Tipo de Transporte) e o **fluxo de
  transição de status via Saga** (dispatch → validação → API → invalidação → UI).

O desafio pedia no mínimo 2 unitários + 1 de integração; o projeto entrega **21
testes** (19 unitários + 2 de integração). RTL segue as boas práticas: `getByRole`/
`getByLabelText`, `userEvent`, `findBy`/`waitFor`.

## Considerações sobre escalabilidade

- **Modular por feature**: novas áreas entram como um módulo isolado
  (`features/<x>`), sem tocar nas existentes.
- **Domínio isolado e testável**: mudar o fluxo (ex.: novo status, cancelamento) é
  local ao mapa de transições; consumidores não mudam.
- **Fronteira de persistência isolada**: trocar o mock por um backend real afeta só
  `repository.ts` e os Route Handlers; hooks/telas permanecem.
- **Filtros server-ready**: a listagem de OVs já aceita filtros por querystring; a
  paginação/consulta server-side é a evolução natural para grandes volumes.

## Considerações sobre performance

- **React Query** com `staleTime` evita refetch desnecessário; invalidação
  cirúrgica por chave após mutações.
- **App Router + Server Components** para as páginas; JS de cliente só onde há
  interatividade.
- **Turbopack** no build; rotas estáticas prerenderizadas e Route Handlers dinâmicos.
- Agregações do monitoramento são **derivadas com `useMemo`** sobre uma única query.

## Trade-offs assumidos

- **React Query + Redux** (sobreposição) — mantidos com fronteira explícita
  (servidor vs UI) para exercitar ambos sem duplicar estado.
- **Saga para a transição de status** — mais cerimônia que um `useMutation`, mas é o
  caso multi-etapa idiomático e o que a vaga pede; a ponte com o React Query é feita
  via contexto do saga.
- **Estado em memória** — sem persistência real; reinicia por instância na Vercel.
  Aceitável para demonstração; documentado acima.
- **Sem exclusão** de cadastros/OVs — reduz complexidade de integridade referencial,
  fora do escopo do desafio.
- **Filtragem client-side no monitoramento** — adequada ao volume mockado; o backend
  já suporta filtro por querystring para evoluir.

## Workflow de desenvolvimento

- **Spec-driven com OpenSpec** (`openspec/`): cada mudança foi documentada
  (proposal → design → specs → tasks), implementada e arquivada. As specs
  consolidadas ficam em `openspec/specs/` e o histórico em `openspec/changes/archive/`.
- **Commits pequenos** em Conventional Commits, um por task.
- **Gate de qualidade**: Prettier + Husky + lint-staged no pre-commit; CI (GitHub
  Actions) roda lint + typecheck + test em cada push/PR.

## Deploy na Vercel

O projeto builda como um app Next.js padrão (sem configuração extra). Para publicar:

1. Suba o repositório para o GitHub.
2. Em [vercel.com](https://vercel.com) → **New Project** → importe o repositório.
3. A Vercel detecta o Next.js automaticamente; **Deploy**.

Os Route Handlers (`/api/*`) rodam como funções serverless — a app funciona sem
backend externo.
