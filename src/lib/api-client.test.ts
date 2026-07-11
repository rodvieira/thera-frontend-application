import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { apiClient, ApiError } from './api-client';

describe('apiClient', () => {
  it('retorna o corpo JSON em uma requisição bem-sucedida', async () => {
    server.use(
      http.get('/api/test-resource', () =>
        HttpResponse.json({ ok: true }, { status: 200 }),
      ),
    );

    const result = await apiClient.get<{ ok: boolean }>('/test-resource');
    expect(result).toEqual({ ok: true });
  });

  it('envia o corpo serializado em POST/PUT/PATCH', async () => {
    let received: unknown;
    server.use(
      http.post('/api/test-resource', async ({ request }) => {
        received = await request.json();
        return HttpResponse.json({ id: '1' }, { status: 201 });
      }),
    );

    await apiClient.post('/test-resource', { name: 'x' });
    expect(received).toEqual({ name: 'x' });
  });

  it('não retorna corpo para respostas 204', async () => {
    server.use(
      http.delete(
        '/api/test-resource',
        () => new HttpResponse(null, { status: 204 }),
      ),
    );

    const result = await apiClient.delete('/test-resource');
    expect(result).toBeUndefined();
  });

  it('lança ApiError com a mensagem do corpo da resposta de erro', async () => {
    server.use(
      http.get('/api/test-resource', () =>
        HttpResponse.json(
          { message: 'Recurso não encontrado' },
          { status: 404 },
        ),
      ),
    );

    await expect(apiClient.get('/test-resource')).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
      message: 'Recurso não encontrado',
    });
  });

  it('usa mensagem padrão quando a resposta de erro não tem corpo parseável', async () => {
    server.use(
      http.get(
        '/api/test-resource',
        () => new HttpResponse('erro cru', { status: 500 }),
      ),
    );

    let caught: unknown;
    try {
      await apiClient.get('/test-resource');
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(ApiError);
    expect((caught as ApiError).message).toBe('Request failed with status 500');
  });
});
