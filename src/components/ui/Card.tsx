import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * The standard surface card — border + radius + optional shadow.
 * Used by listing cards, form sections, dashboard widgets, etc.
 *
 *   <Card>Content</Card>
 *   <Card elevated padding="lg">Feature card</Card>
 *   <Card dark>Dark section card</Card>
 */
type Padding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Lift + shadow at rest (for feature cards above the fold). */
  elevated?: boolean;
  /** Internal padding. Default 'md'. */
  padding?: Padding;
  /** Ink-surface variant for use inside dark sections. */
  dark?: boolean;
  /** Use a hero-sized radius (24px) instead of the default card radius (16px). */
  hero?: boolean;
  /** Render an interactive hover-lift effect. */
  interactive?: boolean;
}

const paddingClasses: Record<Padding, string> = {
  none: '',
  sm: 'p-4 sm:p-5',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
};

export function Card({
  children,
  elevated = false,
  padding = 'md',
  dark = false,
  hero = false,
  interactive = false,
  className,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        'border',
        hero ? 'rounded-3xl' : 'rounded-2xl',
        dark
          ? 'border-white/10 bg-white/[0.03]'
          : 'border-border bg-surface',
        elevated && (dark ? 'shadow-xl shadow-black/30' : 'shadow-sm'),
        interactive &&
          'transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none',
        paddingClasses[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
