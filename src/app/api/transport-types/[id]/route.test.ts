import { NextRequest } from 'next/server';
import { resetDb } from '@/mocks/data/db';
import { PUT } from './route';

beforeEach(() => resetDb());

function putRequest(name: string) {
  return new NextRequest('http://localhost/api/transport-types/tt-caminhao', {
    method: 'PUT',
    body: JSON.stringify({ name }),
  });
}

describe('app/api/transport-types/[id] route', () => {
  it('PUT atualiza um tipo de transporte existente', async () => {
    const response = await PUT(putRequest('Caminhão Baú'), {
      params: Promise.resolve({ id: 'tt-caminhao' }),
    });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.name).toBe('Caminhão Baú');
  });

  it('PUT retorna 404 para tipo de transporte inexistente', async () => {
    const response = await PUT(putRequest('Qualquer'), {
      params: Promise.resolve({ id: 'tt-inexistente' }),
    });

    expect(response.status).toBe(404);
  });
});
