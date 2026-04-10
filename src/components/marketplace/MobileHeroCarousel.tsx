'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { blurhashToDataURL } from '@/lib/blurhash';
import { ScrollTrigger } from '@/lib/gsap';
import { Lightbox } from './Lightbox';
import { FavoriteButton } from './FavoriteButton';
import { ShareButton } from './ShareButton';
import type { ListingImage } from '@/types/domain';

interface Props {
  images: ListingImage[];
  alt: string;
  listingId: string;
  initialFavorited?: boolean;
  shareTitle: string;
  shareUrl: string;
}

export function MobileHeroCarousel({
  images,
  alt,
  listingId,
  initialFavorited,
  shareTitle,
  shareUrl,
}: Props) {
  const router = useRouter();
  const [emblaRef, embla] = useEmblaCarousel({ loop: false });
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on('select', onSelect);
    onSelect();
    return () => {
      embla.off('select', onSelect);
    };
  }, [embla]);

  // Refresh GSAP scroll triggers after carousel settles its layout
  useEffect(() => {
    if (!embla) return;
    const onResize = () => ScrollTrigger.refresh();
    embla.on('resize', onResize);
    const timer = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => {
      embla.off('resize', onResize);
      clearTimeout(timer);
    };
  }, [embla]);

  if (!images.length) {
    return <div className="aspect-[5/4] w-full bg-sand-dark" style={{ aspectRatio: '5/4' }} />;
  }

  return (
    <>
      <div className="relative w-full overflow-hidden overscroll-contain">
        {/* Carousel */}
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {images.map((img, i) => (
              <div
                key={img.id}
                onPointerDown={(e) => {
                  pointerStart.current = { x: e.clientX, y: e.clientY };
                }}
                onPointerUp={(e) => {
                  const start = pointerStart.current;
                  if (start && Math.abs(e.clientX - start.x) < 5 && Math.abs(e.clientY - start.y) < 5) {
                    setLightboxOpen(true);
                  }
                  pointerStart.current = null;
                }}
                className="relative aspect-[5/4] min-w-0 flex-[0_0_100%] cursor-pointer"
                style={{ aspectRatio: '5/4' }}
              >
                <Image
                  src={img.url}
                  alt={img.altText ?? `${alt} - foto ${i + 1}`}
                  fill
                  sizes="(max-width: 1023px) 100vw, 1px"
                  className="object-cover"
                  priority={i === 0}
                  placeholder={img.blurhash ? 'blur' : 'empty'}
                  blurDataURL={
                    img.blurhash ? blurhashToDataURL(img.blurhash) : undefined
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Gradient overlays for button legibility */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
          aria-label="Volver"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Share + Favorite */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <ShareButton title={shareTitle} url={shareUrl} />
          <FavoriteButton
            listingId={listingId}
            initialFavorited={initialFavorited}
            size={36}
          />
        </div>

        {/* Counter pill */}
        {images.length > 1 && (
          <div className="absolute bottom-8 right-4 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
            {selected + 1} / {images.length}
          </div>
        )}
      </div>

      <Lightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        images={images}
        alt={alt}
        startIndex={selected}
      />
    </>
  );
}
