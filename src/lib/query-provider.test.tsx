import { render, screen } from '@testing-library/react';
import { useQueryClient } from '@tanstack/react-query';
import { QueryProvider } from './query-provider';

function Probe() {
  const queryClient = useQueryClient();
  return (
    <span>{queryClient ? 'queryClient disponível' : 'sem queryClient'}</span>
  );
}

describe('QueryProvider', () => {
  it('disponibiliza um QueryClient para os componentes filhos', () => {
    render(
      <QueryProvider>
        <Probe />
      </QueryProvider>,
    );

    expect(screen.getByText('queryClient disponível')).toBeInTheDocument();
  });
});
