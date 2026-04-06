import type { Metadata } from 'next';
import { Suspense } from 'react';
import { buildMetadata } from '@/lib/seo';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/layout/Navbar';
import { RentyScoreWizard } from '@/components/renty-score/RentyScoreWizard';

export const metadata: Metadata = buildMetadata({
  title: 'Calcula tu Renty Score',
  description:
    'Responde 12 preguntas y descubre tu puntaje como inquilino. Sin fiador, sin codeudor — tu historial de pago es tu mejor garantía.',
  path: '/renty-score/formulario',
});

export default async function RentyScoreFormPage() {
  const current = await getCurrentUser();
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
