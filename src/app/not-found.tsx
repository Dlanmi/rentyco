import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-6 animate-in fade-in duration-500 fill-mode-both">
      <div className="max-w-md text-center">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">404</p>
        <h1 className="mt-2 font-display text-[32px] text-ink">Página no encontrada</h1>
        <p className="mt-2 font-body text-[14px] text-ink-muted">
          La página que buscas no existe o fue movida.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-ink px-5 py-2 font-mono text-[12px] uppercase tracking-wide text-white no-underline hover:bg-ink-secondary"
          >
            Ir al inicio
          </Link>
          <Link
            href="/bogota/arriendos"
            className="rounded-full border border-border bg-white px-5 py-2 font-mono text-[12px] uppercase tracking-wide text-ink no-underline hover:border-ink"
          >
            Ver arriendos
          </Link>
        </div>
      </div>
    </div>
  );
}
