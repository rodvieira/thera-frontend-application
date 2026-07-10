## 1. Tipos de domínio

- [ ] 1.1 Definir tipos base em `src/domain/types.ts` (Cliente, TipoTransporte, Item, OV, agendamento)

## 2. Máquina de estados da OV

- [ ] 2.1 Implementar `src/domain/order-status.ts` (status, transições, erro dedicado)
- [ ] 2.2 Testes unitários de transições (válidas, pulo de etapa, retrocesso, final)

## 3. Autorização de transporte

- [ ] 3.1 Implementar `src/domain/transport-authorization.ts` (regra + erro dedicado)
- [ ] 3.2 Testes unitários (autorizado, não autorizado)

## 4. Auditoria

- [ ] 4.1 Implementar `src/domain/audit.ts` (tipos de ação + fábrica de evento)
- [ ] 4.2 Testes unitários (shape do evento, estados anterior/posterior)

## 5. Fechamento

- [ ] 5.1 Barrel `src/domain/index.ts` e rodar lint + typecheck + test
