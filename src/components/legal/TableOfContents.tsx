'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Auto-generated TOC sticky sidebar. Scans the rendered article for
 * `<h2 id>` / `<h3 id>` elements and tracks active section via
 * IntersectionObserver.
 *
 * Works for any article container — pass `containerSelector` (default:
 * `#legal-article`) and the component does the rest.
 *
 * Smooth-scrolls with header offset on click.
 */
interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function TableOfContents({
  containerSelector = '#legal-article',
  title = 'En esta página',
}: {
  containerSelector?: string;
  title?: string;
}) {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const nodes = Array.from(
      container.querySelectorAll<HTMLHeadingElement>('h2[id], h3[id]'),
    );
    const items: TocHeading[] = nodes.map((el) => ({
      id: el.id,
      text: el.textContent?.trim() ?? '',
      level: el.tagName === 'H3' ? 3 : 2,
    }));
    // Scanning the rendered DOM for headings is intrinsically a side effect
    // — there's no prop-derivable source for TOC entries, so setState here is
    // the correct shape of the operation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(items);

    // IntersectionObserver — the last heading whose top has scrolled past
    // the 180px offset wins as "active".
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-120px 0px -70% 0px',
        threshold: [0, 1],
      },
    );
    nodes.forEach((n) => io.observe(n));
    observerRef.current = io;

    return () => io.disconnect();
  }, [containerSelector]);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: y, behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  };

  if (!headings.length) return null;

  return (
    <nav aria-label="Tabla de contenidos" className="text-[13px]">
      <div className="mb-3 font-mono text-[10px] font-500 uppercase tracking-[0.14em] text-ink-muted">
        {title}
      </div>
      <ul className="space-y-1 border-l border-border">
        {headings.map((h) => {
          const isActive = h.id === activeId;
          return (
            <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
              <a
                href={`#${h.id}`}
                onClick={(e) => onClick(e, h.id)}
                className={cn(
                  '-ml-px block border-l-2 py-1 pl-3 font-body leading-snug transition-colors',
                  isActive
                    ? 'border-teal font-600 text-teal'
                    : 'border-transparent text-ink-muted hover:border-border-strong hover:text-ink',
                )}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
