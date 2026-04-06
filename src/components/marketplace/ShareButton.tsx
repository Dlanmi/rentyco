'use client';

import { toast } from 'sonner';
import { IconButton } from '@/components/ui/IconButton';

export function ShareButton({ title, url }: { title: string; url: string }) {
  async function onClick() {
    const absoluteUrl = url.startsWith('http') ? url : window.location.origin + url;
    if (navigator.share) {
      try {
        await navigator.share({ title, url: absoluteUrl });
        return;
      } catch {
        /* user cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      toast('Enlace copiado');
    } catch {
      toast.error('No pudimos copiar el enlace');
    }
  }
  return (
    <IconButton onClick={onClick} aria-label="Compartir" size="sm">
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342a3 3 0 100-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 12.632a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
    </IconButton>
  );
}
