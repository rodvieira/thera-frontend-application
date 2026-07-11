import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { renderWithProviders } from '@/test-utils/render';
import { resetDb } from '@/mocks/data/db';
import { Toaster } from '@/components/notifications/toaster';
import { TransportTypesView } from './transport-types-view';

beforeEach(() => resetDb());

describe('TransportTypesView (integração)', () => {
  it('lista os tipos de transporte do seed', async () => {
    renderWithProviders(<TransportTypesView />);

    expect(await screen.findByText('Caminhão')).toBeInTheDocument();
    expect(screen.getByText('Carreta')).toBeInTheDocument();
  });

  it('cria um novo tipo de transporte e o exibe na tabela', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(<TransportTypesView />);

    await screen.findByText('Caminhão');

    await user.click(screen.getByRole('button', { name: /novo tipo/i }));

    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText('Nome'), 'Van');
    await user.click(within(dialog).getByRole('button', { name: /salvar/i }));

    expect(await screen.findByText('Van')).toBeInTheDocument();
  });

  it('edita um tipo de transporte existente', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(<TransportTypesView />);

    await screen.findByText('Caminhão');
    await user.click(screen.getByRole('button', { name: 'Editar Caminhão' }));

    const dialog = await screen.findByRole('dialog');
    const nameInput = within(dialog).getByLabelText('Nome');
    await user.clear(nameInput);
    await user.type(nameInput, 'Caminhão Baú');
    await user.click(within(dialog).getByRole('button', { name: /salvar/i }));

    expect(await screen.findByText('Caminhão Baú')).toBeInTheDocument();
    expect(screen.queryByText('Caminhão')).not.toBeInTheDocument();
  });

  it('mostra erro e mantém o diálogo aberto quando o salvamento falha', async () => {
    server.use(
      http.post('/api/transport-types', () =>
        HttpResponse.json({ message: 'Nome já utilizado' }, { status: 409 }),
      ),
    );
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(
      <>
        <TransportTypesView />
        <Toaster />
      </>,
    );

    await screen.findByText('Caminhão');
    await user.click(screen.getByRole('button', { name: /novo tipo/i }));

    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText('Nome'), 'Carreta');
    await user.click(within(dialog).getByRole('button', { name: /salvar/i }));

    expect(await screen.findByText('Nome já utilizado')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
