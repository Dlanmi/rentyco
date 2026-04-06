import { Skeleton } from '@/components/ui/Skeleton';

export function ListingCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
      <div className="mt-3 flex flex-col gap-1.5">
        <Skeleton className="h-4 w-2/3 rounded" />
        <Skeleton className="h-3.5 w-4/5 rounded" />
        <Skeleton className="h-3.5 w-1/2 rounded" />
        <Skeleton className="mt-0.5 h-4 w-1/3 rounded" />
      </div>
    </div>
  );
}
