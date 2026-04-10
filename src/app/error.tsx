'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[GlobalError]', { digest: error.digest, message: error.message });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">Error inesperado</p>
        <h1 className="mt-2 font-display text-[32px] text-ink">Algo salió mal</h1>
        <p className="mt-2 font-body text-[14px] text-ink-muted">
          Intenta nuevamente. Si el problema persiste, contáctanos.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-[10px] text-ink-muted">
            Código: {error.digest}
          </p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-ink px-5 py-2 font-mono text-[12px] uppercase tracking-wide text-white hover:bg-ink-secondary"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="rounded-full border border-border bg-white px-5 py-2 font-mono text-[12px] uppercase tracking-wide text-ink no-underline hover:border-ink"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
