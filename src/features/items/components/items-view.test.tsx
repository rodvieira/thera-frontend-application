import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { renderWithProviders } from '@/test-utils/render';
import { resetDb } from '@/mocks/data/db';
import { Toaster } from '@/components/notifications/toaster';
import { ItemsView } from './items-view';

beforeEach(() => resetDb());

describe('ItemsView (integração)', () => {
  it('lista os itens do seed', async () => {
    renderWithProviders(<ItemsView />);

    expect(await screen.findByText('SKU-1001')).toBeInTheDocument();
    expect(screen.getByText('Palete de água 500ml')).toBeInTheDocument();
  });

  it('cria um novo item e o exibe na tabela', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(<ItemsView />);

    await screen.findByText('SKU-1001');

    await user.click(screen.getByRole('button', { name: /novo item/i }));

    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText('SKU'), 'SKU-2001');
    await user.type(
      within(dialog).getByLabelText('Nome'),
      'Engradado de vidro',
    );
    await user.click(within(dialog).getByRole('button', { name: /salvar/i }));

    expect(await screen.findByText('SKU-2001')).toBeInTheDocument();
    expect(screen.getByText('Engradado de vidro')).toBeInTheDocument();
  });

  it('mostra erro e mantém o diálogo aberto quando a criação falha', async () => {
    server.use(
      http.post('/api/items', () =>
        HttpResponse.json({ message: 'SKU já cadastrado' }, { status: 409 }),
      ),
    );
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(
      <>
        <ItemsView />
        <Toaster />
      </>,
    );

    await screen.findByText('SKU-1001');
    await user.click(screen.getByRole('button', { name: /novo item/i }));

    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText('SKU'), 'SKU-1001');
    await user.type(within(dialog).getByLabelText('Nome'), 'Duplicado');
    await user.click(within(dialog).getByRole('button', { name: /salvar/i }));

    expect(await screen.findByText('SKU já cadastrado')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
