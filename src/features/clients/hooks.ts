import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientsApi, type ClientInput } from './api';

export const clientKeys = {
  all: ['clients'] as const,
};

export function useClients() {
  return useQuery({ queryKey: clientKeys.all, queryFn: clientsApi.list });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ClientInput) => clientsApi.create(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: clientKeys.all }),
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ClientInput }) =>
      clientsApi.update(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: clientKeys.all }),
  });
}
