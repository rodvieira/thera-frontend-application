import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { usePathname } from 'next/navigation';
import { makeStore } from '@/store';
import { AppShell } from './app-shell';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mocked(usePathname).mockReturnValue('/');

describe('AppShell', () => {
  it('renderiza a navegação, o cabeçalho e o conteúdo informado', () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <AppShell>
          <p>Conteúdo da página</p>
        </AppShell>
      </Provider>,
    );

    expect(
      screen.getByText('Sistema de Gestão de Ordens de Venda'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Visão geral' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Conteúdo da página')).toBeInTheDocument();
  });
});
