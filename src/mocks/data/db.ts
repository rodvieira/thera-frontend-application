import type { Client, Item, SalesOrder, TransportType } from '@/domain/types';
import type { AuditEvent } from '@/domain/audit';

/**
 * Store em memória que lastreia a API mockada (MSW). Os handlers leem e escrevem
 * aqui, de modo que criações/edições reflitam nas consultas seguintes durante a
 * sessão. O seed é reprovisionado a cada carga da aplicação.
 */
export interface Database {
  transportTypes: TransportType[];
  items: Item[];
  clients: Client[];
  salesOrders: SalesOrder[];
  auditEvents: AuditEvent[];
}

const seedTransportTypes: TransportType[] = [
  { id: 'tt-caminhao', name: 'Caminhão' },
  { id: 'tt-carreta', name: 'Carreta' },
  { id: 'tt-bitruck', name: 'Bi-truck' },
];

const seedItems: Item[] = [
  { id: 'it-1001', sku: 'SKU-1001', name: 'Palete de água 500ml', unit: 'PLT' },
  { id: 'it-1002', sku: 'SKU-1002', name: 'Caixa de refrigerante', unit: 'CX' },
  { id: 'it-1003', sku: 'SKU-1003', name: 'Fardo de arroz 5kg', unit: 'FD' },
  { id: 'it-1004', sku: 'SKU-1004', name: 'Saco de cimento 50kg', unit: 'SC' },
];

const seedClients: Client[] = [
  {
    id: 'cl-atlas',
    name: 'Atlas Distribuidora',
    document: '12.345.678/0001-90',
    authorizedTransportTypeIds: ['tt-caminhao', 'tt-carreta'],
  },
  {
    id: 'cl-boreal',
    name: 'Boreal Alimentos',
    document: '98.765.432/0001-10',
    authorizedTransportTypeIds: ['tt-carreta', 'tt-bitruck'],
  },
  {
    id: 'cl-cerrado',
    name: 'Cerrado Varejo',
    document: '45.678.912/0001-33',
    authorizedTransportTypeIds: ['tt-caminhao'],
  },
];

function seed(): Database {
  return {
    transportTypes: structuredClone(seedTransportTypes),
    items: structuredClone(seedItems),
    clients: structuredClone(seedClients),
    salesOrders: [],
    auditEvents: [],
  };
}

export const db: Database = seed();

/** Reprovisiona o store para o estado inicial (útil em testes). */
export function resetDb(): void {
  const fresh = seed();
  db.transportTypes = fresh.transportTypes;
  db.items = fresh.items;
  db.clients = fresh.clients;
  db.salesOrders = fresh.salesOrders;
  db.auditEvents = fresh.auditEvents;
}
