import type { NextRequest } from 'next/server';
import { handleRoute } from '@/lib/route-handler';
import { listClients, createClient } from '@/mocks/data/repository';

export function GET() {
  return handleRoute(() => listClients());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return handleRoute(() => createClient(body), 201);
}
