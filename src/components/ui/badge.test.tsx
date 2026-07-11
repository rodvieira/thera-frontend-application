import { render, screen } from '@testing-library/react';
import Link from 'next/link';
import { Badge } from './badge';

describe('Badge', () => {
  it('renderiza o conteúdo com a variante padrão', () => {
    render(<Badge>Novo</Badge>);

    const badge = screen.getByText('Novo');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-primary');
  });

  it('aplica a classe correspondente à variante informada', () => {
    render(<Badge variant="destructive">Erro</Badge>);

    expect(screen.getByText('Erro')).toHaveClass('text-destructive');
  });

  it('permite renderizar como outro elemento via a prop render', () => {
    render(
      <Badge render={<Link href="/ordens" />} variant="outline">
        Ordens
      </Badge>,
    );

    const link = screen.getByRole('link', { name: 'Ordens' });
    expect(link).toHaveAttribute('href', '/ordens');
  });
});
