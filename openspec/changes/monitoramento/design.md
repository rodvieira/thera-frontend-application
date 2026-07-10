## Context

O PDF pede consultas filtráveis por status, cliente, transporte e data. A
arquitetura define filtros como estado de UI (Redux). Já existe `useSalesOrders` e
a escala de cores de status.

## Goals / Non-Goals

**Goals:**
- Filtros de UI em Redux, aplicados de forma reativa.
- Indicadores e distribuição por status coerentes com os filtros.
- Visualização acessível reusando a paleta de status (sem lib externa).

**Non-Goals:**
- Séries temporais / analytics avançado.
- Exportação de dados.

## Decisions

- **Filtros no Redux (`monitoring-slice`).** Demonstra o uso do Redux Toolkit para
  client-state de UI. Os dados brutos vêm do React Query (`useSalesOrders`); a
  filtragem/agregação é derivada no cliente (dataset pequeno). _Alternativa:_
  filtrar no servidor por querystring (suportado no backend). Preterida aqui para
  manter uma única query e destacar a fronteira React Query × Redux; o filtro de
  servidor permanece disponível.

- **Agregados excluem o filtro de status.** KPIs e o gráfico de distribuição são
  calculados sobre as OVs filtradas por cliente/transporte/data (mas não por
  status), para o gráfico de status permanecer informativo; a tabela aplica todos
  os filtros. _Alternativa:_ tudo com o mesmo filtro. Preterida por colapsar o
  gráfico ao filtrar status.

- **Gráfico próprio com a paleta de status.** Barras horizontais com rótulo e
  valor, usando os tokens `--color-status-*`. Acessível (texto + cor), coeso com o
  `StatusBadge`, sem adicionar dependência de charting.

## Risks / Trade-offs

- **Filtragem no cliente** → adequada ao volume mockado; para escala real,
  paginação/filtro no servidor (já suportado). Registrado no README.

## Open Questions

- Nenhuma.
