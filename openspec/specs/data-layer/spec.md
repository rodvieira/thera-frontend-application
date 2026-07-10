# data-layer Specification

## Purpose
TBD - created by archiving change foundation. Update Purpose after archive.
## Requirements
### Requirement: Server-state via React Query
O sistema SHALL usar React Query como única camada de server-state, com um
`QueryClient` configurado e disponibilizado via provider na raiz da aplicação.

#### Scenario: Provider disponível para toda a árvore
- **WHEN** um componente cliente usa `useQuery` ou `useMutation`
- **THEN** ele acessa o `QueryClient` da aplicação sem configuração adicional

#### Scenario: Defaults sensatos de cache
- **WHEN** uma query é refeita dentro do `staleTime` configurado
- **THEN** o dado em cache é retornado sem novo request à rede

### Requirement: Cliente HTTP central
O sistema SHALL concentrar o acesso HTTP em um `apiClient` único que define
baseURL, headers padrão e tratamento de erro, evitando duplicação de lógica de
request nas features.

#### Scenario: Resposta de erro é normalizada
- **WHEN** a API mockada responde com status >= 400
- **THEN** o `apiClient` lança um erro tratável pelas camadas superiores

### Requirement: API REST mockada com MSW
O sistema SHALL simular a API REST com MSW, compartilhando os mesmos handlers
entre o ambiente de navegador (dev) e o de testes (Jest/node).

#### Scenario: Interceptação em desenvolvimento
- **WHEN** a aplicação roda em desenvolvimento e faz um request para a API
- **THEN** o MSW worker intercepta e responde com dados mockados

#### Scenario: Interceptação em testes
- **WHEN** um teste de integração executa e o código sob teste faz um request
- **THEN** o MSW server (node) intercepta e responde com dados mockados

