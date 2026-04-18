import type { ReactNode } from 'react';

/**
 * Auto-anchored section wrapper for legal docs.
 *
 *   <LegalSection title="1. Definiciones">
 *     <p>Para los efectos de los presentes...</p>
 *   </LegalSection>
 *
 * The `id` is derived from the title (slugified, lowercase, no accents)
 * so the `TableOfContents` scroll-spy picks it up automatically.
 */
export interface LegalSectionProps {
  title: string;
  id?: string;
  children: ReactNode;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function LegalSection({ title, id, children }: LegalSectionProps) {
  const anchor = id ?? slugify(title);
  return (
    <section className="scroll-mt-24">
      <h2
        id={anchor}
        className="group mb-4 flex items-baseline gap-2 font-heading text-[22px] font-700 text-ink sm:text-[24px]"
      >
        <a
          href={`#${anchor}`}
          aria-label={`Enlace a sección: ${title}`}
          className="text-teal/0 transition-colors hover:text-teal group-hover:text-teal/60"
        >
          #
        </a>
        {title}
      </h2>
      <div className="space-y-3 font-body text-[15px] leading-[1.75] text-ink-secondary">
        {children}
      </div>
    </section>
  );
}
