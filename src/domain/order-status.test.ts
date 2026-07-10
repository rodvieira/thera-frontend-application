import {
  canTransition,
  assertTransition,
  nextStatus,
  isFinalStatus,
  InvalidTransitionError,
} from './order-status';

describe('máquina de estados da OV', () => {
  describe('canTransition', () => {
    it('permite cada passo sequencial do fluxo', () => {
      expect(canTransition('CRIADA', 'PLANEJADA')).toBe(true);
      expect(canTransition('PLANEJADA', 'AGENDADA')).toBe(true);
      expect(canTransition('AGENDADA', 'EM_TRANSPORTE')).toBe(true);
      expect(canTransition('EM_TRANSPORTE', 'ENTREGUE')).toBe(true);
    });

    it('rejeita transição que pula etapa', () => {
      expect(canTransition('CRIADA', 'AGENDADA')).toBe(false);
      expect(canTransition('PLANEJADA', 'EM_TRANSPORTE')).toBe(false);
    });

    it('rejeita retrocesso', () => {
      expect(canTransition('AGENDADA', 'PLANEJADA')).toBe(false);
      expect(canTransition('ENTREGUE', 'EM_TRANSPORTE')).toBe(false);
    });

    it('rejeita transição para o mesmo status', () => {
      expect(canTransition('CRIADA', 'CRIADA')).toBe(false);
    });
  });

  describe('nextStatus / isFinalStatus', () => {
    it('retorna o sucessor de cada status', () => {
      expect(nextStatus('CRIADA')).toBe('PLANEJADA');
      expect(nextStatus('EM_TRANSPORTE')).toBe('ENTREGUE');
    });

    it('trata ENTREGUE como estado final', () => {
      expect(nextStatus('ENTREGUE')).toBeNull();
      expect(isFinalStatus('ENTREGUE')).toBe(true);
      expect(isFinalStatus('CRIADA')).toBe(false);
    });
  });

  describe('assertTransition', () => {
    it('não lança para transição válida', () => {
      expect(() => assertTransition('CRIADA', 'PLANEJADA')).not.toThrow();
    });

    it('lança InvalidTransitionError para transição inválida', () => {
      expect(() => assertTransition('CRIADA', 'ENTREGUE')).toThrow(
        InvalidTransitionError,
      );
    });

    it('descreve a transição rejeitada na mensagem do erro', () => {
      expect(() => assertTransition('AGENDADA', 'CRIADA')).toThrow(
        'AGENDADA → CRIADA',
      );
    });
  });
});
