import type { NextRequest } from 'next/server';
import { handleRoute } from '@/lib/route-handler';
import { updateTransportType } from '@/mocks/data/repository';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  return handleRoute(() => updateTransportType(id, body));
}
