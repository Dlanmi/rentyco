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
    },
  },
});

/** Tailwind-aware class merger. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
