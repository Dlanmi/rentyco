'use client';

import { cn } from '@/lib/cn';
import type { ButtonHTMLAttributes } from 'react';

export function Chip({
  active,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2.5 font-heading text-label font-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2',
        active
          ? 'border-teal bg-teal text-white'
          : 'border-border bg-white text-ink hover:border-teal/40',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
