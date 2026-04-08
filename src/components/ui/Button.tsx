import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'subtle' | 'outline' | 'danger' | 'coral';
type Size = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 font-heading font-600 whitespace-nowrap rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-sand disabled:opacity-50 disabled:pointer-events-none no-underline';

const variants: Record<Variant, string> = {
  primary:
    'bg-teal text-white shadow-lg shadow-teal/20 hover:bg-teal-dark hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal/25',
  secondary:
    'bg-ink text-white hover:bg-ink/90 hover:-translate-y-0.5',
  ghost:
    'bg-transparent text-ink hover:bg-ink/5',
  subtle:
    'bg-surface text-ink ring-1 ring-border hover:ring-border-strong hover:bg-sand-dark/50',
  outline:
    'border border-border-strong bg-transparent text-ink hover:bg-ink/5',
  danger:
    'bg-error text-white hover:bg-error/90',
  coral:
    'bg-coral text-white shadow-lg shadow-coral/20 hover:bg-coral-dark hover:-translate-y-0.5',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px]',
  md: 'h-11 px-5 text-[14px]',
  lg: 'h-12 px-7 text-[15px]',
  icon: 'h-10 w-10 p-0',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', asChild, loading, leftIcon, rightIcon, children, disabled, ...rest },
  ref
) {
  const sharedProps = {
    ref,
    className: cn(base, variants[variant], sizes[size], className),
    disabled: disabled || loading,
    ...rest,
  } as const;

  if (asChild) {
    return <Slot {...sharedProps}>{children}</Slot>;
  }

  return (
    <button {...sharedProps}>
      {loading ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
          <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
});
