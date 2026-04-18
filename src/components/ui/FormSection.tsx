import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * A numbered form section wrapper. Used by long forms (ListingForm,
 * profile, verification, etc.) to segment content without nesting cards.
 *
 *   <FormSection
 *     number="01"
 *     title="Datos básicos"
 *     description="Cómo se llama tu arriendo, en qué barrio está."
 *   >
 *     {...fields}
 *   </FormSection>
 *
 * Pairs naturally with `<Card>` if you want bordered sections.
 */
export interface FormSectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Optional step number ("01", "A", etc.). Rendered in a coral pill. */
  number?: string;
  /** Section title — display typography. */
  title: string;
  /** Short description under the title. */
  description?: string;
  /** Optional right-aligned slot (e.g. field count, action button). */
  action?: ReactNode;
}

export function FormSection({
  number,
  title,
  description,
  action,
  children,
  className,
  ...rest
}: FormSectionProps) {
  return (
    <section className={cn('space-y-5', className)} {...rest}>
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {number && (
            <span className="mb-2 inline-block rounded-full border border-coral/25 bg-coral-light px-2.5 py-1 font-mono text-[11px] font-500 uppercase tracking-[0.14em] text-coral">
              {number}
            </span>
          )}
          <h3 className="font-heading text-[17px] font-600 text-ink">{title}</h3>
          {description && (
            <p className="mt-1 font-body text-[13px] leading-relaxed text-ink-muted">
              {description}
            </p>
          )}
        </div>
        {action && <div className="flex-none">{action}</div>}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
