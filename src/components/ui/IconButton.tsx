import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export const IconButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { size?: 'sm' | 'md' | 'lg' }
>(function IconButton({ className, size = 'md', children, ...rest }, ref) {
  const dims = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10';
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-white/85 text-ink ring-1 ring-border backdrop-blur transition-all hover:bg-white hover:ring-border-strong',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2',
        dims,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
