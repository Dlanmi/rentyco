import { ListingGridSkeleton } from '@/components/marketplace/ListingGrid';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="bg-sand">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-12 lg:py-10">
        <Skeleton className="mb-3 h-4 w-48" />
        <Skeleton className="mb-8 h-12 w-80" />
        <ListingGridSkeleton count={8} />
      </div>
    </div>
  );
}
