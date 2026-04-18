'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { submitRentyScore } from '@/app/actions/renty-score';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

const PENDING_KEY = 'renty-score-pending';
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

type PendingScore = {
  savedAt: number;
  submission: {
    nombre: string;
    cedula: string;
    tipoUsuario: string;
    inmuebleBusca?: string;
    canonMensual: number | null;
    ingresoHogar: number | null;
    answers: Record<string, string>;
    score: {
      total: number;
      scoreA: number;
      scoreB: number;
      scoreC: number;
      scoreD: number;
      penalties: number;
      color: string;
    };
  };
};

export function ScoreRecovery() {
  const router = useRouter();
  const [state, setState] = useState<'checking' | 'recovering' | 'empty' | 'error'>('checking');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function recover() {
      // Check localStorage for pending score
      let pending: PendingScore | null = null;
      try {
        const raw = localStorage.getItem(PENDING_KEY);
        if (raw) {
          pending = JSON.parse(raw) as PendingScore;
          // Check expiry
          if (!pending.savedAt || Date.now() - pending.savedAt > MAX_AGE_MS) {
            localStorage.removeItem(PENDING_KEY);
            pending = null;
          }
        }
      } catch {
        pending = null;
      }

      if (!pending) {
        if (!cancelled) setState('empty');
        return;
      }

      // Found pending score — attempt recovery
      if (!cancelled) setState('recovering');

      try {
        const res = await submitRentyScore(pending.submission);
        if (cancelled) return;

        if (res.success) {
          // Clear pending data
          try { localStorage.removeItem(PENDING_KEY); } catch { /* ok */ }
          // Refresh the page — server component will find the score and render ScoreDetailView
          router.refresh();
        } else {
          setErrorMsg(res.error ?? 'No pudimos guardar tu score.');
          setState('error');
        }
      } catch {
        if (!cancelled) {
          setErrorMsg('Error de conexión. Intenta de nuevo.');
          setState('error');
        }
      }
    }

    recover();
    return () => { cancelled = true; };
  }, [router]);

  if (state === 'checking') {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Icon icon={Loader2} className="h-6 w-6 animate-spin text-teal" />
      </div>
    );
  }

  if (state === 'recovering') {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-lighter">
          <Icon icon={Loader2} className="h-6 w-6 animate-spin text-teal" />
        </div>
        <h2 className="font-display text-xl text-ink">Recuperando tu score\u2026</h2>
        <p className="text-sm text-ink-muted">Ya casi está listo.</p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-error/10">
          <Icon icon={ShieldCheck} className="h-6 w-6 text-error" />
        </div>
        <h2 className="font-display text-xl text-ink">No pudimos recuperar tu score</h2>
        <p className="max-w-md text-sm text-ink-muted">{errorMsg}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="primary"
            onClick={() => {
              setState('checking');
              router.refresh();
            }}
          >
            Reintentar
          </Button>
          <Link href="/renty-score/formulario">
            <Button variant="outline">Calcular de nuevo</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Empty state — no pending score found
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-lighter">
        <Icon icon={ShieldCheck} className="h-6 w-6 text-teal" />
      </div>
      <h2 className="font-display text-xl text-ink">Aún no tienes Renty Score</h2>
      <p className="max-w-md text-sm text-ink-muted">
        Responde unas preguntas rápidas y descubre tu puntaje como inquilino. Toma menos de 3 minutos.
      </p>
      <Link href="/renty-score/formulario">
        <Button variant="primary" size="lg">
          Calcular mi Renty Score
          <Icon icon={ArrowRight} className="ml-1.5 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
