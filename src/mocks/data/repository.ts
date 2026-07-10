import type {
  Client,
  Item,
  SalesOrder,
  SalesOrderItem,
  TransportType,
  OrderStatus,
  DeliveryWindow,
} from '@/domain/types';
import { isTransportAuthorized } from '@/domain/transport-authorization';
import { canTransition } from '@/domain/order-status';
import { createAuditEvent, type AuditAction } from '@/domain/audit';
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

// --- Ordens de Venda ---

function recordAudit(
  action: AuditAction,
  entityId: string,
  previousState: string | null,
  nextState: string | null,
): void {
  db.auditEvents.push(
    createAuditEvent({
      action,
      entity: 'SalesOrder',
      entityId,
      previousState,
      nextState,
    }),
  );
}

export interface SalesOrderFilters {
  status?: OrderStatus;
  clientId?: string;
  transportTypeId?: string;
  date?: string;
}

export function listSalesOrders(filters: SalesOrderFilters = {}): SalesOrder[] {
  return db.salesOrders.filter((order) => {
    if (filters.status && order.status !== filters.status) return false;
    if (filters.clientId && order.clientId !== filters.clientId) return false;
    if (
      filters.transportTypeId &&
      order.transportTypeId !== filters.transportTypeId
    ) {
      return false;
    }
    if (filters.date && order.schedule?.date !== filters.date) return false;
    return true;
  });
}

export function getSalesOrder(id: string): SalesOrder {
  const order = db.salesOrders.find((o) => o.id === id);
  if (!order) throw new HttpError(404, 'Ordem de Venda não encontrada');
  return order;
}

export interface CreateSalesOrderInput {
  clientId: string;
  transportTypeId: string;
  items: SalesOrderItem[];
}

export function createSalesOrder(input: CreateSalesOrderInput): SalesOrder {
  const client = db.clients.find((c) => c.id === input.clientId);
  if (!client) throw new HttpError(400, 'Cliente inválido');

  if (!input.transportTypeId) {
    throw new HttpError(400, 'Tipo de transporte é obrigatório');
  }
  if (!isTransportAuthorized(client, input.transportTypeId)) {
    throw new HttpError(
      400,
      'Tipo de transporte não autorizado para o cliente',
    );
  }

  const items = (input.items ?? []).filter((item) => item.quantity > 0);
  if (items.length === 0) {
    throw new HttpError(400, 'Informe ao menos um item');
  }
  const hasInvalidItem = items.some(
    (item) => !db.items.some((it) => it.id === item.itemId),
  );
  if (hasInvalidItem) throw new HttpError(400, 'Item inválido na ordem');

  const now = new Date().toISOString();
  const order: SalesOrder = {
    id: crypto.randomUUID(),
    clientId: input.clientId,
    transportTypeId: input.transportTypeId,
    items,
    status: 'CRIADA',
    schedule: null,
    createdAt: now,
    updatedAt: now,
  };
  db.salesOrders.push(order);
  recordAudit('ORDER_CREATED', order.id, null, order.status);
  return order;
}

export function updateSalesOrderStatus(
  id: string,
  nextStatus: OrderStatus,
): SalesOrder {
  const order = getSalesOrder(id);
  if (!canTransition(order.status, nextStatus)) {
    throw new HttpError(
      409,
      `Transição inválida: ${order.status} → ${nextStatus}`,
    );
  }
  const previous = order.status;
  order.status = nextStatus;
  order.updatedAt = new Date().toISOString();
  recordAudit('STATUS_CHANGED', order.id, previous, nextStatus);
  return order;
}

// --- Agendamento ---

export function scheduleDelivery(
  id: string,
  input: { date: string; window: DeliveryWindow },
): SalesOrder {
  const order = getSalesOrder(id);
  if (!input.date) throw new HttpError(400, 'Data é obrigatória');

  const previous = order.schedule
    ? `${order.schedule.date} ${order.schedule.window}`
    : null;
  order.schedule = { date: input.date, window: input.window, confirmed: false };
  order.updatedAt = new Date().toISOString();
  recordAudit(
    'SCHEDULE_CHANGED',
    id,
    previous,
    `${input.date} ${input.window}`,
  );
  return order;
}

export function confirmSchedule(id: string): SalesOrder {
  const order = getSalesOrder(id);
  if (!order.schedule) {
    throw new HttpError(400, 'Defina data e janela antes de confirmar');
  }

  order.schedule.confirmed = true;
  order.updatedAt = new Date().toISOString();
  recordAudit('SCHEDULE_CHANGED', id, 'não confirmado', 'confirmado');

  // Confirmar o agendamento leva uma OV planejada para AGENDADA.
  if (canTransition(order.status, 'AGENDADA')) {
    const previous = order.status;
    order.status = 'AGENDADA';
    recordAudit('STATUS_CHANGED', id, previous, 'AGENDADA');
  }
  return order;
}
