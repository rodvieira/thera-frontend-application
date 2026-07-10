import '@testing-library/jest-dom';
import { server } from '@/mocks/server';

// MSW: intercepta requisições em todos os testes de integração.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
