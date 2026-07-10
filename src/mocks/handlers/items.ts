import { http } from 'msw';
import { listItems, createItem } from '../data/repository';
import { respond } from './respond';

export const itemHandlers = [
  http.get('/api/items', () => respond(() => listItems())),

  http.post('/api/items', async ({ request }) => {
    const body = (await request.json()) as {
      sku: string;
      name: string;
      unit: string;
    };
    return respond(() => createItem(body), 201);
  }),
];
