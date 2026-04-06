import { ListingCard } from './ListingCard';
import { ListingCardSkeleton } from './ListingCardSkeleton';
import type { ListingCard as ListingCardType } from '@/types/domain';
import { cn } from '@/lib/cn';

export function ListingGrid({
  listings,
  className,
}: {
  listings: ListingCardType[];
  className?: string;
}) {
  return (
    <div
      data-reveal-stagger
      data-reveal-stagger-each="0.06"
      data-reveal-y="16"
      data-reveal-start="top 92%"
      className={cn(
        'grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {listings.map((l, i) => (
        <ListingCard key={l.id} listing={l} priority={i < 4} />
      ))}
    </div>
  );
}

export function ListingGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}
