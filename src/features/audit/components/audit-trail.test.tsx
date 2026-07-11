import { render, screen } from '@testing-library/react';
import type { AuditEvent } from '@/domain/audit';
import { AuditTrail } from './audit-trail';

function event(overrides: Partial<AuditEvent> = {}): AuditEvent {
  return {
    id: 'ev-1',
    timestamp: '2026-01-15T10:30:00.000Z',
    action: 'STATUS_CHANGED',
    entity: 'sales-order',
    entityId: 'ov-12345678',
    previousState: null,
    nextState: null,
    ...overrides,
  };
}

describe('AuditTrail', () => {
  it('mostra o estado de carregamento', () => {
    render(<AuditTrail events={[]} isLoading />);
    expect(screen.getByText('Carregando…')).toBeInTheDocument();
  });

  it('usa a mensagem de vazio padrão quando nenhuma é informada', () => {
    render(<AuditTrail events={[]} />);
    expect(screen.getByText('Nenhum evento registrado.')).toBeInTheDocument();
  });

  it('usa a mensagem de vazio customizada quando informada', () => {
    render(<AuditTrail events={[]} emptyMessage="Sem eventos por aqui." />);
    expect(screen.getByText('Sem eventos por aqui.')).toBeInTheDocument();
  });

  it('exibe estado anterior e posterior quando presentes', () => {
    render(
      <AuditTrail
        events={[event({ previousState: 'CRIADA', nextState: 'PLANEJADA' })]}
      />,
    );

    expect(screen.getByText('Alteração de status')).toBeInTheDocument();
    expect(screen.getByText('CRIADA → PLANEJADA')).toBeInTheDocument();
  });

  it('não exibe a linha de transição quando não há estado anterior nem posterior', () => {
    render(<AuditTrail events={[event({ action: 'ORDER_CREATED' })]} />);

    expect(screen.getByText('Criação de OV')).toBeInTheDocument();
    expect(screen.queryByText(/→/)).not.toBeInTheDocument();
  });
});
