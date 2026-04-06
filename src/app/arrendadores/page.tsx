import type { Metadata } from 'next';
import { buildMetadata, buildWebPageSchema, buildBreadcrumbSchema } from '@/lib/seo';
import JsonLd from '@/components/layout/JsonLd';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WaitlistForm from '@/components/sections/WaitlistForm';
import Animations from './Animations';

const pageSeo = {
  title: 'Para arrendadores — Renty | Arriende con datos, no con fe',
  description:
    'Renty le da certeza antes de arrendar. Perfiles verificados con Renty Score, historial de pagos real y contratos digitales. Reduzca vacancia y riesgo de impago. Gratis durante el lanzamiento.',
  path: '/arrendadores',
  ogSlug: 'arrendadores',
};

export const metadata: Metadata = buildMetadata(pageSeo);

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Para arrendadores', url: '/arrendadores' },
];

const faqs = [
  {
    q: '¿Cómo funciona el Renty Score para arrendadores?',
    a: 'El Renty Score es una calificación de 0 a 900 que refleja el historial de pago real de un inquilino. Se construye con datos verificados de arrendadores anteriores, pagos de servicios públicos y comportamiento financiero — no solo con Datacrédito. Usted recibe un perfil completo del candidato antes de firmar contrato.',
  },
  {
    q: '¿Cuánto cuesta usar Renty como arrendador?',
    a: 'Durante la fase de lanzamiento, la consulta de perfiles y el Renty Score son completamente gratuitos para arrendadores. Queremos que pruebe el sistema sin compromiso. La estructura de precios definitiva se comunicará antes de salir de la fase beta.',
  },
  {
    q: '¿Qué pasa si mi inquilino actual no tiene Renty Score?',
    a: 'Puede invitar a su inquilino actual a crear su perfil en Renty. Si usted confirma su historial de pago como arrendador anterior, el inquilino comienza a construir su score. Es un beneficio para ambos: el inquilino gana historial verificable y usted contribuye a un ecosistema más transparente.',
  },
  {
    q: '¿Renty reemplaza la inmobiliaria o el contrato tradicional?',
    a: 'No. Renty complementa su proceso actual. Le damos una capa adicional de información verificada sobre el candidato que ni la inmobiliaria ni Datacrédito pueden ofrecer: historial real de pagos de arriendo. Además, ofrecemos contratos digitales con firma electrónica para formalizar acuerdos.',
  },
  {
    q: '¿Qué datos del inquilino puedo ver?',
    a: 'Con autorización del inquilino, usted puede ver: Renty Score, historial de pagos de arriendos anteriores, verificación de identidad, estabilidad de ingresos (sin revelar montos exactos) y referencias de arrendadores previos. Todo bajo cumplimiento de la Ley 1581 de protección de datos.',
  },
  {
    q: '¿Cómo registro mis propiedades en Renty?',
    a: 'El proceso es simple: cree su cuenta de arrendador, registre sus inmuebles con dirección y características básicas, y empiece a recibir candidatos pre-verificados. Durante el lanzamiento estamos priorizando propiedades en Bogotá, con expansión a Medellín y Cali en 2027.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildWebPageSchema({ ...pageSeo, hasBreadcrumb: true })} id="ld-webpage" />
      <JsonLd data={buildBreadcrumbSchema(pageSeo.path, breadcrumbs)} id="ld-breadcrumb" />
      <JsonLd data={faqJsonLd} id="ld-faq" />
      <Navbar />

      <main id="main-content" tabIndex={-1}>
        {/* HERO */}
        <section className="relative overflow-hidden bg-sand py-24 lg:py-36">
          <div
            className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, #0D6B58, transparent 70%)' }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full opacity-[0.05]"
            style={{ background: 'radial-gradient(circle, #E8634A, transparent 70%)' }}
          />

          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mx-auto max-w-3xl text-center">
              <span data-hero-label className="mb-4 inline-block rounded-full border border-teal/20 bg-teal-lighter px-4 py-1.5 font-mono text-[12px] font-500 tracking-[0.1em] uppercase text-teal">
                Para arrendadores
              </span>
              <div data-hero-title>
                <h1 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.1] text-ink">
                  Arriende con datos,<br />no con fe.
                </h1>
              </div>
              <p data-hero-text className="mx-auto mt-6 max-w-xl font-body text-lg leading-relaxed text-ink-secondary">
                Usted no pide codeudor porque quiera finca raíz. Lo pide porque necesita certeza de que le van a pagar. Renty le da esa certeza con datos verificados.
              </p>
              <div data-hero-ctas className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="/renty-score/formulario?tipo=arrendador"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal px-8 py-4 font-heading text-[15px] font-600 text-white no-underline transition-all duration-200 hover:-translate-y-px hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/20"
                >
                  Registrar mis propiedades
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href="#como-ayuda"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-8 py-4 font-heading text-[15px] font-600 text-ink no-underline transition-all duration-200 hover:-translate-y-px hover:shadow-md"
                >
                  Ver cómo funciona
                </a>
              </div>
              <p data-hero-proof className="mt-8 font-mono text-[12px] text-ink-muted">
                Gratis durante el lanzamiento · Sin compromiso · Bogotá 2026
              </p>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section data-problem className="bg-sand-dark py-24 lg:py-32" id="problema-arrendador">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div data-problem-header className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
              <span className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-coral">
                El problema
              </span>
              <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-ink">
                Arrendar en Colombia<br />es un acto de fe.
              </h2>
              <p className="mt-4 font-body text-lg leading-relaxed text-ink-secondary">
                El arrendador colombiano enfrenta vacancia prolongada, riesgo de impago y un sistema legal que no lo protege. Y las herramientas para evaluar inquilinos siguen siendo las mismas de hace 20 años.
              </p>
            </div>

            <div data-stats className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <div data-stat-card className="group rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03]">
                <span
                  className="block font-mono text-[clamp(2.5rem,4vw,3.2rem)] font-500 leading-none text-coral"
                  data-count="3.9"
                  data-suffix=" meses"
                  data-decimals="1"
                >
                  0 meses
                </span>
                <span className="mt-2 block font-heading text-[15px] font-600 text-ink">Tiempo promedio de vacancia</span>
                <p className="mt-2 font-body text-[14px] leading-relaxed text-ink-muted">
                  En Bogotá, un inmueble tarda en promedio 3.9 meses en arrendarse. Eso son casi 4 meses sin ingreso por canon.
                </p>
                <span className="mt-3 block font-mono text-[11px] text-ink-muted/60">Fedelonjas 2024</span>
              </div>

              <div data-stat-card className="group rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03]">
                <span
                  className="block font-mono text-[clamp(2.5rem,4vw,3.2rem)] font-500 leading-none text-coral"
                  data-count="3"
                  data-suffix="–12 meses"
                  data-decimals="0"
                >
                  0–12 meses
                </span>
                <span className="mt-2 block font-heading text-[15px] font-600 text-ink">Para desahuciar un inquilino</span>
                <p className="mt-2 font-body text-[14px] leading-relaxed text-ink-muted">
                  El proceso de restitución de inmueble en Colombia tarda entre 3 y 12 meses. Con abogado, demanda y audiencias. Mientras tanto, cero ingresos.
                </p>
                <span className="mt-3 block font-mono text-[11px] text-ink-muted/60">Asobancaria / Lonja de Propiedad Raíz</span>
              </div>

              <div data-stat-card className="group rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03]">
                <span
                  className="block font-mono text-[clamp(2.5rem,4vw,3.2rem)] font-500 leading-none text-coral"
                  data-count="57"
                  data-suffix="%"
                  data-decimals="0"
                >
                  0%
                </span>
                <span className="mt-2 block font-heading text-[15px] font-600 text-ink">Contratos son verbales</span>
                <p className="mt-2 font-body text-[14px] leading-relaxed text-ink-muted">
                  Más de la mitad de los contratos de arriendo en Colombia son de palabra. Sin protección legal para el propietario ni para el inquilino.
                </p>
                <span className="mt-3 block font-mono text-[11px] text-ink-muted/60">Fedelonjas 2024</span>
              </div>

              <div data-stat-card className="group rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03]">
                <span className="block font-mono text-[clamp(2.5rem,4vw,3.2rem)] font-500 leading-none text-coral">
                  <svg className="inline-block h-10 w-10" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                    <circle cx="20" cy="20" r="16" />
                    <path d="M20 12v1M20 27v1M12 20h1M27 20h1" />
                    <path d="M15 15l.5.5M24.5 24.5l.5.5M15 25l.5-.5M24.5 15.5l.5-.5" />
                    <line x1="20" y1="14" x2="20" y2="20" strokeWidth={2} />
                    <line x1="20" y1="20" x2="25" y2="23" strokeWidth={2} />
                  </svg>
                </span>
                <span className="mt-2 block font-heading text-[15px] font-600 text-ink">Sin historial verificable</span>
                <p className="mt-2 font-body text-[14px] leading-relaxed text-ink-muted">
                  No existe un sistema centralizado para verificar si un candidato a inquilino ha pagado puntualmente en arriendos anteriores. Usted decide a ciegas.
                </p>
                <span className="mt-3 block font-mono text-[11px] text-ink-muted/60">Realidad del mercado colombiano</span>
              </div>
            </div>
          </div>
        </section>

        {/* HOW RENTY HELPS */}
        <section className="py-24 lg:py-32" id="como-ayuda">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
              <span className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-teal">
                La solución
              </span>
              <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-ink">
                Certeza antes de firmar,<br />no después de perder.
              </h2>
              <p className="mt-4 font-body text-lg leading-relaxed text-ink-secondary">
                Renty le entrega información verificada de cada candidato para que usted tome decisiones con datos, no con intuición.
              </p>
            </div>

            <div data-landlord-grid className="grid gap-5 md:grid-cols-2">
              {/* Card 1: Renty Score */}
              <div data-landlord-card className="rounded-2xl border border-border bg-sand-dark p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03]">
                <div className="mb-4 text-teal">
                  <svg className="h-9 w-9" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                    <path d="M18 3l13 7v11c0 7-13 13-13 13S5 28 5 21V10L18 3z" />
                    <path d="M12 18l4 4 8-8" />
                  </svg>
                </div>
                <h3 className="mb-2 font-heading text-[17px] font-700 text-ink">Perfiles verificados con Renty Score</h3>
                <p className="font-body text-[14px] leading-relaxed text-ink-muted">
                  Cada candidato tiene un score de 0 a 900 basado en historial de pago real, verificado directamente con arrendadores anteriores. No es Datacrédito: es comportamiento de arriendo comprobado.
                </p>
              </div>

              {/* Card 2: Payment history */}
              <div data-landlord-card className="rounded-2xl border border-border bg-sand-dark p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03]">
                <div className="mb-4" style={{ color: '#10B981' }}>
                  <svg className="h-9 w-9" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                    <polyline points="3,28 10,22 17,25 24,14 33,6" />
                    <polyline points="24,6 33,6 33,14" />
                  </svg>
                </div>
                <h3 className="mb-2 font-heading text-[17px] font-700 text-ink">Historial de pagos de arriendos anteriores</h3>
                <p className="font-body text-[14px] leading-relaxed text-ink-muted">
                  Vea cuánto tiempo lleva pagando arriendo su candidato, si ha tenido atrasos, y qué dicen sus arrendadores anteriores. Información que hoy no existe en ningún reporte crediticio.
                </p>
              </div>

              {/* Card 3: Reduce vacancy */}
              <div data-landlord-card className="rounded-2xl border border-border bg-sand-dark p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03]">
                <div className="mb-4 text-coral">
                  <svg className="h-9 w-9" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                    <circle cx="18" cy="18" r="14" />
                    <polyline points="18,8 18,18 26,22" />
                  </svg>
                </div>
                <h3 className="mb-2 font-heading text-[17px] font-700 text-ink">Reduzca el tiempo de vacancia</h3>
                <p className="font-body text-[14px] leading-relaxed text-ink-muted">
                  Hoy tarda 3.9 meses en arrendar en Bogotá. Con inquilinos pre-verificados y listos para firmar, usted conecta más rápido con candidatos confiables y reduce meses sin ingreso.
                </p>
              </div>

              {/* Card 4: Digital contracts */}
              <div data-landlord-card className="rounded-2xl border border-border bg-sand-dark p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03]">
                <div className="mb-4 text-teal">
                  <svg className="h-9 w-9" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                    <rect x="5" y="3" width="26" height="30" rx="2" />
                    <line x1="11" y1="11" x2="25" y2="11" />
                    <line x1="11" y1="17" x2="25" y2="17" />
                    <line x1="11" y1="23" x2="20" y2="23" />
                    <path d="M22 27l3 3 5-5" strokeWidth={2} />
                  </svg>
                </div>
                <h3 className="mb-2 font-heading text-[17px] font-700 text-ink">Contratos formales con firma digital</h3>
                <p className="font-body text-[14px] leading-relaxed text-ink-muted">
                  El 57% de contratos en Colombia son verbales. Renty le permite generar contratos digitales con firma electrónica válida legalmente, protegiendo a ambas partes desde el día uno.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section data-testimonial className="bg-sand-dark py-24 lg:py-32">
          <div className="mx-auto max-w-3xl px-6 lg:px-12">
            <span className="mb-8 block text-center font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-coral">
              Historia representativa
            </span>
            <div className="relative mb-8 pl-7">
              <div data-testimonial-line className="absolute top-1 bottom-1 left-0 w-[3px] rounded-full bg-teal"></div>
              <blockquote data-testimonial-quote className="font-display text-[clamp(1.2rem,3vw,1.6rem)] leading-[1.5] text-ink">
                “Llevo 15 años arrendando y el peor golpe fue un inquilino que dejó de pagar 8 meses. Tenía buen puntaje en Datacrédito, pero resulta que ya había hecho lo mismo en otro apartamento. No había forma de saberlo.”
              </blockquote>
            </div>
            <p data-testimonial-narrative className="max-w-2xl font-body text-[15px] leading-relaxed text-ink-muted">
              Este arrendador tiene 3 apartamentos en Bogotá que compró como inversión. El proceso de restitución le tomó 11 meses y más de $4 millones en abogados. Al final recuperó el inmueble, pero nunca los 8 meses de canon perdido. Hoy sigue pidiendo codeudor con finca raíz porque no conoce otra forma de protegerse. Datacrédito no alcanzó a advertirle.
            </p>
            <div data-testimonial-attr className="mt-8 flex items-center gap-4 border-t border-border pt-7">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral-light font-heading text-sm font-700 text-coral">CR</div>
              <div>
                <span className="block font-heading text-[15px] font-600 text-ink">Carlos R.</span>
                <span className="font-body text-[13px] text-ink-muted">Arrendador — 3 inmuebles en Bogotá</span>
              </div>
            </div>
            <p className="mt-6 font-mono text-[11px] leading-relaxed text-ink-muted/70">
              * Historia basada en casos recurrentes recopilados en nuestra investigación. Nombre modificado por privacidad.
            </p>
          </div>
        </section>

        {/* PRICING PREVIEW */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mx-auto max-w-2xl text-center">
              <span className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-teal">
                Precio
              </span>
              <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-ink">
                Consulta gratuita<br />durante el lanzamiento
              </h2>
              <p className="mt-4 font-body text-lg leading-relaxed text-ink-secondary">
                Queremos que conozca Renty sin riesgo. Durante la fase de lanzamiento en Bogotá, el acceso a perfiles verificados y Renty Score es completamente gratis para arrendadores.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-lg">
              <div className="rounded-2xl border-2 border-teal bg-surface p-8 text-center shadow-lg shadow-teal/5">
                <span className="inline-block rounded-full bg-teal-lighter px-4 py-1 font-mono text-[11px] font-500 tracking-[0.1em] uppercase text-teal">
                  Lanzamiento
                </span>
                <div className="mt-5">
                  <span className="font-display text-[clamp(2.5rem,5vw,3.5rem)] leading-none text-ink">$0</span>
                  <span className="ml-1 font-body text-ink-muted">/ mes</span>
                </div>
                <p className="mt-3 font-body text-[14px] text-ink-secondary">
                  Acceso completo mientras dure la fase beta
                </p>
                <ul className="mx-auto mt-6 max-w-xs space-y-3 text-left">
                  <li className="flex items-start gap-3 font-body text-[14px] text-ink-secondary">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-teal" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Consulta de Renty Score ilimitada
                  </li>
                  <li className="flex items-start gap-3 font-body text-[14px] text-ink-secondary">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-teal" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Perfiles verificados de candidatos
                  </li>
                  <li className="flex items-start gap-3 font-body text-[14px] text-ink-secondary">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-teal" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Historial de pagos anteriores
                  </li>
                  <li className="flex items-start gap-3 font-body text-[14px] text-ink-secondary">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-teal" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Contratos digitales con firma electrónica
                  </li>
                  <li className="flex items-start gap-3 font-body text-[14px] text-ink-secondary">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-teal" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Registro de hasta 10 inmuebles
                  </li>
                </ul>
                <a
                  href="/renty-score/formulario?tipo=arrendador"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal px-8 py-4 font-heading text-[15px] font-600 text-white no-underline transition-all duration-200 hover:-translate-y-px hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/20"
                >
                  Registrar mis propiedades
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <p className="mt-4 font-mono text-[11px] text-ink-muted">
                  Sin tarjeta de crédito · Sin compromiso
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-sand-dark py-24 lg:py-32" id="faq-arrendadores">
          <div className="mx-auto max-w-3xl px-6 lg:px-12">
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-teal">
                Preguntas frecuentes
              </span>
              <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-ink">
                Lo que nos preguntan<br />los arrendadores
              </h2>
            </div>

            <div className="space-y-4" data-faq-list>
              {faqs.map((faq) => (
                <details key={faq.q} className="group rounded-2xl border border-border bg-surface transition-all duration-200 hover:shadow-md hover:shadow-black/[0.02]" data-faq-item>
                  <summary className="flex cursor-pointer items-center justify-between gap-4 px-7 py-5 font-heading text-[15px] font-600 text-ink [&::-webkit-details-marker]:hidden list-none">
                    <span>{faq.q}</span>
                    <svg className="h-5 w-5 shrink-0 text-ink-muted transition-transform duration-200 group-open:rotate-45" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                    </svg>
                  </summary>
                  <div className="px-7 pb-6 pt-0">
                    <p className="font-body text-[14px] leading-relaxed text-ink-secondary">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA / WAITLIST */}
        <div data-waitlist>
          <WaitlistForm
            dark
            sectionId="waitlist"
            title="Registre sus propiedades"
            subtitle="Sea de los primeros arrendadores en acceder a perfiles verificados con Renty Score. Gratis durante el lanzamiento."
            submitLabel="Registrar mis propiedades"
          />
        </div>
      </main>

      <Footer />
      <Animations />
    </>
  );
}
