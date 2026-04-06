import type { Metadata } from 'next';
import { buildMetadata, buildWebPageSchema, buildBreadcrumbSchema } from '@/lib/seo';
import JsonLd from '@/components/layout/JsonLd';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WaitlistForm from '@/components/sections/WaitlistForm';
import { WAITLIST_COUNT_LABEL } from '@/lib/waitlist';
import Animations from './Animations';

const pageSeo = {
  title: 'Para inquilinos — Renty | Arrienda con tu historial, no con el de otros',
  description:
    'Renty permite a los inquilinos colombianos arrendar sin codeudor, usando su historial de pago real como garantía. Crea tu perfil gratis y obtén tu Renty Score.',
  path: '/inquilinos',
  ogSlug: 'inquilinos',
};

export const metadata: Metadata = buildMetadata(pageSeo);

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Para inquilinos', url: '/inquilinos' },
];

const painPoints = [
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <circle cx="14" cy="14" r="6" />
        <path d="M4 34c0-5.523 4.477-10 10-10" />
        <circle cx="28" cy="14" r="6" />
        <path d="M18 34c0-5.523 4.477-10 10-10" />
        <path d="M34 18v6m0 4v.01" />
      </svg>
    ),
    stat: '2',
    suffix: ' codeudores',
    title: 'Necesitas 2 codeudores con finca raíz',
    desc: 'Para rentas superiores a $1.5M en Bogotá, las inmobiliarias exigen dos personas con propiedad que se hagan responsables por ti. ¿No los tienes? No arriendas.',
    source: 'Fedelonjas 2024',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <circle cx="20" cy="20" r="16" />
        <path d="M20 10v10l6 4" />
      </svg>
    ),
    stat: '3.9',
    suffix: ' meses',
    title: '3.9 meses en promedio para arrendar',
    desc: 'Entre buscar, aplicar, conseguir documentos, esperar aprobación y firmar, una familia bogotana tarda casi 4 meses en mudarse. Un proceso agotador.',
    source: 'Fedelonjas / Metrocuadrado 2024',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path d="M8 8h24v28H8z" />
        <path d="M14 16h12M14 22h12M14 28h8" />
        <path d="M4 36l8-8M36 36l-8-8" strokeDasharray="2 2" />
      </svg>
    ),
    stat: '57',
    suffix: '%',
    title: 'Contratos verbales sin protección',
    desc: 'El 57% de los contratos de arriendo en Colombia son de palabra. En estratos 1-3 sube al 95%. Son COP $18 billones anuales en acuerdos sin garantía.',
    source: 'Fedelonjas 2024',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path d="M10 34V20l10-12 10 12v14" />
        <path d="M16 34v-8h8v8" />
        <path d="M6 18L20 6l14 12" />
        <path d="M30 14v-4h4v8" />
        <line x1="4" y1="4" x2="36" y2="36" strokeDasharray="2 2" />
      </svg>
    ),
    stat: '55.8',
    suffix: '%',
    title: 'Rechazados por ser informales',
    desc: '12.6 millones de colombianos trabajan sin contrato formal. Sin certificado laboral ni colillas de pago, quedan excluidos del arriendo formal.',
    source: 'DANE Q2 2024',
  },
];

const solutions = [
  {
    problem: 'Necesitas codeudor con finca raíz',
    solution: 'Tu historial de pago verificado reemplaza al codeudor',
    detail: 'Renty verifica cómo has pagado arriendo, servicios y más. Eso se convierte en tu garantía real, no el patrimonio de otra persona.',
  },
  {
    problem: '3.9 meses buscando arriendo',
    solution: 'Perfil verificado en minutos, no en meses',
    detail: 'Crea tu perfil, conecta tus datos y recibe tu Renty Score. Los arrendadores ven un inquilino verificado desde el primer contacto.',
  },
  {
    problem: 'Contrato verbal sin protección',
    solution: 'Contrato digital con respaldo para ambas partes',
    detail: 'Renty facilita contratos claros con términos justos. Protección real para ti y para quien te arrienda.',
  },
  {
    problem: 'Rechazado por ser informal',
    solution: 'Funciona para informales, independientes y migrantes',
    detail: 'Nuestro scoring alternativo usa datos reales: pagos de Nequi, Daviplata, servicios públicos, referencias de arrendadores anteriores.',
  },
];

