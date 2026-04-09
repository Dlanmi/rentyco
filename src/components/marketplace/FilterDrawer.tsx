'use client';

import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Switch } from '@/components/ui/Switch';
import { Slider } from '@/components/ui/Slider';
import { useFilters } from '@/lib/search-params.client';
import { formatCOP } from '@/lib/format';
import { PROPERTY_TYPE_VALUES } from '@/lib/search-params';
import type { Neighborhood } from '@/types/domain';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const TYPE_LABELS: Record<string, string> = {
  apartamento: 'Apartamento', casa: 'Casa', apartaestudio: 'Apartaestudio',
  habitacion: 'Habitación', estudio: 'Estudio',
};
const PRICE_MIN = 500_000, PRICE_MAX = 15_000_000, PRICE_STEP = 100_000;

export function FilterDrawer({
  neighborhoods,
  activeCount,
  resultCount,
}: {
  neighborhoods: Neighborhood[];
  activeCount: number;
  resultCount: number;
}) {
  const [filters, setFilters] = useFilters();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="subtle" size="sm" className="relative">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M3 6h18M7 12h10M11 18h2" /></svg>
          Filtros
          {activeCount > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-teal px-1.5 font-mono text-[10px] text-white">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <VisuallyHidden><SheetTitle>Filtros</SheetTitle></VisuallyHidden>
        <div className="flex items-center justify-between border-b border-border px-5 pb-3 pt-2">
          <h3 className="font-display text-[20px] text-ink">Filtros</h3>
          <SheetClose className="font-mono text-[12px] text-ink-muted underline">Cerrar</SheetClose>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <Section title="Zona">
            <div className="flex flex-wrap gap-2">
              {neighborhoods.map((n) => (
                <Chip
                  key={n.slug}
                  active={filters.zona.includes(n.slug)}
                  onClick={() => {
                    const next = filters.zona.includes(n.slug)
                      ? filters.zona.filter((s) => s !== n.slug)
                      : [...filters.zona, n.slug];
                    setFilters({ zona: next });
                  }}
                >
                  {n.name}
                </Chip>
              ))}
            </div>
          </Section>

          <Section title="Precio mensual">
            <div className="flex items-center justify-between font-mono text-[12px] text-ink-secondary">
              <span>{formatCOP(filters.min || PRICE_MIN)}</span>
              <span>{filters.max ? formatCOP(filters.max) : `${formatCOP(PRICE_MAX)}+`}</span>
            </div>
            <div className="mt-3 px-1">
              <Slider
                min={PRICE_MIN} max={PRICE_MAX} step={PRICE_STEP}
                value={[filters.min || PRICE_MIN, filters.max || PRICE_MAX]}
                onValueChange={(v) => {
                  const [lo, hi] = v;
                  setFilters({
                    min: lo === PRICE_MIN ? 0 : lo ?? 0,
                    max: hi === PRICE_MAX ? 0 : hi ?? 0,
                  });
                }}
              />
            </div>
          </Section>

          <Section title="Habitaciones">
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4].map((n) => (
                <Chip key={n} active={filters.habitaciones === n} onClick={() => setFilters({ habitaciones: n })}>
                  {n === 0 ? 'Cualquiera' : n === 4 ? '4+' : n}
                </Chip>
              ))}
            </div>
          </Section>

          <Section title="Tipo">
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPE_VALUES.map((t) => (
                <Chip
                  key={t}
                  active={filters.tipo.includes(t)}
                  onClick={() => {
                    const next = filters.tipo.includes(t)
                      ? filters.tipo.filter((s) => s !== t)
                      : [...filters.tipo, t];
                    setFilters({ tipo: next });
                  }}
                >
                  {TYPE_LABELS[t]}
                </Chip>
              ))}
            </div>
          </Section>

          <Section title="Amoblado">
            <label className="flex items-center gap-3">
              <Switch checked={filters.amoblado} onCheckedChange={(v) => setFilters({ amoblado: v })} />
              <span className="font-body text-[14px] text-ink">Solo amoblados</span>
            </label>
          </Section>

          <Section title="Sin codeudor">
            <label className="flex items-center gap-3">
              <Switch checked={filters.score} onCheckedChange={(v) => setFilters({ score: v })} />
              <span className="font-body text-[14px] text-ink">Solo arriendos sin codeudor</span>
            </label>
          </Section>
        </div>

        <div className="flex items-center justify-between border-t border-border bg-white px-5 py-3" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.75rem)' }}>
          <button
            type="button"
            onClick={() => setFilters({ zona: [], min: 0, max: 0, habitaciones: 0, tipo: [], amoblado: false, score: false })}
            className="font-heading text-[13px] font-500 text-ink underline"
          >
            Limpiar todo
          </button>
          <SheetClose asChild>
            <Button variant="primary" size="md">
              Ver {resultCount} arriendos
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 border-b border-border pb-6 last:border-0">
      <h4 className="mb-3 font-heading text-[15px] font-600 text-ink">{title}</h4>
      {children}
    </div>
  );
}
