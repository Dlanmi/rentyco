import type { Metadata } from 'next';
import { buildMetadata, buildWebPageSchema, buildBreadcrumbSchema } from '@/lib/seo';
import JsonLd from '@/components/layout/JsonLd';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WaitlistForm from '@/components/sections/WaitlistForm';
import Animations from './Animations';

const pageSeo = {
  title:
    'Lista de espera — Renty | Regístrate hoy y arrienda sin codeudor en Colombia',
  description:
    'Regístrate en la lista de espera de Renty. Sé de los primeros en recibir tu Renty Score gratuito y arrienda sin codeudor en Colombia.',
  path: '/lista-de-espera',
  ogSlug: 'lista-de-espera',
};

export const metadata: Metadata = buildMetadata({ ...pageSeo, noindex: true });

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Lista de espera', url: '/lista-de-espera' },
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
        <section className="relative overflow-hidden px-6 pt-32 pb-16 lg:px-12 lg:pt-40 lg:pb-24">
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

          <div className="mx-auto max-w-3xl text-center" data-waitlist-hero>
            <span
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal-lighter px-4 py-1.5"
              data-waitlist-label
            >
              <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
              <span className="font-heading text-[13px] font-600 text-teal-dark">
                Pre-lanzamiento — Cupos limitados
              </span>
            </span>
            <h1
              className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-tight text-ink"
              data-waitlist-title
            >
              Cansado de que te pidan codeudor? Únete a Renty.
            </h1>
            <p
              className="mx-auto mt-6 max-w-xl font-body text-lg leading-relaxed text-ink-secondary"
              data-waitlist-subtitle
            >
              Regístrate hoy, es gratis, y sé de los primeros en recibir tu Renty
              Score cuando lancemos. Sin letra chiquita.
            </p>
          </div>
        </section>

        {/* ======== FORMULARIO ======== */}
        <div id="waitlist-form" data-waitlist-form-section>
          <WaitlistForm
            title=""
            subtitle=""
            submitLabel="Unirme a la lista"
            sectionId="waitlist-form"
          />
        </div>

        {/* ======== BENEFICIOS ======== */}
        <section className="bg-sand-dark py-24 lg:py-32" data-waitlist-benefits>
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
              <span
                className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-teal"
                data-waitlist-section-label
              >
                Beneficios de unirte hoy
              </span>
              <h2
                className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight text-ink"
                data-waitlist-section-title
              >
                Por ser de los primeros.
              </h2>
            </div>

            <div
              className="mx-auto grid max-w-4xl gap-5 md:grid-cols-3"
              data-waitlist-benefits-grid
            >
              {/* Acceso prioritario */}
              <div
                className="rounded-2xl border border-border bg-surface p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03]"
                data-waitlist-benefit
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-lighter text-teal">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <h3 className="mb-2 font-heading text-[17px] font-700 text-ink">
                  Acceso prioritario
                </h3>
                <p className="font-body text-[14px] leading-relaxed text-ink-muted">
                  Serás de los primeros en acceder a la plataforma cuando lancemos
                  en Bogotá. Sin filas, sin esperas adicionales.
                </p>
              </div>

              {/* Renty Score gratuito */}
              <div
                className="rounded-2xl border border-border bg-surface p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03]"
                data-waitlist-benefit
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-coral-light text-coral">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="mb-2 font-heading text-[17px] font-700 text-ink">
                  Renty Score gratuito
                </h3>
                <p className="font-body text-[14px] leading-relaxed text-ink-muted">
                  Tu primer Renty Score será gratuito de por vida. Conoce tu
                  puntaje y empieza a construir tu historial de arriendo.
                </p>
              </div>

              {/* Comunidad */}
              <div
                className="rounded-2xl border border-border bg-surface p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03]"
                data-waitlist-benefit
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-lighter text-teal">
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
                  Comunidad de arrendatarios
                </h3>
                <p className="font-body text-[14px] leading-relaxed text-ink-muted">
                  Accede a una comunidad exclusiva de inquilinos responsables que
                  comparten tips, experiencias y recomendaciones.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======== TIMELINE ======== */}
        <section className="py-24 lg:py-32" data-waitlist-timeline>
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
              <span
                className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-coral"
                data-waitlist-section-label
              >
                Hoja de ruta
              </span>
              <h2
                className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight text-ink"
                data-waitlist-section-title
              >
                Hacia dónde vamos.
              </h2>
            </div>

            <div className="mx-auto max-w-2xl" data-waitlist-timeline-track>
              {/* Timeline line */}
              <div className="relative ml-4 border-l-2 border-border pl-10 lg:ml-0 lg:border-l-0 lg:border-t-2 lg:pl-0 lg:pt-10 lg:flex lg:justify-between">
                {/* Bogotá 2026 */}
                <div
                  className="relative pb-12 lg:pb-0 lg:text-center lg:flex-1"
                  data-waitlist-milestone
                >
                  <div className="absolute -left-[calc(2.5rem+5px)] top-0 h-3 w-3 rounded-full border-2 border-teal bg-surface lg:static lg:mx-auto lg:mb-4 lg:-mt-[calc(2.5rem+7px)]" />
                  <span className="mb-1 inline-block rounded-full bg-teal-lighter px-3 py-1 font-mono text-[12px] font-500 text-teal-dark">
                    2026 — S2
                  </span>
                  <h3 className="mt-2 font-heading text-[17px] font-700 text-ink">
                    Lanzamiento Bogotá
                  </h3>
                  <p className="mt-1 font-body text-[14px] leading-relaxed text-ink-muted">
                    Primera versión del Renty Score para inquilinos y arrendadores
                    en Bogotá. Verificación de historial de pagos y perfil
                    digital.
                  </p>
                </div>

                {/* Medellín 2027 */}
                <div
                  className="relative pb-12 lg:pb-0 lg:text-center lg:flex-1"
                  data-waitlist-milestone
                >
                  <div className="absolute -left-[calc(2.5rem+5px)] top-0 h-3 w-3 rounded-full border-2 border-coral bg-surface lg:static lg:mx-auto lg:mb-4 lg:-mt-[calc(2.5rem+7px)]" />
                  <span className="mb-1 inline-block rounded-full bg-coral-light px-3 py-1 font-mono text-[12px] font-500 text-coral-dark">
                    2027 — S1
                  </span>
                  <h3 className="mt-2 font-heading text-[17px] font-700 text-ink">
                    Expansión a Medellín
                  </h3>
                  <p className="mt-1 font-body text-[14px] leading-relaxed text-ink-muted">
                    Llevamos el modelo a Medellín, la segunda ciudad con mayor
                    demanda de arriendo en Colombia.
                  </p>
                </div>

                {/* Cali 2027 */}
                <div
                  className="relative lg:text-center lg:flex-1"
                  data-waitlist-milestone
                >
                  <div className="absolute -left-[calc(2.5rem+5px)] top-0 h-3 w-3 rounded-full border-2 border-teal bg-surface lg:static lg:mx-auto lg:mb-4 lg:-mt-[calc(2.5rem+7px)]" />
                  <span className="mb-1 inline-block rounded-full bg-teal-lighter px-3 py-1 font-mono text-[12px] font-500 text-teal-dark">
                    2027 — S2
                  </span>
                  <h3 className="mt-2 font-heading text-[17px] font-700 text-ink">
                    Expansión a Cali
                  </h3>
                  <p className="mt-1 font-body text-[14px] leading-relaxed text-ink-muted">
                    Tercera ciudad. Consolidación del modelo y nuevas
                    funcionalidades: contratos digitales y pagos integrados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======== CTA FINAL ======== */}
        <section
          className="relative overflow-hidden bg-ink py-24 lg:py-32"
          data-waitlist-cta
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
            data-waitlist-cta-content
          >
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-white">
              Tu historial de pago es tu mejor garantía.
            </h2>
            <p className="mx-auto mt-3 max-w-md font-body text-lg leading-relaxed text-white/70">
              Deja de depender de codeudores. Empieza a construir tu perfil de
              arrendatario con Renty Score.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="#waitlist-form"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal px-8 py-4 font-heading text-[15px] font-600 text-white no-underline shadow-lg shadow-teal/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-dark hover:shadow-xl hover:shadow-teal/25"
              >
                Unirme a la lista
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
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </a>
            </div>
            <p className="mt-6 font-mono text-[12px] text-white/50">
              Lanzamiento Bogotá 2026 · Medellín y Cali 2027
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <Animations />
    </>
  );
}