const journey = [
  { n: '01', title: 'Te registras', desc: 'En 2 minutos. Solo necesitas tu cédula y tu correo. Nada más.', color: '#0D6B58' },
  { n: '02', title: 'Conectas tu historial', desc: 'Autorizas acceso a tus pagos de servicios, Nequi/Daviplata y referencias de arrendadores.', color: '#10B981' },
  { n: '03', title: 'Recibes tu Renty Score', desc: 'Un puntaje basado en tu comportamiento real de pago. No en tu patrimonio ni el de tu familia.', color: '#E8634A' },
  { n: '04', title: 'Aplicas a inmuebles', desc: 'Presenta tu perfil verificado a arrendadores que ya confían en Renty. Sin codeudor.', color: '#0D6B58' },
  { n: '05', title: 'Firmas y te mudas', desc: 'Contrato digital, condiciones claras. Bienvenido a tu nuevo hogar.', color: '#10B981' },
];

const faqs = [
  {
    q: '¿Renty es gratis para los inquilinos?',
    a: 'Sí. Crear tu perfil y obtener tu Renty Score no tiene ningún costo. Renty se financia a través de los servicios que ofrece a arrendadores e inmobiliarias, nunca cobrándole al inquilino.',
  },
  {
    q: '¿Cuánto tarda la verificación de mi historial?',
    a: 'El proceso inicial toma entre 5 y 15 minutos. Verificamos automáticamente tus pagos de servicios y billeteras digitales. Las referencias de arrendadores anteriores pueden tomar entre 24 y 48 horas.',
  },
  {
    q: '¿Qué pasa si tengo un mal historial crediticio en Datacrédito?',
    a: 'Renty no depende exclusivamente de Datacrédito. Nuestro scoring alternativo evalúa tu comportamiento real de pago: arriendo, servicios públicos, pagos digitales y referencias. Si has sido buen pagador en la vida real, eso cuenta.',
  },
  {
    q: '¿Necesito tener empleo formal para usar Renty?',
    a: 'No. Renty fue diseñado para incluir a trabajadores informales, independientes, freelancers y migrantes. El 55.8% de los colombianos trabaja en la informalidad, y creemos que su historial de pago es la mejor prueba de responsabilidad.',
  },
  {
    q: '¿Renty funciona solo en Bogotá?',
    a: 'El lanzamiento inicial será en Bogotá, pero planeamos expandirnos rápidamente a otras ciudades principales de Colombia. Calcula tu Renty Score y te avisaremos cuando estemos en tu ciudad.',
  },
  {
    q: '¿Mis datos están seguros?',
    a: 'Absolutamente. Cumplimos con la Ley 1581 de Protección de Datos Personales. Tus datos son encriptados, nunca se comparten sin tu autorización y tú decides qué información incluir en tu perfil.',
  },
];

