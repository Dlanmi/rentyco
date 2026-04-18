import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/**
 * Design-system anti-regression rules.
 *
 * These rules run at `warn` during the DS consolidation (fases 1–8) so
 * existing debt is visible without blocking merges. They flip to `error`
 * in Fase 9 once all known violations are cleaned up.
 *
 * Allowlist: any file with a `/** @allow-hex *\/` pragma at the top
 * (hand-applied to `src/lib/tokens.ts`, icon SVGs, `@vercel/og` routes,
 * and `LeafletMapInner.tsx` where hex in tile layers is legitimate).
 */
const dsAntiRegressionRules = {
  'no-restricted-syntax': [
    'warn',
    {
      selector: "Literal[value=/^#[0-9A-Fa-f]{3,8}$/]",
      message:
        'Hex literals are banned. Use Tailwind tokens (bg-teal, text-score-ok) or var(--color-*). If this is a legitimate edge-case (icon SVG, edge runtime, external lib), add /** @allow-hex */ pragma at top of file.',
    },
    {
      selector:
        "Property[key.name='fontSize'][value.type='Literal'][value.value!=/clamp\\(/]",
      message:
        'Inline fontSize is banned. Use Tailwind text-* scale (text-md, text-[14px] via clamp, etc.) or class composition.',
    },
    {
      selector:
        "TemplateElement[value.raw=/\\b(bg|text|border|ring)-(purple|blue|green|yellow|amber|red|pink|orange|indigo|fuchsia|emerald|rose|violet|cyan|slate|zinc|neutral|stone)-\\d+/]",
      message:
        'Raw Tailwind palette classes are banned. Use semantic tokens (bg-success, bg-score-mid, bg-teal, text-coral, etc.).',
    },
    {
      selector:
        "Literal[value=/\\b(bg|text|border|ring)-(purple|blue|green|yellow|amber|red|pink|orange|indigo|fuchsia|emerald|rose|violet|cyan|slate|zinc|neutral|stone)-\\d+/]",
      message:
        'Raw Tailwind palette classes are banned. Use semantic tokens (bg-success, bg-score-mid, bg-teal, text-coral, etc.).',
    },
    {
      selector: "Literal[value=/cubic-bezier\\(0\\.16, ?1, ?0\\.3, ?1\\)/]",
      message:
        'Inline cubic-bezier ease-out-expo is banned. Use `ease-[var(--ease-out-expo)]` class, or `EASE_STANDARD` JS constant from src/lib/gsap.ts.',
    },
  ],
};

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  { ignores: ['_legacy/**', '.next/**', 'node_modules/**', 'src/lib/tokens.ts'] },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: dsAntiRegressionRules,
  },
  // Relax for files that legitimately need hex / palette access.
  {
    files: [
      'src/components/marketplace/LeafletMapInner.tsx',
      'src/app/inquilinos/InquilinosMapInner.tsx',
      'src/app/og/**/*',
      'src/components/icons/**/*',
      'src/lib/tokens.ts',
      'src/lib/gsap.ts',
      'src/lib/useReveal.ts',
    ],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
];

export default eslintConfig;
