import { useQuery } from '@tanstack/react-query';
import { auditApi } from './api';

export const auditKeys = {
  all: ['audit-events'] as const,
  byEntity: (entityId: string) => ['audit-events', entityId] as const,
};

export function useAuditEvents(entityId?: string) {
  return useQuery({
    queryKey: entityId ? auditKeys.byEntity(entityId) : auditKeys.all,
    queryFn: () => auditApi.list(entityId),
  });
}