const faqSchema = {
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
      <JsonLd data={faqSchema} id="ld-faq" />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* HERO */}
        <section data-section-hero className="relative flex min-h-[85vh] items-center overflow-hidden px-6 pt-24 pb-16 lg:px-12">
          <div
            className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, var(--color-teal) 0%, transparent 70%)' }}
          />
          <div
            className="pointer-events-none absolute -left-48 bottom-0 h-[400px] w-[400px] rounded-full opacity-[0.05]"
            style={{ background: 'radial-gradient(circle, var(--color-coral) 0%, transparent 70%)' }}
          />

          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <div data-hero-label className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal-lighter px-4 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse"></span>
                <span className="font-heading text-[13px] font-600 text-teal-dark">Para inquilinos</span>
              </div>

              <h1 data-hero-title className="font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.1] tracking-tight text-ink">
                <span className="block">Arrienda con tu historial,</span>
                <span className="block text-teal">no con el de otros.</span>
              </h1>

              <p data-hero-text className="mx-auto mt-6 max-w-xl font-body text-lg leading-relaxed text-ink-secondary">
                Llevas años pagando arriendo puntualmente. Pero el sistema no te reconoce porque no tienes codeudor, patrimonio o contrato formal. Con Renty, tu historial de pago es tu mejor garantía.
              </p>

              <div data-hero-ctas className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="/renty-score/formulario"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal px-7 py-3.5 font-heading text-[15px] font-600 text-white no-underline shadow-lg shadow-teal/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-dark hover:shadow-xl hover:shadow-teal/25"
                >
                  Calcula tu Renty Score
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <a
                  href="#como-funciona-inquilinos"
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-white px-7 py-3.5 font-heading text-[15px] font-600 text-ink no-underline transition-all duration-200 hover:border-teal hover:text-teal"
                >
                  Cómo funciona
                </a>
              </div>

              <div data-hero-proof className="mx-auto mt-8 flex items-center justify-center gap-6 border-t border-border pt-6">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-teal-lighter border-2 border-sand flex items-center justify-center font-heading text-[10px] font-700 text-teal">CM</div>
                  <div className="h-8 w-8 rounded-full bg-coral-light border-2 border-sand flex items-center justify-center font-heading text-[10px] font-700 text-coral">JR</div>
                  <div className="h-8 w-8 rounded-full bg-teal-lighter border-2 border-sand flex items-center justify-center font-heading text-[10px] font-700 text-teal">LP</div>
                  <div className="h-8 w-8 rounded-full bg-sand-dark border-2 border-sand flex items-center justify-center font-heading text-[10px] font-700 text-ink-muted">+</div>
                </div>
                <span className="font-body text-sm text-ink-muted">
                  <strong className="text-ink-secondary">{WAITLIST_COUNT_LABEL}</strong> familias ya confían en Renty
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* PAIN POINTS */}
        <section data-section-pain className="bg-sand-dark py-24 lg:py-32" id="problemas-inquilinos">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div data-pain-header className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
              <span className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-coral">
                Lo que enfrentas hoy
              </span>
              <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-ink">
                El sistema de arriendos<br />no está hecho para ti.
              </h2>
              <p className="mt-4 font-body text-lg leading-relaxed text-ink-secondary">
                Si eres inquilino en Colombia, ya conoces estas barreras. No importa cuántos años lleves pagando bien — el sistema mide cuánto tienes, no cómo pagas.
              </p>
            </div>

            <div data-pain-cards className="grid gap-5 md:grid-cols-2">
              {painPoints.map((point) => (
                <div key={point.title} data-pain-card className="group rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03]">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-coral-light text-coral">
                      <div className="h-6 w-6">{point.icon}</div>
                    </div>
                    <span className="font-mono text-[clamp(1.8rem,3vw,2.4rem)] font-500 leading-none text-coral/80">
                      {point.stat}{point.suffix}
                    </span>
                  </div>
                  <h3 className="mb-2 font-heading text-[16px] font-700 text-ink">{point.title}</h3>
                  <p className="font-body text-[14px] leading-relaxed text-ink-muted">{point.desc}</p>
                  <span className="mt-3 block font-mono text-[11px] text-ink-muted/60">{point.source}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CON RENTY - SOLUTIONS */}
        <section data-section-solutions className="py-24 lg:py-32" id="como-funciona-inquilinos">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div data-solutions-header className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
              <span className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-teal">
                Con Renty
              </span>
              <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-ink">
                Cada barrera tiene<br /><span className="text-teal">una solución.</span>
              </h2>
              <p className="mt-4 font-body text-lg leading-relaxed text-ink-secondary">
                Renty transforma tu historial real de pago en una garantía verificada. Así es como resolvemos cada problema.
              </p>
            </div>

            <div data-solutions-grid className="grid gap-6 md:grid-cols-2">
              {solutions.map((item) => (
                <div key={item.problem} data-solution-card className="rounded-2xl border-2 border-teal/10 bg-teal-lighter/20 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-teal/20 hover:shadow-lg hover:shadow-teal/[0.04]">
                  <div className="mb-4 flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coral/10 text-coral text-xs line-through decoration-coral/40">×</span>
                    <span className="font-body text-[14px] text-ink-muted line-through decoration-ink-muted/30">{item.problem}</span>
                  </div>
                  <div className="mb-3 flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal text-xs">✓</span>
                    <span className="font-heading text-[16px] font-700 text-teal-dark">{item.solution}</span>
                  </div>
                  <p className="ml-8 font-body text-[14px] leading-relaxed text-ink-secondary">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* USER JOURNEY */}
        <section data-section-journey className="bg-sand-dark py-24 lg:py-32" id="tu-proceso">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div data-journey-header className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
              <span className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-teal">
                Tu proceso
              </span>
              <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-ink">
                Del Renty Score<br />a tu nuevo hogar.
              </h2>
            </div>

            <div data-journey-steps className="relative">
              {/* Vertical timeline line (mobile) / Horizontal (desktop) */}
              <div data-journey-line className="absolute left-[19px] top-0 bottom-0 w-px bg-border md:left-0 md:right-0 md:top-[28px] md:bottom-auto md:h-px md:w-full"></div>

              <div className="grid gap-8 md:grid-cols-5 md:gap-6">
                {journey.map((step) => (
                  <div key={step.n} data-journey-step className="relative flex gap-5 md:flex-col md:items-center md:text-center">
                    <div
                      className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-[13px] font-500 text-white shadow-md"
                      style={{ backgroundColor: step.color, boxShadow: `0 4px 12px ${step.color}33` }}
                    >
                      {step.n}
                    </div>
                    <div className="pb-2">
                      <h3 className="mb-1 font-heading text-[15px] font-700 text-ink">{step.title}</h3>
                      <p className="font-body text-[13px] leading-relaxed text-ink-muted">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section data-section-testimonial className="py-24 lg:py-32">
          <div className="mx-auto max-w-3xl px-6 lg:px-12">
            <span className="mb-8 block text-center font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-coral">
              Historia representativa
            </span>
            <div className="relative mb-8 pl-7">
              <div data-testimonial-line className="absolute top-1 bottom-1 left-0 w-[3px] rounded-full bg-teal"></div>
              <blockquote data-testimonial-quote className="font-display text-[clamp(1.2rem,3vw,1.6rem)] leading-[1.5] text-ink">
                “Llevo 10 años pagando arriendo sin fallar un solo mes. Pero cuando quise cambiarme de apartamento, me rechazaron en 4 inmobiliarias porque no tengo codeudor con finca raíz. 10 años pagando no sirven de nada en este sistema.”
              </blockquote>
            </div>
            <p data-testimonial-narrative className="max-w-2xl font-body text-[15px] leading-relaxed text-ink-muted">
              Esta inquilina vive en Bogotá y paga arriendo puntualmente desde 2016. Trabaja como independiente, tiene sus servicios al día, jamás un atraso. Pero para el sistema formal, ella no existe. Como el 55.8% de colombianos en la informalidad, su historial es invisible.
            </p>
            <div data-testimonial-attr className="mt-8 flex items-center gap-4 border-t border-border pt-7">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-lighter font-heading text-sm font-700 text-teal">CM</div>
              <div>
                <span className="block font-heading text-[15px] font-600 text-ink">Camila M.</span>
                <span className="font-body text-[13px] text-ink-muted">Trabajadora independiente — Bogotá, 10 años arrendando</span>
              </div>
            </div>
            <p className="mt-6 font-mono text-[11px] leading-relaxed text-ink-muted/70">
              * Historia basada en casos recurrentes recopilados en nuestra investigación. Nombre modificado por privacidad.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section data-section-faq className="bg-sand-dark py-24 lg:py-32" id="preguntas-inquilinos">
          <div className="mx-auto max-w-3xl px-6 lg:px-12">
            <div data-faq-header className="mb-14 text-center">
              <span className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-teal">
                Preguntas frecuentes
              </span>
              <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-ink">
                Todo lo que necesitas saber.
              </h2>
            </div>

            <div data-faq-list className="space-y-4">
              {faqs.map((faq) => (
                <details key={faq.q} data-faq-item className="group rounded-2xl border border-border bg-surface transition-all duration-200 hover:shadow-sm open:shadow-md open:shadow-black/[0.03]">
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
        <div data-section-cta>
          <WaitlistForm
            dark
            sectionId="waitlist"
            title="Quiero mi Renty Score"
            subtitle="Sé de los primeros en demostrar que tu historial de pago vale más que un codeudor. Sin costo. Sin compromiso."
            submitLabel="Calcular mi score"
          />
        </div>
      </main>
      <Footer />
      <Animations />
    </>
  );
}
