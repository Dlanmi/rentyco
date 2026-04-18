import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { buildMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import { absoluteUrl, SITE_URL } from '@/lib/site';
import JsonLd from '@/components/layout/JsonLd';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  formatBlogDate,
  getAllPosts,
  getPostBySlug,
} from '@/lib/blog';

interface Params {
  slug: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: `${post.data.title} — Blog Renty`,
    description: post.data.description,
    path: `/blog/${post.slug}`,
    ogSlug: `blog-${post.slug}`,
    ogType: 'article',
    publishedTime: post.data.pubDate.toISOString(),
    modifiedTime: (post.data.updatedDate || post.data.pubDate).toISOString(),
    author: post.data.author,
    section: CATEGORY_LABELS[post.data.category],
    tags: post.data.tags,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const canonical = absoluteUrl(`/blog/${post.slug}`);
  const ogImageUrl = absoluteUrl(`/og/blog-${post.slug}.png`);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.data.title,
    description: post.data.description,
    image: ogImageUrl,
    datePublished: post.data.pubDate.toISOString(),
    dateModified: (post.data.updatedDate || post.data.pubDate).toISOString(),
    author: { '@type': 'Person', name: post.data.author },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    keywords: post.data.tags.join(', '),
    articleSection: CATEGORY_LABELS[post.data.category],
    inLanguage: 'es-CO',
  };

  const breadcrumbs = [
    { name: 'Inicio', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.data.title, url: `/blog/${post.slug}` },
  ];

  const authorInitials = post.data.author
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);

  return (
    <>
      <JsonLd data={jsonLd} id="ld-article" />
      <JsonLd
        data={buildBreadcrumbSchema(`/blog/${post.slug}`, breadcrumbs)}
        id="ld-breadcrumb"
      />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="pt-6 pb-16 lg:pt-10">
        <article className="mx-auto max-w-3xl px-6 lg:px-0">
          {/* Meta */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="mb-6 inline-flex items-center gap-1.5 font-heading text-label font-600 text-ink-muted no-underline transition-colors hover:text-teal"
            >
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
                  d="M11 17l-5-5m0 0l5-5m-5 5h12"
                />
              </svg>
              Volver al blog
            </Link>

            <div className="mt-4 flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 font-heading text-[11px] font-600 ${
                  CATEGORY_COLORS[post.data.category]
                }`}
              >
                {CATEGORY_LABELS[post.data.category]}
              </span>
              {post.data.readingTime && (
                <span className="font-mono text-[12px] text-ink-muted">
                  {post.data.readingTime} min de lectura
                </span>
              )}
            </div>

            <h1 className="mt-4 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.12] text-ink">
              {post.data.title}
            </h1>

            <div className="mt-4 flex items-center gap-4 border-b border-border pb-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-lighter font-heading text-[11px] font-700 text-teal">
                  {authorInitials}
                </div>
                <span className="font-heading text-label font-600 text-ink-secondary">
                  {post.data.author}
                </span>
              </div>
              <span className="font-body text-label text-ink-muted">
                {formatBlogDate(post.data.pubDate)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div
            className="renty-prose prose prose-lg max-w-none
              prose-headings:font-heading prose-headings:font-700 prose-headings:text-ink
              prose-h2:mt-12 prose-h2:mb-5 prose-h2:text-[1.5rem] prose-h2:border-b prose-h2:border-border prose-h2:pb-3
              prose-h3:mt-9 prose-h3:mb-3 prose-h3:text-[1.2rem]
              prose-p:font-body prose-p:text-ink-secondary prose-p:leading-[1.8]
              prose-a:text-teal prose-a:font-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-ink prose-strong:font-700
              prose-em:text-ink-secondary
              prose-ul:font-body prose-ul:text-ink-secondary
              prose-ol:font-body prose-ol:text-ink-secondary
              prose-li:my-1.5
              prose-blockquote:border-l-4 prose-blockquote:border-teal prose-blockquote:bg-teal-lighter/40 prose-blockquote:rounded-r-xl prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:font-body prose-blockquote:text-ink prose-blockquote:not-italic prose-blockquote:font-500
              prose-code:font-mono prose-code:text-[14px] prose-code:text-teal prose-code:bg-teal-lighter/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-hr:border-border prose-hr:my-10
              prose-img:rounded-xl prose-img:shadow-md"
          >
            <MDXRemote source={post.content} />
          </div>

          {/* Tags */}
          {post.data.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
              {post.data.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-sand-dark px-3 py-1 font-heading text-[11px] font-600 text-ink-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-teal-lighter p-8 text-center">
            <h3 className="font-heading text-[18px] font-700 text-ink">
              ¿Listo para tu Renty Score?
            </h3>
            <p className="mx-auto mt-2 max-w-md font-body text-md text-ink-secondary">
              Calcula tu Renty Score y arrienda sin barreras.
            </p>
            <Link
              href="/renty-score/formulario"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal px-6 py-3 font-heading text-[14px] font-600 text-white no-underline transition-all hover:-translate-y-0.5 hover:bg-teal-dark"
            >
              Calcular mi score
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
