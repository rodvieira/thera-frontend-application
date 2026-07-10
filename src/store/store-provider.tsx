'use client';

import { useState, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from './index';

/**
 * Provider do Redux. Cria o store uma única vez por árvore de render (padrão
 * App Router) via inicializador do useState.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);

  return <Provider store={store}>{children}</Provider>;
}
