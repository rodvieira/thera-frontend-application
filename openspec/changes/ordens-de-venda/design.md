## Context

A vaga exige uso significativo de Redux Saga. A transição de status da OV é o
efeito multi-etapa natural para isso: validar (domínio) → chamar API → notificar →
invalidar cache. Já existem as regras puras em `src/domain`. Server-state é do
React Query; a saga precisa invalidar o cache após a transição.

## Goals / Non-Goals

**Goals:**
- Reutilizar o domínio (`assertTransition`, `assertTransportAuthorized`, auditoria).
- Orquestrar a transição de status com Redux Saga, integrando com React Query.
- Criação de OV com validação de regras (transporte autorizado, ≥1 item).

**Non-Goals:**
- Agendamento (fica na change `agendamento`); aqui a OV nasce sem agendamento.
- Exclusão de OV.

## Decisions

- **Transição de status via Saga.** Uma action `statusTransitionRequested` é
  observada por uma saga que: valida com `canTransition` (domínio) → chama a API →
  em sucesso, notifica e invalida as queries de OV; em erro, notifica. _Alternativa:_
  `useMutation` do React Query. Rejeitada porque a vaga pede orquestração com Saga,
  e a transição é o caso multi-etapa idiomático.

- **Ponte Saga → React Query via contexto do saga.** O `queryClient` é injetado no
  contexto do saga middleware (`createSagaMiddleware({ context: { queryClient } })`),
  e a saga faz `getContext('queryClient').invalidateQueries(...)`. Para isso, o
  `queryClient` passa a ser um singleton no cliente (`getQueryClient()`), reusado
  pelo `QueryProvider` e pela store. _Alternativa:_ dispatch de evento ouvido por um
  hook. Rejeitada por indireção desnecessária.

- **Validação de negócio no repositório (servidor).** A criação e a transição
  revalidam as regras do domínio no repositório (fonte de verdade), retornando 4xx
  com mensagem. A UI também valida (UX), mas o servidor é autoritativo. Auditoria é
  registrada no repositório.

- **Criação: server gera status inicial e auditoria.** O cliente envia
  `{ clientId, transportTypeId, items }`; o repositório valida transporte
  autorizado (via `isTransportAuthorized`), cria com `status: CRIADA` e registra
  `ORDER_CREATED`.

## Risks / Trade-offs

- **Singleton de queryClient no SSR** → `getQueryClient()` cria instância nova no
  servidor e singleton só no browser (padrão Next). Sem vazamento entre requests.
- **Saga + React Query (duas “fontes”)** → mitigado pela fronteira clara: saga só
  orquestra e invalida; os dados continuam no React Query.

## Open Questions

- Filtros do monitoramento (status/cliente/transporte/data) serão consumidos na
  change `monitoramento`; aqui a lista aceita filtros por querystring já previstos
  no repositório.
