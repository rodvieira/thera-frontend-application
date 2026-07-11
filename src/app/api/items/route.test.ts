import { NextRequest } from 'next/server';
import { resetDb } from '@/mocks/data/db';
import { GET, POST } from './route';

beforeEach(() => resetDb());

describe('app/api/items route', () => {
  it('GET lista os itens cadastrados', async () => {
    const response = await GET();
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toHaveLength(4);
  });

  it('POST cria um item e retorna 201', async () => {
    const request = new NextRequest('http://localhost/api/items', {
      method: 'POST',
      body: JSON.stringify({ sku: 'SKU-2001', name: 'Novo item', unit: 'UN' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.sku).toBe('SKU-2001');
  });

  it('POST retorna 409 para SKU duplicado', async () => {
    const request = new NextRequest('http://localhost/api/items', {
      method: 'POST',
      body: JSON.stringify({ sku: 'SKU-1001', name: 'Duplicado', unit: 'UN' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(409);
  });
});
