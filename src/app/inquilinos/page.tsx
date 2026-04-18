import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildWebPageSchema, buildBreadcrumbSchema } from '@/lib/seo';
import JsonLd from '@/components/layout/JsonLd';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Animations from './Animations';
import InquilinosCompare from './InquilinosCompare';
import InquilinosScoreDemo from './InquilinosScoreDemo';
import InquilinosTestimonials from './InquilinosTestimonials';
import InquilinosMap from './InquilinosMap';
import { listListingsForMap, getCityListingStats } from '@/lib/db/listings.repository';
import { formatCOP } from '@/lib/format';
import { whatsappHref } from '@/lib/site';

const pageSeo = {
  title: 'Arrienda sin Codeudor ni Fiador | Renty para Inquilinos',
  description:
    '¿Eres independiente, migrante o no tienes codeudor? Renty te permite arrendar usando tu historial de pago real como garantía. Calcula tu Renty Score gratis en Bogotá.',
  path: '/inquilinos',
  ogSlug: 'inquilinos',
};
export const metadata: Metadata = buildMetadata(pageSeo);

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Para inquilinos', url: '/inquilinos' },
];

const faqItems = [
  {
    q: '¿Qué es el Renty Score y por qué es diferente a DataCrédito?',
    a: 'El Renty Score mide tu comportamiento como inquilino — cómo pagas arriendo, qué tan estable es tu vivienda, tu flujo de ingresos. DataCrédito mide tu comportamiento como deudor — créditos, tarjetas, moras. Son dos cosas distintas. Puedes tener un DataCrédito malo por una tarjeta vieja y un Renty Score excelente porque llevas 8 años pagando arriendo sin fallar un mes.',
  },
  {
    q: '¿Cuánto cuesta calcular mi score?',
    a: 'Nada. Es 100% gratis, siempre. Ganamos cobrando una comisión pequeña a los arrendadores cuando firmas contrato — no a ti.',
  },
  {
    q: '¿Necesito contrato escrito para usar Renty?',
    a: 'No. De hecho, Renty existe justamente para quienes no tienen contrato. Verificamos tu historial con transferencias, recibos de pago, extractos bancarios o testimonio del arrendador anterior. Todo cuenta.',
  },
  {
    q: '¿Y si trabajo por Rappi, Nequi, o soy freelance?',
    a: 'Perfecto — ese es el tipo de historial que nos interesa. Conectamos con Nequi, Rappi, Bancolombia, Davivienda, BBVA y más de 20 plataformas para leer tu flujo real de ingresos. No nos importa si es formal o informal: nos importa que sea constante.',
  },
  {
    q: 'Tengo un reporte viejo en DataCrédito. ¿Me afecta?',
    a: 'Menos de lo que crees. Miramos el reporte como contexto, pero pesa máximo 10% en tu score. Si tu historial de pago de arriendo es sólido, un reporte viejo de $80.000 no te bloquea.',
  },
  {
    q: '¿Qué pasa si Renty no tiene arriendos en mi ciudad?',
    a: 'Hoy estamos en Bogotá. Pronto en Medellín, Cali y Barranquilla. Si tu ciudad aún no está, igual puedes calcular tu score — funciona como carta de presentación ante cualquier arrendador, incluso si todavía no lo integramos.',
  },
  {
    q: '¿Renty me reporta a centrales de riesgo si me atraso?',
    a: 'No. Renty no es un bureau de crédito. No reportamos a DataCrédito, TransUnion ni ninguna central. Tu score baja dentro de Renty, pero eso es todo — nada sale de nuestra plataforma sin tu permiso explícito.',
  },
] as const;

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((i) => ({
    '@type': 'Question',
    name: i.q,
    acceptedAnswer: { '@type': 'Answer', text: i.a },
  })),
};

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default async function InquilinosPage() {
  // Fetch real listings + aggregated stats from Supabase. Both are cached.
  const [markers, stats] = await Promise.all([
    listListingsForMap('bogota', 80),
    getCityListingStats('bogota'),
  ]);
  const waHref = whatsappHref('Hola, quiero saber más sobre Renty 👋');

  // Sidebar rows — real totals from DB (with graceful fallbacks so the card
  // still feels full when a new city has only a handful of listings).
  const t = stats.byType;
  const sidebarRows = [
    { k: String((t.apartamento ?? 0) + (t.apartaestudio ?? 0)), l: 'Aptos y apartaestudios' },
    { k: String(t.casa ?? 0), l: 'Casas' },
    { k: String((t.estudio ?? 0) + (t.habitacion ?? 0)), l: 'Estudios y habitaciones' },
    {
      k: stats.avgPriceCop > 0 ? formatCOP(stats.avgPriceCop) : '—',
      l: 'Arriendo promedio',
    },
  ];

  return (
    <>
      <JsonLd data={buildWebPageSchema({ ...pageSeo, hasBreadcrumb: true })} id="ld-webpage" />
      <JsonLd data={buildBreadcrumbSchema(pageSeo.path, breadcrumbs)} id="ld-breadcrumb" />
      <JsonLd data={faqSchema} id="ld-faq" />
      <Navbar />
      <Animations />

      <main id="main-content" tabIndex={-1}>
        {/* ==================== HERO ==================== */}
        <section className="relative overflow-hidden bg-sand pt-6 pb-16 lg:pt-10 lg:pb-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-[200px] right-[-10%] h-[720px] w-[720px]"
            style={{
              background:
                'radial-gradient(ellipse at 30% 40%, rgba(13,107,88,0.09), transparent 55%), radial-gradient(ellipse at 75% 70%, rgba(232,99,74,0.06), transparent 55%)',
            }}
          />

          <div className="relative mx-auto max-w-[1280px] px-5 text-center sm:px-8 lg:px-12" data-inq-reveal>
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-border bg-white px-4 py-2 font-mono text-[10px] font-500 tracking-[0.12em] uppercase text-teal-dark shadow-sm sm:text-[11px]">
              <span className="relative inline-block h-2 w-2 rounded-full bg-teal">
                <span className="renty-pulse-dot absolute inset-[-4px] rounded-full bg-teal/35" />
              </span>
              Disponible en Bogotá · Pronto en Medellín
            </div>
            <h1
              className="mx-auto max-w-[20ch] font-display font-400 text-ink [letter-spacing:-0.03em]"
              style={{ fontSize: 'clamp(40px, 6.8vw, 88px)', lineHeight: 1.02, margin: '0 auto 28px' }}
            >
              Arrienda con tu <em className="italic text-teal">historial</em>,
              <br />
              no con el{' '}
              <span className="relative inline-block text-ink-muted">
                de otros.
                <span
                  aria-hidden="true"
                  className="absolute -left-1 -right-1 top-[54%] h-[3px] rounded-[2px] bg-coral"
                  style={{ transform: 'rotate(-2deg)' }}
                />
              </span>
            </h1>
            <p
              className="mx-auto max-w-[56ch] font-body text-ink-secondary"
              style={{ fontSize: 19, lineHeight: 1.55, margin: '0 auto 36px' }}
            >
              7.3 millones de familias arriendan en Colombia, pero el sistema las trata como riesgo.
              ¿Pagas cumplido hace años? En Renty eso vale — más que cualquier codeudor con finca
              raíz.
            </p>
            <div className="mb-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/renty-score/formulario"
                className="inline-flex h-[56px] items-center gap-2.5 rounded-[14px] bg-teal px-7 font-heading text-[15px] font-600 text-white no-underline transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/20"
              >
                Calcular mi score gratis
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="#score-demo"
                className="inline-flex h-[56px] items-center gap-2.5 rounded-[14px] border border-border-strong bg-white px-7 font-heading text-[15px] font-600 text-ink no-underline transition-all duration-200 hover:border-teal hover:text-teal"
              >
                Ver cómo funciona
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[10px] font-500 tracking-[0.12em] uppercase text-ink-muted sm:text-[11px]">
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-teal" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                3 minutos · 12 preguntas
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-teal" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Ley 1581 de 2012
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-teal" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Sin costo · Sin DataCrédito
              </span>
            </div>
          </div>
        </section>

        {/* ==================== STATS STRIP ==================== */}
        <section className="border-y border-border bg-white">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { big: '57%', lbl: 'de los arriendamientos en Colombia son verbales o informales.', src: 'DANE · 2024' },
              { big: '55.8%', lbl: 'de los hogares inquilinos tienen ingresos informales.', src: 'DANE Q2 · 2024' },
              { big: '3.9 meses', lbl: 'tiempo promedio para conseguir arriendo sin codeudor.', src: 'Encuesta Renty · 2025' },
              { big: '2 millones', lbl: 'de familias están bloqueadas del arriendo formal.', src: 'Superfinanciera · 2024' },
            ].map((cell, i) => (
              <div
                key={i}
                className="border-b border-border px-6 py-10 text-center last:border-b-0 sm:border-b sm:border-r sm:last:border-r-0 sm:[&:nth-child(2)]:border-r-0 lg:border-b-0 lg:border-r lg:[&:nth-child(2)]:border-r"
                data-inq-reveal
              >
                <div className="font-mono text-[32px] font-500 leading-none text-teal [letter-spacing:-0.02em] sm:text-[36px]">
                  {cell.big}
                </div>
                <div className="mx-auto mt-2.5 max-w-[24ch] font-body text-[14px] leading-relaxed text-ink-secondary">
                  {cell.lbl}
                </div>
                <div className="mt-2 font-mono text-[10px] font-500 tracking-[0.1em] uppercase text-ink-subtle">
                  {cell.src}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== BARRERAS ==================== */}
        <section className="bg-sand-dark py-14 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <div className="mx-auto mb-14 max-w-[720px] text-center" data-inq-reveal>
              <Eyebrow tone="coral">El problema</Eyebrow>
              <h2
                className="mt-5 font-display font-400 text-ink [letter-spacing:-0.02em]"
                style={{ fontSize: 'clamp(30px, 4.6vw, 54px)', lineHeight: 1.1 }}
              >
                El sistema de arriendos no está hecho <em className="italic text-teal">para ti.</em>
              </h2>
              <p className="mx-auto mt-4 max-w-[60ch] font-body text-ink-secondary" style={{ fontSize: 18, lineHeight: 1.55 }}>
                Cuatro barreras reales que bloquean a millones de colombianos que pagan cumplido —
                pero no encajan en el molde del banco.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[
                {
                  n: '01',
                  eye: 'La barrera del codeudor',
                  h: 'Sin un familiar con finca raíz, no existes.',
                  p: 'El 82% de las inmobiliarias exige codeudor con propiedad libre de hipoteca en Bogotá. Si tu familia alquila, estás fuera.',
                  q: '"Llevo pagando arriendo 9 años. Pero mi mamá alquila, mi papá alquila, y ninguna inmobiliaria me quiere recibir."',
                  c: '— Andrea, 31, Bogotá',
                },
                {
                  n: '02',
                  eye: 'La barrera del banco',
                  h: 'Si eres independiente, te miran raro.',
                  p: 'Nequi, Rappi, ventas online, freelance. Ingresos reales que el sistema tradicional no sabe leer — y por eso te rechaza.',
                  q: '"Facturo 5 millones al mes en mi peluquería. El banco me dice que no soy ‘bancable’."',
                  c: '— Carolina, 28, Bogotá',
                },
                {
                  n: '03',
                  eye: 'La barrera del puntaje',
                  h: 'Un reporte viejo te persigue para siempre.',
                  p: 'Una mora de $80.000 de hace 7 años en DataCrédito pesa más que 100 meses de arriendo pagado a tiempo. No tiene sentido.',
                  q: '"Una tarjeta que cancelé hace 6 años me bloqueó de un apartamento que podía pagar."',
                  c: '— Juan David, 35, Bogotá',
                },
                {
                  n: '04',
                  eye: 'La barrera del contrato',
                  h: 'Sin contrato escrito, tu historial no cuenta.',
                  p: 'Aunque pagas hace años, no tienes cómo probarlo. El arriendo verbal es invisible — hasta ahora.',
                  q: '"Pago 1.2 millones hace 6 años con transferencia Bancolombia. Pero ‘oficialmente’ no arriendo nada."',
                  c: '— Héctor, 42, Bogotá',
                },
              ].map((b) => (
                <article
                  key={b.n}
                  data-inq-reveal
                  className="relative rounded-[20px] border border-border bg-white p-8 transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-lg sm:p-9"
                >
                  <div className="mb-5 flex items-center gap-2.5 font-mono text-[11px] font-500 tracking-[0.14em] uppercase text-coral">
                    <span className="font-mono text-[14px] text-ink-muted">{b.n}</span>
                    {b.eye}
                  </div>
                  <h3 className="mb-3.5 font-heading text-[22px] font-600 leading-[1.3] text-ink">{b.h}</h3>
                  <p className="mb-5 font-body text-[15px] leading-relaxed text-ink-secondary">{b.p}</p>
                  <blockquote className="m-0 border-l-2 border-coral pl-4 font-display text-[17px] italic leading-[1.5] text-ink">
                    {b.q}
                    <cite className="mt-2 block font-body text-[12px] font-500 not-italic text-ink-muted">
                      {b.c}
                    </cite>
                  </blockquote>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== COMPARATOR ==================== */}
        <section className="bg-sand py-14 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <div className="mx-auto mb-12 max-w-[720px] text-center" data-inq-reveal>
              <Eyebrow>Sistema tradicional vs Renty</Eyebrow>
              <h2
                className="mt-5 font-display font-400 text-ink [letter-spacing:-0.02em]"
                style={{ fontSize: 'clamp(30px, 4.6vw, 54px)', lineHeight: 1.1 }}
              >
                Dos formas de medir si <em className="italic text-teal">mereces</em> un hogar.
              </h2>
              <p className="mx-auto mt-4 max-w-[60ch] font-body text-ink-secondary" style={{ fontSize: 18, lineHeight: 1.55 }}>
                Una se basa en lo que tienes. La otra, en cómo pagas. Nosotros creemos que la
                segunda es la que importa.
              </p>
            </div>
            <div data-inq-reveal>
              <InquilinosCompare />
            </div>
          </div>
        </section>

        {/* ==================== SCORE DEMO ==================== */}
        <InquilinosScoreDemo />

        {/* ==================== TESTIMONIOS ==================== */}
        <section className="bg-sand py-14 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <div className="mx-auto mb-12 max-w-[720px] text-center" data-inq-reveal>
              <Eyebrow tone="coral">Historias reales</Eyebrow>
              <h2
                className="mt-5 font-display font-400 text-ink [letter-spacing:-0.02em]"
                style={{ fontSize: 'clamp(30px, 4.6vw, 54px)', lineHeight: 1.1 }}
              >
                Del Renty Score a un <em className="italic text-teal">nuevo hogar.</em>
              </h2>
              <p className="mx-auto mt-4 max-w-[60ch] font-body text-ink-secondary" style={{ fontSize: 18, lineHeight: 1.55 }}>
                Cuatro personas que el sistema dijo que no. Los números dijeron que sí.
              </p>
            </div>
            <div data-inq-reveal>
              <InquilinosTestimonials />
            </div>
          </div>
        </section>

        {/* ==================== MAPA BOGOTÁ ==================== */}
        <section className="bg-sand-dark py-14 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <div className="mx-auto mb-12 max-w-[720px] text-center" data-inq-reveal>
              <Eyebrow>Disponible ahora</Eyebrow>
              <h2
                className="mt-5 font-display font-400 text-ink [letter-spacing:-0.02em]"
                style={{ fontSize: 'clamp(30px, 4.6vw, 54px)', lineHeight: 1.1 }}
              >
                Arriendos verificados en <em className="italic text-teal">Bogotá.</em>
              </h2>
              <p className="mx-auto mt-4 max-w-[60ch] font-body text-ink-secondary" style={{ fontSize: 18, lineHeight: 1.55 }}>
                Propiedades abiertas a aplicar con tu Renty Score — sin codeudor con finca raíz.
              </p>
            </div>

            <div
              className="grid grid-cols-1 gap-6 rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6 lg:grid-cols-[320px_1fr] lg:gap-8 lg:p-8"
              data-inq-reveal
            >
              {/* Side panel */}
              <div className="min-w-0">
                <h4 className="m-0 mb-2 font-display text-[22px] font-400 text-ink">
                  {markers.length === 0
                    ? 'Pronto, arriendos en Bogotá'
                    : markers.length === 1
                    ? '1 arriendo disponible'
                    : `${markers.length} arriendos disponibles`}
                </h4>
                <p className="m-0 mb-5 font-body text-[13px] text-ink-muted">
                  Actualizado hoy · Todos aceptan Renty Score como codeudor.
                </p>

                <dl className="space-y-3 border-t border-border pt-5">
                  {sidebarRows.map((r) => (
                    <div key={r.l} className="flex items-baseline justify-between gap-3">
                      <dt className="font-mono text-[20px] font-500 leading-none text-ink sm:text-[22px]">
                        {r.k}
                      </dt>
                      <dd className="m-0 text-right font-body text-[13px] text-ink-muted">{r.l}</dd>
                    </div>
                  ))}
                </dl>

                {stats.topNeighborhoods.length > 0 && (
                  <div className="mt-6 border-t border-border pt-5">
                    <div className="mb-3 font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-ink-muted">
                      Barrios con más arriendos
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {stats.topNeighborhoods.map((b) => (
                        <Link
                          key={b.slug}
                          href={`/bogota/arriendos?zona=${b.slug}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-transparent bg-teal-lighter px-3.5 py-1.5 font-heading text-[12px] font-600 text-teal-dark no-underline transition-colors hover:bg-teal hover:text-white"
                        >
                          {b.name}
                          <span className="font-mono text-[10px] font-500 opacity-60">{b.count}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-7">
                  <Link
                    href="/bogota/arriendos"
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-ink px-5 font-heading text-[13px] font-600 text-white no-underline transition-all hover:-translate-y-0.5 hover:bg-ink-secondary"
                  >
                    Ver todos los arriendos
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Map */}
              <div className="relative h-[420px] min-w-0 overflow-hidden rounded-2xl bg-sand sm:h-[520px] lg:h-[560px]">
                <InquilinosMap markers={markers} />
              </div>
            </div>
          </div>
        </section>

        {/* ==================== TRUST / SEGURIDAD ==================== */}
        <section className="bg-sand py-14 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <div className="mx-auto mb-14 max-w-[720px] text-center" data-inq-reveal>
              <Eyebrow>Tus datos, tus reglas</Eyebrow>
              <h2
                className="mt-5 font-display font-400 text-ink [letter-spacing:-0.02em]"
                style={{ fontSize: 'clamp(30px, 4.6vw, 54px)', lineHeight: 1.1 }}
              >
                Construido con seguridad de <em className="italic text-teal">banco</em>, calidez de barrio.
              </h2>
              <p className="mx-auto mt-4 max-w-[60ch] font-body text-ink-secondary" style={{ fontSize: 18, lineHeight: 1.55 }}>
                Nunca vendemos tus datos. Nunca te reportamos. Tú controlas quién ve tu score.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { h: 'Ley 1581 de 2012', p: 'Cumplimos con el Régimen General de Protección de Datos Personales de Colombia. Registrados ante la SIC.', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>) },
                { h: 'Encriptación AES-256', p: 'Tus datos viajan por TLS 1.3 y se guardan encriptados en reposo. Nadie los ve, ni siquiera nosotros sin tu permiso.', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>) },
                { h: 'Score transparente', p: 'Sabes exactamente qué factores suman o restan. Y puedes mejorarlo — a diferencia de DataCrédito.', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>) },
                { h: 'No te reportamos', p: 'Renty no es un bureau. Si no pagas, no aparece en centrales de riesgo. Tu historial es solo tuyo.', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="17" y1="8" x2="23" y2="14" /><line x1="23" y1="8" x2="17" y2="14" /></svg>) },
                { h: 'Hecho en Colombia', p: 'Equipo colombiano, servidores en Bogotá, soporte en español. Conocemos el mercado porque vivimos aquí.', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>) },
                { h: 'Borra tus datos cuando quieras', p: 'Un botón en tu cuenta. 30 días después, cero rastro. Sin fricciones, sin letra pequeña.', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /></svg>) },
              ].map((t) => (
                <article
                  key={t.h}
                  data-inq-reveal
                  className="rounded-[20px] border border-border bg-white p-7 transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:shadow-md sm:p-8"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] bg-teal-lighter text-teal">
                    <span className="h-6 w-6">{t.icon}</span>
                  </div>
                  <h4 className="mb-2 font-heading text-[16px] font-600 text-ink">{t.h}</h4>
                  <p className="m-0 font-body text-[14px] leading-relaxed text-ink-muted">{t.p}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== FAQ ==================== */}
        <section className="bg-sand-dark py-14 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <div className="mx-auto mb-12 max-w-[720px] text-center" data-inq-reveal>
              <Eyebrow tone="coral">Preguntas frecuentes</Eyebrow>
              <h2
                className="mt-5 font-display font-400 text-ink [letter-spacing:-0.02em]"
                style={{ fontSize: 'clamp(30px, 4.6vw, 54px)', lineHeight: 1.1 }}
              >
                Todo lo que necesitas <em className="italic text-teal">saber.</em>
              </h2>
              <p className="mx-auto mt-4 max-w-[60ch] font-body text-ink-secondary" style={{ fontSize: 18, lineHeight: 1.55 }}>
                Si falta algo, escríbenos por WhatsApp — respondemos en menos de 2 horas.
              </p>
            </div>

            <div className="mx-auto max-w-[840px]" data-inq-reveal>
              {faqItems.map((item, i) => (
                <details
                  key={item.q}
                  className="group mb-3 overflow-hidden rounded-2xl border border-border bg-white transition-all duration-200 open:border-teal open:shadow-sm"
                  {...(i === 0 ? { open: true } : {})}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 font-heading text-[15px] font-500 leading-[1.4] text-ink sm:px-7 sm:py-6 sm:text-[16px] [&::-webkit-details-marker]:hidden">
                    <span>{item.q}</span>
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-sand-dark text-ink transition-all duration-300 group-open:rotate-180 group-open:bg-teal group-open:text-white">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 font-body text-[14px] leading-[1.65] text-ink-secondary sm:px-7 sm:pb-7 sm:text-[15px]">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== FINAL CTA ==================== */}
        <section className="relative overflow-hidden bg-ink py-20 text-center text-white lg:py-[120px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(16,185,129,0.15), transparent 50%)' }}
          />
          <div className="relative mx-auto max-w-[720px] px-5 sm:px-8" data-inq-reveal>
            <Eyebrow tone="tealLight">Tu historial habla por ti</Eyebrow>
            <h2
              className="mt-6 font-display font-400 text-white [letter-spacing:-0.02em]"
              style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.05, margin: '24px 0' }}
            >
              Empieza tu <em className="italic text-teal-light">nuevo hogar</em> con 12 preguntas.
            </h2>
            <p className="mx-auto mb-10 max-w-[56ch] font-body text-white/65" style={{ fontSize: 18, lineHeight: 1.55 }}>
              Tu Renty Score está listo en 3 minutos. Gratis. Sin tarjeta, sin codeudor con finca
              raíz, sin papeles.
            </p>
            <div className="mb-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/renty-score/formulario"
                className="inline-flex h-[56px] items-center gap-2.5 rounded-[14px] bg-teal px-7 font-heading text-[15px] font-600 text-white no-underline transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/20"
              >
                Calcular mi score ahora
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[56px] items-center gap-2.5 rounded-[14px] border border-white/20 px-7 font-heading text-[15px] font-600 text-white no-underline transition-all duration-200 hover:border-white/40 hover:bg-white/[0.08]"
                >
                  Hablar por WhatsApp
                </a>
              )}
            </div>
            <div className="font-mono text-[10px] font-500 tracking-[0.08em] uppercase text-white/50 sm:text-[11px]">
              <span className="text-teal-light">●</span> 12 preguntas · 3 minutos · 100% gratis · Ley 1581
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function Eyebrow({
  children,
  tone = 'teal',
}: {
  children: React.ReactNode;
  tone?: 'teal' | 'coral' | 'tealLight';
}) {
  const color =
    tone === 'coral' ? 'text-coral' : tone === 'tealLight' ? 'text-teal-light' : 'text-teal';
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-mono text-[11px] font-500 tracking-[0.14em] uppercase before:inline-block before:h-px before:w-[18px] before:bg-current before:opacity-55 ${color}`}
    >
      {children}
    </span>
  );
}
