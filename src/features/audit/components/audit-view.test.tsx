import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test-utils/render';
import { resetDb } from '@/mocks/data/db';
import { createSalesOrder } from '@/mocks/data/repository';
import { AuditView } from './audit-view';

beforeEach(() => resetDb());

describe('AuditView (integração)', () => {
  it('mostra a mensagem de vazio quando não há eventos', async () => {
    renderWithProviders(<AuditView />);

    expect(await screen.findByText(/nenhum evento ainda/i)).toBeInTheDocument();
  });

  it('lista os eventos de auditoria registrados', async () => {
    const order = createSalesOrder({
      clientId: 'cl-atlas',
      transportTypeId: 'tt-caminhao',
      items: [{ itemId: 'it-1001', quantity: 1 }],
    });

    renderWithProviders(<AuditView />);

    expect(await screen.findByText('Criação de OV')).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(order.id.slice(0, 8))),
    ).toBeInTheDocument();
  });
});
