'use client';

import { useState } from 'react';
import { ShieldCheck, ChevronDown, CheckCircle2, Clock, FileText, User } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';
import { VerificationUpload } from '@/components/renty-score/VerificationUpload';
import type { VerificationRow } from '@/lib/db/verifications.repository';

interface Props {
  verified: boolean;
  verifications: VerificationRow[];
}

const STEPS = [
  {
    key: 'identity' as const,
    label: 'Cédula de identidad',
    description: 'Sube una foto clara de tu cédula (ambos lados).',
    icon: User,
  },
  {
    key: 'property_proof' as const,
    label: 'Soporte de propiedad',
    description: 'Escritura, certificado de libertad y tradición, o contrato de arrendamiento que te acredite como propietario.',
    icon: FileText,
  },
] as const;

function getStepStatus(verifications: VerificationRow[], type: string) {
  const v = verifications.find((r) => r.type === type);
  return v ?? null;
}

export function LandlordVerificationBanner({ verified, verifications }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [openStep, setOpenStep] = useState<string | null>(null);

  // Already verified
  if (verified) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-teal/20 bg-teal-lighter/30 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10">
          <Icon icon={CheckCircle2} className="h-5 w-5 text-teal" />
        </div>
        <div>
          <h3 className="font-heading text-md font-600 text-teal-dark">Perfil verificado</h3>
          <p className="mt-0.5 text-label text-ink-secondary">
            Tus listings muestran el badge de arrendador verificado.
          </p>
        </div>
      </div>
    );
  }

  const completedCount = STEPS.filter((s) => {
    const v = getStepStatus(verifications, s.key);
    return v && (v.status === 'verified' || v.status === 'completed');
  }).length;

  const hasAnyInReview = STEPS.some((s) => {
    const v = getStepStatus(verifications, s.key);
    return v && ['uploaded', 'submitted'].includes(v.status);
  });

  return (
    <div className="mb-6 rounded-2xl border border-border bg-white">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-4 p-5 text-left"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal/10">
          <Icon icon={ShieldCheck} className="h-6 w-6 text-teal" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-md font-600 text-ink">
            Verifica tu perfil de arrendador
          </h3>
          <p className="mt-0.5 text-label text-ink-secondary">
            {hasAnyInReview
              ? 'Tu verificación está en revisión. Te notificaremos cuando sea aprobada.'
              : 'Los inquilinos confían más en arrendadores verificados. Sube tu cédula y soporte de propiedad.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-sand-dark px-2 py-0.5 font-mono text-[11px] font-600 text-ink-muted">
            {completedCount}/{STEPS.length}
          </span>
          <Icon icon={ChevronDown} className={cn('h-5 w-5 text-ink-muted transition-transform', expanded && 'rotate-180')} />
        </div>
      </button>

      {/* Expandable checklist */}
      {expanded && (
        <div className="border-t border-border px-5 pb-5 pt-3">
          <div className="space-y-3">
            {STEPS.map((step) => {
              const v = getStepStatus(verifications, step.key);
              const status = v?.status ?? 'pending';
              const isVerified = status === 'verified' || status === 'completed';
              const isInReview = ['uploaded', 'submitted'].includes(status);
              const isRejected = status === 'rejected';
              const isOpen = openStep === step.key;
              const StepIcon = step.icon;

              return (
                <div key={step.key} className="rounded-xl border border-border">
                  <button
                    type="button"
                    disabled={isVerified}
                    onClick={() => setOpenStep(isOpen ? null : step.key)}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-3 text-left',
                      isVerified && 'opacity-70',
                    )}
                  >
                    <div className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                      isVerified ? 'bg-teal/10 text-teal' : isInReview ? 'bg-warning/10 text-warning' : 'bg-sand-dark text-ink-muted',
                    )}>
                      {isVerified ? <Icon icon={CheckCircle2} className="h-4 w-4" /> : isInReview ? <Icon icon={Clock} className="h-4 w-4" /> : <Icon icon={StepIcon} className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-heading text-[14px] font-600 text-ink">{step.label}</span>
                      <span className="ml-2 text-[11px] text-ink-muted">
                        {isVerified ? 'Verificado' : isInReview ? 'En revisión' : isRejected ? 'Rechazado' : 'Pendiente'}
                      </span>
                    </div>
                    {!isVerified && (
                      <Icon icon={ChevronDown} className={cn('h-4 w-4 text-ink-muted transition-transform', isOpen && 'rotate-180')} />
                    )}
                  </button>

                  {isOpen && !isVerified && (
                    <div className="border-t border-border px-4 py-3">
                      <p className="mb-3 text-label text-ink-secondary">{step.description}</p>
                      <VerificationUpload
                        type={step.key}
                        existingStatus={status}
                        rejectionNote={isRejected ? String((v?.metadata as Record<string, unknown>)?.review_note ?? '') : undefined}
                        context="landlord"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
