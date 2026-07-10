import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** Elemento renderizado (ex.: 'section', 'aside') para preservar semântica. */
  as?: ElementType;
}

/** Superfície de conteúdo padrão (borda + fundo card). */
export function Card({
  as: Component = 'div',
  className,
  ...props
}: CardProps) {
  return (
    <Component
      className={cn('rounded-lg border bg-card p-5', className)}
      {...props}
    />
  );
}
