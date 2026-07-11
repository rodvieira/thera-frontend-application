import { NextRequest } from 'next/server';
import { resetDb } from '@/mocks/data/db';
import { createSalesOrder } from '@/mocks/data/repository';
import { PATCH } from './route';

beforeEach(() => resetDb());

function patchRequest(status: string) {
  return new NextRequest('http://localhost/api/sales-orders/x/status', {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

describe('app/api/sales-orders/[id]/status route', () => {
  it('PATCH avança o status quando a transição é válida', async () => {
    const order = createSalesOrder({
      clientId: 'cl-atlas',
      transportTypeId: 'tt-caminhao',
      items: [{ itemId: 'it-1001', quantity: 1 }],
    });

    const response = await PATCH(patchRequest('PLANEJADA'), {
      params: Promise.resolve({ id: order.id }),
    });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('PLANEJADA');
  });

  it('PATCH retorna 409 para transição fora da sequência', async () => {
    const order = createSalesOrder({
      clientId: 'cl-atlas',
      transportTypeId: 'tt-caminhao',
      items: [{ itemId: 'it-1001', quantity: 1 }],
    });

    const response = await PATCH(patchRequest('ENTREGUE'), {
      params: Promise.resolve({ id: order.id }),
    });

    expect(response.status).toBe(409);
  });
});
