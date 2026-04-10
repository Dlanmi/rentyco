import Link from 'next/link';
import type { CityConfig } from '@/lib/cities';

export function CityHero({ city }: { city: CityConfig }) {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div
        data-parallax
        className="absolute inset-0 opacity-60"
        style={{
          background: `linear-gradient(180deg, rgba(28,25,23,0.45) 0%, rgba(28,25,23,0.7) 100%), url(${city.heroImage}) center/cover`,
        }}
      />
      <div className="relative mx-auto flex max-w-7xl flex-col justify-end px-6 py-20 min-h-[56vh] lg:px-12 lg:py-24 lg:min-h-[70vh]">
        <div className="max-w-3xl text-white">
          <span data-reveal data-reveal-y="24" className="mb-4 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-white/80">
            {city.heroEyebrow}
          </span>
          <h1
            data-reveal
            data-reveal-y="24"
            data-reveal-delay="0.08"
            className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-tight"
          >
            {city.heroTitle}
          </h1>
          <p
            data-reveal
            data-reveal-y="24"
            data-reveal-delay="0.16"
            className="mt-4 max-w-xl font-body text-[clamp(0.95rem,1.5vw,1.15rem)] leading-relaxed text-white/85"
          >
            {city.heroSub}
          </p>
          <div
            data-reveal
            data-reveal-y="24"
            data-reveal-delay="0.24"
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href={`/${city.slug}/arriendos`}
              className="inline-flex items-center gap-2 rounded-xl bg-coral px-6 py-3.5 font-heading text-md font-600 text-white no-underline shadow-lg shadow-coral/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-coral-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
            >
              Ver arriendos
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <Link
              href="/renty-score/formulario"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-heading text-md font-600 text-white no-underline backdrop-blur transition-all hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
            >
              Calcula tu score
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
