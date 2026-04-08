'use client';

import Image from 'next/image';
import { useState } from 'react';
import { blurhashToDataURL } from '@/lib/blurhash';
import { Lightbox } from './Lightbox';
import { CardCarousel } from './CardCarousel';
import type { ListingImage } from '@/types/domain';

export function GalleryGrid({ images, alt }: { images: ListingImage[]; alt: string }) {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  if (!images.length) {
    return <div className="aspect-[16/9] w-full rounded-2xl bg-sand-dark" />;
  }

  const hero = images[0]!;
  const rest = images.slice(1, 5);

  return (
    <>
      {/* Mobile carousel */}
      <div className="lg:hidden">
        <CardCarousel images={images} alt={alt} priority aspect="wide" showArrows={false} sizes="(max-width: 1023px) 100vw, 1px" />
      </div>

      {/* Desktop grid */}
      <div className="hidden lg:block">
        <div
          className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl ring-1 ring-border"
          style={{ height: 'clamp(360px, 52vh, 560px)' }}
        >
          <button
            type="button"
            onClick={() => { setStartIndex(0); setOpen(true); }}
            className="relative col-span-2 row-span-2 block"
          >
            <Image
              src={hero.url}
              alt={hero.altText ?? `${alt} - foto principal`}
              fill
              sizes="50vw"
              className="object-cover"
              priority
              placeholder={hero.blurhash ? 'blur' : 'empty'}
              blurDataURL={hero.blurhash ? blurhashToDataURL(hero.blurhash) : undefined}
            />
          </button>
          {rest.map((img, i) => {
            const isLastWithMore = i === rest.length - 1 && images.length > 5;
            return (
              <button
                key={img.id}
                type="button"
                onClick={() => { setStartIndex(isLastWithMore ? 0 : i + 1); setOpen(true); }}
                className="relative block overflow-hidden"
              >
                <Image
                  src={img.url}
                  alt={img.altText ?? `${alt} - foto ${i + 2}`}
                  fill
                  sizes="25vw"
                  className="object-cover"
                  placeholder={img.blurhash ? 'blur' : 'empty'}
                  blurDataURL={img.blurhash ? blurhashToDataURL(img.blurhash) : undefined}
                />
                {isLastWithMore && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/50 backdrop-blur-[2px] transition-colors hover:bg-ink/60">
                    <svg className="mb-1.5 h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <span className="font-heading text-[13px] font-600 text-white">
                      Ver las {images.length} fotos
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Lightbox open={open} onOpenChange={setOpen} images={images} alt={alt} startIndex={startIndex} />
    </>
  );
}
