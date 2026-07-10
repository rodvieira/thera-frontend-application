import { apiClient } from '@/lib/api-client';
import type { AuditEvent } from '@/domain/audit';

export const auditApi = {
  list: (entityId?: string) =>
    apiClient.get<AuditEvent[]>(
      `/audit-events${entityId ? `?entityId=${entityId}` : ''}`,
    ),
};
