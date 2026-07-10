import { http, HttpResponse } from 'msw';
import type { TransportType } from '@/domain/types';
import { db } from '../data/db';

interface TransportTypeInput {
  name: string;
}

export const transportTypeHandlers = [
  http.get('/api/transport-types', () => HttpResponse.json(db.transportTypes)),

  http.post('/api/transport-types', async ({ request }) => {
    const body = (await request.json()) as TransportTypeInput;
    if (!body.name?.trim()) {
      return HttpResponse.json(
        { message: 'Nome é obrigatório' },
        { status: 400 },
      );
    }
    const created: TransportType = {
      id: crypto.randomUUID(),
      name: body.name.trim(),
    };
    db.transportTypes.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.put('/api/transport-types/:id', async ({ params, request }) => {
    const body = (await request.json()) as TransportTypeInput;
    const current = db.transportTypes.find((t) => t.id === params.id);
    if (!current) {
      return HttpResponse.json(
        { message: 'Tipo de transporte não encontrado' },
        { status: 404 },
      );
    }
    current.name = body.name.trim();
    return HttpResponse.json(current);
  }),
];
