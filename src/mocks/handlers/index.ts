import type { HttpHandler } from 'msw';
import { http, HttpResponse } from 'msw';
import { transportTypeHandlers } from './transport-types';
import { itemHandlers } from './items';
import { clientHandlers } from './clients';
import { salesOrderHandlers } from './sales-orders';

/**
 * Handlers do MSW. Cada recurso contribui com seus handlers de CRUD, lastreados
 * pelo store em memória (`src/mocks/data/db.ts`).
 */
export const handlers: HttpHandler[] = [
  http.get('/api/health', () => HttpResponse.json({ status: 'ok' })),
  ...transportTypeHandlers,
  ...itemHandlers,
  ...clientHandlers,
  ...salesOrderHandlers,
];
