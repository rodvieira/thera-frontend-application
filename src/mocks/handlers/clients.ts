import { http } from 'msw';
import { listClients, createClient, updateClient } from '../data/repository';
import { respond } from './respond';

interface ClientInput {
  name: string;
  document: string;
  authorizedTransportTypeIds: string[];
}

export const clientHandlers = [
  http.get('/api/clients', () => respond(() => listClients())),

  http.post('/api/clients', async ({ request }) => {
    const body = (await request.json()) as ClientInput;
    return respond(() => createClient(body), 201);
  }),

  http.put('/api/clients/:id', async ({ params, request }) => {
    const body = (await request.json()) as ClientInput;
    return respond(() => updateClient(params.id as string, body));
  }),
];
