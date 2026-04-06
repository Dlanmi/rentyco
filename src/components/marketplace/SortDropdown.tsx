'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { useFilters } from '@/lib/search-params.client';
import type { SortValue } from '@/lib/search-params';

const SORT_LABELS: Record<SortValue, string> = {
  recent: 'Más recientes',
  price_asc: 'Precio: menor a mayor',
  price_desc: 'Precio: mayor a menor',
  area_desc: 'Mayor área',
};

export function SortDropdown() {
  const [filters, setFilters] = useFilters();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-white px-4 font-heading text-[13px] font-500 text-ink transition-colors hover:border-border-strong">
        Ordenar: <span className="text-teal-dark">{SORT_LABELS[filters.sort as SortValue]}</span>
        <svg className="h-3.5 w-3.5 opacity-70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(SORT_LABELS) as SortValue[]).map((v) => (
          <DropdownMenuItem key={v} onSelect={() => setFilters({ sort: v })}>
            {SORT_LABELS[v]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
