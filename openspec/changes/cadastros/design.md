## Context

Primeira feature com IO. Define os padrões que as demais reutilizam: camada de
API por recurso, hooks de React Query, formulários RHF+Zod e store em memória do
MSW. Três recursos com CRUD simples; clientes têm o vínculo N:N com tipos de
transporte autorizados.

## Goals / Non-Goals

**Goals:**
- Padrão de integração consistente e sem duplicação (um módulo de API por recurso).
- Formulários validados por Zod, reaproveitando schema entre criação e edição.
- MSW com persistência em memória durante a sessão (seed determinístico).

**Non-Goals:**
- Exclusão de cadastros (o PDF não pede; evita lidar com integridade referencial).
- Paginação/busca server-side (dataset pequeno; filtro client-side quando útil).

## Decisions

- **Store em memória do MSW (`src/mocks/data/db.ts`).** Arrays mutáveis com seed
  inicial; os handlers leem/escrevem nele. Assim as mutações refletem nas queries
  seguintes na mesma sessão. _Alternativa:_ handlers stateless retornando fixtures.
  Rejeitada por não demonstrar create/update de verdade.

- **Um módulo de API por recurso** (`features/<r>/api/<r>-api.ts`) usando o
  `apiClient`, e hooks de React Query colocalizados (`use<Recurso>`,
  `useCreate<Recurso>`, ...). Chaves de query centralizadas por recurso para
  invalidação consistente.

- **Schema Zod único por recurso**, derivando o tipo do formulário via
  `z.infer`. Criação e edição compartilham o schema; edição apenas pré-preenche.

- **UI baseada em shadcn/ui.** Tabela para listagem e diálogo com formulário para
  criar/editar. Componentes adicionados sob demanda para não inflar o bundle.

- **Feedback via slice de notificações (Redux).** Mutations disparam `notify` no
  sucesso/erro, mantendo o slice de UI como fonte única de feedback.

## Risks / Trade-offs

- **Estado do MSW some ao recarregar** → aceitável para demo; seed reprovisiona.
  Documentado no README.
- **Sem exclusão** → decisão de escopo explícita; reduz complexidade de integridade.

## Open Questions

- Nenhuma; o vínculo cliente↔transportes é modelado como lista de IDs no cliente
  (coerente com `authorizedTransportTypeIds` do domínio).
