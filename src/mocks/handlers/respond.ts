import { HttpResponse } from 'msw';
import { HttpError } from '../data/repository';

/**
 * Executa a lógica do repositório e traduz `HttpError` em `HttpResponse` do MSW.
 * Espelha o `handleRoute` dos Route Handlers, mantendo a mesma semântica nos
 * testes.
 */
export function respond(fn: () => unknown, successStatus = 200) {
  try {
    return HttpResponse.json(fn() as object, { status: successStatus });
  } catch (error) {
    if (error instanceof HttpError) {
      return HttpResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }
    throw error;
  }
}
