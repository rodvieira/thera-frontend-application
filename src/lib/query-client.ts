import { QueryClient } from '@tanstack/react-query';

/**
 * Cria um QueryClient com defaults sensatos para a aplicação.
 *
 * Uma factory (em vez de instância singleton) evita compartilhar cache entre
 * requests no SSR e facilita isolar o client em testes.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000, // 30s: evita refetch imediato em navegação
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}
