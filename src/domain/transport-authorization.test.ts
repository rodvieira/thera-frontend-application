import {
  isTransportAuthorized,
  assertTransportAuthorized,
  TransportNotAuthorizedError,
} from './transport-authorization';

const client = {
  id: 'c1',
  authorizedTransportTypeIds: ['t-caminhao', 't-carreta'],
};

describe('autorização de transporte', () => {
  describe('isTransportAuthorized', () => {
    it('retorna true quando o transporte está na lista do cliente', () => {
      expect(isTransportAuthorized(client, 't-carreta')).toBe(true);
    });

    it('retorna false quando o transporte não está na lista', () => {
      expect(isTransportAuthorized(client, 't-bitruck')).toBe(false);
    });

    it('retorna false quando o cliente não tem transportes autorizados', () => {
      expect(
        isTransportAuthorized({ authorizedTransportTypeIds: [] }, 't-caminhao'),
      ).toBe(false);
    });
  });

  describe('assertTransportAuthorized', () => {
    it('não lança quando autorizado', () => {
      expect(() =>
        assertTransportAuthorized(client, 't-caminhao'),
      ).not.toThrow();
    });

    it('lança TransportNotAuthorizedError quando não autorizado', () => {
      expect(() => assertTransportAuthorized(client, 't-bitruck')).toThrow(
        TransportNotAuthorizedError,
      );
    });

    it('preenche clientId e transportTypeId no erro', () => {
      try {
        assertTransportAuthorized(client, 't-bitruck');
        throw new Error('deveria ter lançado');
      } catch (error) {
        expect(error).toBeInstanceOf(TransportNotAuthorizedError);
        const err = error as TransportNotAuthorizedError;
        expect(err.clientId).toBe('c1');
        expect(err.transportTypeId).toBe('t-bitruck');
      }
    });
  });
});
