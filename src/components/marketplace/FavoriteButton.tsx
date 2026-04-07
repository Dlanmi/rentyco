'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { toggleFavorite } from '@/app/actions/favorites';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/cn';

export function FavoriteButton({
  listingId,
  initialFavorited = false,
  size = 40,
  className,
}: {
  listingId: string;
  initialFavorited?: boolean;
  size?: number;
  className?: string;
}) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, start] = useTransition();
  const iconRef = useRef<SVGSVGElement>(null);

  useEffect(() => { setFavorited(initialFavorited); }, [initialFavorited]);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const nextVal = !favorited;
    setFavorited(nextVal); // optimistic

    if (!prefersReducedMotion() && iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        { scale: 0.75 },
        { scale: 1, ease: 'back.out(2.5)', duration: 0.4 }
      );
    }

    start(async () => {
      const res = await toggleFavorite(listingId);
      if (!res.ok) {
        setFavorited(!nextVal); // rollback
        if (res.code === 'UNAUTHENTICATED') {
          toast('Inicia sesión para guardar favoritos', {
            action: { label: 'Entrar', onClick: () => router.push(`/entrar?next=${encodeURIComponent(location.pathname)}`) },
          });
        } else {
          toast.error(res.message);
        }
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={favorited}
      aria-label={favorited ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      disabled={pending}
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-white/85 backdrop-blur ring-1 ring-border transition-colors hover:bg-white',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal',
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        ref={iconRef}
        className={cn('transition-colors', favorited ? 'fill-coral stroke-coral' : 'fill-transparent stroke-ink/80')}
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 24 24"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
