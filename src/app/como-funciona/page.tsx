import type { Metadata } from 'next';
import { buildMetadata, buildWebPageSchema, buildBreadcrumbSchema } from '@/lib/seo';
import JsonLd from '@/components/layout/JsonLd';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WaitlistForm from '@/components/sections/WaitlistForm';
import Animations from './Animations';

const faqItems = [
  {
    q: '¿Cuánto tiempo toma crear mi perfil?',
    a: 'Menos de 3 minutos. Respondes 12 preguntas sobre tu experiencia como inquilino y recibes tu score al instante. No pedimos documentos escaneados ni certificaciones.',
  },
  {
    q: '¿Qué pasa si nunca he arrendado antes?',
    a: 'Puedes calcular tu score igualmente. Las preguntas cubren varios aspectos de tu perfil financiero y de estabilidad. Empezarás con un puntaje base que refleja tu situación actual.',
  },
  {
    q: '¿Renty reemplaza a Datacrédito?',
    a: 'No lo reemplaza, lo complementa. Datacrédito mide deudas y créditos formales. Renty Score evalúa tu perfil como inquilino: historial de arriendo, estabilidad, capacidad de pago. Es información que el sistema tradicional no mide.',
  },
  {
    q: '¿Mis datos están seguros?',
    a: 'Absolutamente. Cumplimos con la Ley 1581 de Protección de Datos Personales de Colombia. Tus datos se cifran en tránsito y en reposo. Nunca compartimos tu información sin tu autorización explícita.',
  },
  {
    q: '¿Cuánto cuesta el servicio?',
    a: 'Crear tu perfil y calcular tu Renty Score es completamente gratis. Puedes calcularlo cuantas veces quieras sin costo.',
  },
  {
    q: '¿El Renty Score se basa solo en lo que yo respondo?',
    a: 'Sí, actualmente el Renty Score se calcula con base en tus respuestas. Estamos trabajando en integrar fuentes de datos adicionales para enriquecer tu perfil en el futuro.',
  },
  {
    q: '¿Los arrendadores confían en el Renty Score?',
    a: 'Estamos construyendo una red de arrendadores que valoran tener más información sobre sus candidatos. Un Renty Score alto complementa la evaluación tradicional.',
  },
  {
    q: '¿En qué ciudades está disponible Renty?',
    a: 'Lanzamos primero en Bogotá en 2026. Después expandiremos a otras ciudades principales de Colombia. Calcula tu Renty Score y te avisaremos cuando estemos en tu ciudad.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

const pageSeo = {
  title: 'Cómo funciona Renty — Tu Renty Score en 4 pasos simples',
  description:
    'Descubre cómo Renty crea tu perfil de arrendatario confiable en 4 pasos. Sin codeudor, sin documentos imposibles. Basado en tu historial de pagos reales.',
  path: '/como-funciona',
  ogSlug: 'como-funciona',
};

export const metadata: Metadata = buildMetadata(pageSeo);

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Cómo funciona', url: '/como-funciona' },
];

export default function ComoFuncionaPage() {
  return (
    <>
      <JsonLd data={buildWebPageSchema({ ...pageSeo, hasBreadcrumb: true })} id="ld-webpage" />
      <JsonLd data={buildBreadcrumbSchema(pageSeo.path, breadcrumbs)} id="ld-breadcrumb" />
      <JsonLd data={faqSchema} id="ld-faq" />
      <Navbar />
      <Animations />
      <main id="main-content" tabIndex={-1}>
        {/* ==================== HERO ==================== */}
        <section className="relative overflow-hidden px-6 pt-32 pb-20 lg:px-12 lg:pt-40 lg:pb-28">
          <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, var(--color-teal) 0%, transparent 70%)' }}></div>

          <div className="mx-auto max-w-3xl text-center">
            <span data-como-label className="mb-4 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-teal">
              Cómo funciona
            </span>
            <h1 data-como-title className="font-display text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.1] tracking-tight text-ink">
              Así funciona Renty.
            </h1>
            <p data-como-text className="mx-auto mt-5 max-w-xl font-body text-lg leading-relaxed text-ink-secondary">
              En 4 pasos pasas de ser invisible para el sistema a tener un perfil que habla por ti. Sin codeudor. Sin trámites eternos. Solo tu experiencia como inquilino.
            </p>
          </div>
        </section>

        {/* ==================== 4 STEPS DETAILED ==================== */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">

            {/* Step 1 */}
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <div data-como-step>
                <div className="mb-4 inline-flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal font-mono text-[14px] font-500 text-white">01</span>
                  <span className="font-mono text-[12px] font-500 tracking-[0.1em] uppercase text-teal">Paso uno</span>
                </div>
                <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight text-ink">
                  Crea tu perfil en 2 minutos
                </h2>
                <p className="mt-4 max-w-lg font-body text-[16px] leading-relaxed text-ink-secondary">
                  Olvídate de formularios eternos y fotocopias. Registrarte en Renty toma menos de 3 minutos.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="mt-1 h-5 w-5 shrink-0 text-teal" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    <span className="font-body text-[15px] text-ink-secondary">Responde <strong className="font-600 text-ink">12 preguntas</strong> sobre tu experiencia de arriendo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="mt-1 h-5 w-5 shrink-0 text-teal" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    <span className="font-body text-[15px] text-ink-secondary">Información básica: nombre, celular, dónde has vivido</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="mt-1 h-5 w-5 shrink-0 text-teal" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    <span className="font-body text-[15px] text-ink-secondary"><strong className="font-600 text-ink">Sin documentos</strong> — no pedimos cédula escaneada, ni certificados, ni extractos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="mt-1 h-5 w-5 shrink-0 text-teal" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    <span className="font-body text-[15px] text-ink-secondary">22 millones de colombianos ya usan billeteras digitales — tú eres uno de ellos</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div data-como-mockup className="relative w-full max-w-[340px] rounded-2xl border border-border bg-surface p-8 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-lighter">
                      <svg className="h-5 w-5 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7" /></svg>
                    </div>
                    <div>
                      <span className="block font-heading text-[14px] font-600 text-ink">Tu perfil Renty</span>
                      <span className="block font-body text-[12px] text-ink-muted">Registro rápido</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-10 rounded-lg border border-border bg-sand px-3 flex items-center">
                      <span className="font-body text-[13px] text-ink-secondary">Carolina Méndez</span>
                    </div>
                    <div className="h-10 rounded-lg border border-border bg-sand px-3 flex items-center">
                      <span className="font-body text-[13px] text-ink-secondary">+57 310 *** ****</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-teal/30 bg-teal-lighter px-3 py-2.5">
                      <svg className="h-4 w-4 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <span className="font-body text-[13px] font-500 text-teal-dark">Correo confirmado</span>
                    </div>
                  </div>
                  <div className="mt-5 h-10 rounded-lg bg-teal flex items-center justify-center">
                    <span className="font-heading text-[13px] font-600 text-white">Crear perfil</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-16 flex justify-center lg:my-20">
              <div data-como-divider className="h-16 w-px bg-border"></div>
            </div>

            {/* Step 2 */}
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
                <div data-como-mockup className="relative w-full max-w-[380px] rounded-2xl border border-border bg-surface p-8 shadow-sm">
                  <span className="mb-4 block font-heading text-[14px] font-600 text-ink">Cuestionario Renty Score</span>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-lighter">
                        <svg className="h-4 w-4 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div className="flex-1">
                        <span className="block font-body text-[13px] font-500 text-ink">Historial de arriendo</span>
                        <span className="block font-body text-[11px] text-ink-muted">3 preguntas completadas</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-lighter">
                        <svg className="h-4 w-4 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div className="flex-1">
                        <span className="block font-body text-[13px] font-500 text-ink">Capacidad de pago</span>
                        <span className="block font-body text-[11px] text-ink-muted">3 preguntas completadas</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-lighter">
                        <svg className="h-4 w-4 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div className="flex-1">
                        <span className="block font-body text-[13px] font-500 text-ink">Estabilidad</span>
                        <span className="block font-body text-[11px] text-ink-muted">3 preguntas completadas</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sand-dark">
                        <div className="h-3 w-3 rounded-full border-2 border-ink-muted border-t-transparent animate-spin"></div>
                      </div>
                      <div className="flex-1">
                        <span className="block font-body text-[13px] font-500 text-ink">Señales financieras</span>
                        <span className="block font-body text-[11px] text-ink-muted">En progreso...</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand-dark">
                      <div className="h-full w-3/4 rounded-full bg-teal"></div>
                    </div>
                    <span className="font-mono text-[11px] text-ink-muted">9/12</span>
                  </div>
                </div>
              </div>
              <div data-como-step className="order-1 lg:order-2">
                <div className="mb-4 inline-flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full font-mono text-[14px] font-500 text-white" style={{ backgroundColor: '#10B981' }}>02</span>
                  <span className="font-mono text-[12px] font-500 tracking-[0.1em] uppercase" style={{ color: '#10B981' }}>Paso dos</span>
                </div>
                <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight text-ink">
                  Responde 12 preguntas
                </h2>
                <p className="mt-4 max-w-lg font-body text-[16px] leading-relaxed text-ink-secondary">
                  Mientras el sistema tradicional solo mira tu Datacrédito, nosotros evaluamos lo que realmente importa: tu experiencia como inquilino, tu capacidad de pago y tu estabilidad.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="mt-1 h-5 w-5 shrink-0" style={{ color: '#10B981' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    <span className="font-body text-[15px] text-ink-secondary"><strong className="font-600 text-ink">Tu historial de arriendo</strong> — cuánto tiempo llevas, cómo ha sido tu experiencia de pago</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="mt-1 h-5 w-5 shrink-0" style={{ color: '#10B981' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    <span className="font-body text-[15px] text-ink-secondary"><strong className="font-600 text-ink">Tu capacidad de pago</strong> — tu relación ingreso-arriendo y estabilidad financiera</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="mt-1 h-5 w-5 shrink-0" style={{ color: '#10B981' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    <span className="font-body text-[15px] text-ink-secondary"><strong className="font-600 text-ink">Tu comportamiento</strong> — estabilidad en arriendos, responsabilidad con servicios y presencia financiera digital</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Divider */}
            <div className="my-16 flex justify-center lg:my-20">
              <div data-como-divider className="h-16 w-px bg-border"></div>
            </div>

            {/* Step 3 */}
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <div data-como-step>
                <div className="mb-4 inline-flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-coral font-mono text-[14px] font-500 text-white">03</span>
                  <span className="font-mono text-[12px] font-500 tracking-[0.1em] uppercase text-coral">Paso tres</span>
                </div>
                <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight text-ink">
                  Recibe tu Renty Score
                </h2>
                <p className="mt-4 max-w-lg font-body text-[16px] leading-relaxed text-ink-secondary">
                  Tu puntaje va de <strong className="font-600 text-ink">0 a 1000</strong> y está basado en 4 factores que evalúan tu perfil como inquilino. No tu patrimonio, no tus deudas bancarias — tu comportamiento.
                </p>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-surface px-4 py-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#0D6B58' }}></span>
                      <span className="font-heading text-[13px] font-600 text-ink">Historial de pagos</span>
                    </div>
                    <span className="font-body text-[12px] leading-snug text-ink-muted">Pagaste a tiempo tu arriendo anterior</span>
                  </div>
                  <div className="rounded-xl border border-border bg-surface px-4 py-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#10B981' }}></span>
                      <span className="font-heading text-[13px] font-600 text-ink">Continuidad</span>
                    </div>
                    <span className="font-body text-[12px] leading-snug text-ink-muted">Cuánto tiempo llevas arrendando sin interrupciones</span>
                  </div>
                  <div className="rounded-xl border border-border bg-surface px-4 py-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#E8634A' }}></span>
                      <span className="font-heading text-[13px] font-600 text-ink">Estabilidad</span>
                    </div>
                    <span className="font-body text-[12px] leading-snug text-ink-muted">Tu continuidad y comportamiento como inquilino</span>
                  </div>
                  <div className="rounded-xl border border-border bg-surface px-4 py-3 sm:col-span-2">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#F59E0B' }}></span>
                      <span className="font-heading text-[13px] font-600 text-ink">Señales financieras</span>
                    </div>
                    <span className="font-body text-[12px] leading-snug text-ink-muted">Tu responsabilidad con servicios públicos y presencia en plataformas financieras digitales</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div data-como-mockup className="relative w-full max-w-[300px]">
                  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                    <circle cx="150" cy="150" r="120" stroke="#E7E5E4" strokeWidth="12" fill="none" />
                    <circle cx="150" cy="150" r="120" stroke="#0D6B58" strokeWidth="12" fill="none" strokeLinecap="round" transform="rotate(-90 150 150)" strokeDasharray="754" strokeDashoffset="188" />
                    <text x="150" y="140" textAnchor="middle" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="48" fontWeight="500" fill="#1C1917">785</text>
                    <text x="150" y="168" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="11" fill="#A8A29E" letterSpacing="0.14em">RENTY SCORE</text>
                    <text x="150" y="195" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="13" fill="#0D6B58">Excelente</text>
                  </svg>
                  <div className="mt-4 flex justify-between px-4 font-mono text-[11px] text-ink-muted">
                    <span>0</span>
                    <span>400</span>
                    <span>750</span>
                    <span>1000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-16 flex justify-center lg:my-20">
              <div data-como-divider className="h-16 w-px bg-border"></div>
            </div>

            {/* Step 4 */}
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
                <div data-como-mockup className="relative w-full max-w-[380px] space-y-4">
                  <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-lighter">
                        <svg className="h-5 w-5 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 12L12 4l9 8" /><path d="M5 10v10a1 1 0 001 1h12a1 1 0 001-1V10" /></svg>
                      </div>
                      <div>
                        <span className="block font-heading text-[14px] font-600 text-ink">Apto en Chapinero</span>
                        <span className="block font-body text-[12px] text-ink-muted">2 hab · $1.800.000/mes</span>
                        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-teal-lighter px-2.5 py-1">
                          <svg className="h-3 w-3 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          <span className="font-heading text-[11px] font-600 text-teal-dark">Sin codeudor</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-teal/20 bg-teal-lighter/40 p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal/10">
                        <svg className="h-5 w-5 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
                      </div>
                      <div>
                        <span className="block font-heading text-[14px] font-600 text-ink">Perfil compartido</span>
                        <span className="block mt-1 font-body text-[12px] text-ink-secondary">El arrendador puede ver tu Renty Score y tu perfil como inquilino antes de reunirse contigo.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div data-como-step className="order-1 lg:order-2">
                <div className="mb-4 inline-flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal font-mono text-[14px] font-500 text-white">04</span>
                  <span className="font-mono text-[12px] font-500 tracking-[0.1em] uppercase text-teal">Paso cuatro</span>
                </div>
                <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight text-ink">
                  Arrienda sin barreras
                </h2>
                <p className="mt-4 max-w-lg font-body text-[16px] leading-relaxed text-ink-secondary">
                  Con tu Renty Score, arriendas presentando tu perfil como inquilino en vez de trámites imposibles. Los arrendadores obtienen más información para tomar su decisión.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="mt-1 h-5 w-5 shrink-0 text-teal" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    <span className="font-body text-[15px] text-ink-secondary"><strong className="font-600 text-ink">Tu historial habla por ti</strong> — tu comportamiento como inquilino es tu mejor carta</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="mt-1 h-5 w-5 shrink-0 text-teal" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    <span className="font-body text-[15px] text-ink-secondary"><strong className="font-600 text-ink">Sin depósitos excesivos</strong> — un score alto reduce el riesgo percibido</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="mt-1 h-5 w-5 shrink-0 text-teal" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    <span className="font-body text-[15px] text-ink-secondary"><strong className="font-600 text-ink">Sin semanas de espera</strong> — presenta tu perfil al instante desde tu celular</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* ==================== SCORING FACTORS DEEP DIVE ==================== */}
        <section className="bg-sand-dark py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div data-como-factors-header className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
              <span className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-coral">
                Transparencia total
              </span>
              <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-ink">
                ¿Qué datos usamos?
              </h2>
              <p className="mt-4 font-body text-lg leading-relaxed text-ink-secondary">
                Tu Renty Score se calcula con base en 4 dimensiones que evalúan tu perfil como inquilino. Todo transparente, todo basado en tus respuestas.
              </p>
            </div>

            <div data-como-factors-grid className="grid gap-5 sm:grid-cols-2">
              {/* Factor 1 */}
              <div data-como-factor className="rounded-2xl border border-border bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(13, 107, 88, 0.1)' }}>
                  <svg className="h-5 w-5 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18" /><path d="M7 15h4" /></svg>
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-heading text-[16px] font-700 text-ink">Historial de arriendo</h3>
                  <span className="font-mono text-[14px] font-500 text-teal">35%</span>
                </div>
                <p className="font-body text-[14px] leading-relaxed text-ink-muted">
                  Tu experiencia arrendando: cuánto tiempo llevas, cómo ha sido tu comportamiento de pago y tu historial como inquilino.
                </p>
              </div>

              {/* Factor 2 */}
              <div data-como-factor className="rounded-2xl border border-border bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                  <svg className="h-5 w-5" style={{ color: '#10B981' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="9" /></svg>
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-heading text-[16px] font-700 text-ink">Capacidad de pago</h3>
                  <span className="font-mono text-[14px] font-500" style={{ color: '#10B981' }}>30%</span>
                </div>
                <p className="font-body text-[14px] leading-relaxed text-ink-muted">
                  Tu relación ingreso-arriendo y tu capacidad real de cumplir con el canon mensual sin comprometer tus finanzas.
                </p>
              </div>

              {/* Factor 3 */}
              <div data-como-factor className="rounded-2xl border border-border bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(232, 99, 74, 0.1)' }}>
                  <svg className="h-5 w-5 text-coral" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-heading text-[16px] font-700 text-ink">Estabilidad y comportamiento</h3>
                  <span className="font-mono text-[14px] font-500 text-coral">20%</span>
                </div>
                <p className="font-body text-[14px] leading-relaxed text-ink-muted">
                  Tu continuidad en arriendos anteriores, cómo manejas conflictos y tu comportamiento general como inquilino y vecino.
                </p>
              </div>

              {/* Factor 4 */}
              <div data-como-factor className="rounded-2xl border border-border bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                  <svg className="h-5 w-5" style={{ color: '#F59E0B' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-heading text-[16px] font-700 text-ink">Señales financieras</h3>
                  <span className="font-mono text-[14px] font-500" style={{ color: '#F59E0B' }}>15%</span>
                </div>
                <p className="font-body text-[14px] leading-relaxed text-ink-muted">
                  Tu responsabilidad con servicios públicos, presencia en plataformas financieras digitales y hábitos de pago recurrentes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== FAQ ==================== */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-6 lg:px-12">
            <div data-como-faq-header className="mb-12 text-center lg:mb-16">
              <span className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-teal">
                Preguntas frecuentes
              </span>
              <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-ink">
                Lo que siempre nos preguntan
              </h2>
            </div>

            <div data-como-faq-list className="divide-y divide-border">
              {faqItems.map((item) => (
                <details key={item.q} className="group py-5" data-faq-item>
                  <summary className="flex cursor-pointer items-center justify-between gap-4 list-none font-heading text-[16px] font-600 text-ink transition-colors duration-200 hover:text-teal [&::-webkit-details-marker]:hidden">
                    <span>{item.q}</span>
                    <svg className="h-5 w-5 shrink-0 text-ink-muted transition-transform duration-200 group-open:rotate-45" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
                  </summary>
                  <p className="mt-3 max-w-2xl font-body text-[15px] leading-relaxed text-ink-secondary">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== CTA / WAITLIST ==================== */}
        <WaitlistForm
          dark
          sectionId="waitlist"
          title="Tu historial merece ser visto."
          subtitle="Sé de los primeros en recibir tu Renty Score. Sin costo. Sin compromiso. Solo tu historial real hablando por ti."
          submitLabel="Calcular mi score"
        />
      </main>

      <Footer />
    </>
  );
}
