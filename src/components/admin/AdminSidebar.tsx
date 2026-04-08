'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

const NAV = [
  { href: '/admin', label: 'Resumen', exact: true, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/admin/listings', label: 'Arriendos', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { href: '/admin/cities', label: 'Ciudades', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
  { href: '/admin/usuarios', label: 'Usuarios', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { href: '/admin/verificaciones', label: 'Verificaciones', badge: true, icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
];

export function AdminSidebar({ fullName, avatarUrl, pendingVerifications = 0 }: { fullName: string | null; avatarUrl?: string | null; pendingVerifications?: number }) {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex lg:w-[260px] lg:flex-col lg:border-r lg:border-border/60 lg:bg-white">
      {/* Logo */}
      <div className="flex h-18 items-center border-b border-border/60 px-6">
        <Link href="/admin" className="flex items-center gap-2 no-underline">
          <span className="font-heading text-[20px] font-800 tracking-tight text-ink">renty<span className="text-teal">.</span></span>
          <span className="rounded-md bg-ink px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white">admin</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <div className="mb-2 px-3 font-mono text-[9px] uppercase tracking-widest text-ink-muted">Navegación</div>
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 font-heading text-[14px] no-underline transition-all',
                active
                  ? 'bg-teal/8 font-600 text-teal-dark'
                  : 'text-ink-secondary hover:bg-sand-dark/50 hover:text-ink'
              )}
            >
              <svg
                className={cn('h-4.5 w-4.5 shrink-0', active ? 'text-teal' : 'text-ink-muted')}
                fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
              >
                <path d={item.icon} />
              </svg>
              {item.label}
              {item.badge && pendingVerifications > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1.5 font-mono text-[10px] font-700 text-white">
                  {pendingVerifications}
                </span>
              )}
            </Link>
          );
        })}

        <div className="my-4 h-px bg-border/60" />
        <div className="mb-2 px-3 font-mono text-[9px] uppercase tracking-widest text-ink-muted">Acciones</div>
        <Link
          href="/admin/listings/nuevo"
          className="flex items-center gap-3 rounded-xl bg-teal px-3 py-2.5 font-heading text-[14px] font-600 text-white no-underline transition-all hover:-translate-y-px hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/15"
        >
          <svg className="h-4.5 w-4.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nuevo arriendo
        </Link>
        <Link
          href="/bogota/arriendos"
          className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 font-heading text-[14px] text-ink-muted no-underline transition-colors hover:bg-sand-dark/50 hover:text-ink"
        >
          <svg className="h-4.5 w-4.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" viewBox="0 0 24 24">
            <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Ver marketplace
        </Link>
      </nav>

      {/* User footer */}
      <div className="border-t border-border/60 px-4 py-4">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-sm" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-lighter font-heading text-[13px] font-700 text-teal">
              {fullName?.[0]?.toUpperCase() ?? 'A'}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate font-heading text-[13px] font-600 text-ink">{fullName ?? 'Admin'}</div>
            <div className="font-mono text-[10px] text-ink-muted">Administrador</div>
          </div>
        </div>
        <form action="/auth/logout" method="post" className="mt-3">
          <button
            type="submit"
            className="w-full rounded-lg border border-border bg-sand-dark/30 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-ink-muted transition-colors hover:border-ink/20 hover:text-ink"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
