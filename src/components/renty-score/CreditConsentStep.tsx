'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { submitCreditConsent } from '@/app/actions/verifications';
import { CheckCircle2, Shield, Info } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface Props {
  existingStatus: string;
}

export function CreditConsentStep({ existingStatus }: Props) {
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isConsented = existingStatus === 'consented' || existingStatus === 'verified' || existingStatus === 'completed';

  if (success || isConsented) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-teal-lighter/30 px-3 py-2 text-label text-teal-dark">
        <Icon icon={CheckCircle2} className="h-4 w-4" />
        Autorización registrada. Consultaremos tu historial crediticio.
      </div>
    );
  }

  async function handleConsent() {
    setError(null);
    setSaving(true);

    const result = await submitCreditConsent();
    setSaving(false);

    if (result.ok) {
      setSuccess(true);
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-sand-dark/20 p-3">
        <div className="flex items-start gap-2">
          <Icon icon={Shield} className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
          <div className="text-label leading-relaxed text-ink-secondary">
            Al autorizar, permites que Renty consulte tu historial en centrales de riesgo
            (Datacrédito, TransUnion) exclusivamente para calcular tu Renty Score.
            Tus datos se manejan según nuestra{' '}
            <Link href="/legal/privacidad" className="text-teal underline" target="_blank" rel="noopener">
              política de privacidad
            </Link>.
          </div>
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-label text-ink-muted">
        <Icon icon={Info} className="h-3.5 w-3.5 shrink-0" />
        Esta es una consulta blanda (soft inquiry) — no afecta tu puntaje en Datacrédito ni TransUnion.
      </p>

      <label className="flex cursor-pointer items-start gap-2">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-5 w-5 rounded border-border text-teal focus:ring-teal/30"
        />
        <span className="text-label text-ink-secondary">
          Autorizo a Renty a consultar mi historial crediticio
        </span>
      </label>

      {error && <p className="text-[12px] text-error">{error}</p>}

      <Button
        variant="primary"
        size="sm"
        disabled={!agreed}
        loading={saving}
        onClick={handleConsent}
      >
        Autorizar consulta
      </Button>
    </div>
  );
}
