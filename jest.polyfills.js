/**
 * Polyfills de Web APIs para o MSW v2 rodar sob jsdom no Jest.
 * jsdom não fornece parte das APIs de rede/stream que o MSW usa; expomos as
 * implementações nativas do Node antes do ambiente de teste ser montado.
 */
const { TextEncoder, TextDecoder } = require('node:util');
const {
  ReadableStream,
  WritableStream,
  TransformStream,
} = require('node:stream/web');
const {
  BroadcastChannel,
  MessagePort,
  MessageChannel: NodeMessageChannel,
} = require('node:worker_threads');

/**
 * O scheduler do React (usado por qualquer render via @testing-library/react)
 * também cria um `MessageChannel` internamente e nunca fecha as portas. Como
 * aqui expomos a implementação real do Node (necessária para o MSW), essas
 * portas são handles reais do event loop e impedem o processo do Jest de
 * encerrar sozinho ao rodar um único arquivo de teste (sem o pool de workers
 * forçando a saída). O Node re-referencia a porta automaticamente assim que um
 * listener de 'message' é registrado (é o que o scheduler faz via `onmessage`),
 * então só um `unref()` na criação não é suficiente — também neutralizamos
 * `ref()` para a porta nunca voltar a contar para o event loop.
 */
class MessageChannel extends NodeMessageChannel {
  constructor() {
    super();
    for (const port of [this.port1, this.port2]) {
      port.unref();
      port.ref = () => port;
    }
  }
}

Object.defineProperties(globalThis, {
  TextEncoder: { value: TextEncoder, writable: true, configurable: true },
  TextDecoder: { value: TextDecoder, writable: true, configurable: true },
  ReadableStream: { value: ReadableStream, writable: true, configurable: true },
  WritableStream: { value: WritableStream, writable: true, configurable: true },
  TransformStream: {
    value: TransformStream,
    writable: true,
    configurable: true,
  },
  BroadcastChannel: {
    value: BroadcastChannel,
    writable: true,
    configurable: true,
  },
  MessagePort: { value: MessagePort, writable: true, configurable: true },
  MessageChannel: { value: MessageChannel, writable: true, configurable: true },
});

if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (value) =>
    value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

const { fetch, Headers, FormData, Request, Response } = require('undici');

Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true, configurable: true },
  Headers: { value: Headers, writable: true, configurable: true },
  FormData: { value: FormData, writable: true, configurable: true },
  Request: { value: Request, writable: true, configurable: true },
  Response: { value: Response, writable: true, configurable: true },
});
