import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Tailwind-aware class merger, taught about Renty's custom `@theme` utilities
 * from `globals.css`. Without these extensions, `tailwind-merge` misclassifies
 * our custom font-sizes (`text-label`) as text colors and our numeric font
 * weights (`font-600`) as font families, causing legitimate classes like
 * `text-white` and `font-heading` to be silently stripped.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['2xs', 'label', 'md'] }],
      'font-family': [{ font: ['display', 'heading', 'body', 'mono'] }],
      'font-weight': [{ font: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] }],
      // Semantic radius tokens (see globals.css @theme) — register so
      // tailwind-merge doesn't silently strip them when mixed with core ones.
      'rounded': [{ rounded: ['field', 'card', 'hero', 'pill'] }],
      // Semantic shadow tokens + brand CTA shadows.
      'shadow': [{ shadow: ['card-sm', 'card', 'card-lg', 'cta-teal', 'cta-coral'] }],
      // Score ramp colors — used by ScoreGauge + surfaces that render scores.
      'text-color': [{ text: ['score-low', 'score-mid', 'score-ok', 'score-high'] }],
      'bg-color': [{ bg: ['score-low', 'score-mid', 'score-ok', 'score-high', 'score-low-bg', 'score-mid-bg', 'score-ok-bg', 'score-high-bg'] }],
    },
  },
});

/** Tailwind-aware class merger. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
