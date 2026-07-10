import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { itemsApi, type ItemInput } from './api';

export const itemKeys = {
  all: ['items'] as const,
};

export function useItems() {
  return useQuery({ queryKey: itemKeys.all, queryFn: itemsApi.list });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ItemInput) => itemsApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemKeys.all }),
  });
}
