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
  MessageChannel,
} = require('node:worker_threads');

Object.defineProperties(globalThis, {
  TextEncoder: { value: TextEncoder, writable: true, configurable: true },
  TextDecoder: { value: TextDecoder, writable: true, configurable: true },
  ReadableStream: { value: ReadableStream, writable: true, configurable: true },
  WritableStream: { value: WritableStream, writable: true, configurable: true },
  TransformStream: { value: TransformStream, writable: true, configurable: true },
  BroadcastChannel: { value: BroadcastChannel, writable: true, configurable: true },
  MessagePort: { value: MessagePort, writable: true, configurable: true },
  MessageChannel: { value: MessageChannel, writable: true, configurable: true },
});

const { fetch, Headers, FormData, Request, Response } = require('undici');

Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true, configurable: true },
  Headers: { value: Headers, writable: true, configurable: true },
  FormData: { value: FormData, writable: true, configurable: true },
  Request: { value: Request, writable: true, configurable: true },
  Response: { value: Response, writable: true, configurable: true },
});
