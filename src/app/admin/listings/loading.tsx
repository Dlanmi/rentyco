import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="mt-2 h-3 w-28" />
        </div>
        <Skeleton className="h-9 w-40 rounded-full" />
      </div>
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>
        <Skeleton className="ml-auto h-9 w-[260px] rounded-full" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-b-0">
            <Skeleton className="h-12 w-16 rounded-md" />
            <Skeleton className="h-4 flex-1 max-w-xs" />
            <Skeleton className="hidden h-5 w-16 rounded-full md:block" />
            <Skeleton className="hidden h-4 w-20 md:block" />
            <Skeleton className="hidden h-4 w-24 md:block" />
            <Skeleton className="hidden h-4 w-16 md:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
