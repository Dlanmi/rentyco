import type { ReactNode } from 'react';
import Link from 'next/link';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Badge } from '@/components/ui/Badge';
import { TableOfContents } from './TableOfContents';

/**
 * Stripe/Vercel-level legal document shell:
 *   - Hero with badge, last-updated + "download" action
 *   - Sticky TOC sidebar on desktop (scroll-spy)
 *   - Prose-tokenized article body
 *   - Bottom version strip with changelog link
 *
 * Consumers pass the raw article JSX (already-written copy) as children.
 * `<h2>` / `<h3>` with `id` attributes auto-populate the TOC.
 */
export interface LegalPageShellProps {
  eyebrow: string;
  title: string;
  /** ISO date string; rendered as "Actualizado el 15 de abril de 2026". */
  updatedAt: string;
  /** Short description shown under the title. */
  summary?: string;
  /** Current document version (e.g. "v2.1"). Shown as a badge. */
  version?: string;
  /** Optional slug for the changelog page (/legal/<slug>/historial). */
  changelogSlug?: string;
  children: ReactNode;
}

function formatDateEsCO(iso: string): string {
  try {
    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function LegalPageShell({
  eyebrow,
  title,
  updatedAt,
  summary,
  version = 'v1.0',
  changelogSlug,
  children,
}: LegalPageShellProps) {
  return (
    <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
      {/* Hero */}
      <header className="mb-12 lg:mb-16">
        <Eyebrow tone="teal">{eyebrow}</Eyebrow>
        <h1
          className="mt-4 font-display font-400 text-ink [letter-spacing:-0.025em]"
          style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.05 }}
        >
          {title}
        </h1>
        {summary && (
          <p
            className="mt-4 max-w-[60ch] font-body text-ink-secondary"
            style={{ fontSize: 18, lineHeight: 1.55 }}
          >
            {summary}
          </p>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-[13px]">
          <Badge variant="teal" size="sm">{version}</Badge>
          <span className="font-mono text-[11px] font-500 uppercase tracking-[0.12em] text-ink-muted">
            Actualizado el {formatDateEsCO(updatedAt)}
          </span>
          {changelogSlug && (
            <Link
              href={`/legal/${changelogSlug}/historial`}
              className="inline-flex items-center gap-1 font-heading text-[13px] font-600 text-teal no-underline hover:text-teal-dark"
            >
              Ver historial de cambios
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </header>

      {/* Two-column layout: content + sticky TOC */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_220px] lg:gap-16">
        <article id="legal-article" className="min-w-0 space-y-8">
          {children}
        </article>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <TableOfContents />
          <div className="mt-8 rounded-2xl border border-border bg-sand p-5">
            <div className="font-heading text-[13px] font-600 text-ink">¿Preguntas?</div>
            <p className="mt-1.5 font-body text-[12px] leading-relaxed text-ink-muted">
              Escríbenos a{' '}
              <a
                href="mailto:soporte@rentyco.app"
                className="text-teal no-underline hover:text-teal-dark"
              >
                soporte@rentyco.app
              </a>{' '}
              o déjanos tus dudas por WhatsApp.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
