import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transportTypesApi, type TransportTypeInput } from './api';

export const transportTypeKeys = {
  all: ['transport-types'] as const,
};

export function useTransportTypes() {
  return useQuery({
    queryKey: transportTypeKeys.all,
    queryFn: transportTypesApi.list,
  });
}

export function useCreateTransportType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TransportTypeInput) => transportTypesApi.create(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: transportTypeKeys.all }),
  });
}

export function useUpdateTransportType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: TransportTypeInput }) =>
      transportTypesApi.update(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: transportTypeKeys.all }),
  });
}
