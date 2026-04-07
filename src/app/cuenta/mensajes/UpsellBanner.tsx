'use client';

import { useState, useEffect } from 'react';
import { Building2, X } from 'lucide-react';

const DISMISS_KEY = 'renty-upsell-dismissed';

export function UpsellBanner() {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === '1');
    } catch { /* incognito */ }
  }, []);

  if (dismissed) return null;

  function handleDismiss() {
    setDismissed(true);
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch { /* ok */ }
  }

  return (
    <div className="relative mb-4 rounded-2xl border border-teal/15 bg-teal-lighter/30 p-4 sm:p-5">
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-3 top-3 rounded-lg p-1 text-ink-muted transition-colors hover:bg-teal-lighter hover:text-ink"
        aria-label="Cerrar"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3 pr-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
          <Building2 className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="font-heading text-[14px] font-600 text-ink">
            ¿Quieres que gestionemos tus arriendos?
          </p>
          <p className="mt-0.5 font-body text-[13px] leading-relaxed text-ink-secondary">
            Con el Plan Gestión verificamos documentos, cobramos el arriendo y gestionamos todo el proceso por ti.
          </p>
          {/* TODO: link to dedicated management plan page once it exists */}
          <span className="mt-2 inline-flex items-center gap-1 font-heading text-[12px] font-600 text-teal-dark">
            Próximamente
          </span>
        </div>
      </div>
    </div>
  );
}
