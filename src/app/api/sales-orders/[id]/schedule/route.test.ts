import { NextRequest } from 'next/server';
import { resetDb } from '@/mocks/data/db';
import { createSalesOrder } from '@/mocks/data/repository';
import { PATCH } from './route';

beforeEach(() => resetDb());

describe('app/api/sales-orders/[id]/schedule route', () => {
  it('PATCH agenda a entrega e retorna a OV atualizada', async () => {
    const order = createSalesOrder({
      clientId: 'cl-atlas',
      transportTypeId: 'tt-caminhao',
      items: [{ itemId: 'it-1001', quantity: 1 }],
    });

    const request = new NextRequest(
      `http://localhost/api/sales-orders/${order.id}/schedule`,
      {
        method: 'PATCH',
        body: JSON.stringify({ date: '2099-01-15', window: 'MANHA' }),
      },
    );

    const response = await PATCH(request, {
      params: Promise.resolve({ id: order.id }),
    });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.schedule).toMatchObject({
      date: '2099-01-15',
      window: 'MANHA',
    });
  });

  it('PATCH retorna 400 quando a data não é informada', async () => {
    const order = createSalesOrder({
      clientId: 'cl-atlas',
      transportTypeId: 'tt-caminhao',
      items: [{ itemId: 'it-1001', quantity: 1 }],
    });

    const request = new NextRequest(
      `http://localhost/api/sales-orders/${order.id}/schedule`,
      {
        method: 'PATCH',
        body: JSON.stringify({ date: '', window: 'MANHA' }),
      },
    );

    const response = await PATCH(request, {
      params: Promise.resolve({ id: order.id }),
    });

    expect(response.status).toBe(400);
  });
});
