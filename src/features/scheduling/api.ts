import { apiClient } from '@/lib/api-client';
import type { SalesOrder, DeliveryWindow } from '@/domain/types';

export interface ScheduleInput {
  date: string;
  window: DeliveryWindow;
}

export const schedulingApi = {
  schedule: (id: string, input: ScheduleInput) =>
    apiClient.patch<SalesOrder>(`/sales-orders/${id}/schedule`, input),
  confirm: (id: string) =>
    apiClient.post<SalesOrder>(`/sales-orders/${id}/schedule/confirm`),
};
