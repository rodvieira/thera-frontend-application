'use client';

import type { ReactNode } from 'react';
import { StoreProvider } from '@/store/store-provider';
import { QueryProvider } from '@/lib/query-provider';

/**
 * Composição dos providers de estado da aplicação (Redux + React Query).
 *
 * A API é servida por Route Handlers do Next (`src/app/api`), backend mockado em
 * memória. Não há service worker no cliente — as chamadas vão direto às rotas.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <QueryProvider>{children}</QueryProvider>
    </StoreProvider>
  );
}
