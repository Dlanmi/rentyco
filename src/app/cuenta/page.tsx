import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { getServerSupabase } from '@/lib/supabase/server';
import type { ScoreColor } from '@/lib/renty-score/types';

export const dynamic = 'force-dynamic';

async function getCount(table: string, filter: { col: string; val: string }) {
  const supabase = await getServerSupabase();
  if (!supabase) return 0;
  const { count } = await supabase.from(table).select('id', { count: 'exact', head: true }).eq(filter.col, filter.val);
  return count ?? 0;
}

export default async function AccountHomePage() {
  const current = await requireUser();
  const isLandlord = current.profile.role === 'landlord' || current.profile.role === 'admin';
  const firstName = current.profile.full_name?.split(' ')[0] ?? '';

  const [favoritesCount, inquiriesCount, listingsCount] = await Promise.all([
    getCount('favorites', { col: 'user_id', val: current.user.id }),
    getCount('inquiries', { col: 'user_id', val: current.user.id }),
    isLandlord ? getCount('listings', { col: 'owner_id', val: current.user.id }) : Promise.resolve(0),
  ]);

  const { renty_score, renty_score_color, renty_score_date } = current.profile;

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="font-display text-[28px] text-ink sm:text-[32px]">
          Hola, {firstName}
        </h1>
        <p className="mt-1 font-body text-[15px] text-ink-secondary">
          {isLandlord
            ? 'Gestiona tus arriendos y revisa las consultas de inquilinos.'
            : 'Encuentra tu próximo hogar y gestiona tus favoritos.'}
        </p>
      </div>

      {/* Renty Score — show result or prompt */}
      {renty_score && renty_score_color && renty_score_date ? (
        <ScoreBadge score={renty_score} color={renty_score_color} date={renty_score_date} />
      ) : !isLandlord ? (
        <Link
          href="/renty-score/formulario"
          className="group mb-6 flex items-center gap-4 rounded-2xl border border-teal/20 bg-teal-lighter/50 p-5 no-underline transition-all hover:-translate-y-0.5 hover:border-teal/30 hover:shadow-md"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal/10">
            <svg className="h-6 w-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-[15px] font-600 text-teal-dark">
              Calcula tu Renty Score
            </h3>
            <p className="mt-0.5 text-[13px] text-ink-secondary">
              Responde 12 preguntas y descubre tu puntaje como inquilino. Solo toma 3 minutos.
            </p>
          </div>
          <svg className="h-5 w-5 shrink-0 text-teal transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      ) : (
        <Link
          href="/renty-score/formulario?tipo=arrendador"
          className="group mb-6 flex items-center gap-4 rounded-2xl border border-border bg-white p-4 no-underline transition-all hover:border-teal/20 hover:shadow-sm"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sand-dark">
            <svg className="h-5 w-5 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-[13px] font-500 text-ink-secondary">
              ¿Conoces tu Renty Score? <span className="text-ink-muted">(opcional)</span>
            </h3>
          </div>
          <svg className="h-4 w-4 shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Favoritos"
          value={favoritesCount}
          href="/cuenta/favoritos"
          icon="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          emptyText="Guarda arriendos que te gusten"
          color="text-rose-500"
          bg="bg-rose-50"
        />
        <StatCard
          label="Mensajes"
          value={inquiriesCount}
          href="/cuenta/mensajes"
          icon="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          emptyText="Envía mensajes a arrendadores"
          color="text-blue-500"
          bg="bg-blue-50"
        />
        {isLandlord && (
          <StatCard
            label="Mis arriendos"
            value={listingsCount}
            href="/cuenta/publicaciones"
            icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            emptyText="Publica tu primer inmueble"
            color="text-teal"
            bg="bg-teal-lighter"
          />
        )}
      </div>

      {/* Quick actions */}
      <div className="mt-10">
        <h2 className="mb-4 font-heading text-[14px] font-600 uppercase tracking-wider text-ink-muted">
          Acciones rápidas
        </h2>
        <div className="flex flex-wrap gap-3">
          <QuickAction href="/bogota/arriendos" icon="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" label="Explorar arriendos" />
          {!isLandlord && (
            <QuickAction href="/renty-score/formulario" icon="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" label="Mi Renty Score" primary />
          )}
          {isLandlord && (
            <QuickAction href="/admin/listings/nuevo" icon="M12 4v16m8-8H4" label="Publicar arriendo" primary />
          )}
          <QuickAction href="/cuenta/perfil" icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" label="Editar perfil" />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label, value, href, icon, emptyText, color, bg,
}: {
  label: string; value: number; href: string; icon: string;
  emptyText: string; color: string; bg: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-2xl border border-border bg-white p-5 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-md"
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg}`}>
        <svg className={`h-5 w-5 ${color}`} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d={icon} />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-heading text-[13px] font-500 text-ink-secondary">{label}</div>
        <div className="mt-0.5 font-display text-[28px] leading-none text-ink">{value}</div>
        {value === 0 && (
          <p className="mt-1.5 font-body text-[12px] text-ink-muted">{emptyText}</p>
        )}
      </div>
      <svg className="mt-1 h-4 w-4 shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

const SCORE_COLORS: Record<ScoreColor, { bg: string; text: string; ring: string; label: string }> = {
  verde: { bg: 'bg-teal-lighter', text: 'text-teal-dark', ring: 'ring-teal/20', label: 'Excelente' },
  amarillo: { bg: 'bg-warning/10', text: 'text-warning', ring: 'ring-warning/20', label: 'Bueno' },
  naranja: { bg: 'bg-coral-light', text: 'text-coral', ring: 'ring-coral/20', label: 'En construcción' },
  rojo: { bg: 'bg-error/10', text: 'text-error', ring: 'ring-error/20', label: 'Necesita mejorar' },
};

function ScoreBadge({ score, color, date }: { score: number; color: ScoreColor; date: string }) {
  const c = SCORE_COLORS[color];
  const formatted = new Date(date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <div className="mb-6 flex items-center gap-4 rounded-2xl border border-border bg-white p-5">
      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${c.bg} ring-2 ${c.ring}`}>
        <span className={`font-display text-[22px] leading-none ${c.text}`}>{score}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-heading text-[15px] font-600 text-ink">Tu Renty Score</h3>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-600 ${c.bg} ${c.text}`}>{c.label}</span>
        </div>
        <p className="mt-0.5 text-[12px] text-ink-muted">Calculado el {formatted}</p>
      </div>
      <Link
        href="/renty-score/formulario"
        className="shrink-0 rounded-lg border border-border px-3 py-1.5 font-heading text-[12px] font-500 text-ink-secondary no-underline transition-all hover:border-teal/20 hover:text-teal"
      >
        Recalcular
      </Link>
    </div>
  );
}

function QuickAction({ href, icon, label, primary }: { href: string; icon: string; label: string; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-heading text-[13px] font-500 no-underline transition-all hover:-translate-y-px ${
        primary
          ? 'bg-teal font-600 text-white hover:bg-teal-dark hover:shadow-md hover:shadow-teal/15'
          : 'border border-border bg-white text-ink-secondary hover:border-ink/20 hover:text-ink hover:shadow-sm'
      }`}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d={icon} />
      </svg>
      {label}
    </Link>
  );
}
