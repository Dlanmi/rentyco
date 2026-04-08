'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { VerificationUpload } from './VerificationUpload';
import { LandlordReferenceForm } from './LandlordReferenceForm';
import { CreditConsentStep } from './CreditConsentStep';
import {
  ShieldCheck,
  FileText,
  User,
  Phone,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
} from 'lucide-react';
import type { VerificationRow } from '@/lib/db/verifications.repository';

interface Props {
  verifications: VerificationRow[];
  scoreId: string | null;
}

type Step = 'identity' | 'income_proof' | 'landlord_reference' | 'credit_consent';

const STEPS: { key: Step; label: string; description: string; icon: typeof ShieldCheck }[] = [
  {
    key: 'income_proof',
    label: 'Soporte de ingresos',
    description: 'Extracto bancario, certificado laboral o declaración de renta',
    icon: FileText,
  },
  {
    key: 'landlord_reference',
    label: 'Referencia de arrendador',
    description: 'Nombre, teléfono y dirección de tu anterior arrendador',
    icon: Phone,
  },
  {
    key: 'identity',
    label: 'Verificación de identidad',
    description: 'Foto de tu cédula (ambos lados)',
    icon: User,
  },
  {
    key: 'credit_consent',
    label: 'Autorización crediticia',
    description: 'Autoriza la consulta en centrales de riesgo',
    icon: CreditCard,
  },
];

const STATUS_DISPLAY: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  verified: { label: 'Verificado', color: 'text-teal', icon: CheckCircle2 },
  completed: { label: 'Completado', color: 'text-teal', icon: CheckCircle2 },
  uploaded: { label: 'En revisión', color: 'text-warning', icon: Clock },
  submitted: { label: 'Enviado', color: 'text-warning', icon: Clock },
  contacted: { label: 'En proceso', color: 'text-warning', icon: Clock },
  consented: { label: 'Autorizado', color: 'text-warning', icon: Clock },
  rejected: { label: 'Rechazado', color: 'text-error', icon: XCircle },
  pending: { label: 'Pendiente', color: 'text-ink-muted', icon: Clock },
};

function getStatusForType(verifications: VerificationRow[], type: Step) {
  return verifications.find((v) => v.type === type);
}

function isTerminal(status: string) {
  return status === 'verified' || status === 'completed';
}

export function VerificationChecklist({ verifications, scoreId }: Props) {
  const [expanded, setExpanded] = useState<Step | null>(null);

  const completedCount = STEPS.filter((s) => {
    const v = getStatusForType(verifications, s.key);
    return v && isTerminal(v.status);
  }).length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-teal" />
          <h2 className="font-heading text-[17px] font-600 text-ink">Verificaciones</h2>
        </div>
        <span className="rounded-full bg-teal/10 px-2.5 py-0.5 text-[12px] font-600 text-teal">
          {completedCount}/{STEPS.length}
        </span>
      </div>

      <p className="text-[13px] leading-relaxed text-ink-muted">
        Cada verificación aumenta tu factor de confianza y sube tu score.
        Tu score comienza en 50% y crece con cada paso que completes.
      </p>

      {/* Steps */}
      <div className="space-y-2">
        {STEPS.map((step) => {
          const verification = getStatusForType(verifications, step.key);
          const status = verification?.status ?? 'pending';
          const display = STATUS_DISPLAY[status] ?? STATUS_DISPLAY.pending!;
          const isExpanded = expanded === step.key;
          const isVerified = isTerminal(status);
          const Icon = step.icon;
          const StatusIcon = display.icon;

          return (
            <div
              key={step.key}
              className={cn(
                'rounded-xl border transition-all',
                isVerified ? 'border-teal/20 bg-teal-lighter/20' : 'border-border bg-white',
              )}
            >
              {/* Step header */}
              <button
                type="button"
                onClick={() => setExpanded(isExpanded ? null : step.key)}
                disabled={isVerified}
                className={cn(
                  'flex w-full items-center gap-3 p-4 text-left',
                  !isVerified && 'cursor-pointer',
                )}
              >
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                    isVerified ? 'bg-teal/10 text-teal' : 'bg-sand-dark text-ink-muted',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-heading text-[14px] font-600 text-ink">{step.label}</div>
                  <div className="mt-0.5 text-[12px] text-ink-muted">{step.description}</div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <StatusIcon className={cn('h-4 w-4', display.color)} />
                  <span className={cn('text-[11px] font-600', display.color)}>{display.label}</span>
                  {!isVerified && (
                    <ChevronDown
                      className={cn(
                        'ml-1 h-4 w-4 text-ink-muted transition-transform',
                        isExpanded && 'rotate-180',
                      )}
                    />
                  )}
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && !isVerified && (
                <div className="border-t border-border/60 px-4 pb-4 pt-3">
                  {(step.key === 'identity' || step.key === 'income_proof') && (
                    <VerificationUpload
                      type={step.key}
                      existingStatus={status}
                      rejectionNote={
                        status === 'rejected'
                          ? ((verification?.metadata as Record<string, unknown>)?.review_note as string) ?? undefined
                          : undefined
                      }
                    />
                  )}
                  {step.key === 'landlord_reference' && (
                    <LandlordReferenceForm
                      existingStatus={status}
                      existingData={verification?.metadata as Record<string, string> | undefined}
                      rejectionNote={
                        status === 'rejected'
                          ? ((verification?.metadata as Record<string, unknown>)?.review_note as string) ?? undefined
                          : undefined
                      }
                    />
                  )}
                  {step.key === 'credit_consent' && (
                    <CreditConsentStep existingStatus={status} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
