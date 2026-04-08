import { requireAdmin } from '@/lib/auth';
import { getVerificationQueue, getReviewedVerifications } from '@/lib/db/verifications.repository';
import { publicUrlFor } from '@/lib/r2/client';
import { VerificationReviewList } from '@/components/admin/VerificationReviewList';

export const dynamic = 'force-dynamic';

export default async function VerificacionesPage() {
  await requireAdmin();
  const [rawQueue, rawHistory] = await Promise.all([
    getVerificationQueue(),
    getReviewedVerifications(),
  ]);

  const queue = rawQueue.map((item) => ({
    ...item,
    doc_url: item.r2_key ? publicUrlFor(item.r2_key) : null,
  }));

  const history = rawHistory.map((item) => ({
    ...item,
    doc_url: item.r2_key ? publicUrlFor(item.r2_key) : null,
  }));

  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-[22px] font-700 text-ink">Verificaciones</h1>
        <p className="mt-1 text-[14px] text-ink-muted">
          {queue.length === 0
            ? 'No hay verificaciones pendientes.'
            : `${queue.length} verificacion${queue.length > 1 ? 'es' : ''} pendiente${queue.length > 1 ? 's' : ''} de revisión.`}
        </p>
      </div>

      <VerificationReviewList initialQueue={queue} initialHistory={history} />
    </div>
  );
}
