import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildWebPageSchema, buildBreadcrumbSchema } from '@/lib/seo';
import JsonLd from '@/components/layout/JsonLd';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JumpBar from './JumpBar';
import Engine from './Engine';
import Animations from './Animations';
import { whatsappHref } from '@/lib/site';
import { getWaitlistCount } from '@/lib/waitlist';
import { getCityListingStats } from '@/lib/db/listings.repository';

/*
 * Renty — /como-funciona
 * Editorial long-form that walks the prospect through:
 *   Hero → Before vs. Now → 4 cinematic steps → Engine (interactive)
 *   → Timeline → Alternate paths → Trust → Testimonial → FAQ → Final CTA
 *
 * Server component. Interactive pieces (JumpBar scroll-spy, Engine slider)
 * are extracted into dedicated client components in this folder.
 */

const faqItems = [
  {
    q: '¿Cuánto cuesta calcular mi Renty Score?',
    a: 'Cero pesos. Nunca. El Renty Score es gratis de calcular, gratis de consultar y gratis de mantener actualizado. Renty cobra una comisión a los arrendadores cuando concretas un arriendo — no a ti.',
  },
  {
    q: '¿Puedo arrendar si tengo reportes en DataCrédito?',
    a: 'En muchos casos, sí. DataCrédito es solo una señal de las que miramos, y los reportes viejos pesan menos que tu comportamiento reciente. Reportes por deudas bajas y antiguas rara vez impiden aprobación.',
  },
  {
    q: '¿Qué pasa si soy independiente o trabajo por honorarios?',
    a: 'Renty nació para esto. El 55.8% de los colombianos trabaja en la informalidad — tu capacidad de pago la validamos con movimientos de Nequi, Daviplata, Bancolombia o tus declaraciones de renta si las tienes. No exigimos contrato laboral indefinido.',
  },
  {
    q: '¿Necesito codeudor o fiador?',
    a: 'Con un score de 650 o más, en la mayoría de los casos no. Con scores menores, algunos arrendadores aún lo pedirán — pero te avisamos antes de que apliques, no al final del proceso.',
  },
  {
    q: '¿Cómo verifican que pagué arriendo antes si mi contrato fue verbal?',
    a: 'Tres formas: (1) referencia del arrendador anterior — lo llamamos y confirma, (2) transferencias recurrentes desde tu cuenta, (3) facturas de servicios públicos a tu nombre en la misma dirección por varios meses. Cualquiera de las tres vale.',
  },
  {
    q: '¿Renty reemplaza DataCrédito?',
    a: 'No. Renty es complementario — medimos cómo pagas arriendo y servicios, algo que DataCrédito no mide. Tu información financiera no se reporta a centrales de riesgo por usar Renty.',
  },
  {
    q: '¿En qué ciudades puedo arrendar con Renty?',
    a: 'Hoy: Bogotá. Medellín entra en Q3 2026, Cali y Barranquilla en Q4. Puedes calcular tu score desde cualquier ciudad — el score es portable.',
  },
  {
    q: '¿Qué pasa con mis datos si dejo de usar Renty?',
    a: 'Los borras en 2 clics. Por Ley 1581 tienes derecho a exportar todos tus datos o eliminarlos permanentemente cuando quieras — sin preguntas, sin penalidad.',
  },
] as const;

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Cómo arrendar sin codeudor en Colombia con Renty',
  description: 'Guía paso a paso para crear tu perfil de inquilino y calcular tu Renty Score gratis.',
  totalTime: 'PT3M',
  step: [
    { '@type': 'HowToStep', position: 1, name: 'Crea tu perfil', text: 'Regístrate en 60 segundos con correo y cédula. Verificamos tu identidad con la Registraduría.' },
    { '@type': 'HowToStep', position: 2, name: 'Responde 12 preguntas', text: 'Completa el cuestionario en 3 minutos. Una a la vez, en lenguaje claro.' },
    { '@type': 'HowToStep', position: 3, name: 'Recibe tu Renty Score', text: 'Obtén tu puntaje al instante con desglose por factor y recomendaciones para subirlo.' },
    { '@type': 'HowToStep', position: 4, name: 'Arrienda sin barreras', text: 'Filtra arriendos donde ya te pre-califican y aplica con un clic en Bogotá.' },
  ],
};

