'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/cn';
import { ScoreGauge } from './ScoreGauge';
import type { RentyScoreRow } from '@/lib/db/renty-scores.repository';
import type { ScoreColor } from '@/lib/renty-score/types';
import Link from 'next/link';
import {
  Home,
  Wallet,
  ShieldCheck,
  Wifi,
  CircleCheckBig,
  Lightbulb,
  ChevronDown,
  Search,
  RotateCcw,
} from 'lucide-react';

interface Props {
  score: RentyScoreRow;
}

/* ── Strength levels (internal — no numbers exposed) ─────────────────── */

type StrengthLevel = 'excelente' | 'bueno' | 'moderado' | 'por_mejorar';

function getStrength(score: number, max: number): StrengthLevel {
  const pct = score / max;
  if (pct >= 0.75) return 'excelente';
  if (pct >= 0.55) return 'bueno';
  if (pct >= 0.35) return 'moderado';
  return 'por_mejorar';
}

const STRENGTH_DISPLAY: Record<
  StrengthLevel,
  { label: string; bars: number; barColor: string; tagClass: string }
> = {
  excelente: { label: 'Excelente', bars: 4, barColor: 'bg-teal', tagClass: 'bg-teal/10 text-teal-dark' },
  bueno: { label: 'Bueno', bars: 3, barColor: 'bg-teal/60', tagClass: 'bg-teal/10 text-teal-dark' },
  moderado: { label: 'Moderado', bars: 2, barColor: 'bg-warning', tagClass: 'bg-warning/10 text-warning' },
  por_mejorar: { label: 'Por mejorar', bars: 1, barColor: 'bg-coral', tagClass: 'bg-coral/10 text-coral' },
};

/* ── Profile areas ───────────────────────────────────────────────────── */

const PROFILE_AREAS: {
  scoreKey: keyof RentyScoreRow;
  max: number;
  title: string;
  icon: React.ReactNode;
  descriptions: Record<StrengthLevel, string>;
}[] = [
  {
    scoreKey: 'score_a',
    max: 350,
    title: 'Historial de arriendo',
    icon: <Home className="h-5 w-5" />,
    descriptions: {
      excelente: 'Tienes un historial sólido como inquilino',
      bueno: 'Tu experiencia como inquilino va por buen camino',
      moderado: 'Tu historial de arriendo está creciendo',
      por_mejorar: 'Estás empezando a construir tu historial',
    },
  },
  {
    scoreKey: 'score_b',
    max: 300,
    title: 'Capacidad de pago',
    icon: <Wallet className="h-5 w-5" />,
    descriptions: {
      excelente: 'Tu relación ingreso/arriendo es muy saludable',
      bueno: 'Tus finanzas están en un buen rango',
      moderado: 'Tu presupuesto de arriendo podría estar más holgado',
      por_mejorar: 'Vale la pena revisar tu presupuesto de arriendo',
    },
  },
  {
    scoreKey: 'score_c',
    max: 200,
    title: 'Estabilidad',
    icon: <ShieldCheck className="h-5 w-5" />,
    descriptions: {
      excelente: 'Proyectas mucha estabilidad y orden',
      bueno: 'Tienes buenas señales de estabilidad',
      moderado: 'Tu estabilidad está en construcción',
      por_mejorar: 'Hay oportunidades para mostrar más estabilidad',
    },
  },
  {
    scoreKey: 'score_d',
    max: 150,
    title: 'Perfil digital',
    icon: <Wifi className="h-5 w-5" />,
    descriptions: {
      excelente: 'Tu presencia digital te respalda',
      bueno: 'Tus señales digitales suman a tu perfil',
      moderado: 'Tu perfil digital puede fortalecerse',
      por_mejorar: 'Tu perfil digital tiene espacio para crecer',
    },
  },
];

/* ── Hero messages ───────────────────────────────────────────────────── */

