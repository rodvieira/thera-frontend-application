import { handleRoute } from '@/lib/route-handler';
import { getSalesOrder } from '@/mocks/data/repository';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return handleRoute(() => getSalesOrder(id));
}
