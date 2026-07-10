import type { HttpHandler } from 'msw';
import { http, HttpResponse } from 'msw';

/**
 * Handlers do MSW. Cada feature adiciona seus handlers de recurso aqui
 * (clientes, tipos de transporte, itens, ordens de venda, etc.).
 *
 * Por ora expõe apenas um health check, usado para validar a interceptação.
 */
export const handlers: HttpHandler[] = [
  http.get('/api/health', () => HttpResponse.json({ status: 'ok' })),
];
