import { cn } from '@/lib/cn';

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'error' | 'teal' | 'coral';

const variants: Record<BadgeVariant, string> = {
  neutral: 'bg-sand-dark text-ink-secondary ring-border',
  success: 'bg-green-50 text-green-800 ring-green-200',
  warning: 'bg-amber-50 text-amber-900 ring-amber-200',
  error:   'bg-red-50 text-red-800 ring-red-200',
  teal:    'bg-teal-lighter text-teal-dark ring-teal/20',
  coral:   'bg-coral-light text-coral-dark ring-coral/20',
};

export function Badge({
  variant = 'neutral',
  className,
  children,
}: {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-500 tracking-wide uppercase ring-1 ring-inset',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
