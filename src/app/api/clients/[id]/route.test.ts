import { NextRequest } from 'next/server';
import { resetDb } from '@/mocks/data/db';
import { PUT } from './route';

beforeEach(() => resetDb());

function putRequest(body: unknown) {
  return new NextRequest('http://localhost/api/clients/cl-atlas', {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

describe('app/api/clients/[id] route', () => {
  it('PUT atualiza um cliente existente', async () => {
    const response = await PUT(
      putRequest({
        name: 'Atlas Renomeada',
        document: '12.345.678/0001-90',
        authorizedTransportTypeIds: ['tt-caminhao'],
      }),
      { params: Promise.resolve({ id: 'cl-atlas' }) },
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.name).toBe('Atlas Renomeada');
  });

  it('PUT retorna 404 para cliente inexistente', async () => {
    const response = await PUT(
      putRequest({
        name: 'X',
        document: '12.345.678/0001-90',
        authorizedTransportTypeIds: ['tt-caminhao'],
      }),
      { params: Promise.resolve({ id: 'cl-inexistente' }) },
    );

    expect(response.status).toBe(404);
  });
});
