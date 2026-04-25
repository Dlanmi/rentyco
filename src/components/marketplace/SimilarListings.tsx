import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { ListingCard } from './ListingCard';
import type { ListingCard as ListingCardType } from '@/types/domain';

interface Props {
  listings: ListingCardType[];
  citySlug?: string;
  neighborhood?: string | null;
  neighborhoodSlug?: string | null;
}

export function SimilarListings({ listings, citySlug, neighborhood, neighborhoodSlug }: Props) {
  if (!listings.length) return null;

  const browseHref = neighborhoodSlug && citySlug
    ? `/${citySlug}/arriendos?zona=${neighborhoodSlug}`
    : citySlug
      ? `/${citySlug}/arriendos`
      : '/bogota/arriendos';

  const browseLabel = neighborhood ? `Ver más en ${neighborhood}` : 'Ver más arriendos';

  return (
    <section className="mt-2">
      <header className="mb-7 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="max-w-xl">
          <span className="font-mono text-[11px] font-600 uppercase tracking-[0.14em] text-coral">
            También pueden gustarte
          </span>
          <h2 className="mt-2 font-display text-[clamp(1.4rem,3.4vw,2rem)] leading-tight tracking-tight text-ink">
            Otros arriendos parecidos.
          </h2>
          <p className="mt-2 font-body text-[14px] leading-relaxed text-ink-muted">
            Inmuebles verificados que coinciden con esta zona y este rango de precio.
          </p>
        </div>
        <Link
          href={browseHref}
          className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-teal px-5 py-2.5 font-heading text-[13.5px] font-600 text-teal no-underline transition-all hover:bg-teal hover:text-white sm:self-auto"
        >
          {browseLabel}
          <Icon
            icon={ArrowRight}
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </header>

      {/* Mobile: horizontal scroll. Desktop: 4-col grid. */}
      <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0 xl:grid-cols-4">
        {listings.map((l) => (
          <div key={l.id} className="w-[78%] shrink-0 sm:w-[58%] md:w-[44%] lg:w-auto">
            <ListingCard listing={l} />
          </div>
        ))}
      </div>
    </section>
  );
}
