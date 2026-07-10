import { apiClient } from '@/lib/api-client';
import type { Client } from '@/domain/types';

export interface ClientInput {
  name: string;
  document: string;
  authorizedTransportTypeIds: string[];
}

export const clientsApi = {
  list: () => apiClient.get<Client[]>('/clients'),
  create: (input: ClientInput) => apiClient.post<Client>('/clients', input),
  update: (id: string, input: ClientInput) =>
    apiClient.put<Client>(`/clients/${id}`, input),
};
