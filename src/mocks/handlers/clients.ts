import { http, HttpResponse } from 'msw';
import type { Client } from '@/domain/types';
import { db } from '../data/db';

interface ClientInput {
  name: string;
  document: string;
  authorizedTransportTypeIds: string[];
}

function validate(body: ClientInput): string | null {
  if (!body.name?.trim()) return 'Nome é obrigatório';
  if (!body.authorizedTransportTypeIds?.length) {
    return 'Selecione ao menos um tipo de transporte autorizado';
  }
  return null;
}

export const clientHandlers = [
  http.get('/api/clients', () => HttpResponse.json(db.clients)),

  http.post('/api/clients', async ({ request }) => {
    const body = (await request.json()) as ClientInput;
    const error = validate(body);
    if (error) return HttpResponse.json({ message: error }, { status: 400 });

    const created: Client = {
      id: crypto.randomUUID(),
      name: body.name.trim(),
      document: body.document?.trim() ?? '',
      authorizedTransportTypeIds: body.authorizedTransportTypeIds,
    };
    db.clients.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.put('/api/clients/:id', async ({ params, request }) => {
    const body = (await request.json()) as ClientInput;
    const current = db.clients.find((c) => c.id === params.id);
    if (!current) {
      return HttpResponse.json(
        { message: 'Cliente não encontrado' },
        { status: 404 },
      );
    }
    const error = validate(body);
    if (error) return HttpResponse.json({ message: error }, { status: 400 });

    current.name = body.name.trim();
    current.document = body.document?.trim() ?? '';
    current.authorizedTransportTypeIds = body.authorizedTransportTypeIds;
    return HttpResponse.json(current);
  }),
];
