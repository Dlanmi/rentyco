import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      <div className="mb-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-80" />
      </div>
      <div className="mb-8 flex flex-wrap gap-3">
        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px] rounded-2xl" />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[68px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
