import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Entrar',
  description: 'Accede a tu cuenta Renty con magic link o Google.',
  robots: { index: false, follow: false },
};

export default function EntrarPage() {
  return (
    <main className="min-h-screen bg-sand">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        <aside className="hidden flex-col justify-between bg-sand-dark p-12 lg:flex">
          <Link href="/" className="font-display text-[24px] text-ink no-underline">
            Renty<span className="text-coral">.</span>
          </Link>
          <div className="max-w-md">
            <span className="mb-4 block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-teal">
              Arriendo sin codeudor
            </span>
            <h1 className="font-display text-[clamp(2rem,4vw,2.8rem)] leading-tight text-ink">
              Tu historial real,<br />finalmente cuenta.
            </h1>
            <p className="mt-4 font-body text-[15px] leading-relaxed text-ink-secondary">
              Entra para guardar inmuebles, contactar arrendadores y seguir tu score.
            </p>
          </div>
          <div className="font-mono text-[11px] text-ink-muted">
            © {new Date().getFullYear()} Renty — Bogotá, Colombia
          </div>
        </aside>

        <section className="flex items-center justify-center px-6 py-16 lg:px-12">
          <div className="w-full max-w-md">
            <Link href="/" className="mb-8 inline-flex font-display text-[20px] text-ink no-underline lg:hidden">
              Renty<span className="text-coral">.</span>
            </Link>
            <h2 className="font-display text-[28px] leading-tight text-ink">Entrar a Renty</h2>
            <p className="mb-8 mt-2 font-body text-[14px] text-ink-muted">
              Te enviaremos un enlace mágico, sin contraseñas.
            </p>
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
            <p className="mt-6 font-body text-[12px] leading-relaxed text-ink-muted">
              Al continuar aceptas nuestros{' '}
              <Link href="/legal/terminos" className="text-teal-dark underline">Términos</Link>
              {' '}y{' '}
              <Link href="/legal/privacidad" className="text-teal-dark underline">Política de privacidad</Link>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
