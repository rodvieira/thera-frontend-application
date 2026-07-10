import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Path to the Next.js app to load next.config and .env files in the test environment
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  passWithNoTests: true,
  testEnvironment: 'jsdom',
  // Necessário para o MSW resolver os exports corretos sob jsdom.
  testEnvironmentOptions: { customExportConditions: [''] },
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/mocks/**',
  ],
};

// next/jest prepends its próprio transformIgnorePatterns e a lógica é OR: se
// qualquer padrão casar, o arquivo NÃO é transformado. Por isso não basta
// adicionar — precisamos substituir o array depois do merge para permitir a
// transformação do MSW v2 e suas dependências ESM (rettime, etc.).
const esmPackages = [
  'geist',
  'next',
  'msw',
  '@mswjs',
  'rettime',
  'until-async',
  'outvariant',
  '@open-draft',
  'strict-event-emitter',
  'headers-polyfill',
  '@bundled-es-modules',
  'tough-cookie',
];

export default async function jestConfig() {
  const nextConfig = await createJestConfig(config)();
  return {
    ...nextConfig,
    transformIgnorePatterns: [
      `/node_modules/(?!(${esmPackages.join('|')})/)`,
      String.raw`^.+\.module\.(css|sass|scss)$`,
    ],
  };
}
