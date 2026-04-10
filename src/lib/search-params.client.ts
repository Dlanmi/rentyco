'use client';

import { startTransition } from 'react';
import {
  parseAsString,
  parseAsInteger,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs';
import { SORT_VALUES, type SortValue } from './search-params';

export const clientFilterParsers = {
  zona: parseAsArrayOf(parseAsString).withDefault([]),
  min: parseAsInteger.withDefault(0),
  max: parseAsInteger.withDefault(0),
  habitaciones: parseAsInteger.withDefault(0),
  tipo: parseAsArrayOf(parseAsString).withDefault([]),
  amoblado: parseAsBoolean.withDefault(false),
  score: parseAsBoolean.withDefault(false),
  sort: parseAsStringEnum([...SORT_VALUES]).withDefault('recent'),
};

export function useFilters() {
  return useQueryStates(clientFilterParsers, { shallow: false, throttleMs: 250, startTransition });
}

export type { SortValue };