const HERO_MESSAGES: Record<ScoreColor, { title: string; subtitle: string }> = {
  verde: {
    title: '¡Eres un inquilino destacado!',
    subtitle:
      'Tu perfil transmite confianza y estabilidad. Los arrendadores valoran perfiles como el tuyo.',
  },
  amarillo: {
    title: '¡Vas por muy buen camino!',
    subtitle:
      'Tu perfil muestra responsabilidad. Estás cerca de alcanzar el nivel más alto.',
  },
  naranja: {
    title: 'Tu perfil está creciendo',
    subtitle:
      'Ya diste el primer paso al conocer tu score. Con algunos ajustes puedes mejorar significativamente.',
  },
  rojo: {
    title: 'Aquí empieza tu camino',
    subtitle:
      'Conocer tu situación es el primer paso. Te damos consejos concretos para que tu perfil crezca rápido.',
  },
};

/* ── Score benefits ──────────────────────────────────────────────────── */

const SCORE_BENEFITS: Record<ScoreColor, string[]> = {
  verde: [
    'Aplica a inmuebles con total confianza',
    'Tu perfil se destaca frente a otros inquilinos',
    'Arrendadores priorizan perfiles como el tuyo',
  ],
  amarillo: [
    'Tu perfil ya inspira confianza',
    'Estás cerca de desbloquear los mejores beneficios',
    'Te diferencias de la mayoría de inquilinos',
  ],
  naranja: [
    'Ya tienes un score — eso te pone adelante',
    'Cada mejora se refleja rápido en tu perfil',
    'Demuestra compromiso con tu historial',
  ],
  rojo: [
    'Conocer tu score muestra iniciativa',
    'Los consejos de abajo te ayudan a mejorar',
    'Puedes recalcular cuando quieras',
  ],
};

/* ── Tips by color (qualitative — no point values) ───────────────────── */

const TIPS_BY_COLOR: Record<ScoreColor, { title: string; items: string[] }> = {
  rojo: {
    title: 'Acciones clave para mejorar',
    items: [
      'Si tienes reportes en Datacrédito, negocia directamente con el acreedor. Resolverlo es una de las acciones con mayor impacto.',
      'Busca un arriendo acorde a tus ingresos — idealmente que no supere el 30%. Una relación sana entre arriendo e ingreso mejora tu perfil significativamente.',
      'Abre una billetera digital (Nequi, Daviplata) — es gratis, se activa en minutos y fortalece tu perfil de estabilidad.',
      'Consigue una referencia positiva de un arrendador. Una buena referencia hace una gran diferencia.',
    ],
  },
  naranja: {
    title: 'Cómo escalar tu score',
    items: [
      'Reduce tu proporción arriendo/ingreso — entre más holgado sea tu presupuesto, mejor se ve tu perfil.',
      'Documenta bien tus ingresos — si eres independiente, ten a la mano extractos bancarios y declaración de renta.',
      'Ofrece una referencia de arrendador verificable — la confianza que genera es uno de los factores que más pesa.',
      'Consulta tu Datacrédito gratis en midatacredito.com — conocer tu estado te permite actuar.',
    ],
  },
  amarillo: {
    title: 'Lo que te falta para el siguiente nivel',
    items: [
      'La puntualidad de pago es clave — configura débito automático o recordatorios. La constancia marca la diferencia.',
      'Evita mudanzas innecesarias — la estabilidad en tu vivienda habla muy bien de ti como inquilino.',
      'Si puedes formalizar el aporte de ingreso de otra persona en el hogar, tu perfil financiero se fortalece.',
      'Tu experiencia como inquilino crece con el tiempo — cada año cuenta.',
    ],
  },
  verde: {
    title: 'Cómo mantener tu score',
    items: [
      'Sigue pagando puntualmente — un periodo de retrasos puede impactar tu perfil de forma importante.',
      'Mantente en el mismo lugar — fortalece tu historial y tu estabilidad simultáneamente.',
      'Conserva buena relación con tu arrendador — una referencia positiva es muy valiosa.',
      'Revisa tu Datacrédito cada 6 meses — un reporte inesperado puede afectar tu score.',
    ],
  },
};

/* ── Practical rental tips ───────────────────────────────────────────── */

