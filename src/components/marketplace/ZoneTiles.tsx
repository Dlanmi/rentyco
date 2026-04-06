import Link from 'next/link';
import type { CityConfig } from '@/lib/cities';

export function ZoneTiles({ city }: { city: CityConfig }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
      <div className="mb-10 max-w-2xl">
        <span className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-teal">
          Explora por zona
        </span>
        <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-ink">
          Encuentra tu barrio
        </h2>
      </div>
      <div
        data-reveal-stagger
        data-reveal-stagger-each="0.06"
        data-reveal-y="16"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {city.featuredZones.map((z) => (
          <Link
            key={z.slug}
            href={`/${city.slug}/arriendos?zona=${z.slug}`}
            className="group relative block overflow-hidden rounded-2xl ring-1 ring-border no-underline"
          >
            <div
              className="aspect-[3/2] bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${z.image}), linear-gradient(135deg, var(--color-teal-lighter), var(--color-sand-dark))` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <h3 className="font-display text-[22px] leading-tight">{z.name}</h3>
              <p className="mt-1 font-body text-[13px] text-white/85">{z.blurb}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
