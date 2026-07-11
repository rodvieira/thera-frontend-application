import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { ordersApi } from './api';

describe('ordersApi.list', () => {
  it('monta a query string apenas com os filtros informados', async () => {
    let capturedUrl = '';
    server.use(
      http.get('/api/sales-orders', ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json([]);
      }),
    );

    await ordersApi.list({
      status: 'CRIADA',
      clientId: 'cl-atlas',
      transportTypeId: '',
      date: undefined,
    });

    const url = new URL(capturedUrl);
    expect(url.searchParams.get('status')).toBe('CRIADA');
    expect(url.searchParams.get('clientId')).toBe('cl-atlas');
    expect(url.searchParams.has('transportTypeId')).toBe(false);
    expect(url.searchParams.has('date')).toBe(false);
  });

  it('não anexa query string quando nenhum filtro é informado', async () => {
    let capturedUrl = '';
    server.use(
      http.get('/api/sales-orders', ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json([]);
      }),
    );

    await ordersApi.list();

    expect(capturedUrl.endsWith('/api/sales-orders')).toBe(true);
  });
});