const RENTAL_TIPS = [
  {
    title: 'Visita a diferentes horas',
    text: 'Conoce el ruido, la luz natural y el ambiente real del barrio de día y de noche.',
  },
  {
    title: 'Documenta el estado inicial',
    text: 'Toma fotos y video de todo antes de firmar. Te protege al devolver el inmueble.',
  },
  {
    title: 'Pregunta costos adicionales',
    text: 'Administración, parqueadero, servicios… suma todo antes de decidir.',
  },
  {
    title: 'Lee todo el contrato',
    text: 'Revisa cláusulas de terminación anticipada, penalidades y quién paga qué.',
  },
  {
    title: 'Registra servicios a tu nombre',
    text: 'Cambia la titularidad de agua, luz y gas para no heredar deudas anteriores.',
  },
  {
    title: 'Guarda copia de todo',
    text: 'Contrato firmado, recibos de pago y comunicaciones con el arrendador. Todo por escrito.',
  },
];

/* ── Educational sections ────────────────────────────────────────────── */

const EDUCATIONAL_SECTIONS = [
  {
    title: '¿Qué es el IPC y cómo afecta tu arriendo?',
    content:
      'El IPC (Índice de Precios al Consumidor) es el tope máximo legal que tu arrendador puede subir el canon anual. Solo puede aplicarse al cumplir 12 meses de contrato y con notificación escrita previa. Si tu arrendador quiere cobrar más del IPC, es ilegal — puedes denunciar ante la Secretaría de Hábitat.',
  },
  {
    title: 'Tus derechos como inquilino (Ley 820 de 2003)',
    content:
      'Tu contrato se renueva automáticamente si ambas partes cumplen. Si el arrendador quiere terminar el contrato, debe notificarte con al menos 3 meses de anticipación. La ley prohíbe depósitos como garantía del contrato de arriendo. El canon mensual no puede exceder el 1% del valor comercial del inmueble.',
  },
  {
    title: 'Datacrédito y Habeas Data — lo que debes saber',
    content:
      'Tienes derecho a consultar tu historial crediticio gratis (Ley 1266 de 2008) en midatacredito.com. Si pagaste una deuda reportada, el reporte dura el doble del tiempo de mora (máximo 4 años). Si nunca pagaste, dura 8 años. Si una entidad no actualiza tu información, reclama ante la SIC — tienen 15 días hábiles para responder.',
  },
  {
    title: 'La regla del 30% y los gastos ocultos',
    content:
      'Además del canon mensual, presupuesta: servicios públicos (~$200.000-$400.000 COP/mes en Bogotá según estrato), administración (desde $100.000 hasta $500.000+ COP/mes), y posible seguro de arrendamiento. Si el arriendo ya consume el 30%+ de tus ingresos, el presupuesto se vuelve apretado.',
  },
  {
    title: 'Consejos para primerizos',
    content:
      'Inspecciona el inmueble a fondo antes de firmar y toma fotos de todo. Lee TODO el contrato: quién paga administración, condiciones de terminación, cláusulas de penalidad. Pide copia firmada. Registra los servicios a tu nombre para no quedar amarrado a deudas anteriores.',
  },
];

/* ── Color styles ────────────────────────────────────────────────────── */

