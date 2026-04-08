'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

const LEGAL_PAGES = [
  { href: '/legal/terminos', label: 'Términos y condiciones' },
  { href: '/legal/privacidad', label: 'Política de privacidad' },
  { href: '/legal/datos', label: 'Tratamiento de datos' },
] as const;

export function LegalNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentos legales" className="mb-10 flex flex-wrap gap-2">
      {LEGAL_PAGES.map((page) => (
        <Link
          key={page.href}
          href={page.href}
          className={cn(
            'rounded-lg px-4 py-2 font-heading text-[13px] font-500 no-underline transition-colors',
            pathname === page.href
              ? 'bg-teal/10 text-teal-dark font-600'
              : 'text-ink-muted hover:bg-sand-dark hover:text-ink-secondary',
          )}
        >
          {page.label}
        </Link>
      ))}
    </nav>
  );
}
