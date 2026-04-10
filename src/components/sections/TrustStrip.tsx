import { ShieldCheck, Lock, Eye } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

const items = [
  {
    icon: <Icon icon={ShieldCheck} className="h-4 w-4 text-teal" />,
    title: 'Datos protegidos',
    sub: 'Ley 1581 de 2012',
  },
  {
    icon: <Icon icon={Lock} className="h-4 w-4 text-teal" />,
    title: 'Datos encriptados',
    sub: 'En tránsito y en reposo',
  },
  {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 32 24" fill="none" aria-hidden="true">
        <rect width="32" height="12" fill="#FCD116" />
        <rect y="12" width="32" height="6" fill="#003893" />
        <rect y="18" width="32" height="6" fill="#CE1126" />
      </svg>
    ),
    title: 'Hecho en Colombia',
    sub: 'Bogotá, 2026',
  },
  {
    icon: <Icon icon={Eye} className="h-4 w-4 text-teal" />,
    title: 'Score transparente',
    sub: 'Criterios públicos',
  },
] as const;

export default function TrustStrip() {
  return (
    <section className="border-y border-border bg-surface py-5 lg:py-6">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-6 lg:gap-10">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal/10">
                {item.icon}
              </div>
              <div>
                <span className="block font-heading text-label font-600 text-ink">
                  {item.title}
                </span>
                <span className="block font-mono text-[11px] text-ink-muted">
                  {item.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
