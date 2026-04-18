import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Non-interactive pill label.
 *
 * Use `<Pill>` for overlay labels on images, subtle inline tags, and
 * decorative markers. For interactive filter / selection UI, use `<Chip>`
 * instead — it handles click, active state, and keyboard.
 *
 *   <Pill variant="surface">Amoblado</Pill>
 *   <Pill variant="teal" withCheck>Verificado</Pill>
 *   <Pill variant="dark-glass">EN VIVO</Pill>
 */
type Variant =
  | 'surface'       // white bg, ink text — on dark image overlays
  | 'teal'          // teal bg, white text — verified, selected
  | 'coral'         // coral bg, white text — highlight
  | 'dark-glass'    // ink w/ backdrop-blur — for over-image floats
  | 'light-glass'   // white/80 w/ backdrop-blur — subtle floats
  | 'muted';        // sand bg, ink-muted text — neutral

export interface PillProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  children: ReactNode;
  variant?: Variant;
  /** Include a leading teal checkmark (semantic: "verified"). */
  withCheck?: boolean;
}

const variantClasses: Record<Variant, string> = {
  surface: 'bg-surface text-ink border border-border',
  teal: 'bg-teal text-white',
  coral: 'bg-coral text-white',
  'dark-glass': 'bg-ink/85 text-white backdrop-blur-sm',
  'light-glass': 'bg-white/85 text-ink backdrop-blur-sm',
  muted: 'bg-sand-dark text-ink-muted',
};

export function Pill({ variant = 'surface', withCheck, className, children, ...rest }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-600 uppercase tracking-[0.1em]',
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {withCheck && (
        <svg
          aria-hidden="true"
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      )}
      {children}
    </span>
  );
}
