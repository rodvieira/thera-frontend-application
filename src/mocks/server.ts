import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/** Server do MSW para o ambiente Node (testes com Jest). */
export const server = setupServer(...handlers);
