import { apiClient } from '@/lib/api-client';
import type { OrderStatus, SalesOrder } from '@/domain/types';

export interface CreateSalesOrderInput {
  clientId: string;
  transportTypeId: string;
  items: { itemId: string; quantity: number }[];
}

export interface SalesOrderQuery {
  status?: OrderStatus;
  clientId?: string;
  transportTypeId?: string;
  date?: string;
}

function toQueryString(query: SalesOrderQuery): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const ordersApi = {
  list: (query: SalesOrderQuery = {}) =>
    apiClient.get<SalesOrder[]>(`/sales-orders${toQueryString(query)}`),
  get: (id: string) => apiClient.get<SalesOrder>(`/sales-orders/${id}`),
  create: (input: CreateSalesOrderInput) =>
    apiClient.post<SalesOrder>('/sales-orders', input),
  updateStatus: (id: string, status: OrderStatus) =>
    apiClient.patch<SalesOrder>(`/sales-orders/${id}/status`, { status }),
};
