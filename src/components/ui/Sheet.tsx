'use client';

import { Drawer } from 'vaul';
import { cn } from '@/lib/cn';

export const Sheet = Drawer.Root;
export const SheetTrigger = Drawer.Trigger;
export const SheetClose = Drawer.Close;
export const SheetTitle = Drawer.Title;
export const SheetDescription = Drawer.Description;

export function SheetContent({
  children,
  className,
  side = 'bottom',
}: {
  children: React.ReactNode;
  className?: string;
  side?: 'bottom' | 'right';
}) {
  return (
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm" />
      <Drawer.Content
        className={cn(
          'fixed z-50 flex flex-col bg-sand outline-none',
          side === 'bottom'
            ? 'inset-x-0 bottom-0 mt-24 max-h-[92vh] rounded-t-[24px]'
            : 'right-0 top-0 h-full w-[min(420px,90vw)]',
          className
        )}
      >
        {side === 'bottom' && (
          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-border-strong" />
        )}
        {children}
      </Drawer.Content>
    </Drawer.Portal>
  );
}
