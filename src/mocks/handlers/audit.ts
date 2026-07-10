import { http } from 'msw';
import { listAuditEvents } from '../data/repository';
import { respond } from './respond';

export const auditHandlers = [
  http.get('/api/audit-events', ({ request }) => {
    const entityId =
      new URL(request.url).searchParams.get('entityId') ?? undefined;
    return respond(() => listAuditEvents({ entityId }));
  }),
];
