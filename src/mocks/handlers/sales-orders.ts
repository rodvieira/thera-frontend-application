import { http } from 'msw';
import {
  listSalesOrders,
  getSalesOrder,
  createSalesOrder,
  updateSalesOrderStatus,
  type CreateSalesOrderInput,
} from '../data/repository';
import { respond } from './respond';
import type { OrderStatus } from '@/domain/types';

export const salesOrderHandlers = [
  http.get('/api/sales-orders', ({ request }) => {
    const sp = new URL(request.url).searchParams;
    return respond(() =>
      listSalesOrders({
        status: (sp.get('status') as OrderStatus | null) ?? undefined,
        clientId: sp.get('clientId') ?? undefined,
        transportTypeId: sp.get('transportTypeId') ?? undefined,
        date: sp.get('date') ?? undefined,
      }),
    );
  }),

  http.post('/api/sales-orders', async ({ request }) => {
    const body = (await request.json()) as CreateSalesOrderInput;
    return respond(() => createSalesOrder(body), 201);
  }),

  http.get('/api/sales-orders/:id', ({ params }) =>
    respond(() => getSalesOrder(params.id as string)),
  ),

  http.patch('/api/sales-orders/:id/status', async ({ params, request }) => {
    const body = (await request.json()) as { status: OrderStatus };
    return respond(() =>
      updateSalesOrderStatus(params.id as string, body.status),
    );
  }),
];
