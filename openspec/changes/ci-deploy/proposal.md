## Why

Para entregar o desafio de forma profissional, o repositório precisa de
integração contínua (garantindo qualidade a cada push), documentação completa
(README com decisões e trade-offs) e deploy público na Vercel.

## What Changes

- **CI (GitHub Actions)**: workflow que roda `lint`, `typecheck` e `test` em push
  e pull request.
- **README** completo: instruções de execução, tecnologias, decisões
  arquiteturais, estratégia de modelagem do domínio e de persistência (mock),
  escalabilidade, performance e trade-offs.
- **Deploy Vercel**: configuração e instruções (o app já builda como Next padrão).

## Capabilities

### New Capabilities
- `ci-pipeline`: verificação automatizada de qualidade no CI.

## Impact

- **Código**: `.github/workflows/ci.yml`, `README.md`, ajustes menores se
  necessários para o build de produção.
- **Externo**: push para o GitHub e conexão do repositório à Vercel (feitos pelo
  usuário, com contas próprias).