const pageSeo = {
  title: 'Cómo Arrendar sin Codeudor en Colombia | Cómo Funciona Renty',
  description:
    'Descubre cómo arrendar sin codeudor en 4 pasos con Renty. Crea tu perfil de inquilino, calcula tu Renty Score gratis y encuentra arriendos donde ya te pre-califican.',
  path: '/como-funciona',
  ogSlug: 'como-funciona',
};
export const metadata: Metadata = buildMetadata(pageSeo);

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Cómo funciona', url: '/como-funciona' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Reusable bits
// ─────────────────────────────────────────────────────────────────────────────
function Eyebrow({
  children,
  tone = 'teal',
}: {
  children: React.ReactNode;
  tone?: 'teal' | 'coral' | 'white';
}) {
  const color = tone === 'coral' ? 'text-coral' : tone === 'white' ? 'text-white/55' : 'text-teal';
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-mono text-[11px] font-500 tracking-[0.14em] uppercase before:inline-block before:h-px before:w-[18px] before:bg-current before:opacity-55 ${color}`}
    >
      {children}
    </span>
  );
}

function Check({ className = '', strokeWidth = 3 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function Cross({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function ArrowR({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default async function ComoFuncionaPage() {
  const [bogotaStats, waitlistCount] = await Promise.all([
    getCityListingStats('bogota'),
    getWaitlistCount(),
  ]);
  const waHref = whatsappHref('Hola, tengo una pregunta sobre Renty 👋');
  // "+" suffix on small counts so copy never reads "98 personas" as if it's a hard ceiling.
  const waitlistLabel = waitlistCount.toLocaleString('es-CO') + '+';
  const marketCountLabel =
    bogotaStats.total > 0 ? bogotaStats.total.toLocaleString('es-CO') : '—';

  return (
    <>
      <JsonLd data={buildWebPageSchema({ ...pageSeo, hasBreadcrumb: true })} id="ld-webpage" />
      <JsonLd data={buildBreadcrumbSchema(pageSeo.path, breadcrumbs)} id="ld-breadcrumb" />
      <JsonLd data={faqSchema} id="ld-faq" />
      <JsonLd data={howToSchema} id="ld-howto" />
      <Navbar />
      <Animations />
      <main id="main-content" tabIndex={-1}>
        {/* ==================== HERO ==================== */}
        <header className="relative overflow-hidden pt-6 pb-16 lg:pt-10 lg:pb-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[240px] -top-[200px] h-[720px] w-[720px] rounded-full blur-[20px]"
            style={{ background: 'radial-gradient(circle, rgba(13,107,88,0.09), transparent 60%)' }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-[140px] -bottom-[100px] h-[500px] w-[500px] rounded-full blur-[20px]"
            style={{ background: 'radial-gradient(circle, rgba(232,99,74,0.07), transparent 60%)' }}
          />

          <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-12">
            {/* Copy */}
            <div className="min-w-0" data-cf-reveal>
              <Eyebrow tone="coral">Cómo funciona · Guía completa</Eyebrow>
              <h1
                className="mt-5 mb-7 font-display font-400 text-ink [letter-spacing:-0.025em]"
                style={{ fontSize: 'clamp(40px, 6vw, 84px)', lineHeight: 0.98 }}
              >
                Arrienda sin codeudor,
                <br />
                sin humillaciones,
                <br />
                <em className="relative inline-block italic text-teal">
                  sin barreras.
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-1 h-2 bg-coral/25"
                    style={{ zIndex: -1 }}
                  />
                </em>
              </h1>
              <p
                className="max-w-[52ch] font-body text-ink-secondary"
                style={{ fontSize: 19, lineHeight: 1.6, margin: '0 0 32px' }}
              >
                Así es paso a paso: de responder 12 preguntas a tener las llaves en la mano. Sin
                intermediarios que se quedan con un mes de tu canon, sin pedirle finca raíz a tu
                tío, sin &ldquo;no calificas&rdquo; sin explicación.
              </p>
              <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] font-500 tracking-[0.12em] uppercase text-ink-muted sm:text-[11px]">
                <span><b className="font-500 text-ink">3 min</b> · para calcular score</span>
                <span><b className="font-500 text-ink">0 COP</b> · sin costo</span>
                <span><b className="font-500 text-ink">100%</b> · transparente</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/renty-score/formulario"
                  className="inline-flex h-[56px] items-center gap-2.5 rounded-[14px] bg-teal px-8 font-heading text-[15px] font-600 text-white no-underline transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/20"
                >
                  Calcular mi score gratis
                  <ArrowR className="h-4 w-4" />
                </Link>
                <Link
                  href="/bogota/arriendos"
                  className="inline-flex h-[56px] items-center gap-2.5 rounded-[14px] border border-border-strong bg-white px-8 font-heading text-[15px] font-600 text-ink no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-teal hover:text-teal"
                >
                  Ver arriendos en Bogotá
                  <ArrowR className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Hero visual — 3 floating cards */}
            <div className="relative mx-auto h-auto w-full min-w-0 max-w-[420px] lg:mx-0 lg:ml-auto lg:h-[580px] lg:max-w-[560px]">
              <div className="flex flex-col gap-4 lg:contents">
                {/* Card 1: score (María) */}
                <div className="renty-float-a order-1 rounded-[20px] border border-border bg-white p-6 shadow-lg lg:absolute lg:right-0 lg:top-0 lg:w-[360px] lg:p-[26px]">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-full text-white font-heading text-[15px] font-700"
                        style={{ background: 'linear-gradient(135deg, #F0B27A, #C4402A)' }}
                        aria-hidden="true"
                      >
                        M
                      </div>
                      <div>
                        <span className="block font-heading text-[14px] font-600 text-ink">María C.</span>
                        <span className="mt-0.5 block font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-ink-muted">
                          Chapinero, Bogotá
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-lighter px-2.5 py-1 font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-teal">
                      <span className="renty-pulse-dot h-1.5 w-1.5 rounded-full bg-teal" />
                      En vivo
                    </span>
                  </div>
                  <div className="rounded-[14px] bg-sand p-5">
                    <div className="mb-2.5 font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-ink-muted">
                      Renty Score
                    </div>
                    <div className="font-mono font-500 leading-none text-teal [letter-spacing:-0.02em]" style={{ fontSize: 56 }}>
                      785
                      <span className="ml-1.5 font-400 text-ink-muted" style={{ fontSize: 22 }}>/1000</span>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-teal px-3 py-1 font-heading text-[12px] font-600 text-white">
                      <Check className="h-3 w-3" />
                      Excelente
                    </span>
                    <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-white">
                      <span className="renty-fill-bar block h-full rounded-full" style={{ background: 'linear-gradient(90deg, var(--color-teal-light), var(--color-teal))' }} />
                    </div>
                    <div className="mt-2 flex justify-between font-mono text-[10px] font-500 tracking-[0.14em] text-ink-muted">
                      <span>0</span>
                      <span>500</span>
                      <span>1000</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: pre-aprobada */}
                <div className="renty-float-b order-2 flex items-center gap-3 rounded-[20px] border border-border bg-white p-4 shadow-lg lg:absolute lg:bottom-[110px] lg:right-6 lg:w-[260px] lg:p-[18px]">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-coral-light text-coral-dark">
                    <Check className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div>
                    <h5 className="m-0 font-heading text-[14px] font-600 text-ink">Pre-aprobada</h5>
                    <p className="m-0 mt-0.5 font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-ink-muted">
                      Sin codeudor · Sin fiador
                    </p>
                  </div>
                </div>

                {/* Card 3: listing */}
                <div className="renty-float-a order-3 flex gap-3.5 rounded-[20px] border border-border bg-white p-4 shadow-lg lg:absolute lg:bottom-0 lg:left-0 lg:w-[300px]">
                  <div
                    className="relative h-[72px] w-[72px] flex-none overflow-hidden rounded-xl"
                    style={{ background: 'linear-gradient(135deg, #c9bfae 0%, #8b7a62 100%)' }}
                    aria-hidden="true"
                  >
                    <span
                      className="absolute inset-0"
                      style={{
                        background:
                          'radial-gradient(ellipse at 30% 40%, rgba(255,255,255,.18), transparent 50%), linear-gradient(180deg, transparent 60%, rgba(0,0,0,.2))',
                      }}
                    />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-lighter px-2 py-0.5 font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-teal-dark">
                      <span className="renty-pulse-dot h-1.5 w-1.5 rounded-full bg-teal" />
                      Nuevo
                    </span>
                    <h5 className="mt-1.5 mb-0.5 font-heading text-[14px] font-600 text-ink">Chapinero Alto</h5>
                    <p className="m-0 font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-ink-muted">
                      2 hab · 62 m²
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <JumpBar />

        {/* ==================== BEFORE / AFTER ==================== */}
        <section id="antes-ahora" className="bg-sand-dark py-14 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <div className="mx-auto mb-14 max-w-[760px] text-center" data-cf-reveal>
              <Eyebrow tone="coral">El cambio</Eyebrow>
              <h2
                className="mx-auto mt-4 max-w-[20ch] font-display font-400 text-ink [letter-spacing:-0.02em]"
                style={{ fontSize: 'clamp(28px, 4.5vw, 56px)', lineHeight: 1.1, margin: '16px auto 14px' }}
              >
                Así arriendas hoy. Así arriendas con Renty.
              </h2>
              <p className="mx-auto max-w-[56ch] font-body text-ink-secondary" style={{ fontSize: 19, lineHeight: 1.55 }}>
                No es tecnología por tecnología. Es quitar 30 años de fricción entre quien paga
                cumplido y quien tiene un techo.
              </p>
            </div>

            <div
              data-cf-reveal
              className="grid grid-cols-1 overflow-hidden rounded-3xl border border-border bg-white shadow-md md:grid-cols-2"
            >
              {/* OLD side */}
              <div className="border-b border-border p-8 md:border-b-0 md:border-r md:p-12">
                <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-sand-dark px-3.5 py-1.5 font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-ink-muted">
                  Antes · El sistema tradicional
                </span>
                <h3 className="mb-1.5 font-display font-400 text-[28px] leading-[1.15] text-ink [letter-spacing:-0.015em]">
                  Tu vida cabe en tres documentos.
                </h3>
                <p className="mb-8 font-body text-[15px] text-ink-muted">Si no encajas en el molde, no existes.</p>
                <ul className="grid list-none gap-4 p-0">
                  {[
                    { t: 'Te piden un codeudor con finca raíz en Bogotá.', d: 'Aunque pagues cumplido hace 10 años. Aunque tu mamá tenga casa en Pasto.' },
                    { t: 'Una inmobiliaria se queda con un mes de canon.', d: 'Por "estudio de crédito". El mismo estudio que DataCrédito cobra $12.000.' },
                    { t: 'Te rechazan sin decirte por qué.', d: 'Una marca vieja en DataCrédito, un contrato informal, trabajo por honorarios — cualquier cosa cuenta en contra.' },
                    { t: 'El contrato termina siendo verbal.', d: 'El 57% de los arriendos en Colombia son así. Sin contrato escrito, sin historial, sin nada que mostrar después.' },
                  ].map((li, i) => (
                    <li key={i} className="grid grid-cols-[28px_1fr] items-start gap-3.5 border-t border-border pt-3.5 first:border-t-0 first:pt-0">
                      <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#F5E5E1] text-coral-dark">
                        <Cross className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <p className="m-0 font-heading text-[15px] font-500 text-ink">{li.t}</p>
                        <p className="mt-1 font-body text-[13px] leading-[1.55] text-ink-muted">{li.d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* NEW side */}
              <div className="relative overflow-hidden bg-ink p-8 text-white md:p-12">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-[100px] -top-[100px] h-[400px] w-[400px] rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.18), transparent 60%)' }}
                />
                <div className="relative">
                  <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-teal/15 px-3.5 py-1.5 font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-teal-light">
                    Con Renty · Desde hoy
                  </span>
                  <h3 className="mb-1.5 font-display font-400 text-[28px] leading-[1.15] text-white [letter-spacing:-0.015em]">
                    Tu historial habla por ti.
                  </h3>
                  <p className="mb-8 font-body text-[15px] text-white/60">Tu manera de pagar es tu mejor garantía.</p>
                  <ul className="grid list-none gap-4 p-0">
                    {[
                      { t: 'Respondes 12 preguntas. Sacas tu Renty Score.', d: 'Gratis, 3 minutos, sin DataCrédito como única medida. Ves qué lo mueve y cómo subirlo.' },
                      { t: 'Filtras arriendos donde ya te pre-califican.', d: 'Dejas de aplicar a 20 para que te rechacen en 18. Solo ves los que encajan con tu score.' },
                      { t: 'Tu score crece cada mes que pagas.', d: 'Los arriendos que ya pagaste antes cuentan — así no tuvieran contrato escrito. Lo validamos con servicios públicos y referencias.' },
                      { t: 'Contratos escritos, digitales, guardados.', d: 'Cada firma queda. Cada pago queda. El próximo arriendo te lo dan más rápido, porque ya existes.' },
                    ].map((li, i) => (
                      <li key={i} className="grid grid-cols-[28px_1fr] items-start gap-3.5 border-t border-white/10 pt-3.5 first:border-t-0 first:pt-0">
                        <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-teal/20 text-teal-light">
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </span>
                        <div>
                          <p className="m-0 font-heading text-[15px] font-500 text-white">{li.t}</p>
                          <p className="mt-1 font-body text-[13px] leading-[1.55] text-white/55">{li.d}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== STEPS ==================== */}
        <section id="pasos" className="bg-sand py-14 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <div className="mx-auto mb-14 max-w-[760px] text-center lg:mb-20" data-cf-reveal>
              <Eyebrow>Los 4 pasos</Eyebrow>
              <h2
                className="mt-4 font-display font-400 text-ink [letter-spacing:-0.02em]"
                style={{ fontSize: 'clamp(32px, 5vw, 64px)', lineHeight: 1.05 }}
              >
                De responder preguntas
                <br />
                a tener las llaves.
              </h2>
              <p className="mx-auto mt-4 max-w-[56ch] font-body text-ink-secondary" style={{ fontSize: 19, lineHeight: 1.55 }}>
                Todo el proceso, visto desde adentro. Nada de letra chica ni sorpresas al final.
              </p>
            </div>

            <div className="flex flex-col gap-16 lg:gap-[140px]">
              {/* STEP 01 — signup mock */}
              <Step
                num="1"
                tag="Primero · 60 segundos"
                title="Crea tu perfil con correo y cédula."
                lead="Sin formularios eternos. Nombre, cédula, correo, celular. Si ya tienes Nequi o Daviplata, podemos pre-llenar los datos."
                bullets={[
                  'Verificamos tu cédula con la Registraduría en segundos.',
                  'Solo pedimos lo necesario — Ley 1581 de 2012.',
                  'Puedes entrar con Google o con tu correo + OTP.',
                ]}
                meta={[
                  { k: '60 s', v: 'promedio' },
                  { k: 'Encriptado', v: 'AES-256' },
                ]}
                mockup={<SignupMock waitlistLabel={waitlistLabel} />}
              />
              {/* STEP 02 — quiz */}
              <Step
                reverse
                num="2"
                tag="Segundo · 3 minutos"
                title="Respondes 12 preguntas simples."
                lead="Cosas que un arrendador ya te preguntaría: ¿cuánto ganas? ¿hace cuánto pagas arriendo? ¿tienes hijos? Todo en lenguaje claro, una a la vez."
                bullets={[
                  'Ninguna pregunta es obligatoria — puedes saltarla y bajas un poco tu score.',
                  'Validamos lo que se puede validar: servicios públicos, referencias, movimientos Nequi.',
                  'No le preguntamos a DataCrédito si no quieres — es opcional, suma al score.',
                ]}
                meta={[
                  { k: '3 min', v: 'promedio' },
                  { k: '12 preguntas', v: '' },
                ]}
                mockup={<QuizMock />}
              />
              {/* STEP 03 — score reveal (dark) */}
              <Step
                num="3"
                tag="Tercero · instantáneo"
                title="Conoces tu Renty Score y qué lo mueve."
                lead="Un número de 0 a 1000 — pero más importante que el número, ves los 4 factores que lo componen. Sabes qué sumar, qué restar, cómo mejorarlo en 30 días."
                bullets={[
                  '40% historial de pago · 25% estabilidad laboral',
                  '20% capacidad de pago · 15% comportamiento',
                  'Cada factor tiene un "cómo mejorarlo" con pasos concretos.',
                ]}
                meta={[
                  { k: 'Transparente', v: '' },
                  { k: 'Sube cada mes', v: '' },
                ]}
                mockup={<ScoreMock />}
              />
              {/* STEP 04 — marketplace */}
              <Step
                reverse
                num="4"
                tag="Cuarto · de 3 a 7 días"
                title="Ves arriendos donde ya te pre-califican."
                lead="Tu score viaja contigo en el marketplace. Cada inmueble tiene un score mínimo — ves solo los que te caben, y aplicas con un clic. El arrendador ya te vio verificada, tu historial ya habló por ti."
                bullets={[
                  'Filtros: precio, zona, habitaciones, mascotas, amoblado.',
                  'Badge verde "Pre-aprobada" cuando tu score supera el mínimo.',
                  'Contacto directo con el arrendador — sin intermediarios de comisión.',
                ]}
                meta={[
                  { k: marketCountLabel, v: 'arriendos en Bogotá' },
                  { k: 'Respuesta', v: '< 24 h' },
                ]}
                mockup={<MarketMock />}
              />
            </div>
          </div>
        </section>

        {/* ==================== ENGINE ==================== */}
        <Engine />

        {/* ==================== TIMELINE ==================== */}
        <section id="tiempos" className="bg-sand py-14 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <div className="mx-auto mb-14 max-w-[720px] text-center lg:mb-20" data-cf-reveal>
              <Eyebrow>El calendario</Eyebrow>
              <h2
                className="mt-4 font-display font-400 text-ink [letter-spacing:-0.02em]"
                style={{ fontSize: 'clamp(32px, 5vw, 60px)', lineHeight: 1.05 }}
              >
                Qué pasa en 3 minutos,
                <br />
                1 semana, 6 meses.
              </h2>
              <p className="mx-auto mt-4 max-w-[56ch] font-body text-ink-secondary" style={{ fontSize: 19, lineHeight: 1.55 }}>
                Renty no es solo para encontrar tu próximo arriendo — es para construir un historial
                que te acompañe por los siguientes 20.
              </p>
            </div>

            <div className="relative mx-auto max-w-[1080px]" data-cf-reveal>
              {/* Horizontal line on desktop */}
              <div
                aria-hidden="true"
                className="absolute left-[80px] right-[80px] top-[22px] hidden h-0.5 bg-border-strong lg:block"
              >
                <span className="block h-full w-[85%] bg-teal" />
              </div>
              {/* Vertical line on mobile */}
              <div
                aria-hidden="true"
                className="absolute left-[22px] top-[22px] bottom-[22px] w-0.5 bg-teal-lighter lg:hidden"
              />

              <ol className="relative grid list-none grid-cols-1 gap-6 p-0 lg:grid-cols-5 lg:gap-4">
                {[
                  { t: 'Min 1', h: 'Te registras', d: 'Cédula, correo, celular. 60 segundos.', muted: false, icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  ) },
                  { t: 'Min 3', h: 'Tienes tu score', d: '12 preguntas. Ya ves el número y los factores.', muted: false, icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 12l2 2 4-4m-6 8h12V6H5v16l4-4z" /></svg>
                  ) },
                  { t: 'Día 1 – 7', h: 'Encuentras arriendo', d: 'Aplicas a 3. Te contestan en menos de 24 h.', muted: false, icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 10l9-7 9 7v10a2 2 0 01-2 2h-4v-6H9v6H5a2 2 0 01-2-2V10z" /></svg>
                  ) },
                  { t: 'Día 8 – 14', h: 'Firmas y entras', d: 'Contrato digital. Depósito escrow. Llaves en mano.', muted: false, icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
                  ) },
                  { t: 'Mes 1 – 24', h: 'Tu score sube', d: 'Cada pago cumplido lo refuerza — para el siguiente arriendo, ya existes.', muted: true, icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                  ) },
                ].map((it, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[44px_1fr] items-start gap-4 lg:block lg:text-center"
                  >
                    <span
                      className={`relative z-[1] inline-flex h-11 w-11 items-center justify-center rounded-full border-2 shadow-[0_0_0_6px_var(--color-sand)] lg:mb-4 ${
                        it.muted
                          ? 'border-border-strong bg-sand-dark text-ink-muted'
                          : 'border-teal bg-teal text-white'
                      }`}
                      aria-hidden="true"
                    >
                      <span className="h-[18px] w-[18px]">{it.icon}</span>
                    </span>
                    <div>
                      <div className={`mb-1 font-mono text-[10px] font-500 tracking-[0.14em] uppercase sm:text-[11px] ${it.muted ? 'text-ink-muted' : 'text-coral'}`}>
                        {it.t}
                      </div>
                      <h5 className="m-0 mb-1.5 font-heading text-[16px] font-600 text-ink sm:text-[18px] [letter-spacing:-0.01em]">
                        {it.h}
                      </h5>
                      <p className="m-0 font-body text-[13px] leading-[1.5] text-ink-muted sm:text-[14px] lg:mx-auto lg:max-w-[20ch]">
                        {it.d}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ==================== ALTERNATE PATHS ==================== */}
        <section id="caminos" className="bg-sand-dark py-14 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <div className="mx-auto mb-12 max-w-[760px] text-center lg:mb-16" data-cf-reveal>
              <Eyebrow tone="coral">Honestidad radical</Eyebrow>
              <h2
                className="mt-4 font-display font-400 text-ink [letter-spacing:-0.02em]"
                style={{ fontSize: 'clamp(28px, 4.5vw, 56px)', lineHeight: 1.1 }}
              >
                ¿Y si mi score no es alto?
              </h2>
              <p className="mx-auto mt-4 max-w-[56ch] font-body text-ink-secondary" style={{ fontSize: 19, lineHeight: 1.55 }}>
                Lo decimos claro: Renty no aprueba a todo el mundo. Pero te damos un camino para
                llegar. Ningún score es definitivo — se mueve cada mes.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3" data-cf-reveal>
              {[
                {
                  tone: 'red',
                  range: '0 – 400 · En construcción',
                  title: 'Todavía no, pero sí.',
                  desc: 'No puedes arrendar con nosotros aún — el riesgo para el arrendador es alto. Pero te damos el plan exacto para llegar a 500 en 3 meses.',
                  hd: 'Cómo subes',
                  items: [
                    'Enlazas Nequi/Daviplata — mostramos 3 meses de pagos cumplidos.',
                    'Añades una referencia de arrendador anterior, así sea verbal.',
                    'Pagas tus servicios con la app — se registra cada mes.',
                  ],
                },
                {
                  tone: 'amber',
                  range: '400 – 650 · Pre-calificado parcial',
                  title: 'Arriendas, con condiciones.',
                  desc: 'Ves arriendos específicos que aceptan tu rango. Puede que pidan 2 meses de depósito en escrow, o una póliza de arrendamiento — te lo decimos desde el primer clic.',
                  hd: 'Cómo subes',
                  items: [
                    'Cada mes que pagues cumplido con nosotros, subes 8–15 puntos.',
                    'Verifica ingresos — por Nequi, Daviplata o desprendible.',
                    'Completa referencias — hasta 3 suman.',
                  ],
                },
                {
                  tone: 'green',
                  range: '650 – 1000 · Vía libre',
                  title: 'Arriendas sin codeudor.',
                  desc: 'Sin más. Tu historial es tu garantía. Pre-aprobada en la mayoría de los arriendos del catálogo y en la mayoría de los casos sin depósito adicional.',
                  hd: 'Cómo mantienes',
                  items: [
                    'Pagas a tiempo — 40% del score depende de esto.',
                    'No cambias de trabajo cada 2 meses si puedes evitarlo.',
                    'Si te atrasas una vez, avísanos antes — no penaliza igual.',
                  ],
                },
              ].map((p, i) => {
                const rangeCls =
                  p.tone === 'red'
                    ? 'bg-score-low-bg text-score-low'
                    : p.tone === 'amber'
                    ? 'bg-score-mid-bg text-score-mid'
                    : 'bg-teal-lighter text-teal-dark';
                return (
                  <div
                    key={i}
                    className="rounded-3xl border border-border bg-white p-7 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-teal hover:shadow-lg sm:p-8"
                  >
                    <span className={`mb-5 inline-flex items-center rounded-full px-3.5 py-1.5 font-mono text-[11px] font-500 tracking-[0.04em] ${rangeCls}`}>
                      {p.range}
                    </span>
                    <h4 className="mb-2.5 font-display font-400 text-[22px] leading-tight text-ink [letter-spacing:-0.01em] sm:text-[24px]">
                      {p.title}
                    </h4>
                    <p className="mb-6 font-body text-[15px] leading-relaxed text-ink-secondary">{p.desc}</p>
                    <div className="border-t border-border pt-5">
                      <div className="mb-3 font-mono text-[10px] font-500 tracking-[0.12em] uppercase text-ink-muted">
                        {p.hd}
                      </div>
                      <ul className="grid list-none gap-2.5 p-0">
                        {p.items.map((t, j) => (
                          <li key={j} className="flex gap-2.5 font-body text-[13px] leading-[1.5] text-ink-secondary sm:text-[14px]">
                            <span className="flex-none font-600 text-coral">→</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== TRUST ==================== */}
        <section id="seguridad" className="border-t border-border bg-white py-14 lg:py-24">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-12">
            <div className="min-w-0" data-cf-reveal>
              <Eyebrow>Seguridad · Cumplimiento</Eyebrow>
              <h2
                className="mt-4 font-display font-400 text-ink [letter-spacing:-0.02em]"
                style={{ fontSize: 'clamp(28px, 4.5vw, 52px)', lineHeight: 1.1 }}
              >
                Tus datos son tuyos.
                <br />
                Siempre.
              </h2>
              <p className="mb-7 mt-4 max-w-[52ch] font-body text-ink-secondary" style={{ fontSize: 19, lineHeight: 1.55 }}>
                No vendemos tu información, no la prestamos, no la usamos para publicidad. Renty
                opera bajo la Ley 1581 de 2012 y cumple con estándares bancarios de encriptación.
              </p>
              <ul className="grid list-none gap-3.5 p-0">
                {[
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    ),
                    b: 'Encriptados en tránsito y en reposo.',
                    d: 'TLS 1.3 en el transporte. AES-256 para lo almacenado. Los mismos estándares que tu banco.',
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                    ),
                    b: 'Ley 1581 de 2012 · Habeas Data.',
                    d: 'Puedes descargar todos tus datos o eliminarlos permanentemente en 2 clics, cuando quieras.',
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    ),
                    b: 'Cero reventa de datos.',
                    d: 'No somos un broker de datos. Tu información nunca va a terceros sin tu permiso expreso.',
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    ),
                    b: 'Verificación biométrica opcional.',
                    d: 'Si quieres subir 40 puntos en el score, validamos tu identidad con selfie + cédula en 30 segundos.',
                  },
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-teal-lighter text-teal">
                      <span className="h-[18px] w-[18px]">{t.icon}</span>
                    </span>
                    <div>
                      <b className="mb-0.5 block font-heading text-[15px] font-600 text-ink">{t.b}</b>
                      <small className="font-body text-[13px] leading-relaxed text-ink-muted">{t.d}</small>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="grid min-w-0 grid-cols-1 gap-3 rounded-3xl border border-border bg-sand p-5 sm:grid-cols-2 sm:p-8"
              data-cf-reveal
            >
              <div className="rounded-[14px] border border-border bg-white p-5">
                <div className="mb-2.5 font-mono text-[10px] font-500 tracking-[0.12em] uppercase text-ink-muted">Uptime · 2025</div>
                <div className="font-mono text-[28px] font-500 leading-none text-teal [letter-spacing:-0.02em] sm:text-[32px]">99.97%</div>
                <div className="mt-2 font-body text-[13px] text-ink-secondary">Medido en los últimos 12 meses. SLA público.</div>
              </div>
              <div className="rounded-[14px] border border-border bg-white p-5">
                <div className="mb-2.5 font-mono text-[10px] font-500 tracking-[0.12em] uppercase text-ink-muted">Respuesta · Soporte</div>
                <div className="font-mono text-[28px] font-500 leading-none text-teal [letter-spacing:-0.02em] sm:text-[32px]">&lt; 4 h</div>
                <div className="mt-2 font-body text-[13px] text-ink-secondary">Promedio de primer contacto, en horario hábil.</div>
              </div>
              <div className="rounded-[14px] border border-border bg-white p-5 sm:col-span-2">
                <div className="mb-2.5 font-mono text-[10px] font-500 tracking-[0.12em] uppercase text-ink-muted">Encriptación en reposo</div>
                <code className="block overflow-hidden rounded-lg bg-ink px-3 py-2.5 font-mono text-[11px] text-teal-light" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  AES-256-GCM · RSA-4096 · Keys rotadas cada 90 días
                </code>
              </div>
              <div className="rounded-[14px] border border-border bg-white p-5 sm:col-span-2">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-teal text-white">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  </div>
                  <div>
                    <div className="font-heading text-[14px] font-600 text-ink">Ley 1581 de 2012 · SIC registrada</div>
                    <div className="mt-0.5 font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-ink-muted">
                      Habeas data · Política de tratamiento pública
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== TESTIMONIAL ==================== */}
        <section className="bg-sand py-20 text-center lg:py-[140px]">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12" data-cf-reveal>
            <div className="mx-auto mb-7 h-px w-14 bg-coral/50" />
            <Eyebrow tone="coral">Una historia real</Eyebrow>
            <blockquote
              className="mx-auto mt-6 mb-8 max-w-[24ch] font-display font-400 text-ink [letter-spacing:-0.01em]"
              style={{ fontSize: 'clamp(22px, 3.5vw, 42px)', lineHeight: 1.25 }}
            >
              <span aria-hidden="true" className="mb-5 block font-display leading-none text-coral" style={{ fontSize: 72, lineHeight: 0.3 }}>&ldquo;</span>
              Llevo <em className="italic text-teal">8 años pagando arriendo</em> cumplida. Nunca
              tuve un codeudor con finca raíz. Con Renty, por primera vez, mi historial vale lo que
              debería valer.
            </blockquote>
            <div className="inline-flex items-center gap-3.5">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-white font-heading font-700"
                style={{ background: 'linear-gradient(135deg, #F0B27A, #C4402A)' }}
                aria-hidden="true"
              >
                M
              </div>
              <div className="text-left">
                <span className="block font-heading text-[14px] font-600 text-ink">María Castillo, 34 años</span>
                <span className="block font-mono text-[10px] font-500 tracking-[0.12em] uppercase text-ink-muted">
                  Bogotá · Diseñadora independiente
                </span>
              </div>
            </div>
            <div className="mt-5">
              <span className="inline-flex items-baseline gap-1.5 rounded-full border border-teal/15 bg-teal-lighter px-3.5 py-1.5 font-mono text-[14px] font-500 text-teal">
                <small className="font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-ink-muted">Renty Score</small>
                785
              </span>
            </div>
          </div>
        </section>

        {/* ==================== FAQ ==================== */}
        <section id="faq" className="bg-sand-dark py-14 lg:py-24">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-start gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.4fr] lg:gap-20 lg:px-12">
            <div className="min-w-0" data-cf-reveal>
              <Eyebrow>Preguntas frecuentes</Eyebrow>
              <h2
                className="mt-4 font-display font-400 text-ink [letter-spacing:-0.02em]"
                style={{ fontSize: 'clamp(28px, 4.5vw, 52px)', lineHeight: 1.1 }}
              >
                Lo que siempre
                <br />
                nos preguntan.
              </h2>
              <p className="mb-7 mt-4 font-body text-ink-secondary" style={{ fontSize: 19, lineHeight: 1.55 }}>
                Sin letra chica. Si algo no está aquí, lo respondemos en menos de 4 horas.
              </p>
              {waHref ? (
                <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
                  <h5 className="m-0 mb-1 font-heading text-[14px] font-600 text-ink">
                    ¿No encuentras lo que buscas?
                  </h5>
                  <p className="m-0 mb-3.5 font-body text-[13px] text-ink-muted">
                    Escríbenos por WhatsApp. Responde una persona, no un bot.
                  </p>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-heading text-[13px] font-600 text-teal no-underline hover:text-teal-dark"
                  >
                    Abrir WhatsApp
                    <ArrowR className="h-3.5 w-3.5" />
                  </a>
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
                  <h5 className="m-0 mb-1 font-heading text-[14px] font-600 text-ink">
                    ¿No encuentras lo que buscas?
                  </h5>
                  <p className="m-0 font-body text-[13px] text-ink-muted">
                    Escríbenos a{' '}
                    <a href="mailto:soporte@rentyco.app" className="text-teal no-underline hover:text-teal-dark">
                      soporte@rentyco.app
                    </a>{' '}
                    — respondemos en menos de 4 horas.
                  </p>
                </div>
              )}
            </div>

            <div className="min-w-0" data-cf-reveal>
              <div className="divide-y divide-border">
                {faqItems.map((item, i) => (
                  <details key={item.q} className="group py-5" {...(i === 0 ? { open: true } : {})}>
                    <summary className="flex cursor-pointer items-start justify-between gap-4 list-none font-heading text-[15px] font-500 leading-[1.4] text-ink sm:text-[18px] [&::-webkit-details-marker]:hidden">
                      <span>{item.q}</span>
                      <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-sand text-ink transition-all duration-300 group-open:rotate-45 group-open:bg-teal group-open:text-white sm:h-7 sm:w-7">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-3 pr-10 font-body text-[14px] leading-[1.65] text-ink-secondary sm:text-[15px]">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==================== FINAL CTA ==================== */}
        <section className="relative overflow-hidden bg-ink py-20 text-white lg:py-[140px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[200px] -top-[200px] h-[900px] w-[900px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(13,107,88,0.2), transparent 60%)' }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-[100px] -bottom-[200px] h-[600px] w-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(232,99,74,0.1), transparent 60%)' }}
          />
          <div className="relative mx-auto max-w-[820px] px-5 text-center sm:px-8 lg:px-12" data-cf-reveal>
            <Eyebrow tone="white">Empieza ahora · 3 minutos</Eyebrow>
            <h2
              className="mt-5 mb-6 font-display font-400 text-white [letter-spacing:-0.03em]"
              style={{ fontSize: 'clamp(36px, 6vw, 88px)', lineHeight: 1 }}
            >
              Tu historial ya habla. <em className="italic text-coral">Dale voz.</em>
            </h2>
            <p className="mx-auto mb-10 max-w-[48ch] font-body text-white/70" style={{ fontSize: 19, lineHeight: 1.55 }}>
              Calcula tu Renty Score gratis. Sin tarjeta, sin compromiso, sin letra chica.
            </p>
            <div
              role="list"
              aria-label="Disponibilidad por ciudad"
              className="mb-8 inline-flex max-w-full flex-wrap justify-center gap-1 rounded-full border border-white/10 bg-white/[0.05] p-1"
            >
              <span
                role="listitem"
                className="inline-flex items-center gap-1.5 rounded-full bg-teal px-5 py-2.5 font-heading text-[13px] font-600 text-white"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Bogotá
              </span>
              <span
                role="listitem"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-heading text-[13px] font-500 text-white/80"
              >
                Medellín
                <span className="font-mono text-[10px] font-500 tracking-[0.12em] uppercase text-teal-light">
                  Q3 2026
                </span>
              </span>
              <span
                role="listitem"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-heading text-[13px] font-500 text-white/80"
              >
                Cali
                <span className="font-mono text-[10px] font-500 tracking-[0.12em] uppercase text-teal-light">
                  Q4 2026
                </span>
              </span>
            </div>
            <div className="mb-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/renty-score/formulario"
                className="inline-flex h-[56px] items-center gap-2.5 rounded-[14px] bg-coral px-8 font-heading text-[15px] font-600 text-white no-underline transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-lg hover:shadow-coral/20"
              >
                Calcular mi score
                <ArrowR className="h-4 w-4" />
              </Link>
              <Link
                href="/bogota/arriendos"
                className="inline-flex h-[56px] items-center gap-2.5 rounded-[14px] border border-white/20 px-8 font-heading text-[15px] font-600 text-white no-underline transition-all duration-200 hover:border-white/40 hover:bg-white/[0.08]"
              >
                Ver arriendos en Bogotá
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-x-7 gap-y-2 font-mono text-[10px] font-500 tracking-[0.12em] uppercase text-white/40 sm:text-[11px]">
              <span>🔒 Encriptados</span>
              <span>🇨🇴 Hecho en Colombia</span>
              <span>👁️ Score transparente</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponents
// ─────────────────────────────────────────────────────────────────────────────
interface StepProps {
  num: string;
  tag: string;
  title: string;
  lead: string;
  bullets: string[];
  meta: { k: string; v: string }[];
  mockup: React.ReactNode;
  reverse?: boolean;
}
function Step({ num, tag, title, lead, bullets, meta, mockup, reverse }: StepProps) {
  return (
    <div
      className={`grid grid-cols-1 items-center gap-6 lg:gap-20 ${
        reverse ? 'lg:grid-cols-[1fr_1fr]' : 'lg:grid-cols-[1fr_1fr]'
      }`}
      data-cf-reveal
    >
      {/* Mock appears first on mobile (visual-first) */}
      <div className={`order-1 min-w-0 ${reverse ? 'lg:order-1' : 'lg:order-2'}`}>
        {mockup}
      </div>
      <div className={`order-2 min-w-0 max-w-[520px] ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
        <div className="mb-5 flex items-center gap-3.5 font-mono text-[11px] font-500 tracking-[0.14em] uppercase text-coral">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-coral font-600 text-white">
            {num}
          </span>
          {tag}
        </div>
        <h3
          className="mb-4 font-display font-400 text-ink [letter-spacing:-0.02em]"
          style={{ fontSize: 'clamp(24px, 3.5vw, 44px)', lineHeight: 1.1 }}
        >
          {title}
        </h3>
        <p className="mb-6 font-body text-ink-secondary" style={{ fontSize: 17, lineHeight: 1.6 }}>
          {lead}
        </p>
        <ul className="mb-7 grid list-none gap-3 p-0">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3 font-body text-[15px] text-ink-secondary">
              <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-teal-lighter text-teal">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-6 border-t border-border pt-5 font-mono text-[10px] font-500 tracking-[0.12em] uppercase text-ink-muted sm:text-[11px]">
          {meta.map((m, i) => (
            <span key={i}>
              <b className="font-500 text-teal">{m.k}</b>
              {m.v && <> · {m.v}</>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SignupMock({ waitlistLabel }: { waitlistLabel: string }) {
  return (
    <div className="cf-mock p-6 sm:p-7">
      <div className="mb-6 font-display text-[22px]">
        renty<span className="text-teal">.</span>
      </div>
      <h4 className="m-0 mb-1.5 font-heading text-[22px] font-600 text-ink [letter-spacing:-0.01em]">
        Crea tu cuenta
      </h4>
      <p className="m-0 mb-6 font-body text-[13px] text-ink-muted">
        Ya somos {waitlistLabel} personas construyendo otra forma de arrendar.
      </p>
      <div className="mb-3.5">
        <label className="mb-1.5 block font-mono text-[10px] font-500 tracking-[0.12em] uppercase text-ink-muted">
          Correo
        </label>
        <div className="flex h-12 items-center rounded-[10px] border border-border bg-sand px-4 font-body text-[14px]">
          maria.castillo@gmail.com
        </div>
      </div>
      <div className="mb-5">
        <label className="mb-1.5 block font-mono text-[10px] font-500 tracking-[0.12em] uppercase text-ink-muted">
          Cédula
        </label>
        <div
          className="flex h-12 items-center rounded-[10px] border border-teal bg-white px-4 font-body text-[14px]"
          style={{ boxShadow: '0 0 0 4px rgba(13,107,88,.12)' }}
        >
          52.984.<span className="renty-caret" />
        </div>
      </div>
      <button
        type="button"
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-teal font-heading text-[13px] font-600 text-white"
      >
        Continuar
        <ArrowR className="h-4 w-4" />
      </button>
      <div className="relative my-5 text-center font-mono text-[10px] font-500 tracking-[0.12em] uppercase text-ink-muted before:absolute before:left-0 before:top-1/2 before:h-px before:w-[38%] before:bg-border after:absolute after:right-0 after:top-1/2 after:h-px after:w-[38%] after:bg-border">
        o
      </div>
      <div className="flex h-12 items-center justify-center gap-2.5 rounded-[10px] border border-border-strong font-heading text-[13px] font-500">
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continuar con Google
      </div>
    </div>
  );
}

function QuizMock() {
  const opts = ['Menos de un año', 'Entre 1 y 3 años', 'Entre 3 y 5 años', 'Más de 5 años'];
  return (
    <div className="cf-mock flex flex-col p-6 sm:p-7">
      <div className="mb-4 flex items-center justify-between font-mono text-[10px] font-500 tracking-[0.12em] uppercase text-ink-muted">
        <span>Renty Score</span>
        <span>
          <b className="font-500 text-ink">5</b>/12
        </span>
      </div>
      <div className="mb-6 h-1 overflow-hidden rounded-full bg-sand-dark">
        <span className="renty-prog-fill block h-full rounded-full bg-teal" />
      </div>
      <div className="mb-2.5 font-mono text-[11px] font-500 tracking-[0.14em] uppercase text-coral">
        Pregunta 5
      </div>
      <h4 className="m-0 mb-5 font-display text-[22px] font-400 leading-tight text-ink [letter-spacing:-0.01em]">
        ¿Hace cuánto estás arrendando tu vivienda actual?
      </h4>
      <div className="grid gap-2.5">
        {opts.map((o, i) => {
          const selected = i === 2;
          return (
            <div
              key={o}
              className={`flex items-center gap-3.5 rounded-xl border px-4 py-3.5 font-body text-[14px] transition-colors ${
                selected
                  ? 'border-teal bg-teal-lighter text-teal-dark'
                  : 'border-border bg-sand'
              }`}
            >
              <span className={`cf-radio ${selected ? 'on' : ''}`} />
              {o}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex gap-2.5 border-t border-border pt-5">
        <button type="button" className="inline-flex h-10 flex-1 items-center justify-center rounded-[10px] border border-border-strong bg-white font-heading text-[13px] font-500 text-ink">
          Atrás
        </button>
        <button type="button" className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] bg-teal font-heading text-[13px] font-600 text-white">
          Siguiente
          <ArrowR className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function ScoreMock() {
  const R = 108;
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC * (1 - 0.785);
  return (
    <div className="cf-mock dark flex flex-col items-center p-6 text-center sm:p-8">
      <div className="mb-1 font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-white/55">
        Resultado listo
      </div>
      <div className="mb-5 font-display text-[18px] text-white sm:text-[20px]">
        Hola <em className="italic text-coral">María</em>, este es tu puntaje.
      </div>
      <div className="relative">
        <svg viewBox="0 0 260 260" className="h-[200px] w-[200px] sm:h-[240px] sm:w-[240px]" aria-hidden="true">
          <circle cx="130" cy="130" r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={16} />
          <circle
            cx="130"
            cy="130"
            r={R}
            fill="none"
            stroke="#10B981"
            strokeWidth={16}
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 130 130)"
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center font-mono font-500 text-white [letter-spacing:-0.02em]"
          style={{ fontSize: 56, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}
        >
          785
          <small className="ml-1 font-400 text-white/45" style={{ fontSize: 18 }}>/1000</small>
        </div>
      </div>
      <span className="my-5 inline-flex items-center gap-2 rounded-full border border-teal-light/30 bg-teal/15 px-3.5 py-1.5 font-heading text-[12px] font-600 text-teal-light">
        <Check className="h-3 w-3" />
        Excelente · pre-aprobada en el 78% de los arriendos
      </span>
      <div className="grid w-full gap-2 text-left">
        {[
          { lbl: 'Historial de pago', v: '92%' },
          { lbl: 'Estabilidad laboral', v: '78%' },
          { lbl: 'Capacidad de pago', v: '74%' },
          { lbl: 'Comportamiento', v: '81%' },
        ].map((r) => (
          <div
            key={r.lbl}
            className="grid grid-cols-[1fr_auto] items-center gap-3.5 rounded-lg bg-white/[0.04] px-3.5 py-2.5 font-body text-[13px]"
          >
            <span className="text-white">{r.lbl}</span>
            <span className="font-mono font-500 text-teal-light">{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketMock() {
  const items = [
    { h: 'Chapinero Alto', m: '2 hab · 62 m²', p: '$2.450.000', grad: 'linear-gradient(135deg, #d2c4ad, #8b7a62)' },
    { h: 'Quinta Camacho', m: '1 hab · 48 m²', p: '$1.850.000', grad: 'linear-gradient(135deg, #b8ccc2, #5f8a77)' },
    { h: 'Teusaquillo', m: '2 hab · 70 m²', p: '$2.100.000', grad: 'linear-gradient(135deg, #e0cac0, #a67e6b)' },
    { h: 'La Soledad', m: '3 hab · 85 m²', p: '$2.800.000', grad: 'linear-gradient(135deg, #c4bfb0, #736a55)' },
  ];
  return (
    <div className="cf-mock p-5 sm:p-[22px]">
      <div className="mb-4 flex gap-1.5 font-mono text-[10px] font-500 tracking-[0.12em] uppercase">
        <span className="rounded-full bg-ink px-3 py-1.5 text-white">Arriendos</span>
        <span className="rounded-full bg-sand px-3 py-1.5 text-ink-muted">Favoritos</span>
        <span className="rounded-full bg-sand px-3 py-1.5 text-ink-muted">Aplicaciones</span>
      </div>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {[
          { t: 'Bogotá', on: true },
          { t: '< $3M', on: false },
          { t: '2+ hab', on: true },
          { t: 'Amoblado', on: false },
          { t: 'Pre-aprobada', on: true },
        ].map((c) => (
          <span
            key={c.t}
            className={`rounded-full px-3 py-1.5 font-mono text-[10px] font-500 tracking-[0.1em] uppercase ${
              c.on ? 'bg-teal text-white' : 'bg-sand text-ink-muted'
            }`}
          >
            {c.t}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {items.map((it, i) => (
          <div key={i} className="overflow-hidden rounded-[14px] bg-sand">
            <div className="relative" style={{ aspectRatio: '4/3', background: it.grad }}>
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-teal px-2 py-0.5 font-mono text-[9px] font-500 tracking-[0.1em] text-white">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
                Pre-aprobada
              </span>
              {i === 1 && (
                <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-coral">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden="true">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </span>
              )}
            </div>
            <div className="px-3 pb-3 pt-2.5">
              <h5 className="m-0 mb-0.5 font-heading text-[12px] font-600 text-ink">{it.h}</h5>
              <div className="font-mono text-[10px] font-500 tracking-[0.08em] uppercase text-ink-muted">
                {it.m}
              </div>
              <div className="mt-1.5 font-heading text-[13px] font-600 text-ink">
                {it.p}
                <small className="ml-1 font-400 text-ink-muted"> /mes</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
