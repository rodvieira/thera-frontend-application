import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { navItems } from './nav-items';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

const mockedUsePathname = jest.mocked(usePathname);

describe('Sidebar', () => {
  it('renderiza um link para cada item de navegação', () => {
    mockedUsePathname.mockReturnValue('/');
    render(<Sidebar />);

    navItems.forEach((item) => {
      expect(screen.getByRole('link', { name: item.label })).toHaveAttribute(
        'href',
        item.href,
      );
    });
  });

  it('marca como página atual o item cujo href corresponde ao pathname', () => {
    mockedUsePathname.mockReturnValue('/ordens');
    render(<Sidebar />);

    expect(
      screen.getByRole('link', { name: 'Ordens de Venda' }),
    ).toHaveAttribute('aria-current', 'page');
    expect(
      screen.getByRole('link', { name: 'Visão geral' }),
    ).not.toHaveAttribute('aria-current');
  });

  it('marca a visão geral como atual apenas na raiz exata', () => {
    mockedUsePathname.mockReturnValue('/ordens');
    render(<Sidebar />);

    expect(
      screen.getByRole('link', { name: 'Visão geral' }),
    ).not.toHaveAttribute('aria-current', 'page');
  });
});
