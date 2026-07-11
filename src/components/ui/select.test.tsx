import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

const ITEMS = { a: 'Manhã', b: 'Tarde' };

function SelectHarness() {
  const [value, setValue] = useState<string | null>('a');

  return (
    <Select value={value} onValueChange={setValue} items={ITEMS}>
      <SelectTrigger aria-label="Janela de atendimento">
        <SelectValue placeholder="Selecione" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Manhã</SelectItem>
        <SelectItem value="b">Tarde</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe('Select', () => {
  it('exibe o valor selecionado e permite trocar a opção', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(<SelectHarness />);

    const trigger = screen.getByRole('combobox', {
      name: 'Janela de atendimento',
    });
    expect(trigger).toHaveTextContent('Manhã');

    await user.click(trigger);
    const option = await screen.findByRole('option', { name: 'Tarde' });
    await user.click(option);

    expect(trigger).toHaveTextContent('Tarde');
  });

  it('exibe a label do item (não o value bruto) quando o Select não recebe a prop `items`', async () => {
    // Uso real da aplicação: nenhum dos formulários passa `items` para o
    // Select raiz — a label precisa vir só dos children do SelectItem.
    function NoItemsHarness() {
      const [value, setValue] = useState<string | null>('opt-caminhao');
      return (
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger aria-label="Transporte">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="opt-caminhao">Caminhão</SelectItem>
            <SelectItem value="opt-carreta">SKU-1 — Item combinado</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(<NoItemsHarness />);

    const trigger = screen.getByRole('combobox', { name: 'Transporte' });
    expect(trigger).toHaveTextContent('Caminhão');
    expect(trigger).not.toHaveTextContent('opt-caminhao');

    await user.click(trigger);
    await user.click(
      await screen.findByRole('option', { name: /SKU-1 — Item combinado/ }),
    );

    expect(trigger).toHaveTextContent('SKU-1 — Item combinado');
    expect(trigger).not.toHaveTextContent('opt-carreta');
  });
});
