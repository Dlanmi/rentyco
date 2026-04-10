'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { blurhashToDataURL } from '@/lib/blurhash';
import type { ListingImage } from '@/types/domain';
import { cn } from '@/lib/cn';

interface Props {
  images: ListingImage[];
  alt: string;
  priority?: boolean;
  aspect?: 'card' | 'wide';
  sizes?: string;
  showArrows?: boolean;
}

export function CardCarousel({
  images,
  alt,
  priority = false,
  aspect = 'card',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  showArrows = true,
}: Props) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: false, dragFree: false });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on('select', onSelect);
    onSelect();
    return () => { embla.off('select', onSelect); };
  }, [embla]);

  const prev = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    embla?.scrollPrev();
  }, [embla]);
  const next = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    embla?.scrollNext();
  }, [embla]);

  const hasMultiple = images.length > 1;
  const aspectClass = aspect === 'card' ? 'aspect-[4/3]' : 'aspect-[16/9]';

  if (!images.length) {
    return (
      <div className={cn('w-full overflow-hidden rounded-2xl bg-sand-dark ring-1 ring-border', aspectClass)} style={{ aspectRatio: aspect === 'card' ? '4/3' : '16/9' }} />
    );
  }

  return (
    <div className={cn('relative w-full overflow-hidden rounded-2xl ring-1 ring-border', aspectClass)} style={{ aspectRatio: aspect === 'card' ? '4/3' : '16/9' }}>
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {images.map((img, i) => (
            <div key={img.id} className="relative min-w-0 flex-[0_0_100%] overflow-hidden">
              <Image
                src={img.url}
                alt={img.altText ?? `${alt} - foto ${i + 1}`}
                fill
                sizes={sizes}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority={priority && i === 0}
                placeholder={img.blurhash ? 'blur' : 'empty'}
                blurDataURL={img.blurhash ? blurhashToDataURL(img.blurhash) : undefined}
              />
            </div>
          ))}
        </div>
      </div>

      {hasMultiple && showArrows && (
        <>
          <button
            type="button"
            aria-label="Foto anterior"
            onClick={prev}
            className={cn(
              'absolute left-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow transition-opacity hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 group-hover:opacity-100 md:flex',
              selected === 0 && 'pointer-events-none opacity-0'
            )}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button
            type="button"
            aria-label="Foto siguiente"
            onClick={next}
            className={cn(
              'absolute right-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow transition-opacity hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 group-hover:opacity-100 md:flex',
              selected === images.length - 1 && 'pointer-events-none opacity-0'
            )}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" d="M9 18l6-6-6-6" /></svg>
          </button>
        </>
      )}

      {hasMultiple && (
        <div className="pointer-events-none absolute inset-x-0 bottom-2.5 flex justify-center gap-[5px]">
          {images.map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-[6px] w-[6px] rounded-full transition-opacity',
                selected === i ? 'bg-white' : 'bg-white/50'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
