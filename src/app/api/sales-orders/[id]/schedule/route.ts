import type { NextRequest } from 'next/server';
import { handleRoute } from '@/lib/route-handler';
import { scheduleDelivery } from '@/mocks/data/repository';
import type { DeliveryWindow } from '@/domain/types';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as {
    date: string;
    window: DeliveryWindow;
  };
  return handleRoute(() => scheduleDelivery(id, body));
}
