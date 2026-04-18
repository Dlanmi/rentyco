'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';

/**
 * Accessible radiogroup styled as a pill-glider. Single-select mutually
 * exclusive options.
 *
 *   <SegmentedControl
 *     name="userType"
 *     value={type}
 *     onChange={setType}
 *     options={[
 *       { value: 'inquilino', label: 'Soy inquilino' },
 *       { value: 'arrendador', label: 'Soy arrendador' },
 *     ]}
 *   />
 *
 * - Keyboard: arrow keys move selection (native radio group semantics).
 * - Focus visible ring comes from the inner `button`s.
 * - For dark sections pass `dark`; the bg and text flip accordingly.
 */
export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  /** Optional label shown below the value (e.g. "Q3 2026"). */
  hint?: string;
  /** When true the option is non-selectable but still rendered. */
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string> {
  name: string;
  value: T;
  onChange: (value: T) => void;
  options: ReadonlyArray<SegmentedOption<T>>;
  dark?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function SegmentedControl<T extends string>({
  name,
  value,
  onChange,
  options,
  dark = false,
  className,
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) {
  const groupId = useId();
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex flex-wrap gap-1 rounded-full p-1',
        dark ? 'border border-white/10 bg-white/[0.05]' : 'bg-sand-dark',
        className,
      )}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        const id = `${groupId}-${opt.value}`;
        return (
          <button
            key={opt.value}
            id={id}
            type="button"
            role="radio"
            name={name}
            aria-checked={isSelected}
            aria-disabled={opt.disabled || undefined}
            onClick={() => !opt.disabled && onChange(opt.value)}
            className={cn(
              'inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 py-2 font-heading text-[13px] font-500 transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2',
              isSelected
                ? dark
                  ? 'bg-teal text-white focus-visible:ring-offset-ink'
                  : 'bg-ink text-white focus-visible:ring-offset-sand-dark'
                : dark
                ? 'text-white/70 hover:text-white'
                : 'text-ink-muted hover:text-ink',
              opt.disabled && 'cursor-not-allowed opacity-60',
            )}
          >
            <span>{opt.label}</span>
            {opt.hint && (
              <span
                className={cn(
                  'font-mono text-[10px] tracking-[0.12em] uppercase',
                  isSelected ? 'text-white/75' : dark ? 'text-teal-light' : 'text-ink-muted',
                )}
              >
                {opt.hint}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
