import { handleRoute } from '@/lib/route-handler';
import { confirmSchedule } from '@/mocks/data/repository';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return handleRoute(() => confirmSchedule(id));
}
