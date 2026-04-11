import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div>
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-2 h-4 w-64" />
      <section className="mt-8">
        <Skeleton className="mb-4 h-4 w-44" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-white p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="h-16 w-20 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="mt-2 h-3 w-1/2" />
                  <Skeleton className="mt-3 h-3 w-full" />
                  <Skeleton className="mt-1 h-3 w-5/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
