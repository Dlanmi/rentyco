import {
  parseAsString,
  parseAsInteger,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsStringEnum,
  createLoader,
} from 'nuqs/server';

export const SORT_VALUES = ['recent', 'price_asc', 'price_desc', 'area_desc'] as const;
export type SortValue = (typeof SORT_VALUES)[number];

export const PROPERTY_TYPE_VALUES = [
  'apartamento',
  'casa',
  'apartaestudio',
  'habitacion',
  'estudio',
] as const;
export type PropertyTypeValue = (typeof PROPERTY_TYPE_VALUES)[number];

export const filterParsers = {
  zona: parseAsArrayOf(parseAsString).withDefault([]),
  min: parseAsInteger.withDefault(0),
  max: parseAsInteger.withDefault(0),
  habitaciones: parseAsInteger.withDefault(0),
  tipo: parseAsArrayOf(parseAsString).withDefault([]),
  amoblado: parseAsBoolean.withDefault(false),
  sort: parseAsStringEnum([...SORT_VALUES]).withDefault('recent'),
  cursor: parseAsString.withDefault(''),
};

export const loadFilterParams = createLoader(filterParsers);

export type FilterParams = {
  zona: string[];
  min: number;
  max: number;
  habitaciones: number;
  tipo: string[];
  amoblado: boolean;
  sort: SortValue;
  cursor: string;
};

/** Count how many filters are actively applied (for chip row / drawer badge). */
export function countActiveFilters(f: FilterParams): number {
  let n = 0;
  if (f.zona.length) n += f.zona.length;
  if (f.min) n += 1;
  if (f.max) n += 1;
  if (f.habitaciones) n += 1;
  if (f.tipo.length) n += f.tipo.length;
  if (f.amoblado) n += 1;
  return n;
}
