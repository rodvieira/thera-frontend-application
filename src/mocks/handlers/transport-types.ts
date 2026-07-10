import { http } from 'msw';
import {
  listTransportTypes,
  createTransportType,
  updateTransportType,
} from '../data/repository';
import { respond } from './respond';

export const transportTypeHandlers = [
  http.get('/api/transport-types', () => respond(() => listTransportTypes())),

  http.post('/api/transport-types', async ({ request }) => {
    const body = (await request.json()) as { name: string };
    return respond(() => createTransportType(body), 201);
  }),

  http.put('/api/transport-types/:id', async ({ params, request }) => {
    const body = (await request.json()) as { name: string };
    return respond(() => updateTransportType(params.id as string, body));
  }),
];
