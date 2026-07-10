import type { ReactNode } from 'react';
import { Sidebar } from './sidebar';

/**
 * Shell da aplicação: rail de navegação + área de conteúdo com cabeçalho.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
          <span className="font-display text-sm font-semibold tracking-tight md:hidden">
            OVGS
          </span>
          <div className="hidden text-sm text-muted-foreground md:block">
            Sistema de Gestão de Ordens de Venda
          </div>
          <span className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">
            Operador
          </span>
        </header>
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
