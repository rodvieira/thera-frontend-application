## Why

O Monitoramento Operacional dá visibilidade ao fluxo logístico: consultar as OVs
com filtros e enxergar a distribuição por status. É onde o **Redux Toolkit**
guarda o estado de UI (filtros) e onde entra a visualização de dados.

## What Changes

- Slice de **filtros de monitoramento** (status, cliente, transporte, data) no
  Redux — estado de UI, não de servidor.
- Página **Monitoramento**: barra de filtros, indicadores (total e por status),
  gráfico de distribuição por status e tabela filtrada das OVs.
- Reuso de `useSalesOrders` (React Query) para os dados; filtragem e agregação
  derivadas no cliente.

## Capabilities

### New Capabilities
- `monitoring`: consulta filtrada de OVs e indicadores/visualização do fluxo por
  status.

## Impact

- **Código**: `src/features/monitoring` (slice + componentes), rota
  `src/app/(dashboard)/monitoramento`, reducer registrado no store.
- **Sem novas dependências**: gráfico construído com a escala de cores de status
  já existente (coeso com `StatusBadge`).
