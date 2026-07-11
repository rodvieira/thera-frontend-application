import { NextRequest } from 'next/server';
import { resetDb } from '@/mocks/data/db';
import { createSalesOrder } from '@/mocks/data/repository';
import { GET } from './route';

beforeEach(() => resetDb());

describe('app/api/audit-events route', () => {
  it('GET lista todos os eventos de auditoria quando nenhum filtro é informado', async () => {
    createSalesOrder({
      clientId: 'cl-atlas',
      transportTypeId: 'tt-caminhao',
      items: [{ itemId: 'it-1001', quantity: 1 }],
    });

    const response = await GET(
      new NextRequest('http://localhost/api/audit-events'),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveLength(1);
  });

  it('GET filtra por entityId quando informado na query string', async () => {
    const order = createSalesOrder({
      clientId: 'cl-atlas',
      transportTypeId: 'tt-caminhao',
      items: [{ itemId: 'it-1001', quantity: 1 }],
    });
    createSalesOrder({
      clientId: 'cl-boreal',
      transportTypeId: 'tt-carreta',
      items: [{ itemId: 'it-1002', quantity: 1 }],
    });

    const response = await GET(
      new NextRequest(`http://localhost/api/audit-events?entityId=${order.id}`),
    );
    const body = await response.json();

    expect(body).toHaveLength(1);
    expect(body[0].entityId).toBe(order.id);
  });
});
