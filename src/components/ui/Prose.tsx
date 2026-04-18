import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Typography prose wrapper. Wraps `@tailwindcss/typography` with Renty's
 * display type + token-based heading colors + coral links + mono code.
 *
 *   <Prose>
 *     <h2>Section heading</h2>
 *     <p>Body copy flows naturally...</p>
 *   </Prose>
 *
 * Used for long-form content: legal pages, blog posts, markdown renders.
 * Not meant for dashboards or apps — those use atomic typography classes.
 *
 * Size `sm|base|lg` controls the reading measure (16ch → 72ch for base).
 */
type Size = 'sm' | 'base' | 'lg';

export interface ProseProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: Size;
  /** Use display serif for h1/h2/h3 (default: true; false uses sans headings). */
  displayHeadings?: boolean;
}

const sizeClasses: Record<Size, string> = {
  sm: 'prose-sm',
  base: 'prose',
  lg: 'prose-lg',
};

export function Prose({
  children,
  size = 'base',
  displayHeadings = true,
  className,
  ...rest
}: ProseProps) {
  return (
    <div
      className={cn(
        sizeClasses[size],
        'max-w-none',
        // Tokenized headings + body.
        'prose-headings:text-ink prose-headings:tracking-[-0.01em]',
        displayHeadings && 'prose-headings:font-display prose-headings:font-400',
        'prose-p:text-ink-secondary prose-p:leading-relaxed',
        // Links: coral, underlined on hover.
        'prose-a:text-teal prose-a:no-underline hover:prose-a:text-teal-dark hover:prose-a:underline',
        // Strong: ink (inherit instead of black).
        'prose-strong:text-ink prose-strong:font-600',
        // Code: mono + sand bg.
        'prose-code:rounded prose-code:bg-sand-dark prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.875em] prose-code:text-ink prose-code:font-400 prose-code:before:content-none prose-code:after:content-none',
        'prose-pre:rounded-card prose-pre:bg-ink prose-pre:text-white',
        // Lists: tokenized markers.
        'marker:text-coral',
        // Blockquote: brand-tinted.
        'prose-blockquote:border-l-coral prose-blockquote:text-ink prose-blockquote:font-display prose-blockquote:not-italic',
        // HR: subtle.
        'prose-hr:border-border',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
