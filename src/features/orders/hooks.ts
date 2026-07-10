import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ordersApi,
  type CreateSalesOrderInput,
  type SalesOrderQuery,
} from './api';

export const orderKeys = {
  all: ['sales-orders'] as const,
  list: (query: SalesOrderQuery) => ['sales-orders', 'list', query] as const,
  detail: (id: string) => ['sales-orders', 'detail', id] as const,
};

export function useSalesOrders(query: SalesOrderQuery = {}) {
  return useQuery({
    queryKey: orderKeys.list(query),
    queryFn: () => ordersApi.list(query),
  });
}

export function useSalesOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersApi.get(id),
    enabled: Boolean(id),
  });
}

export function useCreateSalesOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSalesOrderInput) => ordersApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderKeys.all }),
  });
}
