import type { Metadata } from 'next';
import { buildMetadata, buildWebPageSchema, buildBreadcrumbSchema } from '@/lib/seo';
import JsonLd from '@/components/layout/JsonLd';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Waitlist from '@/components/sections/Waitlist';

const factors = [
  { name: 'Historial de pagos verificado', weight: '35%', color: '#0D6B58', desc: 'Contactamos directamente a tus arrendadores anteriores para verificar tu historial de pagos. No dependemos de centrales de riesgo tradicionales.' },
  { name: 'Continuidad de arriendo', weight: '25%', color: '#10B981', desc: 'Cuánto tiempo has vivido en cada lugar y la estabilidad de tu historial de vivienda. Más continuidad = más confianza.' },
  { name: 'Referencias de arrendadores', weight: '20%', color: '#E8634A', desc: 'Lo que dicen tus arrendadores anteriores sobre ti como inquilino. Cuidaste el inmueble? Fuiste buen vecino?' },
  { name: 'Pago de servicios públicos', weight: '10%', color: '#F59E0B', desc: 'Agua, luz, gas, internet: tus pagos de servicios son evidencia directa de tu responsabilidad financiera.' },
  { name: 'Datos financieros digitales', weight: '10%', color: '#A8A29E', desc: 'Actividad en Nequi, Daviplata y otras plataformas. 22 millones de colombianos ya generan estos datos a diario.' },
];

const ranges = [
  { range: '800–900', label: 'Excelente', color: '#0D6B58', desc: 'Acceso prioritario a inmuebles, mejores condiciones de arriendo, sin depósito adicional.' },
  { range: '700–799', label: 'Bueno', color: '#10B981', desc: 'Aprobación rápida con la mayoría de arrendadores. Condiciones estándar favorables.' },
  { range: '600–699', label: 'Aceptable', color: '#F59E0B', desc: 'Puede requerir condiciones adicionales como un mes de depósito extra o referencias adicionales.' },
  { range: '300–599', label: 'En construcción', color: '#A8A29E', desc: 'Tu historial es nuevo o limitado. Te ayudamos a construirlo con datos verificables.' },
];

const tips = [
  'Paga tu arriendo puntualmente — es el factor más importante (35%).',
  'Mantente en la misma vivienda el mayor tiempo posible.',
  'Pide a tu arrendador actual que te dé una referencia positiva.',
  'Mantén al día tus servicios públicos: agua, luz, gas.',
  'Usa Nequi o Daviplata para pagos — genera historial verificable.',
  'Si tienes contrato verbal, intenta formalizarlo por escrito.',
];

const faqs = [
  { q: '¿El Renty Score reemplaza a DataCrédito?', a: 'No. El Renty Score es un complemento que mide tu comportamiento como arrendatario. DataCrédito mide tu historial crediticio general. Son datos diferentes que se complementan.' },
  { q: '¿Cuánto tiempo tarda en calcularse mi score?', a: 'El proceso de verificación toma entre 3 y 5 días hábiles. Contactamos a tus arrendadores anteriores y cruzamos datos de servicios y pagos digitales.' },
  { q: '¿Qué pasa si nunca he arrendado antes?', a: 'Empiezas con un score base en la categoría "En construcción" (300-599). A medida que registras pagos y generas historial, tu puntaje sube.' },
  { q: '¿Mi score puede bajar?', a: 'Sí. Si dejas de pagar arriendo o servicios, o si un arrendador reporta un problema, tu score puede disminuir. Pero siempre puedes recuperarlo.' },
  { q: '¿Quién puede ver mi Renty Score?', a: 'Solo tú y los arrendadores a quienes tú autorices expresamente. Cumplimos con la Ley 1581 de 2012 de protección de datos personales.' },
  { q: '¿Es gratis calcular mi score?', a: 'Sí, durante el lanzamiento tu primer Renty Score es completamente gratuito. Si creas una cuenta, será gratuito de por vida.' },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Renty Score',
  provider: { '@id': 'https://rentyco.app/#organization' },
  description:
    'Puntuación alternativa de confiabilidad de arrendatario basada en historial de pagos reales, estabilidad y referencias.',
  areaServed: { '@type': 'Country', name: 'Colombia' },
  serviceType: 'Credit Scoring Alternativo',
  audience: { '@type': 'Audience', audienceType: 'Inquilinos y arrendadores en Colombia' },
};

