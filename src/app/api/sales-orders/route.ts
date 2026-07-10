import type { NextRequest } from 'next/server';
import { handleRoute } from '@/lib/route-handler';
import {
  listSalesOrders,
  createSalesOrder,
  type SalesOrderFilters,
} from '@/mocks/data/repository';
import type { OrderStatus } from '@/domain/types';

export function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const filters: SalesOrderFilters = {
    status: (sp.get('status') as OrderStatus | null) ?? undefined,
    clientId: sp.get('clientId') ?? undefined,
    transportTypeId: sp.get('transportTypeId') ?? undefined,
    date: sp.get('date') ?? undefined,
  };
  return handleRoute(() => listSalesOrders(filters));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return handleRoute(() => createSalesOrder(body), 201);
}
