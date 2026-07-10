import type { NextRequest } from 'next/server';
import { handleRoute } from '@/lib/route-handler';
import { listAuditEvents } from '@/mocks/data/repository';

export function GET(request: NextRequest) {
  const entityId = request.nextUrl.searchParams.get('entityId') ?? undefined;
  return handleRoute(() => listAuditEvents({ entityId }));
}
