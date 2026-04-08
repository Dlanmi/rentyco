'use client';

import { useState, useTransition } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { reviewVerification } from '@/app/actions/verifications';
import {
  FileText,
  User,
  Phone,
  CreditCard,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Clock,
  Filter,
} from 'lucide-react';

export type QueueItem = {
  id: string;
  user_id: string;
  type: string;
  status: string;
  metadata: Record<string, unknown>;
  r2_key: string | null;
  doc_url: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  user_name: string | null;
  user_cedula: string | null;
  user_score: number | null;
};

const TYPE_LABELS: Record<string, { label: string; icon: typeof FileText; shortLabel: string }> = {
  identity: { label: 'Verificación de identidad', icon: User, shortLabel: 'Identidad' },
  income_proof: { label: 'Soporte de ingresos', icon: FileText, shortLabel: 'Ingresos' },
  landlord_reference: { label: 'Referencia de arrendador', icon: Phone, shortLabel: 'Referencia' },
  credit_consent: { label: 'Autorización crediticia', icon: CreditCard, shortLabel: 'Crediticia' },
};

const STATUS_VARIANTS: Record<string, 'success' | 'warning' | 'neutral'> = {
  verified: 'success',
  completed: 'success',
  rejected: 'neutral',
  submitted: 'warning',
  uploaded: 'warning',
  contacted: 'warning',
  consented: 'warning',
};

