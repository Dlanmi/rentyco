'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthAvatar } from './AuthAvatar';

interface NavLink {
  href: string;
  label: string;
  active: boolean;
}

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const isHome = pathname === '/' || pathname === '';
  const normalizedPath =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const isMarketplace =
    normalizedPath.startsWith('/bogota') ||
    normalizedPath.includes('/arriendos') ||
    normalizedPath.startsWith('/cuenta') ||
    normalizedPath.startsWith('/admin');

  const links: NavLink[] = [
    { href: isHome ? '#problema' : '/#problema', label: 'Por qué Renty', active: false },
    {
      href: isHome ? '#como-funciona' : '/#como-funciona',
      label: 'Cómo funciona',
      active: normalizedPath === '/como-funciona',
    },
    {
      href: isHome ? '#renty-score' : '/#renty-score',
      label: 'Renty Score',
      active: normalizedPath === '/renty-score',
    },
    {
      href: isHome ? '#arrendadores' : '/#arrendadores',
      label: 'Para arrendadores',
      active: normalizedPath === '/arrendadores',
    },
    {
      href: '/blog',
      label: 'Blog',
      active: normalizedPath === '/blog' || normalizedPath.startsWith('/blog/'),
    },
  ];
  const ctaHref = '/renty-score/formulario';

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        toggleBtnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // Close on route change — derive-from-prop pattern (React 19 idiom).
  const [prevPath, setPrevPath] = useState(pathname);
  const [shouldFocusToggle, setShouldFocusToggle] = useState(false);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    if (isOpen) {
      setIsOpen(false);
      setShouldFocusToggle(true);
    }
  }

  // Return focus to the toggle button after the menu closes from a route
  // change, matching the Escape handler's behavior for keyboard users.
  useEffect(() => {
    if (shouldFocusToggle) {
      toggleBtnRef.current?.focus();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShouldFocusToggle(false);
    }
  }, [shouldFocusToggle]);

  // Focus first link when opening
  useEffect(() => {
    if (isOpen) firstLinkRef.current?.focus();
  }, [isOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!isOpen) return;
    const menu = document.getElementById('mobile-nav-menu');
    if (!menu) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = menu.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <>
      <nav
        data-navbar
        className="renty-navbar sticky top-0 z-50 border-b border-transparent"
        style={{
          background: 'rgba(250, 247, 242, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
        aria-label="Navegación principal"
      >
        <div
          className="nav-inner mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12"
          style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 1rem)' }}
        >
          <Link
            href="/"
            aria-label="Renty, ir al inicio"
            className="flex items-center gap-1 font-heading text-[22px] font-800 tracking-tight text-ink no-underline"
          >
            renty<span className="text-teal">.</span>
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-heading text-[14px] font-500 text-ink-secondary no-underline transition-colors duration-200 hover:text-ink"
                  aria-current={link.active ? 'page' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href="/bogota/arriendos"
              className="hidden items-center gap-1.5 rounded-[10px] bg-teal px-4 py-2.5 font-heading text-label font-600 text-white no-underline transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-px hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/20 motion-reduce:transform-none sm:inline-flex"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
              Buscar arriendo
            </Link>
            <Link
              href="/bogota/arriendos"
              aria-label="Buscar arriendo"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-teal text-white sm:hidden"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
            </Link>

            {!isMarketplace && (
              <Link
                href={ctaHref}
                className="hidden rounded-[10px] px-4 py-2.5 font-heading text-label font-600 text-ink-secondary no-underline transition-colors duration-200 hover:text-ink md:inline-block"
              >
                Obtén tu score
              </Link>
            )}

            <AuthAvatar />

            <button
              ref={toggleBtnRef}
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              className="flex h-12 w-12 items-center justify-center rounded-lg lg:hidden"
              aria-label={isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-menu"
            >
              <svg
                className={`h-5 w-5 text-ink ${isOpen ? 'hidden' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`h-5 w-5 text-ink ${isOpen ? '' : 'hidden'}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div
          id="mobile-nav-menu"
          className={`${isOpen ? '' : 'hidden'} border-t border-border bg-sand px-6 py-4 lg:hidden overscroll-contain`}
          aria-hidden={!isOpen}
        >
          <ul className="flex flex-col">
            {links.map((link, i) => (
              <li key={link.href}>
                <a
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 font-heading text-md font-500 text-ink-secondary no-underline transition-colors hover:text-teal"
                  aria-current={link.active ? 'page' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <style jsx>{`
        :global(.renty-navbar) {
          transition:
            border-color 300ms cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        :global(.renty-navbar .nav-inner) {
          transition:
            padding-top 300ms cubic-bezier(0.16, 1, 0.3, 1),
            padding-bottom 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        :global(.renty-navbar.is-scrolled) {
          border-color: var(--color-border);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }
        :global(.renty-navbar.is-scrolled .nav-inner) {
          padding-top: 0.625rem;
          padding-bottom: 0.625rem;
        }
        :global(#mobile-nav-menu) {
          overflow: hidden;
          transition:
            max-height 300ms cubic-bezier(0.16, 1, 0.3, 1),
            padding 300ms cubic-bezier(0.16, 1, 0.3, 1),
            opacity 200ms ease;
        }
        :global(#mobile-nav-menu.hidden) {
          max-height: 0;
          padding-top: 0;
          padding-bottom: 0;
          opacity: 0;
          display: block !important;
        }
        :global(#mobile-nav-menu:not(.hidden)) {
          max-height: 400px;
          padding-top: 1rem;
          padding-bottom: 1rem;
          opacity: 1;
        }
      `}</style>
    </>
  );
}
