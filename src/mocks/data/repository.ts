import type { Client, Item, TransportType } from '@/domain/types';
import { db } from './db';

/**
 * Camada de serviço do backend mockado. Opera sobre o store em memória (`db`) e
 * é compartilhada pelos Route Handlers do Next (aplicação) e pelos handlers do
 * MSW (testes), evitando duplicar a lógica de negócio da API.
 */

/** Erro com status HTTP, traduzido pelos adaptadores (route handlers / MSW). */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

// --- Tipos de transporte ---

export function listTransportTypes(): TransportType[] {
  return db.transportTypes;
}

export function createTransportType(input: { name: string }): TransportType {
  const name = input.name?.trim();
  if (!name) throw new HttpError(400, 'Nome é obrigatório');
  const created: TransportType = { id: crypto.randomUUID(), name };
  db.transportTypes.push(created);
  return created;
}

export function updateTransportType(
  id: string,
  input: { name: string },
): TransportType {
  const current = db.transportTypes.find((t) => t.id === id);
  if (!current) throw new HttpError(404, 'Tipo de transporte não encontrado');
  const name = input.name?.trim();
  if (!name) throw new HttpError(400, 'Nome é obrigatório');
  current.name = name;
  return current;
}

// --- Itens ---

export function listItems(): Item[] {
  return db.items;
}

export function createItem(input: {
  sku: string;
  name: string;
  unit: string;
}): Item {
  const sku = input.sku?.trim();
  const name = input.name?.trim();
  if (!sku || !name) throw new HttpError(400, 'SKU e nome são obrigatórios');
  if (db.items.some((item) => item.sku === sku)) {
    throw new HttpError(409, 'SKU já cadastrado');
  }
  const created: Item = {
    id: crypto.randomUUID(),
    sku,
    name,
    unit: input.unit?.trim() || 'UN',
  };
  db.items.push(created);
  return created;
}

// --- Clientes ---

interface ClientInput {
  name: string;
  document: string;
  authorizedTransportTypeIds: string[];
}

function assertValidClient(input: ClientInput): void {
  if (!input.name?.trim()) throw new HttpError(400, 'Nome é obrigatório');
  if (!input.authorizedTransportTypeIds?.length) {
    throw new HttpError(
      400,
      'Selecione ao menos um tipo de transporte autorizado',
    );
  }
}

export function listClients(): Client[] {
  return db.clients;
}

export function createClient(input: ClientInput): Client {
  assertValidClient(input);
  const created: Client = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    document: input.document?.trim() ?? '',
    authorizedTransportTypeIds: input.authorizedTransportTypeIds,
  };
  db.clients.push(created);
  return created;
}

export function updateClient(id: string, input: ClientInput): Client {
  const current = db.clients.find((c) => c.id === id);
  if (!current) throw new HttpError(404, 'Cliente não encontrado');
  assertValidClient(input);
  current.name = input.name.trim();
  current.document = input.document?.trim() ?? '';
  current.authorizedTransportTypeIds = input.authorizedTransportTypeIds;
  return current;
}
