import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import type { QueryClient } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import notificationsReducer from './slices/notifications';
import ordersReducer from '@/features/orders/store/orders-slice';
import { rootSaga } from './root-saga';

/**
 * Factory do store. Cria uma nova instância por árvore de render (evita
 * compartilhar estado entre requests no SSR) com o saga middleware ativo. O
 * `queryClient` é injetado no contexto do saga para permitir invalidar queries
 * do React Query após efeitos orquestrados (ex.: transição de status da OV).
 * Pode ser injetado (testes) para compartilhar o mesmo cache do provider.
 */
export function makeStore(queryClient: QueryClient = getQueryClient()) {
  const sagaMiddleware = createSagaMiddleware({
    context: { queryClient },
  });

  const store = configureStore({
    reducer: {
      notifications: notificationsReducer,
      orders: ordersReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(sagaMiddleware),
  });

  sagaMiddleware.run(rootSaga);

  return store;
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
