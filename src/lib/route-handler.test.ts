import { handleRoute } from './route-handler';
import { HttpError } from '@/mocks/data/repository';

describe('handleRoute', () => {
  it('retorna o dado com o status de sucesso informado', async () => {
    const response = await handleRoute(() => ({ ok: true }), 201);

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it('aguarda funções assíncronas antes de responder', async () => {
    const response = await handleRoute(async () => {
      await Promise.resolve();
      return { async: true };
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ async: true });
  });

  it('traduz HttpError no status e mensagem correspondentes', async () => {
    const response = await handleRoute(() => {
      throw new HttpError(404, 'Não encontrado');
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: 'Não encontrado',
    });
  });

  it('traduz erro inesperado em 500 com mensagem genérica', async () => {
    const response = await handleRoute(() => {
      throw new Error('boom');
    });

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      message: 'Erro interno',
    });
  });
});