const pageSeo = {
  title: 'Renty Score — Scoring alternativo para arrendar en Colombia',
  description:
    'El Renty Score mide cómo pagas, no cuánto tienes. Basado en historial de pagos, continuidad, referencias y datos financieros digitales. Conoce cómo funciona.',
  path: '/renty-score',
  ogSlug: 'renty-score',
};

export const metadata: Metadata = buildMetadata(pageSeo);

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Renty Score', url: '/renty-score' },
];

export default function RentyScorePage() {
  return (
    <>
      <JsonLd data={buildWebPageSchema({ ...pageSeo, hasBreadcrumb: true })} id="ld-webpage" />
      <JsonLd data={buildBreadcrumbSchema(pageSeo.path, breadcrumbs)} id="ld-breadcrumb" />
      <JsonLd data={faqJsonLd} id="ld-faq" />
      <JsonLd data={serviceJsonLd} id="ld-service" />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Hero — dark section with score gauge */}
        <section className="relative overflow-hidden pt-28 pb-20 lg:pb-28" style={{ backgroundColor: '#1C1917' }}>
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-12">
            <div>
              <span className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-coral">
                Renty Score
              </span>
              <h1 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.08] text-white">
                Un puntaje que mide<br />cómo pagas, no cuánto tienes.
              </h1>
              <p className="mt-5 max-w-lg font-body text-lg leading-relaxed text-white/75">
                El sistema tradicional mide tu patrimonio. El Renty Score mide tu comportamiento:
                pagos puntuales, estabilidad, referencias reales. Porque 7.3 millones de hogares
                colombianos merecen que su historial hable por ellos.
              </p>
              <a href="/renty-score/formulario" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-coral px-7 py-3.5 font-heading text-[15px] font-600 text-white no-underline transition-all duration-200 hover:-translate-y-0.5 hover:bg-coral-dark">
                Calcular mi score
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </a>
            </div>
            <div className="flex justify-center">
              <svg data-score viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[300px]">
                <circle cx="180" cy="180" r="140" stroke="#292524" strokeWidth="14" fill="none" />
                <circle data-score-arc cx="180" cy="180" r="140" stroke="#0D6B58" strokeWidth="14" fill="none" strokeLinecap="round" transform="rotate(-90 180 180)" />
                <text x="180" y="168" textAnchor="middle" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="56" fontWeight="500" fill="white">785</text>
                <text x="180" y="200" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="12" fill="#A8A29E" letterSpacing="0.14em">RENTY SCORE</text>
                <circle data-score-dot cx="75" cy="90" r="5" fill="#0D6B58" />
                <circle data-score-dot cx="48" cy="190" r="5" fill="#10B981" />
                <circle data-score-dot cx="100" cy="290" r="5" fill="#E8634A" />
                <circle data-score-dot cx="260" cy="290" r="5" fill="#F59E0B" />
                <circle data-score-dot cx="312" cy="190" r="5" fill="#A8A29E" />
              </svg>
            </div>
          </div>
        </section>

        {/* What is Renty Score */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-6 text-center lg:px-12" data-reveal>
            <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight text-ink">
              ¿Qué es el Renty Score?
            </h2>
            <p className="mt-5 font-body text-lg leading-relaxed text-ink-secondary">
              Es un sistema de scoring alternativo diseñado específicamente para el mercado de arriendo colombiano.
              Mientras DataCrédito mide si pagas tus deudas, el Renty Score mide si eres buen inquilino.
              No es un reemplazo de las centrales de riesgo: es un complemento que mide lo que ellas no pueden ver.
            </p>
            <div className="mx-auto mt-8 grid max-w-2xl gap-4 text-left sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-surface p-5 text-center">
                <p className="font-mono text-2xl font-500 text-teal">300–900</p>
                <p className="mt-1 font-body text-[13px] text-ink-muted">Rango del score</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-5 text-center">
                <p className="font-mono text-2xl font-500 text-teal">5</p>
                <p className="mt-1 font-body text-[13px] text-ink-muted">Fuentes de datos</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-5 text-center">
                <p className="font-mono text-2xl font-500 text-teal">3–5</p>
                <p className="mt-1 font-body text-[13px] text-ink-muted">Días para calcular</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5 Factors */}
        <section className="py-20 lg:py-28" style={{ backgroundColor: '#F0EDE5' }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mb-12 text-center" data-reveal>
              <span className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-teal">Los 5 factores</span>
              <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight text-ink">
                ¿Cómo se calcula tu score?
              </h2>
            </div>
            <div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              data-reveal-stagger
              data-reveal-fade="false"
              data-reveal-y="12"
              data-reveal-duration="0.32"
              data-reveal-stagger-each="0.05"
              data-reveal-start="top 98%"
            >
              {factors.map((f) => (
                <div key={f.name} className="rounded-2xl border border-border bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.04]">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-block h-3 w-3 rounded-full" style={{ background: f.color }}></span>
                    <span className="font-mono text-[28px] font-500" style={{ color: f.color }}>{f.weight}</span>
                  </div>
                  <h3 className="mb-2 font-heading text-[16px] font-700 text-ink">{f.name}</h3>
                  <p className="font-body text-[14px] leading-relaxed text-ink-muted">{f.desc}</p>
                </div>
              ))}
              <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-teal/35 bg-surface p-7 shadow-sm shadow-teal/5">
                <div className="text-center">
                  <p className="font-heading text-[15px] font-700 text-teal">= 100%</p>
                  <p className="mt-1 font-body text-[13px] text-ink-muted">Tu comportamiento real como inquilino</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Score Ranges */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-4xl px-6 lg:px-12">
            <div className="mb-12 text-center" data-reveal>
              <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight text-ink">
                ¿Qué significa mi puntaje?
              </h2>
            </div>
            <div className="space-y-4" data-reveal-stagger>
              {ranges.map((r) => (
                <div key={r.range} className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center">
                  <div className="flex shrink-0 items-center gap-3 sm:w-48">
                    <span className="inline-block h-3 w-12 rounded-full" style={{ background: r.color }}></span>
                    <div>
                      <p className="font-mono text-lg font-500 text-ink">{r.range}</p>
                      <p className="font-heading text-[13px] font-600" style={{ color: r.color }}>{r.label}</p>
                    </div>
                  </div>
                  <p className="font-body text-[15px] leading-relaxed text-ink-secondary">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to improve */}
        <section className="py-20 lg:py-28" style={{ backgroundColor: '#F0EDE5' }}>
          <div className="mx-auto max-w-3xl px-6 lg:px-12">
            <div className="mb-10 text-center" data-reveal>
              <span className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-teal">Consejos</span>
              <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight text-ink">
                ¿Cómo mejoro mi score?
              </h2>
            </div>
            <div className="space-y-3" data-reveal-stagger>
              {tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal font-mono text-[12px] font-500 text-white">{i + 1}</span>
                  <p className="font-body text-[15px] leading-relaxed text-ink-secondary">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-6 lg:px-12">
            <div className="mb-10 text-center" data-reveal>
              <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight text-ink">
                Preguntas frecuentes
              </h2>
            </div>
            <div className="space-y-4" data-reveal-stagger>
              {faqs.map((faq) => (
                <details key={faq.q} className="group rounded-xl border border-border bg-surface">
                  <summary className="flex cursor-pointer items-center justify-between p-5 font-heading text-[15px] font-600 text-ink [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <svg className="h-5 w-5 shrink-0 text-ink-muted transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M19 9l-7 7-7-7" /></svg>
                  </summary>
                  <div className="px-5 pb-5">
                    <p className="font-body text-[14px] leading-relaxed text-ink-secondary">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-6 text-center lg:px-12">
            <div className="rounded-2xl bg-teal-lighter p-12" data-reveal>
              <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] text-ink">¿Listo para conocer tu score?</h2>
              <p className="mx-auto mt-3 max-w-md font-body text-ink-secondary">
                Responde 12 preguntas y descubre tu puntaje como inquilino en menos de 3 minutos.
              </p>
              <a href="/renty-score/formulario" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal px-7 py-3.5 font-heading text-[15px] font-600 text-white no-underline transition-all hover:-translate-y-0.5 hover:bg-teal-dark">
                Calcular mi score
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Waitlist />
      <Footer />
    </>
  );
}
