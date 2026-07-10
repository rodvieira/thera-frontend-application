import type { NextRequest } from 'next/server';
import { handleRoute } from '@/lib/route-handler';
import { listItems, createItem } from '@/mocks/data/repository';

export function GET() {
  return handleRoute(() => listItems());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return handleRoute(() => createItem(body), 201);
}
