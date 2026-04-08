'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import type { UserRole } from '@/types/domain';

interface NavItem {
  href: string;
  label: string;
  exact?: boolean;
  icon: string;
}

const BASE_NAV: NavItem[] = [
  { href: '/cuenta', label: 'Inicio', exact: true, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1' },
  { href: '/cuenta/favoritos', label: 'Favoritos', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { href: '/cuenta/mensajes', label: 'Mensajes', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
];

const LANDLORD_NAV: NavItem[] = [
  { href: '/cuenta/publicaciones', label: 'Mis arriendos', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
];

const SCORE_ICON = 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z';

function getScoreNav(hasScore: boolean): NavItem[] {
  return [
    {
      href: hasScore ? '/cuenta/mi-score' : '/renty-score/formulario',
      label: 'Mi Score',
      icon: SCORE_ICON,
    },
  ];
}

const TAIL_NAV: NavItem[] = [
  { href: '/cuenta/perfil', label: 'Perfil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

function NavIcon({ d, className }: { d: string; className?: string }) {
  return (
    <svg className={cn('h-5 w-5 shrink-0', className)} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d={d} />
    </svg>
  );
}

export function DashboardSidebar({
  role,
  fullName,
  avatarUrl,
  hasScore = false,
}: {
  role: UserRole;
  fullName: string | null;
  avatarUrl?: string | null;
  hasScore?: boolean;
}) {
  const pathname = usePathname();
  const isLandlord = role === 'landlord' || role === 'admin';
  const items = [...BASE_NAV, ...getScoreNav(hasScore), ...(isLandlord ? LANDLORD_NAV : []), ...TAIL_NAV];

  const initials = fullName
    ? fullName.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '·';

  return (
    <aside className="hidden lg:block lg:w-56 lg:shrink-0">
      <div className="sticky top-[88px] flex flex-col gap-1">
        {/* User card */}
        <div className="mb-3 flex items-center gap-3 px-3 py-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink text-white">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="font-heading text-[13px] font-700">{initials}</span>
            )}
          </div>
          <div className="min-w-0">
            <div className="truncate font-heading text-[14px] font-600 text-ink">{fullName ?? 'Mi cuenta'}</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              {role === 'admin' ? 'Admin' : role === 'landlord' ? 'Arrendador' : 'Inquilino'}
            </div>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Nav items */}
        <nav className="mt-1 flex flex-col gap-0.5">
          {items.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 font-heading text-[14px] no-underline transition-all duration-150',
                  active
                    ? 'bg-sand-dark font-600 text-ink'
                    : 'text-ink-secondary hover:bg-sand-dark/50 hover:text-ink'
                )}
              >
                <NavIcon d={item.icon} className={active ? 'text-teal' : 'text-ink-muted'} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {isLandlord && (
          <>
            <div className="my-2 h-px bg-border" />
            <Link
              href="/cuenta/publicaciones/nuevo"
              className="flex items-center justify-center gap-2 rounded-xl bg-teal px-4 py-2.5 font-heading text-[13px] font-600 text-white no-underline transition-all hover:-translate-y-px hover:bg-teal-dark hover:shadow-md hover:shadow-teal/15"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
              Publicar arriendo
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}

export function DashboardTabs({ role, hasScore = false }: { role: UserRole; hasScore?: boolean }) {
  const pathname = usePathname();
  const isLandlord = role === 'landlord' || role === 'admin';
  const scoreHref = hasScore ? '/cuenta/mi-score' : '/renty-score/formulario';
  const items: { href: string; label: string; exact?: boolean; icon: string }[] = [
    { href: '/cuenta', label: 'Inicio', exact: true, icon: 'M3 12l9-9 9 9M5 10v10h14V10' },
    { href: '/cuenta/favoritos', label: 'Favoritos', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { href: scoreHref, label: 'Score', icon: SCORE_ICON },
    { href: '/cuenta/mensajes', label: 'Mensajes', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    ...(isLandlord ? [{ href: '/cuenta/publicaciones', label: 'Arriendos', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' }] : []),
    { href: '/cuenta/perfil', label: 'Perfil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  return (
    <div className="-mx-6 overflow-x-auto border-b border-border px-6 lg:hidden">
      <div className="flex gap-0.5 py-1.5">
        {items.map((i) => {
          const active = i.exact ? pathname === i.href : pathname.startsWith(i.href);
          return (
            <Link
              key={i.href}
              href={i.href}
              className={cn(
                'flex shrink-0 flex-col items-center gap-1 rounded-lg px-4 py-2 no-underline transition-colors',
                active ? 'text-teal' : 'text-ink-muted hover:text-ink-secondary'
              )}
            >
              <NavIcon d={i.icon} className={cn('h-5 w-5', active ? 'text-teal' : 'text-ink-muted')} />
              <span className={cn('font-mono text-[10px] uppercase tracking-wider', active && 'font-700')}>
                {i.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
