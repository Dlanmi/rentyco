import type { Metadata } from 'next';
import { requireUser } from '@/lib/auth';
import { getLatestScore } from '@/lib/db/renty-scores.repository';
import { getVerificationsForUser } from '@/lib/db/verifications.repository';
import { buildMetadata } from '@/lib/seo';
import { ScoreDetailView } from '@/components/renty-score/ScoreDetailView';
import { ScoreRecovery } from '@/components/renty-score/ScoreRecovery';
import { VerificationChecklist } from '@/components/renty-score/VerificationChecklist';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: 'Mi Renty Score — Detalle',
  description: 'Revisa el detalle de tu Renty Score, entiende cada módulo y aprende cómo mejorar tu perfil como inquilino.',
  path: '/cuenta/mi-score',
  noindex: true,
});

export default async function MiScorePage() {
  const current = await requireUser('/cuenta/mi-score');
  const [score, verifications] = await Promise.all([
    getLatestScore(current.user.id),
    getVerificationsForUser(current.user.id),
  ]);

  if (!score) return <ScoreRecovery />;

  return (
    <>
      <ScoreDetailView score={score} />
      {score.algorithm_version !== '1.0' && (
        <div className="mx-auto mt-6 max-w-2xl px-5">
          <VerificationChecklist verifications={verifications} scoreId={score.id} />
        </div>
      )}
    </>
  );
}
