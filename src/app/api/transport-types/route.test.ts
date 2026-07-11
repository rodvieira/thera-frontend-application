import { NextRequest } from 'next/server';
import { resetDb } from '@/mocks/data/db';
import { GET, POST } from './route';

beforeEach(() => resetDb());

describe('app/api/transport-types route', () => {
  it('GET lista os tipos de transporte cadastrados', async () => {
    const response = await GET();
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toHaveLength(3);
  });

  it('POST cria um tipo de transporte e retorna 201', async () => {
    const request = new NextRequest('http://localhost/api/transport-types', {
      method: 'POST',
      body: JSON.stringify({ name: 'Van' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.name).toBe('Van');
  });

  it('POST retorna 400 quando o nome não é informado', async () => {
    const request = new NextRequest('http://localhost/api/transport-types', {
      method: 'POST',
      body: JSON.stringify({ name: '  ' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
