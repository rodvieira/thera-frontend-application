import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils/render';
import { resetDb } from '@/mocks/data/db';
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
});
