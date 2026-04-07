import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { requireUser } from '@/lib/auth';
import { getLatestScore } from '@/lib/db/renty-scores.repository';
import { buildMetadata } from '@/lib/seo';
import { ScoreDetailView } from '@/components/renty-score/ScoreDetailView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: 'Mi Renty Score — Detalle',
  description: 'Revisa el detalle de tu Renty Score, entiende cada módulo y aprende cómo mejorar tu perfil como inquilino.',
  path: '/cuenta/mi-score',
  noindex: true,
});

export default async function MiScorePage() {
  const current = await requireUser('/cuenta/mi-score');
  const score = await getLatestScore(current.user.id);

  if (!score) redirect('/renty-score/formulario');

  return <ScoreDetailView score={score} />;
}
