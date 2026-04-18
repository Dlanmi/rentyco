/**
 * Design-system tokens as TS constants.
 *
 * Single source of truth is `src/app/globals.css` `@theme`. This file mirrors
 * the hex values for the rare contexts that can't read CSS variables:
 *
 *  - `@vercel/og` runtime (edge, no `document` / no computed styles)
 *  - `ConfettiProvider` (needs hex at init for the particle canvas)
 *  - OG image routes (same edge runtime)
 *
 * Everything else should go through Tailwind classes (`bg-teal`, `text-score-ok`)
 * or `var(--color-*)` — don't import from here unless you're in one of those
 * edge cases.
 *
 * @allow-hex — this file is the one place hex literals are legitimately allowed.
 */

export const COLORS = {
  // Primary — Deep Teal
  teal: '#0D6B58',
  tealLight: '#10B981',
  tealLighter: '#E8F5F0',
  tealDark: '#064E3B',

  // Secondary — Warm Coral
  coral: '#E8634A',
  coralLight: '#FCEAE6',
  coralDark: '#C4402A',

  // Backgrounds
  sand: '#FAF7F2',
  sandDark: '#F0EDE5',
  surface: '#FFFFFF',

  // Text
  ink: '#1C1917',
  inkSecondary: '#3D3836',
  inkMuted: '#6B6560',

  // Borders
  border: '#E7E5E4',
  borderStrong: '#D6D3D1',

  // Semantic feedback
  success: '#16A34A',
  warning: '#F59E0B',
  error: '#DC2626',

  // Score ramp
  scoreLow: '#DC2626',
  scoreMid: '#F59E0B',
  scoreOk: '#10B981',
  scoreHigh: '#0D6B58',
} as const;

/** Confetti particle palette — used by `ConfettiProvider`. */
export const CONFETTI_COLORS = [
  COLORS.teal,
  COLORS.tealLight,
  COLORS.coral,
  COLORS.tealLighter,
  COLORS.warning,
] as const;

/** Renty flag colors — for the "Hecho en Colombia" badge in OG/footer. */
export const CO_FLAG = {
  yellow: '#FCD116',
  blue: '#003893',
  red: '#CE1126',
} as const;

export type ColorToken = keyof typeof COLORS;
