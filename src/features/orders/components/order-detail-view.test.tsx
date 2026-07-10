import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils/render';
import { resetDb } from '@/mocks/data/db';
import { createSalesOrder } from '@/mocks/data/repository';
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
});
