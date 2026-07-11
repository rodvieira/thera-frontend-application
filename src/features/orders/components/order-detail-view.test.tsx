import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils/render';
import { resetDb } from '@/mocks/data/db';
import { createSalesOrder, scheduleDelivery } from '@/mocks/data/repository';
import { OrderDetailView } from './order-detail-view';

let orderId: string;

beforeEach(() => {
  resetDb();
  const order = createSalesOrder({
    clientId: 'cl-atlas',
    transportTypeId: 'tt-caminhao',
    items: [{ itemId: 'it-1001', quantity: 2 }],
  });
  orderId = order.id;
});

describe('OrderDetailView (integração)', () => {
  it('avança o status via saga: CRIADA → PLANEJADA → AGENDADA', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(<OrderDetailView id={orderId} />);

    // OV recém-criada está em CRIADA → botão oferece avançar para Planejada.
    const toPlanejada = await screen.findByRole('button', {
      name: /avançar para planejada/i,
    });
    await user.click(toPlanejada);

    // Após a saga (API + invalidação + refetch), o botão passa a oferecer Agendada.
    expect(
      await screen.findByRole('button', { name: /avançar para agendada/i }),
    ).toBeInTheDocument();
  });

  it('mostra mensagem quando a Ordem de Venda não existe', async () => {
    renderWithProviders(<OrderDetailView id="ov-inexistente" />);

    expect(
      await screen.findByText('Ordem de Venda não encontrada.'),
    ).toBeInTheDocument();
  });

  it('exibe a data, janela e status do agendamento quando presente', async () => {
    scheduleDelivery(orderId, { date: '2099-03-20', window: 'TARDE' });
    renderWithProviders(<OrderDetailView id={orderId} />);

    expect(
      await screen.findByText(/20\/03\/2099 · Tarde \(13h–18h\) \(pendente\)/),
    ).toBeInTheDocument();
  });
});
