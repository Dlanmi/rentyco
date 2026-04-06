import type { CityConfig } from '@/lib/cities';

export function StatsStrip({ stats }: { stats: CityConfig['stats'] }) {
  return (
    <section className="border-y border-border bg-sand-dark">
      <div
        data-reveal-stagger
        data-reveal-stagger-each="0.08"
        className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 lg:grid-cols-4 lg:px-12 lg:py-12"
      >
        {stats.map((s) => (
          <div key={s.label}>
            <div
              className="font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-none text-ink"
              data-count={s.count ?? undefined}
            >
              {s.value}
            </div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-wide text-ink-muted">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
