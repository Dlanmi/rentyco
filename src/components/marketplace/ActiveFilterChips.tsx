'use client';

import { useFilters } from '@/lib/search-params.client';
import { formatCOP } from '@/lib/format';
import type { Neighborhood } from '@/types/domain';

const TYPE_LABELS: Record<string, string> = {
  apartamento: 'Apartamento',
  casa: 'Casa',
  apartaestudio: 'Apartaestudio',
  habitacion: 'Habitación',
  estudio: 'Estudio',
};

export function ActiveFilterChips({ neighborhoods }: { neighborhoods: Neighborhood[] }) {
  const [filters, setFilters] = useFilters();
  const hoodMap = new Map(neighborhoods.map((n) => [n.slug, n.name]));

  const chips: { label: string; onRemove: () => void; key: string }[] = [];
  filters.zona.forEach((slug) => {
    chips.push({
      key: `z-${slug}`,
      label: hoodMap.get(slug) ?? slug,
      onRemove: () => setFilters({ zona: filters.zona.filter((s) => s !== slug) }),
    });
  });
  if (filters.min || filters.max) {
    chips.push({
      key: 'price',
      label: `${filters.min ? formatCOP(filters.min, { short: true }) : 'Min'}–${filters.max ? formatCOP(filters.max, { short: true }) : 'Max'}`,
      onRemove: () => setFilters({ min: 0, max: 0 }),
    });
  }
  if (filters.habitaciones) {
    chips.push({
      key: 'beds',
      label: filters.habitaciones >= 4 ? '4+ hab' : `${filters.habitaciones} hab`,
      onRemove: () => setFilters({ habitaciones: 0 }),
    });
  }
  filters.tipo.forEach((t) => {
    chips.push({
      key: `t-${t}`,
      label: TYPE_LABELS[t] ?? t,
      onRemove: () => setFilters({ tipo: filters.tipo.filter((s) => s !== t) }),
    });
  });
  if (filters.amoblado) {
    chips.push({
      key: 'furn',
      label: 'Amoblado',
      onRemove: () => setFilters({ amoblado: false }),
    });
  }

  if (!chips.length) return null;

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={c.onRemove}
          className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1 font-heading text-[12px] font-500 text-teal-dark transition-colors hover:bg-teal/15"
        >
          {c.label}
          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ))}
    </div>
  );
}
