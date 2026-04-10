'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import { Chip } from '@/components/ui/Chip';
import { useFilters } from '@/lib/search-params.client';
import { formatCOP } from '@/lib/format';
import { PROPERTY_TYPE_VALUES } from '@/lib/search-params';
import type { Neighborhood } from '@/types/domain';
import { cn } from '@/lib/cn';

const TYPE_LABELS: Record<string, string> = {
  apartamento: 'Apartamento',
  casa: 'Casa',
  apartaestudio: 'Apartaestudio',
  habitacion: 'Habitación',
  estudio: 'Estudio',
};

const PRICE_MIN = 500_000;
const PRICE_MAX = 15_000_000;
const PRICE_STEP = 100_000;

export function FilterBar({ neighborhoods }: { neighborhoods: Neighborhood[] }) {
  const [filters, setFilters] = useFilters();

  const bedroomLabel =
    filters.habitaciones === 0 ? 'Habitaciones'
    : filters.habitaciones >= 4 ? '4+ hab'
    : `${filters.habitaciones} hab`;
  const priceLabel =
    filters.min || filters.max
      ? `${filters.min ? formatCOP(filters.min, { short: true }) : 'Min'} – ${filters.max ? formatCOP(filters.max, { short: true }) : 'Max'}`
      : 'Precio';
  const zonaLabel = filters.zona.length ? `${filters.zona.length} zonas` : 'Zona';
  const tipoLabel = filters.tipo.length ? `${filters.tipo.length} tipos` : 'Tipo';

  return (
    <div className="sticky top-[64px] z-30 -mx-6 mb-6 border-b border-border bg-sand/90 px-6 py-3 backdrop-blur-md lg:-mx-12 lg:px-12">
      <div className="flex items-center gap-2 overflow-x-auto">
        {/* Zona */}
        <Popover>
          <PopoverTrigger asChild>
            <FilterButton active={filters.zona.length > 0}>{zonaLabel}</FilterButton>
          </PopoverTrigger>
          <PopoverContent className="max-h-[400px] w-80 overflow-y-auto">
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
            {filters.zona.length > 0 && (
              <button
                type="button"
                className="mt-3 font-mono text-[11px] underline text-ink-muted"
                onClick={() => setFilters({ zona: [] })}
              >
                Limpiar zonas
              </button>
            )}
          </PopoverContent>
        </Popover>

        {/* Precio */}
        <Popover>
          <PopoverTrigger asChild>
            <FilterButton active={!!(filters.min || filters.max)}>{priceLabel}</FilterButton>
          </PopoverTrigger>
          <PopoverContent className="w-[320px]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between font-mono text-[12px] text-ink-secondary">
                <span>{formatCOP(filters.min || PRICE_MIN)}</span>
                <span>{filters.max ? formatCOP(filters.max) : `${formatCOP(PRICE_MAX)}+`}</span>
              </div>
              <Slider
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={PRICE_STEP}
                value={[filters.min || PRICE_MIN, filters.max || PRICE_MAX]}
                onValueChange={(v) => {
                  const [lo, hi] = v;
                  setFilters({
                    min: lo === PRICE_MIN ? 0 : lo ?? 0,
                    max: hi === PRICE_MAX ? 0 : hi ?? 0,
                  });
                }}
              />
              {(filters.min || filters.max) && (
                <button
                  type="button"
                  className="font-mono text-[11px] underline text-ink-muted"
                  onClick={() => setFilters({ min: 0, max: 0 })}
                >
                  Limpiar
                </button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Habitaciones */}
        <Popover>
          <PopoverTrigger asChild>
            <FilterButton active={filters.habitaciones > 0}>{bedroomLabel}</FilterButton>
          </PopoverTrigger>
          <PopoverContent className="w-auto">
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4].map((n) => (
                <Chip
                  key={n}
                  active={filters.habitaciones === n}
                  onClick={() => setFilters({ habitaciones: n })}
                >
                  {n === 0 ? 'Cualquiera' : n === 4 ? '4+' : n}
                </Chip>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Tipo */}
        <Popover>
          <PopoverTrigger asChild>
            <FilterButton active={filters.tipo.length > 0}>{tipoLabel}</FilterButton>
          </PopoverTrigger>
          <PopoverContent className="w-auto">
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
          </PopoverContent>
        </Popover>

        {/* Amoblado */}
        <Popover>
          <PopoverTrigger asChild>
            <FilterButton active={filters.amoblado}>Amoblado</FilterButton>
          </PopoverTrigger>
          <PopoverContent className="w-auto">
            <label className="flex items-center gap-3">
              <Switch checked={filters.amoblado} onCheckedChange={(v) => setFilters({ amoblado: v })} />
              <span className="font-body text-[14px] text-ink">Solo amoblados</span>
            </label>
          </PopoverContent>
        </Popover>

        {/* Sin codeudor */}
        <Popover>
          <PopoverTrigger asChild>
            <FilterButton active={filters.score}>Sin codeudor</FilterButton>
          </PopoverTrigger>
          <PopoverContent className="w-auto">
            <label className="flex items-center gap-3">
              <Switch checked={filters.score} onCheckedChange={(v) => setFilters({ score: v })} />
              <span className="font-body text-[14px] text-ink">Solo arriendos sin codeudor</span>
            </label>
          </PopoverContent>
        </Popover>

        <div className="ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({ zona: [], min: 0, max: 0, habitaciones: 0, tipo: [], amoblado: false, score: false })}
          >
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
}

function FilterButton({
  children,
  active,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 font-heading text-label font-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2',
        active ? 'border-teal bg-teal text-white' : 'border-border bg-white text-ink hover:border-border-strong'
      )}
    >
      {children}
      <svg className="h-3.5 w-3.5 opacity-70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}
