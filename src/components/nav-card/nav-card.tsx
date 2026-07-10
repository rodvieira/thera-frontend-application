import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

export interface NavCardProps {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

/** Cartão de navegação para áreas do sistema (usado na visão geral e cadastros). */
export function NavCard({
  href,
  label,
  description,
  icon: Icon,
}: NavCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-lg border bg-card p-5 transition-colors hover:border-foreground/20 hover:bg-accent"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-md bg-muted text-foreground">
          <Icon className="size-4.5" aria-hidden />
        </span>
        <h2 className="font-display text-base font-semibold tracking-tight">
          {label}
        </h2>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}
