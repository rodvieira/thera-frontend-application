import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { makeStore } from '@/store';

/**
 * Renderiza um componente com os providers reais da aplicação (Redux + React
 * Query), para testes de integração. O QueryClient desabilita retry para os
 * testes falharem rápido.
 */
export function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  // A store usa o mesmo queryClient (para a saga invalidar o cache do provider).
  const store = makeStore(queryClient);

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Provider>
    );
  }

  return render(ui, { wrapper: Wrapper });
}
