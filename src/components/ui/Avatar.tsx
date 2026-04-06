'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/cn';

function initialsFromName(name: string | null | undefined): string {
  if (!name) return '·';
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
}

export function Avatar({
  src,
  name,
  size = 36,
  className,
}: {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-teal-lighter font-heading font-700 text-teal ring-1 ring-border',
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {src ? (
        <AvatarPrimitive.Image
          src={src}
          alt={name ?? ''}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : null}
      <AvatarPrimitive.Fallback
        delayMs={src ? 600 : 0}
        className="flex h-full w-full items-center justify-center uppercase"
      >
        {initialsFromName(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
