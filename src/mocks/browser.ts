import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/** Worker do MSW para o ambiente de navegador (desenvolvimento). */
export const worker = setupWorker(...handlers);