const STATUS_LABELS: Record<string, string> = {
  verified: 'Aprobado',
  completed: 'Completado',
  rejected: 'Rechazado',
  submitted: 'Enviado',
  uploaded: 'Subido',
  contacted: 'Contactado',
  consented: 'Autorizado',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ReviewCard({ item, onReviewed }: { item: QueueItem; onReviewed: (id: string) => void }) {
  const [pending, start] = useTransition();
  const [note, setNote] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const typeInfo = TYPE_LABELS[item.type];
  const Icon = typeInfo?.icon ?? FileText;
  const meta = item.metadata ?? {};

  function handleAction(action: 'approve' | 'reject') {
    start(async () => {
      const res = await reviewVerification({
        verificationId: item.id,
        action,
        note: note.trim() || undefined,
      });
      if (res.ok) {
        const label = action === 'approve' ? 'Aprobado' : 'Rechazado';
        const extra = res.data.newTotal != null ? ` — Nuevo score: ${res.data.newTotal}` : '';
        setResult(`${label}${extra}`);
        onReviewed(item.id);
      }
    });
  }

  if (result) {
    return (
      <div className="rounded-xl border border-teal/20 bg-teal-lighter/20 p-4">
        <div className="flex items-center gap-2 text-[14px] text-teal-dark">
          <CheckCircle2 className="h-4 w-4" />
          {result}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white">
      {/* Header */}
      <div className="flex items-start gap-3 border-b border-border/60 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-heading text-[14px] font-600 text-ink">
            {typeInfo?.label ?? item.type}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[12px] text-ink-muted">
            <span>{item.user_name ?? 'Usuario desconocido'}</span>
            {item.user_cedula && <span>· CC {item.user_cedula}</span>}
            {item.user_score != null && <span>· Score: {item.user_score}</span>}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <Badge variant="warning">{STATUS_LABELS[item.status] ?? item.status}</Badge>
          <div className="mt-1 text-[10px] text-ink-muted">{formatDate(item.created_at)}</div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 p-4">
        {/* Document link */}
        {item.doc_url && (
          <a
            href={item.doc_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-sand-dark/50 px-3 py-1.5 text-[13px] font-500 text-teal-dark transition-colors hover:bg-sand-dark"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Ver documento
          </a>
        )}

        {/* Landlord reference metadata */}
        {item.type === 'landlord_reference' && (
          <div className="rounded-lg bg-sand-dark/30 px-3 py-2 text-[13px] text-ink-secondary">
            <div><span className="font-600">Arrendador:</span> {String(meta.landlord_name ?? '')}</div>
            <div><span className="font-600">Teléfono:</span> {String(meta.landlord_phone ?? '')}</div>
            <div><span className="font-600">Dirección:</span> {String(meta.previous_address ?? '')}</div>
          </div>
        )}

        {/* Credit consent metadata */}
        {item.type === 'credit_consent' && typeof meta.consented_at === 'string' && (
          <div className="text-[13px] text-ink-muted">
            Autorizado el {formatDate(String(meta.consented_at ?? ''))}
          </div>
        )}

        {/* Review actions */}
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nota de revisión (opcional)"
              className="w-full rounded-lg border border-border bg-white px-3 py-1.5 text-[13px] text-ink placeholder:text-ink-muted/50 focus:border-teal focus:outline-none"
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            loading={pending}
            onClick={() => handleAction('approve')}
            leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
          >
            Aprobar
          </Button>
          <Button
            variant="danger"
            size="sm"
            loading={pending}
            onClick={() => handleAction('reject')}
            leftIcon={<XCircle className="h-3.5 w-3.5" />}
          >
            Rechazar
          </Button>
        </div>
      </div>
    </div>
  );
}

function HistoryCard({ item }: { item: QueueItem }) {
  const typeInfo = TYPE_LABELS[item.type];
  const Icon = typeInfo?.icon ?? FileText;
  const meta = item.metadata ?? {};
  const isApproved = item.status === 'verified' || item.status === 'completed';
  const reviewNote = typeof meta.review_note === 'string' ? meta.review_note : null;

  return (
    <div className={cn('rounded-xl border bg-white', isApproved ? 'border-teal/20' : 'border-border')}>
      <div className="flex items-start gap-3 p-4">
        <div className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
          isApproved ? 'bg-teal/10 text-teal' : 'bg-sand-dark text-ink-muted'
        )}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-heading text-[14px] font-600 text-ink">
              {typeInfo?.label ?? item.type}
            </span>
            <Badge variant={STATUS_VARIANTS[item.status] ?? 'neutral'}>
              {STATUS_LABELS[item.status] ?? item.status}
            </Badge>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[12px] text-ink-muted">
            <span>{item.user_name ?? 'Usuario desconocido'}</span>
            {item.user_cedula && <span>· CC {item.user_cedula}</span>}
            {item.user_score != null && <span>· Score: {item.user_score}</span>}
          </div>
          {reviewNote && (
            <p className="mt-1.5 rounded-lg bg-sand-dark/30 px-2.5 py-1.5 text-[12px] text-ink-secondary">
              Nota: {reviewNote}
            </p>
          )}
        </div>
        <div className="shrink-0 text-right text-[10px] text-ink-muted">
          {item.reviewed_at && <div>Revisado {formatDate(item.reviewed_at)}</div>}
          <div>Enviado {formatDate(item.created_at)}</div>
        </div>
      </div>
    </div>
  );
}

type Tab = 'pending' | 'history';
type TypeFilter = 'all' | string;

export function VerificationReviewList({
  initialQueue,
  initialHistory,
}: {
  initialQueue: QueueItem[];
  initialHistory: QueueItem[];
}) {
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<Tab>('pending');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const pending = initialQueue.filter((item) => !reviewed.has(item.id));
  const filteredPending = typeFilter === 'all' ? pending : pending.filter((i) => i.type === typeFilter);
  const filteredHistory = typeFilter === 'all' ? initialHistory : initialHistory.filter((i) => i.type === typeFilter);

  const types = Object.entries(TYPE_LABELS);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border">
        <button
          type="button"
          onClick={() => setTab('pending')}
          className={cn(
            'relative pb-2.5 font-heading text-[14px] font-600 transition-colors',
            tab === 'pending' ? 'text-teal' : 'text-ink-muted hover:text-ink',
          )}
        >
          Pendientes
          {pending.length > 0 && (
            <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 font-mono text-[10px] font-700 text-white">
              {pending.length}
            </span>
          )}
          {tab === 'pending' && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-teal" />}
        </button>
        <button
          type="button"
          onClick={() => setTab('history')}
          className={cn(
            'relative pb-2.5 font-heading text-[14px] font-600 transition-colors',
            tab === 'history' ? 'text-teal' : 'text-ink-muted hover:text-ink',
          )}
        >
          <Clock className="mr-1 inline h-3.5 w-3.5" />
          Historial
          {tab === 'history' && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-teal" />}
        </button>
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-3.5 w-3.5 text-ink-muted" />
        <button
          type="button"
          onClick={() => setTypeFilter('all')}
          className={cn(
            'rounded-full px-2.5 py-1 text-[11px] font-600 transition-colors',
            typeFilter === 'all' ? 'bg-teal/10 text-teal-dark' : 'bg-sand-dark text-ink-muted hover:text-ink',
          )}
        >
          Todos
        </button>
        {types.map(([key, info]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTypeFilter(key)}
            className={cn(
              'rounded-full px-2.5 py-1 text-[11px] font-600 transition-colors',
              typeFilter === key ? 'bg-teal/10 text-teal-dark' : 'bg-sand-dark text-ink-muted hover:text-ink',
            )}
          >
            {info.shortLabel}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'pending' && (
        <>
          {filteredPending.length === 0 && (
            <div className="rounded-xl border border-border bg-white py-12 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-teal" />
              <p className="mt-2 text-[14px] text-ink-muted">
                {pending.length === 0
                  ? 'Todas las verificaciones han sido revisadas.'
                  : 'No hay verificaciones de este tipo pendientes.'}
              </p>
            </div>
          )}
          {filteredPending.map((item) => (
            <ReviewCard
              key={item.id}
              item={item}
              onReviewed={(id) => setReviewed((prev) => new Set(prev).add(id))}
            />
          ))}
        </>
      )}

      {tab === 'history' && (
        <>
          {filteredHistory.length === 0 && (
            <div className="rounded-xl border border-border bg-white py-12 text-center">
              <Clock className="mx-auto h-8 w-8 text-ink-muted" />
              <p className="mt-2 text-[14px] text-ink-muted">
                {initialHistory.length === 0
                  ? 'No hay verificaciones revisadas aún.'
                  : 'No hay verificaciones de este tipo en el historial.'}
              </p>
            </div>
          )}
          {filteredHistory.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </>
      )}
    </div>
  );
}
