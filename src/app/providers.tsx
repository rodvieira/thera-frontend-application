'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { StoreProvider } from '@/store/store-provider';
import { QueryProvider } from '@/lib/query-provider';
import { enableApiMocking } from '@/mocks/enable-mocking';

/**
 * Composição dos providers de estado da aplicação.
 *
 * Aguarda o MSW estar pronto antes de renderizar o conteúdo, para que nenhuma
 * query dispare antes da API mockada estar interceptando. O gate evita
 * mismatch de hidratação (SSR e primeiro render cliente renderizam o mesmo
 * estado "carregando").
 */
export function Providers({ children }: { children: ReactNode }) {
  const [mockingReady, setMockingReady] = useState(false);

  useEffect(() => {
    let active = true;
    enableApiMocking().finally(() => {
      if (active) setMockingReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!mockingReady) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Inicializando ambiente…
      </div>
    );
  }

  return (
    <StoreProvider>
      <QueryProvider>{children}</QueryProvider>
    </StoreProvider>
  );
}
