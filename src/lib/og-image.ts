/**
 * Build-time OG image generator.
 * Uses Satori to render a React-like object tree into SVG, then @resvg/resvg-js
 * to rasterize SVG → PNG. Called from the `/og/[slug].png` dynamic route, so
 * every page gets a branded 1200x630 image at build time.
 */
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type FontStyle = { name: string; data: Buffer; weight: 400 | 700; style: 'normal' };
let fontCache: FontStyle[] | null = null;

async function loadFonts(): Promise<FontStyle[]> {
  if (fontCache) return fontCache;

  // Resolve from project root — build-time only, process.cwd() is the Astro project dir.
  const fontDir = resolve(process.cwd(), 'src/fonts');
  const [regular, bold, display] = await Promise.all([
    readFile(`${fontDir}/DMSans-Regular.ttf`),
    readFile(`${fontDir}/DMSans-Bold.ttf`),
    readFile(`${fontDir}/DMSerifDisplay-Regular.ttf`),
  ]);

  fontCache = [
    { name: 'DM Sans', data: regular, weight: 400, style: 'normal' },
    { name: 'DM Sans', data: bold, weight: 700, style: 'normal' },
    { name: 'DM Serif Display', data: display, weight: 400, style: 'normal' },
  ];
  return fontCache;
}

export interface OgImageOptions {
  title: string;
  subtitle?: string;
  category?: string;
  accent?: 'teal' | 'coral';
}

const TEAL = '#0D6B58';
const TEAL_LIGHT = '#10B981';
const CORAL = '#E8634A';
const INK = '#1C1917';
const SAND = '#FAF7F2';
const BORDER = '#E7E5E4';
const MUTED = '#6B6560';

/**
 * Generates a 1200x630 PNG OG image as a Uint8Array.
 */
export async function generateOgImage(opts: OgImageOptions): Promise<Uint8Array> {
  const fonts = await loadFonts();
  const accent = opts.accent === 'coral' ? CORAL : TEAL;

  // Build the satori tree (React-like element tree)
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: SAND,
          position: 'relative',
          fontFamily: 'DM Sans',
        },
        children: [
          // Decorative background blob — top right
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '-140px',
                right: '-140px',
                width: '500px',
                height: '500px',
                borderRadius: '9999px',
                background: `radial-gradient(circle, ${TEAL}20 0%, transparent 70%)`,
              },
            },
          },
          // Decorative blob — bottom left
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '-120px',
                left: '-120px',
                width: '420px',
                height: '420px',
                borderRadius: '9999px',
                background: `radial-gradient(circle, ${CORAL}18 0%, transparent 70%)`,
              },
            },
          },
          // Content wrapper
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                padding: '72px 80px',
                position: 'relative',
              },
              children: [
                // Top: logo + category
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
                    children: [
                      // Logo mark
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', alignItems: 'center', gap: '14px' },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  width: '44px',
                                  height: '44px',
                                  borderRadius: '12px',
                                  backgroundColor: TEAL,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontSize: '24px',
                                  fontWeight: 700,
                                  fontFamily: 'DM Serif Display',
                                },
                                children: 'R',
                              },
                            },
                            {
                              type: 'div',
                              props: {
                                style: {
                                  fontSize: '28px',
                                  fontWeight: 700,
                                  color: INK,
                                  letterSpacing: '-0.02em',
                                },
                                children: 'Renty',
                              },
                            },
                          ],
                        },
                      },
                      // Category pill
                      opts.category
                        ? {
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 18px',
                                borderRadius: '9999px',
                                border: `1.5px solid ${accent}30`,
                                backgroundColor: `${accent}12`,
                              },
                              children: [
                                {
                                  type: 'div',
                                  props: {
                                    style: {
                                      width: '8px',
                                      height: '8px',
                                      borderRadius: '9999px',
                                      backgroundColor: accent,
                                    },
                                  },
                                },
                                {
                                  type: 'div',
                                  props: {
                                    style: {
                                      fontSize: '14px',
                                      fontWeight: 700,
                                      color: accent,
                                      letterSpacing: '0.08em',
                                      textTransform: 'uppercase',
                                    },
                                    children: opts.category,
                                  },
                                },
                              ],
                            },
                          }
                        : null,
                    ].filter(Boolean),
                  },
                },
                // Middle: title + subtitle
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '960px' },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: opts.title.length > 60 ? '54px' : '64px',
                            fontWeight: 400,
                            fontFamily: 'DM Serif Display',
                            color: INK,
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                          },
                          children: opts.title,
                        },
                      },
                      opts.subtitle
                        ? {
                            type: 'div',
                            props: {
                              style: {
                                fontSize: '24px',
                                fontWeight: 400,
                                color: MUTED,
                                lineHeight: 1.45,
                                maxWidth: '880px',
                              },
                              children: opts.subtitle,
                            },
                          }
                        : null,
                    ].filter(Boolean),
                  },
                },
                // Bottom: URL + tagline bar
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '28px',
                      borderTop: `1px solid ${BORDER}`,
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '18px',
                            fontWeight: 700,
                            color: INK,
                            letterSpacing: '-0.01em',
                          },
                          children: 'rentyco.app',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '16px',
                            fontWeight: 400,
                            color: MUTED,
                            fontFamily: 'DM Sans',
                          },
                          children: 'El arriendo sin barreras · Bogotá 2026',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          // Accent bar at the bottom edge
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: `linear-gradient(90deg, ${TEAL} 0%, ${TEAL_LIGHT} 50%, ${CORAL} 100%)`,
              },
            },
          },
        ],
      },
    } as any,
    {
      width: 1200,
      height: 630,
      fonts,
    }
  );

  // Rasterize SVG → PNG
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  return resvg.render().asPng();
}
