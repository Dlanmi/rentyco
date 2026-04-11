import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div>
      <div className="mx-auto max-w-2xl px-5">
        <div className="rounded-2xl border border-border bg-white p-8">
          <div className="flex items-center justify-center">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
          <Skeleton className="mx-auto mt-6 h-4 w-40" />
          <Skeleton className="mx-auto mt-2 h-3 w-56" />
        </div>
        <div className="mt-6 rounded-2xl border border-border bg-white p-6">
          <Skeleton className="h-4 w-44" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
