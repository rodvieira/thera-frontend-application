import { render, screen } from '@testing-library/react';
import { useAppSelector } from './hooks';
import { StoreProvider } from './store-provider';

function Probe() {
  const notifications = useAppSelector((state) => state.notifications.items);
  return <span>Notificações: {notifications.length}</span>;
}

describe('StoreProvider', () => {
  it('disponibiliza a store Redux para os componentes filhos', () => {
    render(
      <StoreProvider>
        <Probe />
      </StoreProvider>,
    );

    expect(screen.getByText('Notificações: 0')).toBeInTheDocument();
  });
});
