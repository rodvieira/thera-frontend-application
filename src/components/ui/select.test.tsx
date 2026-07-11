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
});
