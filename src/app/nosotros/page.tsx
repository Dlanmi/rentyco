import type { Metadata } from 'next';
import { buildMetadata, buildWebPageSchema, buildBreadcrumbSchema } from '@/lib/seo';
import JsonLd from '@/components/layout/JsonLd';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Waitlist from '@/components/sections/Waitlist';
import { WAITLIST_COUNT_LABEL } from '@/lib/waitlist';
import Animations from './Animations';

const pageSeo = {
  title: 'Nosotros — Renty | Creemos en el arriendo justo para Colombia',
  description:
    'Renty es una startup bogotana que está construyendo tecnología para medir la confiabilidad de los arrendatarios por comportamiento, no por patrimonio. Conoce nuestra misión.',
  path: '/nosotros',
  ogSlug: 'nosotros',
};

export const metadata: Metadata = buildMetadata(pageSeo);

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Nosotros', url: '/nosotros' },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildWebPageSchema({ ...pageSeo, hasBreadcrumb: true })}
        id="ld-webpage"
      />
      <JsonLd
        data={buildBreadcrumbSchema(pageSeo.path, breadcrumbs)}
        id="ld-breadcrumb"
      />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* ======== HERO ======== */}
        <section className="relative overflow-hidden px-6 pt-32 pb-20 lg:px-12 lg:pt-40 lg:pb-28">
          <div
            className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full opacity-[0.06]"
            style={{
              background:
                'radial-gradient(circle, var(--color-teal) 0%, transparent 70%)',
            }}
          />
          <div
            className="pointer-events-none absolute -left-32 bottom-0 h-[350px] w-[350px] rounded-full opacity-[0.04]"
            style={{
              background:
                'radial-gradient(circle, var(--color-coral) 0%, transparent 70%)',
            }}
          />

          <div className="mx-auto max-w-3xl text-center" data-about-hero>
            <span
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal-lighter px-4 py-1.5"
              data-about-label
            >
              <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
              <span className="font-heading text-[13px] font-600 text-teal-dark">
                Nuestra historia
              </span>
            </span>
            <h1
              className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-tight text-ink"
              data-about-title
            >
              Creemos que pagar arriendo a tiempo debería{' '}
              <span className="text-teal">abrir puertas</span>, no cerrarlas.
            </h1>
            <p
              className="mx-auto mt-6 max-w-xl font-body text-lg leading-relaxed text-ink-secondary"
              data-about-subtitle
            >
              Estamos construyendo la infraestructura de confianza que el mercado
              de arriendos colombiano necesita.
            </p>
          </div>
        </section>

        {/* ======== MISIÓN ======== */}
        <section className="bg-sand-dark py-24 lg:py-32" data-about-mission>
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mx-auto max-w-3xl">
              <span
                className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-teal"
                data-about-section-label
              >
                Nuestra misión
              </span>
              <h2
                className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight text-ink"
                data-about-section-title
              >
                Medir la confiabilidad por comportamiento, no por patrimonio.
              </h2>
              <div
                className="mt-8 space-y-5 font-body text-[16px] leading-relaxed text-ink-secondary"
                data-about-text
              >
                <p>
                  Colombia tiene{' '}
                  <strong className="text-ink">7.3 millones de hogares</strong>{' '}
                  que arriendan. Más de la mitad de la población urbana vive en
                  arriendo, y por primera vez en la historia del país, los
                  arrendatarios superan a los propietarios.
                </p>
                <p>
                  Pero el sistema sigue tratándolos como ciudadanos de segunda. El{' '}
                  <strong className="text-ink">
                    57% de los contratos de arriendo son verbales
                  </strong>{' '}
                  — acuerdos de palabra sin protección para nadie. En estratos 1 a
                  3, esa cifra sube al 95%.
                </p>
                <p>
                  El modelo tradicional exige codeudor con finca raíz, extractos
                  bancarios, certificados laborales. Pero el 55.8% de los
                  colombianos trabajan en la informalidad. Millones de personas
                  pagan su arriendo puntualmente cada mes y aun así no pueden
                  acceder al mercado formal.
                </p>
                <p>
                  En Renty estamos construyendo tecnología que cambie eso. Un
                  sistema que mide{' '}
                  <strong className="text-ink">
                    cómo pagas, no cuánto tienes
                  </strong>
                  .
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div
              className="mx-auto mt-16 grid max-w-3xl gap-5 sm:grid-cols-3"
              data-about-stats
            >
              <div
                className="rounded-2xl border border-border bg-surface p-7 text-center"
                data-about-stat
              >
                <span
                  className="block font-mono text-[clamp(2rem,3.5vw,2.8rem)] font-500 leading-none text-teal"
                  data-count="7.3"
                  data-suffix="M"
                  data-decimals="1"
                >
                  0M
                </span>
                <span className="mt-2 block font-heading text-[14px] font-600 text-ink">
                  hogares arriendan
                </span>
                <span className="mt-1 block font-body text-[13px] text-ink-muted">
                  en Colombia
                </span>
              </div>
              <div
                className="rounded-2xl border border-border bg-surface p-7 text-center"
                data-about-stat
              >
                <span
                  className="block font-mono text-[clamp(2rem,3.5vw,2.8rem)] font-500 leading-none text-coral"
                  data-count="57"
                  data-suffix="%"
                >
                  0%
                </span>
                <span className="mt-2 block font-heading text-[14px] font-600 text-ink">
                  contratos verbales
                </span>
                <span className="mt-1 block font-body text-[13px] text-ink-muted">
                  sin protección legal
                </span>
              </div>
              <div
                className="rounded-2xl border border-border bg-surface p-7 text-center"
                data-about-stat
              >
                <span
                  className="block font-mono text-[clamp(2rem,3.5vw,2.8rem)] font-500 leading-none text-teal"
                  data-count="55.8"
                  data-suffix="%"
                  data-decimals="1"
                >
                  0%
                </span>
                <span className="mt-2 block font-heading text-[14px] font-600 text-ink">
                  trabajan informales
                </span>
                <span className="mt-1 block font-body text-[13px] text-ink-muted">
                  excluidos del sistema
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ======== EL PROBLEMA QUE RESOLVEMOS ======== */}
        <section className="py-24 lg:py-32" data-about-problem>
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mx-auto max-w-3xl">
              <span
                className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-coral"
                data-about-section-label
              >
                El problema que resolvemos
              </span>
              <h2
                className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight text-ink"
                data-about-section-title
              >
                El codeudor es un parche, no una solución.
              </h2>
              <div
                className="mt-8 space-y-5 font-body text-[16px] leading-relaxed text-ink-secondary"
                data-about-text
              >
                <p>
                  En Colombia, para arrendar un apartamento necesitas un codeudor
                  — alguien con propiedad raíz que respalde tu contrato. Es un
                  requisito heredado de décadas pasadas, cuando la información
                  crediticia no existía y la única forma de garantizar un pago era
                  tener a alguien con bienes embargables.
                </p>
                <p>
                  Hoy ese modelo está roto. El arrendador que pide codeudor con
                  finca raíz no quiere finca raíz — quiere{' '}
                  <strong className="text-ink">
                    certeza de que le van a pagar
                  </strong>
                  . Pero la forma de medir esa certeza no ha evolucionado.
                </p>
                <p>
                  Mientras tanto, las afianzadoras cobran entre 0.5x y 1.5x el
                  canon mensual solo por la póliza. Las inmobiliarias tardan hasta
                  3.9 meses en arrendar un inmueble. Y millones de personas quedan
                  atrapadas en un mercado informal sin protección ni derechos.
                </p>
                <p>
                  <strong className="text-ink">
                    Renty reemplaza la pregunta &ldquo;¿cuánto tienes?&rdquo; por
                    &ldquo;¿cómo pagas?&rdquo;
                  </strong>{' '}
                  — un cambio simple pero transformador que alinea los incentivos
                  de arrendadores e inquilinos por primera vez.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======== VALORES ======== */}
        <section className="bg-sand-dark py-24 lg:py-32" data-about-values>
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
              <span
                className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-teal"
                data-about-section-label
              >
                Nuestros valores
              </span>
              <h2
                className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight text-ink"
                data-about-section-title
              >
                Lo que nos guía.
              </h2>
            </div>

            <div
              className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
              data-about-values-grid
            >
              {/* Transparencia radical */}
              <div
                className="rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03]"
                data-about-value
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-lighter text-teal">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="4" />
                    <line x1="12" y1="2" x2="12" y2="6" />
                    <line x1="12" y1="18" x2="12" y2="22" />
                    <line x1="2" y1="12" x2="6" y2="12" />
                    <line x1="18" y1="12" x2="22" y2="12" />
                  </svg>
                </div>
                <h3 className="mb-2 font-heading text-[17px] font-700 text-ink">
                  Transparencia radical
                </h3>
                <p className="font-body text-[14px] leading-relaxed text-ink-muted">
                  Datos reales, criterios abiertos. Cada inquilino sabe
                  exactamente cómo se calcula su puntaje y qué puede hacer para
                  mejorarlo. Sin cajas negras ni decisiones ocultas.
                </p>
              </div>

              {/* Inclusión con responsabilidad */}
              <div
                className="rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03]"
                data-about-value
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-coral-light text-coral">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87" />
                    <path d="M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
                <h3 className="mb-2 font-heading text-[17px] font-700 text-ink">
                  Inclusión con responsabilidad
                </h3>
                <p className="font-body text-[14px] leading-relaxed text-ink-muted">
                  Todos merecen una oportunidad, verificada con datos. No bajamos
                  el estándar — cambiamos lo que medimos. El comportamiento habla
                  más que el patrimonio.
                </p>
              </div>

              {/* Tecnología humana */}
              <div
                className="rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03]"
                data-about-value
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-lighter text-teal">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </div>
                <h3 className="mb-2 font-heading text-[17px] font-700 text-ink">
                  Tecnología humana
                </h3>
                <p className="font-body text-[14px] leading-relaxed text-ink-muted">
                  Como Nubank pero con el calor de un barrio colombiano.
                  Construimos productos digitales que respetan la realidad de las
                  personas — no las obligan a adaptarse a un sistema que no fue
                  hecho para ellas.
                </p>
              </div>

              {/* Impacto medible */}
              <div
                className="rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03]"
                data-about-value
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-coral-light text-coral">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                  </svg>
                </div>
                <h3 className="mb-2 font-heading text-[17px] font-700 text-ink">
                  Impacto medible
                </h3>
                <p className="font-body text-[14px] leading-relaxed text-ink-muted">
                  Cada métrica que importa la medimos y la compartimos. Familias
                  incluidas, tiempos de arriendo reducidos, contratos
                  formalizados. Si no se mide, no se mejora.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======== HECHO EN COLOMBIA ======== */}
        <section className="py-24 lg:py-32" data-about-colombia>
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mx-auto max-w-3xl text-center">
              <div
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sand-dark"
                data-about-flag
              >
                <svg className="h-8 w-8" viewBox="0 0 32 24" fill="none">
                  <rect width="32" height="12" fill="#FCD116" />
                  <rect y="12" width="32" height="6" fill="#003893" />
                  <rect y="18" width="32" height="6" fill="#CE1126" />
                </svg>
              </div>
              <span
                className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-coral"
                data-about-section-label
              >
                Hecho en Colombia
              </span>
              <h2
                className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight text-ink"
                data-about-section-title
              >
                De Bogotá para Colombia.
              </h2>
              <div
                className="mt-6 space-y-4 font-body text-[16px] leading-relaxed text-ink-secondary"
                data-about-text
              >
                <p>
                  Somos una startup bogotana construyendo para la realidad
                  colombiana. No adaptamos un producto gringo al mercado local —
                  diseñamos desde cero para un país donde los contratos son
                  verbales, los pagos se hacen en Nequi, y la confianza se
                  construye barrio a barrio.
                </p>
                <p>
                  Entendemos que en Colombia el arriendo no es solo un tema
                  financiero — es un tema de dignidad. De poder mudarte cuando tu
                  familia crece. De no depender de un favor para tener un techo.
                  De que tu esfuerzo mensual de pagar a tiempo finalmente cuente
                  para algo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======== CTA: LISTA DE ESPERA ======== */}
        <section
          className="relative overflow-hidden py-24 lg:py-32"
          style={{ backgroundColor: '#1C1917' }}
          data-about-cta
        >
          <div
            className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, #0D6B58, transparent 70%)',
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, #E8634A, transparent 70%)',
            }}
          />

          <div
            className="mx-auto max-w-xl px-6 text-center lg:px-12"
            data-about-cta-content
          >
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-white">
              Calcula tu Renty Score
            </h2>
            <p className="mx-auto mt-3 max-w-md font-body text-lg leading-relaxed text-white/70">
              Sé de los primeros en recibir tu Renty Score. Sin costo. Sin
              compromiso.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="/renty-score/formulario"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal px-8 py-4 font-heading text-[15px] font-600 text-white no-underline shadow-lg shadow-teal/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-dark hover:shadow-xl hover:shadow-teal/25"
              >
                Quiero mi Renty Score
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </div>
            <p className="mt-6 font-mono text-[12px] text-white/50">
              {WAITLIST_COUNT_LABEL} familias ya están en la lista · Lanzamiento
              Bogotá 2026
            </p>
          </div>
        </section>
      </main>
      <Waitlist />
      <Footer />
      <Animations />
    </>
  );
}
