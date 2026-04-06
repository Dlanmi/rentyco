import { ListingCard } from './ListingCard';
import type { ListingCard as ListingCardType } from '@/types/domain';

export function SimilarListings({ listings }: { listings: ListingCardType[] }) {
  if (!listings.length) return null;
  return (
    <section className="mt-16">
      <h2 className="mb-6 font-display text-[clamp(1.4rem,3vw,2rem)] leading-tight text-ink">
        Arriendos parecidos
      </h2>
      <div className="flex gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible">
        {listings.map((l) => (
          <div key={l.id} className="w-70 shrink-0 lg:w-auto">
            <ListingCard listing={l} />
          </div>
        ))}
      </div>
    </section>
  );
}
