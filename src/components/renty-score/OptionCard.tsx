'use client';

import { cn } from '@/lib/cn';
import type { QuestionOption } from '@/lib/renty-score/types';

interface Props {
  option: QuestionOption;
  selected: boolean;
  onSelect: (value: string) => void;
  index: number;
}

export function OptionCard({ option, selected, onSelect, index }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={cn(
        'group relative w-full rounded-2xl border-2 px-5 py-4 text-left transition-all duration-200',
        'hover:border-teal/40 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2',
        selected
          ? 'border-teal bg-teal-lighter shadow-sm'
          : 'border-border bg-white hover:bg-teal-lighter/30'
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center gap-3">
        {/* Radio indicator */}
        <div
          className={cn(
            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
            selected ? 'border-teal bg-teal' : 'border-ink-muted/30 group-hover:border-teal/50'
          )}
        >
          {selected && (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        <span
          className={cn(
            'text-[15px] leading-snug transition-colors duration-200',
            selected ? 'font-semibold text-teal-dark' : 'text-ink-secondary'
          )}
        >
          {option.label}
        </span>
      </div>
    </button>
  );
}
