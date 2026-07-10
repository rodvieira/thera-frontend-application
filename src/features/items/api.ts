import { apiClient } from '@/lib/api-client';
import type { Item } from '@/domain/types';

export interface ItemInput {
  sku: string;
  name: string;
  unit: string;
}

export const itemsApi = {
  list: () => apiClient.get<Item[]>('/items'),
  create: (input: ItemInput) => apiClient.post<Item>('/items', input),
};
