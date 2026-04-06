/**
 * OG image generator — 1200x630 PNG per page + blog post.
 * Uses @vercel/og (ImageResponse) with locally bundled DM Sans + DM Serif Display.
 */
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { findOgPage, OG_PAGES } from '@/lib/og-pages';
import { getAllPosts } from '@/lib/blog';

export const dynamic = 'force-static';

const TEAL = '#0D6B58';
const TEAL_LIGHT = '#10B981';
const CORAL = '#E8634A';
const INK = '#1C1917';
const SAND = '#FAF7F2';
const BORDER = '#E7E5E4';
const MUTED = '#6B6560';

async function loadFont(name: string): Promise<ArrayBuffer> {
  const buf = await readFile(join(process.cwd(), 'src', 'fonts', name));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await getAllPosts();
  return [
    ...OG_PAGES.map((p) => ({ slug: `${p.slug}.png` })),
    ...posts.map((p) => ({ slug: `blog-${p.slug}.png` })),
  ];
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<Response> {
  const { slug: raw } = await params;
  const slug = raw.replace(/\.png$/, '');

  let page = findOgPage(slug);

  if (!page && slug.startsWith('blog-')) {
    const postSlug = slug.slice('blog-'.length);
    const posts = await getAllPosts();
    const post = posts.find((p) => p.slug === postSlug);
    if (post) {
      page = {
        slug,
        title: post.data.title,
        subtitle: post.data.description,
        category: 'Artículo',
        accent: 'teal',
      };
    }
  }

  if (!page) {
    page = findOgPage('default')!;
  }

  const accent = page.accent === 'coral' ? CORAL : TEAL;
  const [regular, bold, display] = await Promise.all([
    loadFont('DMSans-Regular.ttf'),
    loadFont('DMSans-Bold.ttf'),
    loadFont('DMSerifDisplay-Regular.ttf'),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: SAND,
          position: 'relative',
          fontFamily: 'DM Sans',
        }}
      >
        {/* Decorative blob — top right */}
        <div
          style={{
            position: 'absolute',
            top: '-140px',
            right: '-140px',
            width: '500px',
            height: '500px',
            borderRadius: '9999px',
            background: `radial-gradient(circle, ${TEAL}20 0%, transparent 70%)`,
          }}
        />
        {/* Decorative blob — bottom left */}
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            left: '-120px',
            width: '420px',
            height: '420px',
            borderRadius: '9999px',
            background: `radial-gradient(circle, ${CORAL}18 0%, transparent 70%)`,
          }}
        />
        {/* Content wrapper */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            padding: '72px 80px',
            position: 'relative',
          }}
        >
          {/* Top: logo + category */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
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
                }}
              >
                R
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: INK,
                  letterSpacing: '-0.02em',
                }}
              >
                Renty
              </div>
            </div>
            {page.category && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 18px',
                  borderRadius: '9999px',
                  border: `1.5px solid ${accent}30`,
                  backgroundColor: `${accent}12`,
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '9999px',
                    backgroundColor: accent,
                  }}
                />
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: accent,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {page.category}
                </div>
              </div>
            )}
          </div>
          {/* Middle: title + subtitle */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '22px',
              maxWidth: '960px',
            }}
          >
            <div
              style={{
                fontSize: page.title.length > 60 ? '54px' : '64px',
                fontWeight: 400,
                fontFamily: 'DM Serif Display',
                color: INK,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              {page.title}
            </div>
            {page.subtitle && (
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 400,
                  color: MUTED,
                  lineHeight: 1.45,
                  maxWidth: '880px',
                }}
              >
                {page.subtitle}
              </div>
            )}
          </div>
          {/* Bottom: URL + tagline */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '28px',
              borderTop: `1px solid ${BORDER}`,
            }}
          >
            <div
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: INK,
                letterSpacing: '-0.01em',
              }}
            >
              rentyco.app
            </div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: 400,
                color: MUTED,
                fontFamily: 'DM Sans',
              }}
            >
              El arriendo sin barreras · Bogotá 2026
            </div>
          </div>
        </div>
        {/* Accent bar at the bottom edge */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: `linear-gradient(90deg, ${TEAL} 0%, ${TEAL_LIGHT} 50%, ${CORAL} 100%)`,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'DM Sans', data: regular, weight: 400, style: 'normal' },
        { name: 'DM Sans', data: bold, weight: 700, style: 'normal' },
        { name: 'DM Serif Display', data: display, weight: 400, style: 'normal' },
      ],
    }
  );
}
