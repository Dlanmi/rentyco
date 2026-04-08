import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { getCurrentUser } from '@/lib/auth';
import { hasAnyScore } from '@/lib/db/renty-scores.repository';
import Navbar from '@/components/layout/Navbar';
import { RentyScoreWizard } from '@/components/renty-score/RentyScoreWizard';

export const metadata: Metadata = buildMetadata({
  title: 'Calcula tu Renty Score',
  description:
    'Responde 12 preguntas y descubre tu puntaje como inquilino. Sin fiador, sin codeudor — tu historial de pago es tu mejor garantía.',
  path: '/renty-score/formulario',
});

export default async function RentyScoreFormPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const current = await getCurrentUser();
  const params = await searchParams;
  const isRecalculating = params.recalcular === '1';

  // If authenticated user already has a score, redirect to detail page
  // Unless they explicitly chose to recalculate
  if (current && !isRecalculating) {
    const alreadyHasScore = await hasAnyScore(current.user.id);
    if (alreadyHasScore) redirect('/cuenta/mi-score');
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-sand pt-20">
        <Suspense>
          <RentyScoreWizard
            isAuthed={!!current}
            userName={current?.profile.full_name ?? undefined}
            userRole={current?.profile.role}
          />
        </Suspense>
      </main>
    </>
  );
}
