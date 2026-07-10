/**
 * Tipos centrais do domínio OVGS. Sem dependência de React, API ou framework.
 */

/** Estados do fluxo operacional da Ordem de Venda, em ordem. */
export const ORDER_STATUSES = [
  'CRIADA',
  'PLANEJADA',
  'AGENDADA',
  'EM_TRANSPORTE',
  'ENTREGUE',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Tipo de transporte (ex.: Caminhão, Carreta, Bi-truck). */
export interface TransportType {
  id: string;
  name: string;
}

/** Item cadastrado que pode ser vinculado a uma OV. */
export interface Item {
  id: string;
  sku: string;
  name: string;
  unit: string;
}

/** Cliente, com a lista de tipos de transporte autorizados. */
export interface Client {
  id: string;
  name: string;
  document: string;
  authorizedTransportTypeIds: string[];
}

export type DeliveryWindow = 'MANHA' | 'TARDE' | 'INTEGRAL';

/** Agendamento de entrega de uma OV. */
export interface DeliverySchedule {
  date: string; // ISO date (YYYY-MM-DD)
  window: DeliveryWindow;
  confirmed: boolean;
}

/** Item de uma OV: referência ao item cadastrado + quantidade. */
export interface SalesOrderItem {
  itemId: string;
  quantity: number;
}

/** Ordem de Venda. */
export interface SalesOrder {
  id: string;
  clientId: string;
  transportTypeId: string;
  items: SalesOrderItem[];
  status: OrderStatus;
  schedule: DeliverySchedule | null;
  createdAt: string;
  updatedAt: string;
}
