import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const baseField =
  'w-full rounded-xl border border-border bg-white px-4 py-2.5 font-body text-[15px] text-ink placeholder:text-ink-muted/60 transition-colors focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 disabled:opacity-60 disabled:bg-sand-dark/40';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={cn(baseField, 'h-11', className)} {...rest} />;
  }
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, rows = 5, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(baseField, 'resize-y leading-relaxed', className)}
      {...rest}
    />
  );
});

export function FieldLabel({
  htmlFor,
  children,
  required,
  hint,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between">
      <span className="font-heading text-[13px] font-600 text-ink">
        {children}
        {required && <span className="ml-0.5 text-coral">*</span>}
      </span>
      {hint && <span className="font-mono text-[11px] text-ink-muted">{hint}</span>}
    </label>
  );
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-1.5 font-body text-[13px] text-error">
      {children}
    </p>
  );
}
