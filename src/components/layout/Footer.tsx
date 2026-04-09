import Link from 'next/link';
import { ShieldCheck, Lock } from 'lucide-react';
import { SITE, SOCIAL } from '@/lib/site';

const cols = [
  {
    title: 'Producto',
    links: [
      { label: 'Cómo funciona', href: '/como-funciona' },
      { label: 'Renty Score', href: '/renty-score' },
      { label: 'Para inquilinos', href: '/inquilinos' },
      { label: 'Para arrendadores', href: '/arrendadores' },
      { label: 'Arriendos en Bogotá', href: '/bogota/arriendos' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Nosotros', href: '/nosotros' },
      { label: 'Blog', href: '/blog' },
      { label: 'Calcula tu score', href: '/renty-score/formulario' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Términos de servicio', href: '/legal/terminos' },
      { label: 'Política de privacidad', href: '/legal/privacidad' },
      { label: 'Tratamiento de datos', href: '/legal/datos' },
    ],
  },
] as const;

const socialLinks = [
  {
    href: SOCIAL.twitter,
    label: 'Renty en X (Twitter)',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: SOCIAL.instagram,
    label: 'Renty en Instagram',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: SOCIAL.linkedin,
    label: 'Renty en LinkedIn',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-sand-dark py-14 lg:pt-16 lg:pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col justify-between gap-10 pb-10 lg:flex-row lg:gap-16">
          <div className="max-w-xs">
            <Link
              href="/"
              className="font-heading text-xl font-800 tracking-tight text-ink no-underline"
            >
              renty<span className="text-teal">.</span>
            </Link>
            <p className="mt-3 font-body text-[14px] leading-relaxed text-ink-muted">
              El arriendo sin barreras. Tu historial de pago es tu mejor garantía.
            </p>
            {/* Social icons */}
            <div className="mt-4 flex items-center gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-sand text-ink-muted transition-colors hover:bg-teal-lighter hover:text-teal"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-8 sm:flex-row sm:gap-14">
            {cols.map((col) => (
              <div key={col.title} className="flex flex-col gap-2">
                <span className="mb-1 font-heading text-[12px] font-600 tracking-[0.06em] uppercase text-ink-secondary">
                  {col.title}
                </span>
                {col.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="py-1.5 font-body text-[14px] text-ink-muted no-underline transition-colors duration-200 hover:text-ink"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 border-t border-border py-6 sm:justify-start">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-teal" />
            <span className="font-mono text-[11px] text-ink-muted">Ley 1581 de 2012</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-teal" />
            <span className="font-mono text-[11px] text-ink-muted">Datos encriptados</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 32 24" fill="none" aria-hidden="true">
              <rect width="32" height="12" fill="#FCD116" />
              <rect y="12" width="32" height="6" fill="#003893" />
              <rect y="18" width="32" height="6" fill="#CE1126" />
            </svg>
            <span className="font-mono text-[11px] text-ink-muted">Hecho en Colombia</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <span className="font-body text-[12px] text-ink-muted">
              &copy; 2026 Renty. Hecho en Colombia.
            </span>
            <span className="flex items-center gap-1.5 font-body text-[11px] text-ink-muted/70">
              <ShieldCheck className="h-3.5 w-3.5 text-teal/60" />
              Tus datos protegidos bajo la Ley 1581 de 2012 · Encriptados en tránsito y en reposo
            </span>
          </div>
          <div className="flex items-center gap-2 font-body text-[12px] text-ink-muted">
            <span>Contacto:</span>
            <a
              href={`mailto:${SITE.email}`}
              className="text-ink-secondary no-underline transition-colors duration-200 hover:text-teal"
            >
              {SITE.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
