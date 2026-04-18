'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogClose, VisuallyHidden } from '@/components/ui/Dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { blurhashToDataURL } from '@/lib/blurhash';
import type { ListingImage } from '@/types/domain';

export function Lightbox({
  open,
  onOpenChange,
  images,
  alt,
  startIndex = 0,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: ListingImage[];
  alt: string;
  startIndex?: number;
}) {
  const [i, setI] = useState(startIndex);
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setI(startIndex);
  }

  const prev = useCallback(() => setI((v) => (v - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setI((v) => (v + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, prev, next]);

  const img = images[i];
  if (!img) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent fullscreen className="bg-ink overscroll-contain">
        <VisuallyHidden><DialogPrimitive.Title>Galería de fotos</DialogPrimitive.Title></VisuallyHidden>
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          Foto {i + 1} de {images.length}
        </span>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-white">
            <span className="font-mono text-[12px]">{i + 1} / {images.length}</span>
            <DialogClose aria-label="Cerrar" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </DialogClose>
          </div>
          <div className="relative flex-1">
            <Image
              key={img.id}
              src={img.url}
              alt={img.altText ?? alt}
              fill
              sizes="100vw"
              className="object-contain"
              placeholder={img.blurhash ? 'blur' : 'empty'}
              blurDataURL={img.blurhash ? blurhashToDataURL(img.blurhash) : undefined}
              priority
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Foto anterior"
                  className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Foto siguiente"
                  className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" d="M9 18l6-6-6-6" /></svg>
                </button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
