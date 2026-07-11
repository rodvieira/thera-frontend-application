import { render, screen } from '@testing-library/react';
import { FieldError } from './field-error';

describe('FieldError', () => {
  it('renderiza a mensagem quando informada', () => {
    render(<FieldError message="Campo obrigatório" />);

    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
  });

  it('não renderiza nada quando a mensagem está vazia', () => {
    const { container } = render(<FieldError />);

    expect(container).toBeEmptyDOMElement();
  });
});
