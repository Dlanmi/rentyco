import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * A contextual info/tip/warn/error box.
 *
 *   <Callout variant="info">La habitación se publica con más reglas.</Callout>
 *   <Callout variant="warn" title="Revisa la dirección">...</Callout>
 *
 * Replaces the hand-rolled `bg-blue-50/50 border-blue-200 text-blue-700`
 * pattern in ListingForm and a handful of similar spots. Uses only
 * semantic tokens — teal for info (brand-consistent), success/warning/error
 * for the others.
 */
type Variant = 'info' | 'success' | 'warn' | 'error' | 'neutral';

export interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: Variant;
  /** Optional title shown above the body copy. */
  title?: string;
  /** Optional leading icon. */
  icon?: ReactNode;
}

const variantClasses: Record<Variant, { wrap: string; title: string; body: string; icon: string }> = {
  info: {
    wrap: 'bg-teal-lighter border-teal/20',
    title: 'text-teal-dark',
    body: 'text-ink-secondary',
    icon: 'text-teal',
  },
  success: {
    wrap: 'bg-success/10 border-success/30',
    title: 'text-success',
    body: 'text-ink-secondary',
    icon: 'text-success',
  },
  warn: {
    wrap: 'bg-warning/10 border-warning/30',
    title: 'text-warning',
    body: 'text-ink-secondary',
    icon: 'text-warning',
  },
  error: {
    wrap: 'bg-error/10 border-error/30',
    title: 'text-error',
    body: 'text-ink-secondary',
    icon: 'text-error',
  },
  neutral: {
    wrap: 'bg-sand-dark border-border',
    title: 'text-ink',
    body: 'text-ink-muted',
    icon: 'text-ink-muted',
  },
};

export function Callout({
  children,
  variant = 'info',
  title,
  icon,
  className,
  ...rest
}: CalloutProps) {
  const v = variantClasses[variant];
  return (
    <div
      role="note"
      className={cn('flex gap-3 rounded-xl border px-4 py-3', v.wrap, className)}
      {...rest}
    >
      {icon && (
        <span className={cn('mt-0.5 flex h-5 w-5 flex-none items-center justify-center', v.icon)}>
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        {title && (
          <div className={cn('mb-0.5 font-heading text-[13px] font-600', v.title)}>{title}</div>
        )}
        <div className={cn('font-body text-[13px] leading-relaxed', v.body)}>{children}</div>
      </div>
    </div>
  );
}
