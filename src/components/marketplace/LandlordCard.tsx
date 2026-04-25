import { Fingerprint, ScrollText, Clock, ShieldCheck, BadgeCheck, AlertCircle } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { formatDate } from '@/lib/format';
import type { ListingDetail } from '@/types/domain';

type LandlordVariant = 'editorial' | 'compact' | 'dark';

export function LandlordCard({
  owner,
  acceptsRentyScore = false,
  variant = 'compact',
}: {
  owner: ListingDetail['owner'];
  acceptsRentyScore?: boolean;
  variant?: LandlordVariant;
}) {
  if (variant === 'editorial') {
    return <EditorialLandlord owner={owner} acceptsRentyScore={acceptsRentyScore} />;
  }

  const isDark = variant === 'dark';
  return (
    <div
      className={`flex items-center gap-4 rounded-2xl p-5 ${
        isDark ? 'border border-white/10 bg-white/5' : 'border border-border bg-white'
      }`}
    >
      <Avatar
        src={owner.avatarUrl}
        name={owner.fullName ?? '·'}
        size={56}
        className={isDark ? 'ring-white/20' : undefined}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4
            className={`truncate font-heading text-md font-600 ${
              isDark ? 'text-white' : 'text-ink'
            }`}
          >
            {owner.fullName ?? 'Arrendador Renty'}
          </h4>
          {owner.verified && <Badge variant="teal">Verificado</Badge>}
        </div>
        <p
          className={`mt-0.5 font-mono text-[12px] ${
            isDark ? 'text-white/70' : 'text-ink-muted'
          }`}
        >
          Miembro desde {formatDate(owner.memberSince, { month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}

function EditorialLandlord({
  owner,
  acceptsRentyScore,
}: {
  owner: ListingDetail['owner'];
  acceptsRentyScore: boolean;
}) {
  const verifiedSignal = owner.verified
    ? {
        icon: BadgeCheck,
        k: 'Cédula verificada',
        v: 'Identidad confirmada por Renty',
      }
    : {
        icon: AlertCircle,
        k: 'Sin verificar',
        v: 'Aún no completa el proceso Renty',
      };

  const signals: Array<{ icon: typeof Fingerprint; k: string; v: string; muted?: boolean }> = [
    verifiedSignal,
    { icon: ScrollText, k: 'Contrato escrito', v: 'Cumple con la Ley 820 de 2003' },
    { icon: Clock, k: 'Responde rápido', v: '~1 hora en promedio' },
    ...(acceptsRentyScore
      ? [{ icon: ShieldCheck, k: 'Acepta Renty Score', v: 'Sin codeudor con finca raíz' }]
      : []),
  ];

  return (
    <section className="border-t border-border pt-10 sm:pt-12">
      <span className="font-mono text-[11px] font-600 uppercase tracking-[0.14em] text-coral">
        Conoce al arrendador
      </span>
      <div className="mt-4 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
        {/* Left: profile + signals */}
        <div>
          <div className="flex items-center gap-4 sm:gap-5">
            <Avatar
              src={owner.avatarUrl}
              name={owner.fullName ?? 'Arrendador Renty'}
              size={64}
              className="bg-teal text-white ring-0"
            />
            <div className="min-w-0">
              <h3 className="font-display text-[clamp(1.35rem,3vw,1.75rem)] leading-tight tracking-tight text-ink">
                {owner.fullName ?? 'Arrendador Renty'}
              </h3>
              <p className="mt-1 font-body text-[13px] text-ink-muted">
                Miembro desde {formatDate(owner.memberSince, { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:mt-7">
            {signals.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-border bg-white p-4"
              >
                <Icon
                  icon={s.icon}
                  className={`h-5 w-5 shrink-0 ${
                    !owner.verified && i === 0 ? 'text-warning' : 'text-teal'
                  } mt-0.5`}
                  strokeWidth={1.8}
                />
                <div className="min-w-0">
                  <p className="font-heading text-[13.5px] font-600 leading-snug text-ink">
                    {s.k}
                  </p>
                  <p className="mt-0.5 font-body text-[12.5px] leading-snug text-ink-muted">
                    {s.v}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Renty promise pull-quote */}
        <aside className="rounded-2xl bg-sand-dark p-6 sm:p-7">
          <div className="mb-4 h-px w-12 bg-coral/45" />
          <p className="font-display text-[clamp(1.05rem,2.4vw,1.35rem)] leading-snug text-ink">
            Renty se asegura de que el contrato sea claro y los pagos lleguen a tiempo —
            para que tanto el arrendador como tú tengan tranquilidad.
          </p>
          <p className="mt-5 font-mono text-[10.5px] font-600 uppercase tracking-[0.14em] text-ink-muted">
            — Protección Renty
          </p>
        </aside>
      </div>
    </section>
  );
}
