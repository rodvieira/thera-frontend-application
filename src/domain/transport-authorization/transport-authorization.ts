import type { Client } from '../types';

/** Erro de negócio: transporte não autorizado para o cliente. */
export class TransportNotAuthorizedError extends Error {
  constructor(
    public readonly clientId: string,
    public readonly transportTypeId: string,
  ) {
    super(
      `Transporte ${transportTypeId} não autorizado para o cliente ${clientId}`,
    );
    this.name = 'TransportNotAuthorizedError';
  }
}

/**
 * `true` se o tipo de transporte está autorizado para o cliente. Novos tipos de
 * transporte não exigem mudança desta regra.
 */
export function isTransportAuthorized(
  client: Pick<Client, 'authorizedTransportTypeIds'>,
  transportTypeId: string,
): boolean {
  return client.authorizedTransportTypeIds.includes(transportTypeId);
}

/** Lança `TransportNotAuthorizedError` se o transporte não estiver autorizado. */
export function assertTransportAuthorized(
  client: Pick<Client, 'id' | 'authorizedTransportTypeIds'>,
  transportTypeId: string,
): void {
  if (!isTransportAuthorized(client, transportTypeId)) {
    throw new TransportNotAuthorizedError(client.id, transportTypeId);
  }
}
