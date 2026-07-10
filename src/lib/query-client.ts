import { QueryClient } from '@tanstack/react-query';

/**
 * Cria um QueryClient com defaults sensatos para a aplicação.
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

let browserClient: QueryClient | undefined;

/**
 * Retorna o QueryClient da aplicação. No servidor cria uma instância nova a cada
 * chamada (evita vazamento entre requests); no navegador reusa um singleton, de
 * modo que o `QueryProvider` e a store (para a ponte com o Redux Saga)
 * compartilhem o mesmo cache.
 */
export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') return makeQueryClient();
  if (!browserClient) browserClient = makeQueryClient();
  return browserClient;
}
