/**
 * Converts a string to a URL-safe slug.
 * Strips accents, lowercases, collapses whitespace/punctuation to hyphens.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Appends a short random suffix to break collisions. */
export function slugWithSuffix(base: string): string {
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${slugify(base)}-${suffix}`;
}
