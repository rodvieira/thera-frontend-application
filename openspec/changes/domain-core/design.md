## Context

O PDF define um fluxo operacional linear e regras de consistência (transporte
autorizado, itens obrigatórios) e exige auditoria de eventos relevantes. Essas
regras são o núcleo do sistema e serão consumidas por várias camadas (formulários,
sagas, hooks). Devem ser puras e determinísticas.

## Goals / Non-Goals

**Goals:**
- Funções puras, sem IO, 100% testáveis e sem dependência de React.
- Uma única fonte de verdade para transições válidas e autorização.
- Erros de domínio tipados para tratamento consistente na UI.

**Non-Goals:**
- Persistência ou chamadas de API (fica nas features/MSW).
- Validação de formulário (Zod fica em cada feature).
- Cálculo de disponibilidade de agendamento (simplificado nas features).

## Decisions

- **Máquina de estados como mapa `próximo-estado`.** Cada status aponta para seu
  único sucessor válido (linear estrito). `canTransition(from, to)` compara com o
  mapa. _Alternativa:_ tabela de adjacência com múltiplos destinos. Rejeitada
  agora por YAGNI — o fluxo é linear; a estrutura em mapa deixa a extensão futura
  trivial (basta trocar o mapa) sem alterar os consumidores.

- **Erros de domínio dedicados** (`InvalidTransitionError`,
  `TransportNotAuthorizedError`). Permitem que sagas/UI diferenciem falha de
  negócio de erro técnico. Funções `assert*` lançam; funções `can/is` retornam
  boolean (para habilitar/desabilitar UI sem try/catch).

- **Auditoria como fábrica pura com metadados injetáveis.** `createAuditEvent`
  recebe `id`/`timestamp` opcionais (default: `crypto.randomUUID()` e
  `new Date().toISOString()`), tornando os testes determinísticos sem mockar
  globais. _Alternativa:_ gerar sempre internamente. Rejeitada por dificultar o
  teste do timestamp/id.

- **Autorização baseada na lista do cliente.** `isTransportAuthorized` verifica se
  o `transportTypeId` está em `client.authorizedTransportTypeIds`. Novos tipos de
  transporte não exigem mudança de regra (atende o requisito de extensibilidade).

## Risks / Trade-offs

- **Fluxo linear pode mudar** → Mitigação: o mapa de transições concentra a regra;
  mudar para não-linear é local.
- **IDs via `crypto.randomUUID`** → disponível em Node 22 e navegadores modernos;
  sem risco no alvo (Next 16 / Node 22).

## Open Questions

- Nenhuma no momento; agendamento e cancelamento ficam fora deste núcleo por
  decisão de escopo (linear estrito).
