import { NextRequest } from 'next/server';
import { resetDb } from '@/mocks/data/db';
import { createSalesOrder } from '@/mocks/data/repository';
import { GET, POST } from './route';

beforeEach(() => resetDb());

describe('app/api/sales-orders route', () => {
  it('GET lista as Ordens de Venda aplicando filtros da query string', async () => {
    createSalesOrder({
      clientId: 'cl-atlas',
      transportTypeId: 'tt-caminhao',
      items: [{ itemId: 'it-1001', quantity: 1 }],
    });
    createSalesOrder({
      clientId: 'cl-boreal',
      transportTypeId: 'tt-carreta',
      items: [{ itemId: 'it-1002', quantity: 1 }],
    });

    const request = new NextRequest(
      'http://localhost/api/sales-orders?clientId=cl-atlas',
    );
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0].clientId).toBe('cl-atlas');
  });

  it('POST cria uma Ordem de Venda válida e retorna 201', async () => {
    const request = new NextRequest('http://localhost/api/sales-orders', {
      method: 'POST',
      body: JSON.stringify({
        clientId: 'cl-atlas',
        transportTypeId: 'tt-caminhao',
        items: [{ itemId: 'it-1001', quantity: 2 }],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.status).toBe('CRIADA');
  });

  it('POST retorna 400 quando o transporte não é autorizado para o cliente', async () => {
    const request = new NextRequest('http://localhost/api/sales-orders', {
      method: 'POST',
      body: JSON.stringify({
        clientId: 'cl-cerrado', // só autoriza tt-caminhao
        transportTypeId: 'tt-carreta',
        items: [{ itemId: 'it-1001', quantity: 1 }],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.message).toMatch(/não autorizado/i);
  });
});
