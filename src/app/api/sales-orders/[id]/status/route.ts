import type { NextRequest } from 'next/server';
import { handleRoute } from '@/lib/route-handler';
import { updateSalesOrderStatus } from '@/mocks/data/repository';
import type { OrderStatus } from '@/domain/types';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as { status: OrderStatus };
  return handleRoute(() => updateSalesOrderStatus(id, body.status));
}
