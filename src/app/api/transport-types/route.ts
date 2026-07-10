import type { NextRequest } from 'next/server';
import { handleRoute } from '@/lib/route-handler';
import {
  listTransportTypes,
  createTransportType,
} from '@/mocks/data/repository';

export function GET() {
  return handleRoute(() => listTransportTypes());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return handleRoute(() => createTransportType(body), 201);
}
