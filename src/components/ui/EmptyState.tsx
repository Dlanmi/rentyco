import type { ReactNode } from 'react';

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-surface/50 p-10 text-center">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-lighter text-teal">
          {icon}
        </div>
      )}
      <h3 className="font-display text-[20px] text-ink">{title}</h3>
      {description && (
        <p className="font-body text-[14px] leading-relaxed text-ink-muted">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
