## Why

As regras de negócio centrais da OV (transições de status, autorização de
transporte e auditoria) precisam existir como lógica **pura**, independente de
UI, API ou framework. Isolá-las torna as regras testáveis, reutilizáveis por
todas as features e evita espalhar `if`s de negócio pelos componentes.

## What Changes

- Definir os **tipos de domínio** (Cliente, Tipo de Transporte, Item, Ordem de
  Venda, status, agendamento, evento de auditoria) em `src/domain`.
- Implementar a **máquina de estados da OV** (linear estrita) com validação de
  transições e erro dedicado para transições inválidas.
- Implementar a regra de **autorização de transporte** (uma OV só pode usar um
  tipo de transporte autorizado para o cliente).
- Implementar o **modelo de auditoria**: fábrica de eventos com data/hora, tipo
  de ação, entidade afetada e estados anterior/posterior.
- Cobrir as regras com **testes unitários** (cenários válidos e inválidos).

## Capabilities

### New Capabilities
- `order-domain`: regras puras da Ordem de Venda — máquina de estados,
  autorização de transporte e auditoria.

### Modified Capabilities
<!-- Nenhuma. -->

## Impact

- **Código**: novos arquivos em `src/domain` (tipos + regras + testes).
- **Sem dependências novas** (usa apenas TS e `crypto.randomUUID`).
- Base para as features `cadastros`, `ordens-de-venda`, `agendamento` e
  `auditoria`.
