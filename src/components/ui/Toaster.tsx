'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        className: 'font-body text-[14px]',
        style: {
          background: 'white',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          color: 'var(--color-ink)',
          boxShadow: '0 10px 30px -10px rgba(28,25,23,0.15)',
        },
      }}
    />
  );
}
