import { http, HttpResponse } from 'msw';
import type { Item } from '@/domain/types';
import { db } from '../data/db';

interface ItemInput {
  sku: string;
  name: string;
  unit: string;
}

export const itemHandlers = [
  http.get('/api/items', () => HttpResponse.json(db.items)),

  http.post('/api/items', async ({ request }) => {
    const body = (await request.json()) as ItemInput;
    if (!body.sku?.trim() || !body.name?.trim()) {
      return HttpResponse.json(
        { message: 'SKU e nome são obrigatórios' },
        { status: 400 },
      );
    }
    const sku = body.sku.trim();
    if (db.items.some((item) => item.sku === sku)) {
      return HttpResponse.json(
        { message: 'SKU já cadastrado' },
        { status: 409 },
      );
    }
    const created: Item = {
      id: crypto.randomUUID(),
      sku,
      name: body.name.trim(),
      unit: body.unit?.trim() || 'UN',
    };
    db.items.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),
];
