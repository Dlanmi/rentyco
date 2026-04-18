'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Sticky anchor nav below the navbar — 7 links that smooth-scroll to page
 * sections, with an active pill driven by scroll position and a thin
 * teal→coral progress rail spanning the whole document.
 */
interface Anchor {
  id: string;
  n: string;
  label: string;
}

const anchors: Anchor[] = [
  { id: 'antes-ahora', n: '01', label: 'Antes vs. ahora' },
  { id: 'pasos', n: '02', label: 'Los 4 pasos' },
  { id: 'motor', n: '03', label: 'El motor' },
  { id: 'tiempos', n: '04', label: 'En cuánto tiempo' },
  { id: 'caminos', n: '05', label: 'Si tu score es bajo' },
  { id: 'seguridad', n: '06', label: 'Seguridad' },
  { id: 'faq', n: '07', label: 'Preguntas' },
];

export default function JumpBar() {
  const [active, setActive] = useState<string>(anchors[0]!.id);
  const [progress, setProgress] = useState(0);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(100, (y / h) * 100) : 0);

      const mid = y + 180;
      let current = anchors[0]!.id;
      for (const a of anchors) {
        const el = document.getElementById(a.id);
        if (el && el.offsetTop <= mid) current = a.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const navH = 64; // navbar height on mobile; 72 on desktop, but 64 is safe offset
    const jumpH = barRef.current?.offsetHeight || 56;
    window.scrollTo({ top: el.offsetTop - navH - jumpH - 16, behavior: 'smooth' });
  };

  return (
    <>
      {/* Progress rail — sits directly under the navbar */}
      <div
        aria-hidden="true"
        className="fixed left-0 right-0 top-[72px] z-40 h-[2px]"
        style={{ pointerEvents: 'none' }}
      >
        <span
          className="block h-full"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--color-teal), var(--color-coral))',
            transition: 'width 0.1s linear',
          }}
        />
      </div>

      <nav
        ref={barRef}
        aria-label="Secciones de la página"
        className="sticky top-[72px] z-30 border-y border-border bg-sand/92 backdrop-blur-md"
      >
        <div className="cf-jump-track mx-auto flex h-14 max-w-[1280px] items-center gap-1 overflow-x-auto px-5 sm:px-8 lg:px-12">
          {anchors.map((a) => {
            const isActive = a.id === active;
            return (
              <a
                key={a.id}
                href={`#${a.id}`}
                onClick={(e) => handleClick(e, a.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 font-mono text-[10px] font-500 tracking-[0.12em] uppercase transition-colors duration-200 sm:text-[11px] ${
                  isActive
                    ? 'bg-ink text-white'
                    : 'text-ink-muted hover:bg-sand-dark hover:text-ink'
                }`}
              >
                <span className={`hidden sm:inline ${isActive ? 'opacity-60' : 'opacity-50'}`}>
                  {a.n}
                </span>
                {a.label}
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
