import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { renderWithProviders } from '@/test-utils/render';
import { resetDb } from '@/mocks/data/db';
import { Toaster } from '@/components/notifications/toaster';
import { OrdersView } from './orders-view';

beforeEach(() => resetDb());

describe('OrdersView (integração)', () => {
  it('mostra a mensagem de vazio quando não há Ordens de Venda', async () => {
    renderWithProviders(<OrdersView />);

    expect(
      await screen.findByText(/nenhuma ordem de venda ainda/i),
    ).toBeInTheDocument();
  });

  it('cria uma nova Ordem de Venda selecionando cliente, transporte e itens', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(<OrdersView />);

    await user.click(screen.getByRole('button', { name: /nova ov/i }));
    const dialog = await screen.findByRole('dialog');

    const [clientSelect, transportSelect, itemSelect] =
      within(dialog).getAllByRole('combobox');

    await user.click(clientSelect);
    await user.click(
      await screen.findByRole('option', { name: 'Atlas Distribuidora' }),
    );

    await user.click(transportSelect);
    await user.click(await screen.findByRole('option', { name: 'Caminhão' }));

    await user.click(itemSelect);
    await user.click(
      await screen.findByRole('option', { name: /Palete de água 500ml/ }),
    );
    await user.click(within(dialog).getByRole('button', { name: '' }));

    await user.click(within(dialog).getByRole('button', { name: /criar ov/i }));

    expect(await screen.findByText('Atlas Distribuidora')).toBeInTheDocument();
    expect(screen.getByText('Caminhão')).toBeInTheDocument();
  });

  it('impede adicionar o mesmo item duas vezes na OV', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(
      <>
        <OrdersView />
        <Toaster />
      </>,
    );

    await user.click(screen.getByRole('button', { name: /nova ov/i }));
    const dialog = await screen.findByRole('dialog');
    const [clientSelect, transportSelect, itemSelect] =
      within(dialog).getAllByRole('combobox');

    await user.click(clientSelect);
    await user.click(
      await screen.findByRole('option', { name: 'Atlas Distribuidora' }),
    );
    await user.click(transportSelect);
    await user.click(await screen.findByRole('option', { name: 'Caminhão' }));

    await user.click(itemSelect);
    await user.click(
      await screen.findByRole('option', { name: /Palete de água 500ml/ }),
    );
    await user.click(within(dialog).getByRole('button', { name: '' }));

    expect(within(dialog).getAllByRole('listitem')).toHaveLength(1);

    await user.click(itemSelect);
    await user.click(
      await screen.findByRole('option', { name: /Palete de água 500ml/ }),
    );
    await user.click(within(dialog).getByRole('button', { name: '' }));

    expect(await screen.findByText('Item já adicionado')).toBeInTheDocument();
    expect(within(dialog).getAllByRole('listitem')).toHaveLength(1);
  });

  it('limpa o transporte selecionado ao trocar para um cliente que não o autoriza', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(<OrdersView />);

    await user.click(screen.getByRole('button', { name: /nova ov/i }));
    const dialog = await screen.findByRole('dialog');
    const [clientSelect, transportSelect] =
      within(dialog).getAllByRole('combobox');

    await user.click(clientSelect);
    await user.click(
      await screen.findByRole('option', { name: 'Atlas Distribuidora' }),
    );
    await user.click(transportSelect);
    await user.click(await screen.findByRole('option', { name: 'Carreta' }));
    expect(within(dialog).getByText('Carreta')).toBeInTheDocument();

    // Cerrado Varejo só autoriza Caminhão — a Carreta escolhida deixa de ser válida.
    await user.click(clientSelect);
    await user.click(
      await screen.findByRole('option', { name: 'Cerrado Varejo' }),
    );

    expect(
      within(dialog).getByText('Selecione o transporte'),
    ).toBeInTheDocument();
  });

  it('mostra erro e mantém o diálogo aberto quando a criação da OV falha', async () => {
    server.use(
      http.post('/api/sales-orders', () =>
        HttpResponse.json(
          { message: 'Transporte não autorizado para o cliente' },
          { status: 400 },
        ),
      ),
    );
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(
      <>
        <OrdersView />
        <Toaster />
      </>,
    );

    await user.click(screen.getByRole('button', { name: /nova ov/i }));
    const dialog = await screen.findByRole('dialog');
    const [clientSelect, transportSelect, itemSelect] =
      within(dialog).getAllByRole('combobox');

    await user.click(clientSelect);
    await user.click(
      await screen.findByRole('option', { name: 'Atlas Distribuidora' }),
    );
    await user.click(transportSelect);
    await user.click(await screen.findByRole('option', { name: 'Caminhão' }));
    await user.click(itemSelect);
    await user.click(
      await screen.findByRole('option', { name: /Palete de água 500ml/ }),
    );
    await user.click(within(dialog).getByRole('button', { name: '' }));
    await user.click(within(dialog).getByRole('button', { name: /criar ov/i }));

    expect(
      await screen.findByText('Transporte não autorizado para o cliente'),
    ).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
