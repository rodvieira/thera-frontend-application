import { apiClient } from '@/lib/api-client';
import type { TransportType } from '@/domain/types';

export interface TransportTypeInput {
  name: string;
}

export const transportTypesApi = {
  list: () => apiClient.get<TransportType[]>('/transport-types'),
  create: (input: TransportTypeInput) =>
    apiClient.post<TransportType>('/transport-types', input),
  update: (id: string, input: TransportTypeInput) =>
    apiClient.put<TransportType>(`/transport-types/${id}`, input),
};
