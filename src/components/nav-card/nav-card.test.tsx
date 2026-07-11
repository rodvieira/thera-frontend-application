import { render, screen } from '@testing-library/react';
import { LayoutDashboard } from 'lucide-react';
import { NavCard } from './nav-card';

describe('NavCard', () => {
  it('renderiza o link com label, descrição e destino corretos', () => {
    render(
      <NavCard
        href="/ordens"
        label="Ordens de Venda"
        description="Gerencie o ciclo de vida das OVs"
        icon={LayoutDashboard}
      />,
    );

    const link = screen.getByRole('link', { name: /ordens de venda/i });
    expect(link).toHaveAttribute('href', '/ordens');
    expect(
      screen.getByText('Gerencie o ciclo de vida das OVs'),
    ).toBeInTheDocument();
  });

  it('esconde o ícone de leitores de tela', () => {
    const { container } = render(
      <NavCard
        href="/cadastros"
        label="Cadastros"
        description="Clientes, itens e transportes"
        icon={LayoutDashboard}
      />,
    );

    expect(
      container.querySelector('svg[aria-hidden="true"]'),
    ).toBeInTheDocument();
  });
});
