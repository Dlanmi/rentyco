import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/**
 * Semantic status pill — listing lifecycle, inquiry state, verification
 * status, etc. Always round-full; tone mapped to semantic token.
 *
 *   <StatusPill status="active">Activo</StatusPill>
 *   <StatusPill status="pending">Pendiente</StatusPill>
 *
 * Do NOT use raw Tailwind palettes (bg-green-100, bg-amber-100, etc.) —
 * the lint rule bans them. Always go through this component.
 */
type Status =
  | 'active'     // success — live/published
  | 'pending'    // warning — under review
  | 'paused'     // neutral — temporarily hidden
  | 'draft'      // neutral — not yet published
  | 'archived'   // muted — permanent off
  | 'error';     // error — something broke

export interface StatusPillProps extends HTMLAttributes<HTMLSpanElement> {
  status: Status;
  children: string;
}

const classes: Record<Status, string> = {
  active: 'bg-success/10 text-success border-success/20',
  pending: 'bg-warning/10 text-warning border-warning/30',
  paused: 'bg-sand-dark text-ink border-border',
  draft: 'bg-sand-dark text-ink-muted border-border',
  archived: 'bg-sand text-ink-muted border-border',
  error: 'bg-error/10 text-error border-error/30',
};

export function StatusPill({ status, children, className, ...rest }: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-600 uppercase tracking-[0.08em]',
        classes[status],
        className,
      )}
      {...rest}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  );
}
