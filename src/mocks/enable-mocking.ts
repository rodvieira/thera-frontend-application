/**
 * Inicia o MSW no navegador. É idempotente e no-op fora do browser (SSR).
 * Pode ser desativado via `NEXT_PUBLIC_API_MOCKING=disabled`.
 */
export async function enableApiMocking(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (process.env.NEXT_PUBLIC_API_MOCKING === 'disabled') return;

  const { worker } = await import('./browser');
  await worker.start({ onUnhandledRequest: 'bypass', quiet: true });
}
