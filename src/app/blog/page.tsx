import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import { SITE_URL, absoluteUrl } from '@/lib/site';
import JsonLd from '@/components/layout/JsonLd';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BlogFilter from './BlogFilter';
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  formatBlogDate,
  getAllPosts,
} from '@/lib/blog';

const pageSeo = {
  title: 'Blog de Arriendo en Colombia | Guías, Derechos y Requisitos — Renty',
  description:
    'Todo sobre arrendar en Colombia: requisitos para arrendar en Bogotá, derechos del inquilino, cómo arrendar sin codeudor y más. Información verificada.',
  path: '/blog',
  ogSlug: 'blog',
};

export const metadata: Metadata = buildMetadata(pageSeo);

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Blog', url: '/blog' },
];

const categories = [
  { id: 'todos', label: 'Todos' },
  { id: 'inquilinos', label: 'Inquilinos' },
  { id: 'arrendadores', label: 'Arrendadores' },
  { id: 'legal', label: 'Legal' },
  { id: 'mercado', label: 'Mercado' },
  { id: 'producto', label: 'Producto' },
];

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  const blogJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      '@id': `${SITE_URL}/blog#blog`,
      url: `${SITE_URL}/blog`,
      name: 'Blog Renty',
      description: 'Guías, datos y perspectivas sobre el arriendo en Colombia.',
      inLanguage: 'es-CO',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absoluteUrl(`/blog/${post.slug}`),
        name: post.data.title,
      })),
    },
  ];

  return (
    <>
      <JsonLd data={blogJsonLd[0]!} id="ld-blog" />
      <JsonLd data={blogJsonLd[1]!} id="ld-blog-list" />
      <JsonLd data={buildBreadcrumbSchema(pageSeo.path, breadcrumbs)} id="ld-breadcrumb" />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="pt-28 pb-20">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 lg:px-12">
          <span data-reveal className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-teal">
            Blog
          </span>
          <h1 data-reveal className="font-display text-[clamp(2rem,4.5vw,3.2rem)] leading-tight text-ink">
            Guías, datos y perspectivas<br />sobre el arriendo en Colombia.
          </h1>
          <p data-reveal className="mt-4 max-w-2xl font-body text-lg text-ink-secondary">
            Información que debería existir pero nadie reúne: derechos, datos del mercado, y cómo
            funciona el sistema que queremos cambiar.
          </p>
        </section>

        {/* Category Filter + Posts Grid (client-side filter) */}
        <BlogFilter
          categories={categories}
          posts={posts.map((p) => ({
            slug: p.slug,
            title: p.data.title,
            description: p.data.description,
            category: p.data.category,
            categoryLabel: CATEGORY_LABELS[p.data.category] || p.data.category,
            categoryColor: CATEGORY_COLORS[p.data.category] || 'bg-gray-100 text-gray-600',
            author: p.data.author,
            pubDate: formatBlogDate(p.data.pubDate),
            readingTime: p.data.readingTime,
          }))}
        />

        {/* CTA */}
        <section className="mx-auto mt-20 max-w-7xl px-6 text-center lg:px-12">
          <div data-reveal className="rounded-2xl border border-border bg-surface p-12">
            <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] text-ink">
              ¿Quieres ser de los primeros?
            </h2>
            <p className="mx-auto mt-3 max-w-md font-body text-ink-muted">
              Calcula tu Renty Score gratuito y arrienda sin barreras en Bogotá.
            </p>
            <Link
              href="/renty-score/formulario"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal px-7 py-3.5 font-heading text-md font-600 text-white no-underline transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-dark"
            >
              Calcular mi score
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
