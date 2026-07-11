import type { Client, Item, SalesOrder, TransportType } from '@/domain/types';
import { createAuditEvent, type AuditEvent } from '@/domain/audit';

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

function daysAgoIso(days: number, hours = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours, 0, 0, 0);
  return d.toISOString();
}

function dateOnly(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().slice(0, 10);
}

/**
 * Dados de demonstração (Ordens de Venda + trilha de auditoria) para a
 * aplicação abrir populada. `resetDb` (usado nos testes) NÃO chama esta
 * função — testes continuam partindo do estado mínimo e determinístico.
 */
function seedDemoData(): Pick<Database, 'salesOrders' | 'auditEvents'> {
  const salesOrders: SalesOrder[] = [
    {
      id: 'demoov-1',
      clientId: 'cl-atlas',
      transportTypeId: 'tt-caminhao',
      items: [{ itemId: 'it-1001', quantity: 4 }],
      status: 'ENTREGUE',
      schedule: { date: dateOnly(-2), window: 'MANHA', confirmed: true },
      createdAt: daysAgoIso(6),
      updatedAt: daysAgoIso(2),
    },
    {
      id: 'demoov-2',
      clientId: 'cl-boreal',
      transportTypeId: 'tt-carreta',
      items: [
        { itemId: 'it-1002', quantity: 10 },
        { itemId: 'it-1003', quantity: 5 },
      ],
      status: 'EM_TRANSPORTE',
      schedule: { date: dateOnly(0), window: 'TARDE', confirmed: true },
      createdAt: daysAgoIso(4),
      updatedAt: daysAgoIso(0, 3),
    },
    {
      id: 'demoov-3',
      clientId: 'cl-atlas',
      transportTypeId: 'tt-carreta',
      items: [{ itemId: 'it-1004', quantity: 20 }],
      status: 'AGENDADA',
      schedule: { date: dateOnly(2), window: 'INTEGRAL', confirmed: true },
      createdAt: daysAgoIso(3),
      updatedAt: daysAgoIso(1),
    },
    {
      id: 'demoov-4',
      clientId: 'cl-cerrado',
      transportTypeId: 'tt-caminhao',
      items: [
        { itemId: 'it-1001', quantity: 8 },
        { itemId: 'it-1004', quantity: 3 },
      ],
      status: 'PLANEJADA',
      schedule: null,
      createdAt: daysAgoIso(2),
      updatedAt: daysAgoIso(1, 4),
    },
    {
      id: 'demoov-5',
      clientId: 'cl-boreal',
      transportTypeId: 'tt-bitruck',
      items: [{ itemId: 'it-1002', quantity: 6 }],
      status: 'CRIADA',
      schedule: null,
      createdAt: daysAgoIso(1),
      updatedAt: daysAgoIso(1),
    },
  ];

  const auditEvents: AuditEvent[] = [
    createAuditEvent(
      { action: 'ORDER_CREATED', entity: 'SalesOrder', entityId: 'demoov-1' },
      { id: 'audit-demo-1-created', timestamp: daysAgoIso(6) },
    ),
    createAuditEvent(
      {
        action: 'STATUS_CHANGED',
        entity: 'SalesOrder',
        entityId: 'demoov-1',
        previousState: 'CRIADA',
        nextState: 'PLANEJADA',
      },
      { id: 'audit-demo-1-planejada', timestamp: daysAgoIso(5) },
    ),
    createAuditEvent(
      {
        action: 'SCHEDULE_CHANGED',
        entity: 'SalesOrder',
        entityId: 'demoov-1',
        previousState: null,
        nextState: `${dateOnly(-2)} MANHA`,
      },
      { id: 'audit-demo-1-schedule', timestamp: daysAgoIso(4) },
    ),
    createAuditEvent(
      {
        action: 'STATUS_CHANGED',
        entity: 'SalesOrder',
        entityId: 'demoov-1',
        previousState: 'PLANEJADA',
        nextState: 'AGENDADA',
      },
      { id: 'audit-demo-1-agendada', timestamp: daysAgoIso(3) },
    ),
    createAuditEvent(
      {
        action: 'STATUS_CHANGED',
        entity: 'SalesOrder',
        entityId: 'demoov-1',
        previousState: 'AGENDADA',
        nextState: 'EM_TRANSPORTE',
      },
      { id: 'audit-demo-1-transporte', timestamp: daysAgoIso(3, 4) },
    ),
    createAuditEvent(
      {
        action: 'STATUS_CHANGED',
        entity: 'SalesOrder',
        entityId: 'demoov-1',
        previousState: 'EM_TRANSPORTE',
        nextState: 'ENTREGUE',
      },
      { id: 'audit-demo-1-entregue', timestamp: daysAgoIso(2) },
    ),

    createAuditEvent(
      { action: 'ORDER_CREATED', entity: 'SalesOrder', entityId: 'demoov-2' },
      { id: 'audit-demo-2-created', timestamp: daysAgoIso(4) },
    ),
    createAuditEvent(
      {
        action: 'STATUS_CHANGED',
        entity: 'SalesOrder',
        entityId: 'demoov-2',
        previousState: 'CRIADA',
        nextState: 'PLANEJADA',
      },
      { id: 'audit-demo-2-planejada', timestamp: daysAgoIso(3) },
    ),
    createAuditEvent(
      {
        action: 'SCHEDULE_CHANGED',
        entity: 'SalesOrder',
        entityId: 'demoov-2',
        previousState: null,
        nextState: `${dateOnly(0)} TARDE`,
      },
      { id: 'audit-demo-2-schedule', timestamp: daysAgoIso(2) },
    ),
    createAuditEvent(
      {
        action: 'STATUS_CHANGED',
        entity: 'SalesOrder',
        entityId: 'demoov-2',
        previousState: 'PLANEJADA',
        nextState: 'AGENDADA',
      },
      { id: 'audit-demo-2-agendada', timestamp: daysAgoIso(1) },
    ),
    createAuditEvent(
      {
        action: 'STATUS_CHANGED',
        entity: 'SalesOrder',
        entityId: 'demoov-2',
        previousState: 'AGENDADA',
        nextState: 'EM_TRANSPORTE',
      },
      { id: 'audit-demo-2-transporte', timestamp: daysAgoIso(0, 3) },
    ),

    createAuditEvent(
      { action: 'ORDER_CREATED', entity: 'SalesOrder', entityId: 'demoov-3' },
      { id: 'audit-demo-3-created', timestamp: daysAgoIso(3) },
    ),
    createAuditEvent(
      {
        action: 'STATUS_CHANGED',
        entity: 'SalesOrder',
        entityId: 'demoov-3',
        previousState: 'CRIADA',
        nextState: 'PLANEJADA',
      },
      { id: 'audit-demo-3-planejada', timestamp: daysAgoIso(2) },
    ),
    createAuditEvent(
      {
        action: 'SCHEDULE_CHANGED',
        entity: 'SalesOrder',
        entityId: 'demoov-3',
        previousState: null,
        nextState: `${dateOnly(2)} INTEGRAL`,
      },
      { id: 'audit-demo-3-schedule', timestamp: daysAgoIso(1) },
    ),
    createAuditEvent(
      {
        action: 'STATUS_CHANGED',
        entity: 'SalesOrder',
        entityId: 'demoov-3',
        previousState: 'PLANEJADA',
        nextState: 'AGENDADA',
      },
      { id: 'audit-demo-3-agendada', timestamp: daysAgoIso(1) },
    ),

    createAuditEvent(
      { action: 'ORDER_CREATED', entity: 'SalesOrder', entityId: 'demoov-4' },
      { id: 'audit-demo-4-created', timestamp: daysAgoIso(2) },
    ),
    createAuditEvent(
      {
        action: 'STATUS_CHANGED',
        entity: 'SalesOrder',
        entityId: 'demoov-4',
        previousState: 'CRIADA',
        nextState: 'PLANEJADA',
      },
      { id: 'audit-demo-4-planejada', timestamp: daysAgoIso(1, 4) },
    ),

    createAuditEvent(
      { action: 'ORDER_CREATED', entity: 'SalesOrder', entityId: 'demoov-5' },
      { id: 'audit-demo-5-created', timestamp: daysAgoIso(1) },
    ),
  ];

  return { salesOrders, auditEvents };
}

export const db: Database = { ...seed(), ...seedDemoData() };

/** Reprovisiona o store para o estado inicial (útil em testes). */
export function resetDb(): void {
  const fresh = seed();
  db.transportTypes = fresh.transportTypes;
  db.items = fresh.items;
  db.clients = fresh.clients;
  db.salesOrders = fresh.salesOrders;
  db.auditEvents = fresh.auditEvents;
}
