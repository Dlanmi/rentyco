'use client';

import { useState } from 'react';
import { Flag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

const REASONS = [
  { value: 'false_info', label: 'Información falsa o incorrecta' },
  { value: 'misleading_price', label: 'Precio engañoso' },
  { value: 'fake_photos', label: 'Fotos falsas o de otro inmueble' },
  { value: 'scam', label: 'Posible estafa' },
] as const;

export function ReportButton({ listingId, variant = 'ghost' }: { listingId: string; variant?: 'ghost' | 'inline' }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) return;
    setSending(true);
    // For now: send report via mailto (can be replaced with server action + DB table later)
    try {
      await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, reason, details }),
      }).catch(() => {
        // Silently fallback — report is best-effort
      });
    } catch {
      // noop
    }
    setSending(false);
    setSent(true);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setSent(false); setReason(''); setDetails(''); } }}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'inline-flex items-center gap-1.5 transition-colors',
          variant === 'ghost'
            ? 'rounded-lg px-3 py-2 text-[13px] text-ink-muted hover:bg-sand-dark hover:text-ink'
            : 'text-[12px] text-ink-muted underline-offset-2 hover:text-ink hover:underline'
        )}
      >
        <Flag className="h-3.5 w-3.5" />
        Reportar
      </button>

      <DialogContent className="max-w-sm p-0 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-coral to-warning" />
        <div className="p-6">
          <DialogClose className="absolute right-4 top-5 rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-sand-dark hover:text-ink">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </DialogClose>

          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal/10">
                <svg className="h-7 w-7 text-teal" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <DialogTitle className="text-center">Gracias por tu reporte</DialogTitle>
              <DialogDescription className="text-center">
                Nuestro equipo lo revisará en las próximas 24 horas. Tu reporte nos ayuda a mantener la plataforma segura.
              </DialogDescription>
              <Button onClick={() => setOpen(false)} variant="subtle" size="md" className="mt-5 w-full">
                Cerrar
              </Button>
            </div>
          ) : (
            <>
              <DialogTitle>Reportar este arriendo</DialogTitle>
              <DialogDescription>
                Selecciona el motivo del reporte. Tu identidad no será compartida con el arrendador.
              </DialogDescription>

              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <fieldset className="space-y-2">
                  {REASONS.map((r) => (
                    <label
                      key={r.value}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-[14px] transition-all',
                        reason === r.value
                          ? 'border-coral bg-coral-light/30 font-500 text-ink'
                          : 'border-border bg-white text-ink-secondary hover:border-coral/30'
                      )}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={r.value}
                        checked={reason === r.value}
                        onChange={() => setReason(r.value)}
                        className="h-4 w-4 border-border text-coral focus:ring-coral/30"
                      />
                      {r.label}
                    </label>
                  ))}
                </fieldset>

                <div>
                  <label htmlFor="report-details" className="mb-1 block text-[12px] font-600 text-ink-secondary">
                    Detalles adicionales <span className="font-400 text-ink-muted">(opcional)</span>
                  </label>
                  <textarea
                    id="report-details"
                    rows={3}
                    maxLength={500}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Cuéntanos más sobre el problema..."
                    className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-muted/50 focus:border-coral"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full bg-coral hover:bg-coral/90"
                  loading={sending}
                  disabled={!reason}
                >
                  Enviar reporte
                </Button>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