const COLOR_STYLES: Record<ScoreColor, { bar: string; bg: string; text: string; border: string }> = {
  verde: { bar: 'bg-teal', bg: 'bg-teal-lighter', text: 'text-teal-dark', border: 'border-teal/20' },
  amarillo: { bar: 'bg-warning', bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
  naranja: { bar: 'bg-coral', bg: 'bg-coral-light', text: 'text-coral', border: 'border-coral/20' },
  rojo: { bar: 'bg-error', bg: 'bg-error/10', text: 'text-error', border: 'border-error/20' },
};

const COLOR_LABELS: Record<ScoreColor, string> = {
  verde: 'Excelente',
  amarillo: 'Buen camino',
  naranja: 'En construcción',
  rojo: 'Necesita mejorar',
};

/* ── Component ───────────────────────────────────────────────────────── */

export function ScoreDetailView({ score }: Props) {
  // Clean up any stale pending score from localStorage (anonymous recovery flow)
  useEffect(() => {
    try { localStorage.removeItem('renty-score-pending'); } catch { /* ok */ }
  }, []);

  const color = score.resultado;
  const styles = COLOR_STYLES[color];
  const hero = HERO_MESSAGES[color];
  const benefits = SCORE_BENEFITS[color];
  const tips = TIPS_BY_COLOR[color];
  const formattedDate = new Date(score.created_at).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-[28px] text-ink sm:text-[32px]">Mi Renty Score</h1>
        <p className="mt-1 text-[15px] text-ink-secondary">Calculado el {formattedDate}</p>
      </div>

      {/* Hero Card — gauge + motivational message */}
      <div className="flex flex-col items-center rounded-2xl border border-border bg-white p-6 sm:p-8">
        <ScoreGauge score={score.score_total} color={color} label={COLOR_LABELS[color]} />
        <div className="mt-6 text-center">
          <h2 className="font-display text-[22px] text-ink sm:text-[24px]">{hero.title}</h2>
          <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-ink-secondary">
            {hero.subtitle}
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
        <h2 className="mb-4 font-heading text-[15px] font-600 uppercase tracking-wider text-ink-muted">
          Qué significa tu score
        </h2>
        <ul className="space-y-3">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-3 text-[14px] leading-relaxed text-ink-secondary">
              <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Profile Areas — qualitative strength indicators */}
      <div className="space-y-4">
        <h2 className="font-heading text-[15px] font-600 uppercase tracking-wider text-ink-muted">
          Tu perfil
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {PROFILE_AREAS.map((area) => {
            const moduleScore = score[area.scoreKey] as number;
            const level = getStrength(moduleScore, area.max);
            const display = STRENGTH_DISPLAY[level];

            return (
              <div key={area.scoreKey as string} className="rounded-2xl border border-border bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
                    {area.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-heading text-[14px] font-600 text-ink">{area.title}</div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              'h-1.5 w-4 rounded-full',
                              i <= display.bars ? display.barColor : 'bg-sand-dark',
                            )}
                          />
                        ))}
                      </div>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[11px] font-600',
                          display.tagClass,
                        )}
                      >
                        {display.label}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-snug text-ink-muted">
                      {area.descriptions[level]}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips by color */}
      <div className={cn('rounded-2xl border p-5 sm:p-6', styles.bg, styles.border)}>
        <h3 className={cn('mb-4 font-heading text-[17px] font-600', styles.text)}>{tips.title}</h3>
        <ul className="space-y-3">
          {tips.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-ink-secondary">
              <span
                className={cn(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-700 text-white',
                  styles.bar,
                )}
              >
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Practical Rental Tips */}
      <div className="space-y-4">
        <h2 className="font-heading text-[15px] font-600 uppercase tracking-wider text-ink-muted">
          Tips para tu próximo arriendo
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {RENTAL_TIPS.map((tip, i) => (
            <div key={i} className="flex gap-3 rounded-2xl border border-border bg-white p-4">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
              <div>
                <div className="font-heading text-[13px] font-600 text-ink">{tip.title}</div>
                <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">{tip.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Content */}
      <div className="space-y-4">
        <h2 className="font-heading text-[15px] font-600 uppercase tracking-wider text-ink-muted">
          Conoce tus derechos
        </h2>
        <div className="space-y-3">
          {EDUCATIONAL_SECTIONS.map((section) => (
            <details
              key={section.title}
              className="group rounded-2xl border border-border bg-white transition-shadow open:shadow-sm"
            >
              <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-heading text-[15px] font-500 text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                {section.title}
                <ChevronDown className="h-4 w-4 shrink-0 text-ink-muted transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-border px-5 py-4 text-[14px] leading-relaxed text-ink-secondary">
                {section.content}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/bogota/arriendos"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal px-6 py-3 text-[15px] font-600 text-white transition-colors hover:bg-teal-dark"
        >
          <Search className="h-4 w-4" />
          Explorar arriendos
        </Link>
        <Link
          href="/renty-score/formulario"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 py-3 text-[15px] font-600 text-ink transition-colors hover:bg-sand"
        >
          <RotateCcw className="h-4 w-4" />
          Recalcular mi score
        </Link>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-ink-muted">
        Tu información es confidencial y está protegida bajo la Ley 1581 de 2012.
      </p>
    </div>
  );
}
