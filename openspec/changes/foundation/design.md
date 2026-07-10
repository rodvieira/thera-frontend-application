## Context

Projeto frontend novo (Next.js App Router + TS). A vaga exige uso combinado de
React Query **e** Redux Toolkit + Redux Saga — ferramentas com sobreposição
parcial (ambas guardam dados). A API real está fora de escopo; usaremos MSW para
simular endpoints REST. Esta change define como esses pilares se encaixam antes
das features de negócio.

## Goals / Non-Goals

**Goals:**
- Separação clara de responsabilidades entre server-state e client-state.
- API mockada realista que funcione igual em dev (browser) e testes (node).
- App shell reutilizável (layout, navegação, providers) para todas as features.
- Padrão único de acesso a dados (`apiClient` + hooks de query/mutation).

**Non-Goals:**
- Implementar regras de negócio de domínio (fica na change `domain-core`).
- Implementar qualquer CRUD de feature (clientes, OVs, etc.).
- Autenticação/autorização real.

## Decisions

- **React Query = server-state; Redux = client-state.** React Query cuida de
  fetch/cache/invalidação de todos os recursos REST. Redux Toolkit guarda apenas
  estado de UI global (filtros de monitoramento, seleção, notificações/toasts).
  _Alternativa considerada:_ usar só React Query (sem Redux). Rejeitada porque a
  vaga exige Redux Toolkit + Saga; a separação por natureza do estado evita
  duplicação e mantém cada ferramenta no seu ponto forte.

- **Redux Saga orquestra side-effects multi-etapa.** Fluxos como transição de
  status da OV e confirmação/reagendamento (validar → chamar API → registrar
  auditoria → invalidar queries → notificar) vivem em sagas. _Alternativa:_
  colocar essa lógica em componentes/hooks. Rejeitada por espalhar efeitos e
  dificultar teste; a saga centraliza e é testável isoladamente.

- **MSW isomórfico.** `src/mocks/handlers` compartilhado entre `browser.ts`
  (dev, via `worker`) e `server.ts` (Jest, via `setupServer`). Mesma fonte de
  verdade de dados (`src/mocks/data`). _Alternativa:_ Next Route Handlers como
  mock. Rejeitada porque MSW intercepta no nível de rede, deixando o React Query
  fazer fetch real e permitindo reuso direto nos testes de integração.

- **Cliente HTTP central (`apiClient`).** Um wrapper fino sobre `fetch` que
  concentra baseURL, headers e tratamento de erro, para não duplicar lógica de
  request em cada feature.

- **App shell com shadcn/ui.** Layout com sidebar de navegação e área de
  conteúdo. Providers isolados em `providers.tsx` (client component) para manter
  o `layout.tsx` enxuto e compatível com Server Components.

## Risks / Trade-offs

- **Sobreposição React Query × Redux** → Mitigação: fronteira explícita
  (servidor vs UI) documentada aqui e no README; nada de dados de servidor no
  Redux.
- **MSW em produção (Vercel)** → Mitigação: o worker só inicia fora de produção;
  em produção o deploy roda com os mocks ativados apenas se explicitamente
  habilitado (é um app de demonstração sem backend). Decisão registrada no README.
- **Custo de setup inicial maior** → Mitigação: pago uma vez; todas as features
  herdam o padrão.

## Open Questions

- Em produção na Vercel, manter MSW ativo (demo self-contained) vs. desabilitar.
  Decisão provisória: **manter ativo** para a app funcionar sem backend, sinalizado
  no README. Reavaliar na change `ci-deploy`.
