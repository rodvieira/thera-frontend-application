import { resetDb } from '@/mocks/data/db';
import { createSalesOrder } from '@/mocks/data/repository';
import { GET } from './route';

beforeEach(() => resetDb());

describe('app/api/sales-orders/[id] route', () => {
  it('GET retorna a Ordem de Venda pelo id', async () => {
    const order = createSalesOrder({
      clientId: 'cl-atlas',
      transportTypeId: 'tt-caminhao',
      items: [{ itemId: 'it-1001', quantity: 1 }],
    });

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: order.id }),
    });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(order.id);
  });

  it('GET retorna 404 para Ordem de Venda inexistente', async () => {
    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'ov-inexistente' }),
    });

    expect(response.status).toBe(404);
  });
});
