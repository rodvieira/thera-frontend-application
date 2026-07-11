import { NextRequest } from 'next/server';
import { resetDb } from '@/mocks/data/db';
import { GET, POST } from './route';

beforeEach(() => resetDb());

describe('app/api/clients route', () => {
  it('GET lista os clientes cadastrados', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveLength(3);
  });

  it('POST cria um cliente e retorna 201', async () => {
    const request = new NextRequest('http://localhost/api/clients', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Delta Logística',
        document: '11.222.333/0001-81',
        authorizedTransportTypeIds: ['tt-caminhao'],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.name).toBe('Delta Logística');
  });

  it('POST retorna 400 quando nenhum transporte é autorizado', async () => {
    const request = new NextRequest('http://localhost/api/clients', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Sem transporte',
        document: '11.222.333/0001-81',
        authorizedTransportTypeIds: [],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.message).toMatch(/tipo de transporte/i);
  });
});
