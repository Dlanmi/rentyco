'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';
import { FieldLabel } from './Input';

/**
 * Numeric input with +/- steppers. Used in ListingForm (bedrooms/bathrooms/
 * parking) and wherever a small integer is being entered.
 *
 *   <NumField label="Habitaciones" value={bedrooms} onChange={setBedrooms} min={0} max={10} />
 *
 * Keyboard: arrow up/down on the input increments/decrements via native
 * `type=number` semantics. +/- buttons are for touch users.
 */
export interface NumFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  name?: string;
  required?: boolean;
  hint?: string;
  className?: string;
}

export function NumField({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  name,
  required,
  hint,
  className,
}: NumFieldProps) {
  const id = useId();
  const canDecrement = value > min;
  const canIncrement = value < max;
  const clamp = (n: number) => Math.max(min, Math.min(max, n));

  return (
    <div className={cn('space-y-1.5', className)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="inline-flex h-11 items-center gap-1 rounded-field border border-border bg-surface px-1">
        <button
          type="button"
          aria-label={`Disminuir ${label.toLowerCase()}`}
          disabled={!canDecrement}
          onClick={() => onChange(clamp(value - step))}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-sand-dark disabled:opacity-30 disabled:pointer-events-none"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" d="M5 12h14" />
          </svg>
        </button>
        <input
          id={id}
          name={name}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={step}
          value={value}
          required={required}
          onChange={(e) => onChange(clamp(parseInt(e.target.value || '0', 10)))}
          className="h-9 w-10 border-0 bg-transparent text-center font-mono text-[15px] font-500 text-ink outline-none focus:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          aria-label={`Aumentar ${label.toLowerCase()}`}
          disabled={!canIncrement}
          onClick={() => onChange(clamp(value + step))}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-sand-dark disabled:opacity-30 disabled:pointer-events-none"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
      {hint && <p className="font-body text-[12px] text-ink-muted">{hint}</p>}
    </div>
  );
}
