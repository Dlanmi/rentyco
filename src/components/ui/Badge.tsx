import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/**
 * Inline label for status / category / meta-info. Uses only semantic tokens
 * (no raw Tailwind palettes — lint bans them). For non-interactive overlays
 * use `<Pill>` instead; for interactive filter chips use `<Chip>`.
 */
type Variant = 'neutral' | 'success' | 'warning' | 'error' | 'teal' | 'coral' | 'outline' | 'outline-light';
type Size = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
}

const variants: Record<Variant, string> = {
  neutral: 'bg-sand-dark text-ink-secondary ring-border',
  success: 'bg-success/10 text-success ring-success/25',
  warning: 'bg-warning/10 text-warning ring-warning/30',
  error:   'bg-error/10 text-error ring-error/25',
  teal:    'bg-teal-lighter text-teal-dark ring-teal/20',
  coral:   'bg-coral-light text-coral-dark ring-coral/20',
  outline: 'bg-transparent text-ink ring-border-strong',
  'outline-light': 'bg-transparent text-white ring-white/30',
};

const sizes: Record<Size, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-0.5 text-[11px]',
};

export function Badge({ variant = 'neutral', size = 'md', className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-mono font-500 tracking-wide uppercase ring-1 ring-inset',
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
