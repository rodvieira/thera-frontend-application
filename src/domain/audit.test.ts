import { createAuditEvent } from './audit';

describe('auditoria', () => {
  it('registra estados anterior e posterior em mudança de status', () => {
    const event = createAuditEvent(
      {
        action: 'STATUS_CHANGED',
        entity: 'SalesOrder',
        entityId: 'ov-1',
        previousState: 'CRIADA',
        nextState: 'PLANEJADA',
      },
      { id: 'evt-1', timestamp: '2026-07-09T12:00:00.000Z' },
    );

    expect(event).toEqual({
      id: 'evt-1',
      timestamp: '2026-07-09T12:00:00.000Z',
      action: 'STATUS_CHANGED',
      entity: 'SalesOrder',
      entityId: 'ov-1',
      previousState: 'CRIADA',
      nextState: 'PLANEJADA',
    });
  });

  it('usa null para estados ausentes (ex.: criação)', () => {
    const event = createAuditEvent({
      action: 'ORDER_CREATED',
      entity: 'SalesOrder',
      entityId: 'ov-2',
    });

    expect(event.previousState).toBeNull();
    expect(event.nextState).toBeNull();
  });

  it('gera id e timestamp quando não injetados', () => {
    const event = createAuditEvent({
      action: 'ORDER_CREATED',
      entity: 'SalesOrder',
      entityId: 'ov-3',
    });

    expect(event.id).toEqual(expect.any(String));
    expect(event.id.length).toBeGreaterThan(0);
    expect(Number.isNaN(Date.parse(event.timestamp))).toBe(false);
  });
});
