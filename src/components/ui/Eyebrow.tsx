import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * The signature Renty mono kicker that sits above every section H2.
 *
 *   <Eyebrow>EL PROBLEMA</Eyebrow>
 *   <Eyebrow tone="coral">CÓMO FUNCIONA</Eyebrow>
 *   <Eyebrow tone="inverse">DARK SECTION</Eyebrow>
 *   <Eyebrow tone="teal" withDot>EN VIVO</Eyebrow>
 *
 * The `before:` pseudo draws the 1-line rule. Pass `withRule={false}` to
 * omit it (rare — a few specific places use the text only).
 *
 * Tones map to semantic colors, never hex. To add a tone, extend
 * `toneClasses` — do not inline color overrides in consumers.
 */
type Tone = 'teal' | 'teal-dark' | 'coral' | 'muted' | 'inverse';

export interface EyebrowProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  children: ReactNode;
  tone?: Tone;
  /** Show a pulsing dot before the rule (live indicators, "disponible", etc.). */
  withDot?: boolean;
  /** Hide the left rule (default: shown). */
  withRule?: boolean;
}

const toneClasses: Record<Tone, string> = {
  teal: 'text-teal',
  'teal-dark': 'text-teal-dark',
  coral: 'text-coral',
  muted: 'text-ink-muted',
  inverse: 'text-white/60',
};

export function Eyebrow({
  tone = 'teal',
  withDot = false,
  withRule = true,
  className,
  children,
  ...rest
}: EyebrowProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 font-mono text-[11px] font-500 uppercase tracking-[0.14em]',
        toneClasses[tone],
        withRule &&
          'before:inline-block before:h-px before:w-[18px] before:bg-current before:opacity-55',
        className,
      )}
      {...rest}
    >
      {withDot && (
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current"
        />
      )}
      {children}
    </span>
  );
}
