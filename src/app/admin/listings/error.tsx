'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminListingsError({
  error,
  reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[AdminListingsError]', { digest: error.digest, message: error.message });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">Error cargando arriendos</p>
        <h1 className="mt-2 font-display text-[28px] text-ink">No pudimos cargar la lista</h1>
        <p className="mt-2 font-body text-[14px] text-ink-muted">
          Intenta nuevamente. Si el problema persiste, revisa la consola del servidor.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-[10px] text-ink-muted">Código: {error.digest}</p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-ink px-5 py-2 font-mono text-[12px] uppercase tracking-wide text-white hover:bg-ink-secondary"
          >
            Reintentar
          </button>
          <Link
            href="/admin"
            className="rounded-full border border-border bg-white px-5 py-2 font-mono text-[12px] uppercase tracking-wide text-ink no-underline hover:border-ink"
          >
            Volver al panel
          </Link>
        </div>
      </div>
    </div>
  );
}
