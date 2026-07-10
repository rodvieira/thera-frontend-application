import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderKeys } from '@/features/orders/hooks';
import { schedulingApi, type ScheduleInput } from './api';

export function useScheduleDelivery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ScheduleInput }) =>
      schedulingApi.schedule(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: ['audit-events'] });
    },
  });
}

export function useConfirmSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => schedulingApi.confirm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: ['audit-events'] });
    },
  });
}
