import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/format';
import type { ListingDetail } from '@/types/domain';

export function LandlordCard({
  owner,
  variant = 'light',
}: {
  owner: ListingDetail['owner'];
  variant?: 'light' | 'dark';
}) {
  const isDark = variant === 'dark';
  return (
    <div className={`flex items-center gap-4 rounded-2xl p-5 ${isDark ? 'bg-white/5 border border-white/10' : 'border border-border bg-white'}`}>
      <Avatar
        src={owner.avatarUrl}
        name={owner.fullName ?? '·'}
        size={56}
        className={isDark ? 'ring-white/20' : undefined}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className={`truncate font-heading text-[15px] font-600 ${isDark ? 'text-white' : 'text-ink'}`}>
            {owner.fullName ?? 'Arrendador Renty'}
          </h4>
          {owner.verified && <Badge variant="teal">Verificado</Badge>}
        </div>
        <p className={`mt-0.5 font-mono text-[12px] ${isDark ? 'text-white/70' : 'text-ink-muted'}`}>
          Miembro desde {formatDate(owner.memberSince, { month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
