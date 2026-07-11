import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils/render';
import { resetDb } from '@/mocks/data/db';
import { createSalesOrder } from '@/mocks/data/repository';
import { MonitoringView } from './monitoring-view';

beforeEach(() => resetDb());

describe('MonitoringView (integração)', () => {
  it('exibe as Ordens de Venda e a distribuição por status', async () => {
    createSalesOrder({
      clientId: 'cl-atlas',
      transportTypeId: 'tt-caminhao',
      items: [{ itemId: 'it-1001', quantity: 2 }],
    });

    renderWithProviders(<MonitoringView />);

    expect(await screen.findByText('Atlas Distribuidora')).toBeInTheDocument();
    expect(screen.getByText('de 1 no total')).toBeInTheDocument();
  });

  it('filtra as Ordens de Venda por cliente', async () => {
    createSalesOrder({
      clientId: 'cl-atlas',
      transportTypeId: 'tt-caminhao',
      items: [{ itemId: 'it-1001', quantity: 1 }],
    });
    createSalesOrder({
      clientId: 'cl-boreal',
      transportTypeId: 'tt-carreta',
      items: [{ itemId: 'it-1002', quantity: 1 }],
    });

    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(<MonitoringView />);

    const table = await screen.findByRole('table');
    await within(table).findByText('Atlas Distribuidora');
    expect(within(table).getByText('Boreal Alimentos')).toBeInTheDocument();

    const [, clientFilter] = screen.getAllByRole('combobox');
    await user.click(clientFilter);
    await user.click(
      await screen.findByRole('option', { name: 'Atlas Distribuidora' }),
    );

    expect(within(table).getByText('Atlas Distribuidora')).toBeInTheDocument();
    expect(
      within(table).queryByText('Boreal Alimentos'),
    ).not.toBeInTheDocument();
  });

  it('filtra as Ordens de Venda por status', async () => {
    createSalesOrder({
      clientId: 'cl-atlas',
      transportTypeId: 'tt-caminhao',
      items: [{ itemId: 'it-1001', quantity: 1 }],
    });

    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(<MonitoringView />);

    const table = await screen.findByRole('table');
    await within(table).findByText('Atlas Distribuidora');

    const [statusFilter] = screen.getAllByRole('combobox');
    await user.click(statusFilter);
    await user.click(await screen.findByRole('option', { name: 'Entregue' }));

    expect(
      screen.getByText(/nenhuma ordem de venda para os filtros selecionados/i),
    ).toBeInTheDocument();
  });

  it('limpa os filtros aplicados', async () => {
    createSalesOrder({
      clientId: 'cl-atlas',
      transportTypeId: 'tt-caminhao',
      items: [{ itemId: 'it-1001', quantity: 1 }],
    });
    createSalesOrder({
      clientId: 'cl-boreal',
      transportTypeId: 'tt-carreta',
      items: [{ itemId: 'it-1002', quantity: 1 }],
    });

    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(<MonitoringView />);

    const table = await screen.findByRole('table');
    await within(table).findByText('Atlas Distribuidora');

    const [, clientFilter] = screen.getAllByRole('combobox');
    await user.click(clientFilter);
    await user.click(
      await screen.findByRole('option', { name: 'Atlas Distribuidora' }),
    );
    expect(
      within(table).queryByText('Boreal Alimentos'),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /limpar/i }));

    expect(within(table).getByText('Boreal Alimentos')).toBeInTheDocument();
  });
});
