'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PostCard {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  categoryColor: string;
  author: string;
  pubDate: string;
  readingTime?: number;
}

interface CategoryDef {
  id: string;
  label: string;
}

interface Props {
  categories: CategoryDef[];
  posts: PostCard[];
}

export default function BlogFilter({ categories, posts }: Props) {
  const [active, setActive] = useState('todos');
  const visible = (p: PostCard) => active === 'todos' || p.category === active;

  return (
    <>
      <section className="mx-auto mt-10 max-w-7xl px-6 lg:px-12">
        <div data-blog-filter className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = cat.id === active;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActive(cat.id)}
                aria-pressed={isActive}
                className={`rounded-full border px-4 py-1.5 font-heading text-[13px] font-600 transition-all duration-200 ${
                  isActive
                    ? 'border-teal bg-teal text-white'
                    : 'border-border bg-surface text-ink-muted hover:border-teal hover:text-teal'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-7xl px-6 lg:px-12">
        <div
          data-blog-grid
          data-reveal-stagger
          data-reveal-y="20"
          data-reveal-duration="0.5"
          data-reveal-stagger-each="0.1"
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {posts.filter(visible).length === 0 && (
            <div className="col-span-full py-16 text-center">
              <p className="font-body text-ink-muted">
                No hay artículos en esta categoría aún.
              </p>
              <button
                type="button"
                onClick={() => setActive('todos')}
                className="mt-3 font-heading text-[14px] font-600 text-teal hover:text-teal-dark transition-colors"
              >
                Ver todos los artículos
              </button>
            </div>
          )}
          {posts.map((post) => (
            <article
              key={post.slug}
              data-blog-card
              data-category={post.category}
              hidden={!visible(post)}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.04]"
            >
              <div className="flex h-48 items-center justify-center bg-gradient-to-br from-teal-lighter to-sand">
                <svg
                  className="h-12 w-12 text-teal/30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-heading text-[11px] font-600 ${post.categoryColor}`}
                  >
                    {post.categoryLabel}
                  </span>
                  {post.readingTime && (
                    <span className="font-mono text-[11px] text-ink-muted">
                      {post.readingTime} min
                    </span>
                  )}
                </div>
                <h2 className="mb-2 font-heading text-[17px] font-700 leading-snug text-ink group-hover:text-teal transition-colors duration-200">
                  <Link href={`/blog/${post.slug}`} className="no-underline text-inherit">
                    {post.title}
                  </Link>
                </h2>
                <p className="mb-4 flex-1 font-body text-[14px] leading-relaxed text-ink-muted">
                  {post.description}
                </p>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="font-body text-[12px] text-ink-muted">{post.pubDate}</span>
                  <span className="font-heading text-[12px] font-600 text-ink-secondary">
                    {post.author}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
