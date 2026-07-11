import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { makeStore } from '@/store';
import { notify } from '@/store/slices/notifications';
import { Toaster } from './toaster';

function renderToaster() {
  const store = makeStore();
  render(
    <Provider store={store}>
      <Toaster />
    </Provider>,
  );
  return store;
}

describe('Toaster', () => {
  it('exibe uma notificação despachada na store e permite fechá-la', async () => {
    const user = userEvent.setup();
    const store = renderToaster();

    act(() => {
      store.dispatch(
        notify({ type: 'success', message: 'Operação concluída' }),
      );
    });

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Operação concluída',
    );

    await user.click(
      screen.getByRole('button', { name: /fechar notificação/i }),
    );

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('remove a notificação automaticamente após 4 segundos', () => {
    jest.useFakeTimers();
    const store = renderToaster();

    act(() => {
      store.dispatch(notify({ type: 'info', message: 'Aviso importante' }));
    });
    expect(screen.getByRole('status')).toHaveTextContent('Aviso importante');

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    jest.useRealTimers();
  });

  it('renderiza múltiplas notificações simultaneamente', () => {
    const store = renderToaster();

    act(() => {
      store.dispatch(notify({ type: 'error', message: 'Falha ao salvar' }));
      store.dispatch(notify({ type: 'info', message: 'Tentando novamente' }));
    });

    expect(screen.getAllByRole('status')).toHaveLength(2);
  });
});
