import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * A rounded colored square that holds an icon — the "tile" pattern that
 * repeats across feature cards, Steps section, Trust section, admin
 * sidebar, etc.
 *
 *   <IconBox color="teal" size="md"><ShieldCheck /></IconBox>
 *   <IconBox color="coral" size="lg"><Sparkles /></IconBox>
 *
 * Avoids the repeated pattern of `flex h-11 w-11 items-center ... rounded-xl
 * bg-teal-lighter text-teal` that litters consumer files.
 */
type Color = 'teal' | 'teal-dark' | 'coral' | 'success' | 'warning' | 'error' | 'neutral';
type Size = 'sm' | 'md' | 'lg' | 'xl';

export interface IconBoxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  children: ReactNode;
  color?: Color;
  size?: Size;
}

const colorClasses: Record<Color, string> = {
  teal: 'bg-teal-lighter text-teal',
  'teal-dark': 'bg-teal text-white',
  coral: 'bg-coral-light text-coral-dark',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
  neutral: 'bg-sand-dark text-ink',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 w-8 rounded-lg [&>svg]:h-4 [&>svg]:w-4',
  md: 'h-11 w-11 rounded-xl [&>svg]:h-5 [&>svg]:w-5',
  lg: 'h-14 w-14 rounded-2xl [&>svg]:h-6 [&>svg]:w-6',
  xl: 'h-16 w-16 rounded-2xl [&>svg]:h-7 [&>svg]:w-7',
};

export function IconBox({
  color = 'teal',
  size = 'md',
  className,
  children,
  ...rest
}: IconBoxProps) {
  return (
    <div
      aria-hidden={rest['aria-label'] ? undefined : true}
      className={cn(
        'inline-flex flex-none items-center justify-center',
        colorClasses[color],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
