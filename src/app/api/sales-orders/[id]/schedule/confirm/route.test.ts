import { resetDb } from '@/mocks/data/db';
import { createSalesOrder, scheduleDelivery } from '@/mocks/data/repository';
import { POST } from './route';

beforeEach(() => resetDb());

describe('app/api/sales-orders/[id]/schedule/confirm route', () => {
  it('POST confirma o agendamento existente', async () => {
    const order = createSalesOrder({
      clientId: 'cl-atlas',
      transportTypeId: 'tt-caminhao',
      items: [{ itemId: 'it-1001', quantity: 1 }],
    });
    scheduleDelivery(order.id, { date: '2099-01-15', window: 'MANHA' });

    const response = await POST(new Request('http://localhost'), {
      params: Promise.resolve({ id: order.id }),
    });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.schedule.confirmed).toBe(true);
  });

  it('POST retorna 400 quando não há agendamento para confirmar', async () => {
    const order = createSalesOrder({
      clientId: 'cl-atlas',
      transportTypeId: 'tt-caminhao',
      items: [{ itemId: 'it-1001', quantity: 1 }],
    });

    const response = await POST(new Request('http://localhost'), {
      params: Promise.resolve({ id: order.id }),
    });

    expect(response.status).toBe(400);
  });
});
