import { http, HttpResponse } from 'msw';
import { waitFor } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { server } from '@/mocks/server';
import { resetDb } from '@/mocks/data/db';
import { createSalesOrder } from '@/mocks/data/repository';
import { makeStore } from '@/store';
import { selectNotifications } from '@/store/slices/notifications';
import {
  statusTransitionRequested,
  selectTransitioningId,
} from './orders-slice';

beforeEach(() => resetDb());

function setup() {
  const store = makeStore(new QueryClient());
  return store;
}

describe('ordersSaga', () => {
  it('rejeita uma transição fora da sequência sem chamar a API', async () => {
    const order = createSalesOrder({
      clientId: 'cl-atlas',
      transportTypeId: 'tt-caminhao',
      items: [{ itemId: 'it-1001', quantity: 1 }],
    });
    const store = setup();

    store.dispatch(
      statusTransitionRequested({
        id: order.id,
        currentStatus: 'CRIADA',
        nextStatus: 'AGENDADA', // pula PLANEJADA — transição inválida
      }),
    );

    await waitFor(() =>
      expect(selectTransitioningId(store.getState())).toBeNull(),
    );
    expect(selectNotifications(store.getState())).toEqual([
      expect.objectContaining({
        type: 'error',
        message: 'Transição de status inválida',
      }),
    ]);
  });

  it('notifica erro da API e limpa o estado de transição quando a chamada falha', async () => {
    const order = createSalesOrder({
      clientId: 'cl-atlas',
      transportTypeId: 'tt-caminhao',
      items: [{ itemId: 'it-1001', quantity: 1 }],
    });
    server.use(
      http.patch('/api/sales-orders/:id/status', () =>
        HttpResponse.json(
          { message: 'Falha simulada na API' },
          { status: 500 },
        ),
      ),
    );
    const store = setup();

    store.dispatch(
      statusTransitionRequested({
        id: order.id,
        currentStatus: 'CRIADA',
        nextStatus: 'PLANEJADA',
      }),
    );

    await waitFor(() =>
      expect(selectTransitioningId(store.getState())).toBeNull(),
    );
    expect(selectNotifications(store.getState())).toEqual([
      expect.objectContaining({
        type: 'error',
        message: 'Falha simulada na API',
      }),
    ]);
  });

  it('avança o status, notifica sucesso e invalida as queries relacionadas', async () => {
    const order = createSalesOrder({
      clientId: 'cl-atlas',
      transportTypeId: 'tt-caminhao',
      items: [{ itemId: 'it-1001', quantity: 1 }],
    });
    const queryClient = new QueryClient();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const store = makeStore(queryClient);

    store.dispatch(
      statusTransitionRequested({
        id: order.id,
        currentStatus: 'CRIADA',
        nextStatus: 'PLANEJADA',
      }),
    );

    await waitFor(() =>
      expect(selectTransitioningId(store.getState())).toBeNull(),
    );
    expect(selectNotifications(store.getState())).toEqual([
      expect.objectContaining({ type: 'success' }),
    ]);
    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['sales-orders'] }),
    );
    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['audit-events'] }),
    );
  });
});
