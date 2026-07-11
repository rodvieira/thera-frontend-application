import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { renderWithProviders } from '@/test-utils/render';
import { resetDb } from '@/mocks/data/db';
import {
  createSalesOrder,
  scheduleDelivery,
  updateSalesOrderStatus,
} from '@/mocks/data/repository';
import { Toaster } from '@/components/notifications/toaster';
import { SchedulingView } from './scheduling-view';

beforeEach(() => resetDb());

function createOrder() {
  return createSalesOrder({
    clientId: 'cl-atlas',
    transportTypeId: 'tt-caminhao',
    items: [{ itemId: 'it-1001', quantity: 1 }],
  });
}

describe('SchedulingView (integração)', () => {
  it('mostra a mensagem de vazio quando não há Ordens de Venda', async () => {
    renderWithProviders(<SchedulingView />);

    expect(
      await screen.findByText(/nenhuma ordem de venda para agendar/i),
    ).toBeInTheDocument();
  });

  it('agenda a entrega de uma OV pendente', async () => {
    createOrder();
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(<SchedulingView />);

    await user.click(await screen.findByRole('button', { name: /agendar/i }));

    const dialog = await screen.findByRole('dialog');
    await user.type(screen.getByLabelText('Data de entrega'), '2099-01-15');
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    expect(dialog).not.toBeInTheDocument();
    expect(await screen.findByText('Pendente')).toBeInTheDocument();
  });

  it('confirma o agendamento e atualiza o status para Agendada', async () => {
    const order = createOrder();
    updateSalesOrderStatus(order.id, 'PLANEJADA');
    scheduleDelivery(order.id, { date: '2099-01-15', window: 'MANHA' });

    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(<SchedulingView />);

    await screen.findByText('Pendente');
    await user.click(screen.getByRole('button', { name: /confirmar/i }));

    expect(await screen.findByText('Confirmado')).toBeInTheDocument();
    expect(screen.getByText('Agendada')).toBeInTheDocument();
  });

  it('mostra erro e mantém o diálogo aberto quando o agendamento falha', async () => {
    createOrder();
    server.use(
      http.patch('/api/sales-orders/:id/schedule', () =>
        HttpResponse.json({ message: 'Janela indisponível' }, { status: 409 }),
      ),
    );
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(
      <>
        <SchedulingView />
        <Toaster />
      </>,
    );

    await user.click(await screen.findByRole('button', { name: /agendar/i }));
    const dialog = await screen.findByRole('dialog');
    await user.type(screen.getByLabelText('Data de entrega'), '2099-01-15');
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    expect(await screen.findByText('Janela indisponível')).toBeInTheDocument();
    expect(dialog).toBeInTheDocument();
  });

  it('mostra erro quando a confirmação do agendamento falha', async () => {
    const order = createOrder();
    updateSalesOrderStatus(order.id, 'PLANEJADA');
    scheduleDelivery(order.id, { date: '2099-01-15', window: 'MANHA' });
    server.use(
      http.post('/api/sales-orders/:id/schedule/confirm', () =>
        HttpResponse.json({ message: 'OV não está pronta' }, { status: 409 }),
      ),
    );
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(
      <>
        <SchedulingView />
        <Toaster />
      </>,
    );

    await screen.findByText('Pendente');
    await user.click(screen.getByRole('button', { name: /confirmar/i }));

    expect(await screen.findByText('OV não está pronta')).toBeInTheDocument();
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });
});
