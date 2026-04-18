import Link from 'next/link';
import { getAdminStats } from '@/lib/db/listings.repository';

export const dynamic = 'force-dynamic';

export default async function AdminHomePage() {
  const stats = await getAdminStats();

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-[32px] text-ink">Panel de control</h1>
        <p className="mt-1 font-body text-[14px] text-ink-muted">
          Resumen de la plataforma en Bogotá
        </p>
      </div>

      {/* Quick actions */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Link
          href="/admin/listings/nuevo"
          className="inline-flex items-center gap-2 rounded-xl bg-teal px-5 py-2.5 font-heading text-label font-600 text-white no-underline transition-all hover:-translate-y-px hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/15"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
          Nuevo arriendo
        </Link>
        {stats.pendingReview > 0 && (
          <Link
            href="/admin/listings?status=pending_review"
            className="inline-flex items-center gap-2 rounded-xl border border-coral/30 bg-coral-light/30 px-5 py-2.5 font-heading text-label font-600 text-coral-dark no-underline transition-colors hover:border-coral/50 hover:bg-coral-light/50"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-coral text-[11px] font-700 text-white">
              {stats.pendingReview}
            </span>
            Revisar pendientes
          </Link>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Activos"
          value={stats.active}
          sub={`${stats.total} totales`}
          icon="M5 13l4 4L19 7"
          iconBg="bg-success/10"
          iconColor="text-success"
        />
        <StatCard
          label="En revisión"
          value={stats.pendingReview}
          accent={stats.pendingReview > 0}
          icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          iconBg="bg-warning/10"
          iconColor="text-warning"
        />
        <StatCard
          label="Usuarios"
          value={stats.totalUsers}
          icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          iconBg="bg-teal/10"
          iconColor="text-teal"
        />
        <StatCard
          label="Consultas nuevas"
          value={stats.newInquiries}
          sub={`${stats.totalInquiries} totales`}
          accent={stats.newInquiries > 0}
          icon="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
          iconBg="bg-coral-light"
          iconColor="text-coral"
        />
      </div>

      {/* Secondary stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <MiniStat label="Borradores" value={stats.draft} />
        <MiniStat label="Pausados" value={stats.paused} />
        <MiniStat label="Archivados" value={stats.archived} />
      </div>
    </div>
  );
}

function StatCard({
  label, value, sub, accent, icon, iconBg, iconColor,
}: {
  label: string; value: number; sub?: string; accent?: boolean;
  icon: string; iconBg: string; iconColor: string;
}) {
  return (
    <div className={`rounded-2xl border p-5 transition-colors ${accent ? 'border-coral/30 bg-coral-light/15' : 'border-border bg-white'}`}>
      <div className="flex items-center justify-between">
        <div className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">{label}</div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>
          <svg className={`h-4.5 w-4.5 ${iconColor}`} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d={icon} />
          </svg>
        </div>
      </div>
      <div className="mt-3 font-display text-[36px] leading-none text-ink">{value}</div>
      {sub && <div className="mt-1 font-mono text-[11px] text-ink-muted">{sub}</div>}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-white/60 px-4 py-3">
      <div className="font-mono text-2xs uppercase tracking-wider text-ink-muted">{label}</div>
      <div className="mt-1 font-display text-[22px] text-ink">{value}</div>
    </div>
  );
}
