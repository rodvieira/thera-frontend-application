import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { renderWithProviders } from '@/test-utils/render';
import { resetDb } from '@/mocks/data/db';
import { Toaster } from '@/components/notifications/toaster';
import { ClientsView } from './clients-view';

beforeEach(() => resetDb());

describe('ClientsView (integração)', () => {
  it('lista os clientes do seed com os transportes autorizados', async () => {
    renderWithProviders(<ClientsView />);

    expect(await screen.findByText('Atlas Distribuidora')).toBeInTheDocument();
    expect(screen.getByText('Boreal Alimentos')).toBeInTheDocument();
    expect(screen.getByText('Cerrado Varejo')).toBeInTheDocument();

    const row = screen.getByText('Atlas Distribuidora').closest('tr')!;
    expect(within(row).getByText('Caminhão')).toBeInTheDocument();
    expect(within(row).getByText('Carreta')).toBeInTheDocument();
  });

  it('cria um novo cliente selecionando os transportes autorizados', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(<ClientsView />);

    await screen.findByText('Atlas Distribuidora');

    await user.click(screen.getByRole('button', { name: /novo cliente/i }));

    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText('Nome'), 'Delta Logística');
    await user.type(
      within(dialog).getByLabelText('Documento (CNPJ)'),
      '11222333000181',
    );
    await user.click(within(dialog).getByRole('button', { name: 'Caminhão' }));
    await user.click(within(dialog).getByRole('button', { name: /salvar/i }));

    expect(await screen.findByText('Delta Logística')).toBeInTheDocument();
    expect(screen.getByText('11.222.333/0001-81')).toBeInTheDocument();
  });

  it('formata o CNPJ enquanto o usuário digita e valida a quantidade de dígitos', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(<ClientsView />);

    await screen.findByText('Atlas Distribuidora');
    await user.click(screen.getByRole('button', { name: /novo cliente/i }));

    const dialog = await screen.findByRole('dialog');
    const documentInput = within(dialog).getByLabelText('Documento (CNPJ)');
    await user.type(documentInput, '11222333000181');
    expect(documentInput).toHaveValue('11.222.333/0001-81');

    await user.clear(documentInput);
    await user.type(documentInput, '123');
    await user.type(within(dialog).getByLabelText('Nome'), 'CNPJ Incompleto');
    await user.click(within(dialog).getByRole('button', { name: 'Caminhão' }));
    await user.click(within(dialog).getByRole('button', { name: /salvar/i }));

    expect(
      await screen.findByText('CNPJ inválido — informe os 14 dígitos'),
    ).toBeInTheDocument();
  });

  it('edita um cliente existente', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(<ClientsView />);

    await screen.findByText('Cerrado Varejo');

    await user.click(
      screen.getByRole('button', { name: 'Editar Cerrado Varejo' }),
    );

    const dialog = await screen.findByRole('dialog');
    const nameInput = within(dialog).getByLabelText('Nome');
    await user.clear(nameInput);
    await user.type(nameInput, 'Cerrado Atacado');
    await user.click(within(dialog).getByRole('button', { name: /salvar/i }));

    expect(await screen.findByText('Cerrado Atacado')).toBeInTheDocument();
    expect(screen.queryByText('Cerrado Varejo')).not.toBeInTheDocument();
  });

  it('mostra erro e mantém o diálogo aberto quando o salvamento falha', async () => {
    server.use(
      http.post('/api/clients', () =>
        HttpResponse.json({ message: 'CNPJ já cadastrado' }, { status: 409 }),
      ),
    );
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(
      <>
        <ClientsView />
        <Toaster />
      </>,
    );

    await screen.findByText('Atlas Distribuidora');
    await user.click(screen.getByRole('button', { name: /novo cliente/i }));

    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText('Nome'), 'Épsilon');
    await user.type(
      within(dialog).getByLabelText('Documento (CNPJ)'),
      '11222333000181',
    );
    await user.click(within(dialog).getByRole('button', { name: 'Caminhão' }));
    await user.click(within(dialog).getByRole('button', { name: /salvar/i }));

    expect(await screen.findByText('CNPJ já cadastrado')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
