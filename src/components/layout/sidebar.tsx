'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navItems } from './nav-items';

/**
 * Rail de navegação lateral. Console escuro para dar identidade operacional e
 * separar visualmente a navegação do conteúdo de trabalho.
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-neutral-950 text-neutral-300 md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
        <span className="flex size-8 items-center justify-center rounded-md bg-white/10 font-display text-sm font-bold text-white">
          OV
        </span>
        <span className="font-display text-base font-semibold tracking-tight text-white">
          OVGS
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-white/10 text-white'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white',
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4 text-xs text-neutral-500">
        Ambiente de demonstração · API mockada
      </div>
    </aside>
  );
}
