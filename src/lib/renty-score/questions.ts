import type { ScoreModule, Answers } from './types';

export const MODULES: ScoreModule[] = [
  {
    id: 'A',
    title: 'Tu historial de arriendo',
    subtitle: 'Queremos conocer tu experiencia como inquilino',
    icon: 'home',
    maxPoints: 350,
    questions: [
      {
        id: 'a1',
        text: '¿Cuántos años en total lleva viviendo en arriendo?',
        hint: 'Suma todos los lugares donde ha arrendado, no solo el actual',
        options: [
          { value: 'first', label: 'Es mi primer arriendo', points: 0 },
          { value: 'lt1', label: 'Menos de 1 año', points: 30 },
          { value: '1to3', label: '1 a 3 años', points: 70 },
          { value: '3to6', label: '3 a 6 años', points: 110 },
          { value: '6to10', label: '6 a 10 años', points: 140 },
          { value: 'gt10', label: 'Más de 10 años', points: 160 },
        ],
      },
      {
        id: 'a2',
        text: 'En los últimos 2 años, ¿cuántas veces llegó tarde al pago del arriendo?',
        hint: 'Tarde = más de 5 días después de la fecha acordada',
        options: [
          { value: 'none', label: 'Ninguna vez', points: 130 },
          { value: '1', label: '1 vez', points: 90 },
          { value: '2to3', label: '2 a 3 veces', points: 50 },
          { value: '4to6', label: '4 a 6 veces', points: 15 },
          { value: 'gt6', label: 'Más de 6 veces', points: 0 },
          { value: 'na', label: 'No aplica (primer arriendo)', points: 65 },
        ],
      },
      {
        id: 'a3',
        text: '¿Puede darnos el nombre y teléfono de su arrendador actual o del último lugar donde vivió?',
        hint: 'El contrato puede ser verbal, eso no importa',
        options: [
          { value: 'yes', label: 'Sí, acepta que lo llamemos', points: 60 },
          { value: 'has_but_no', label: 'Tiene el contacto pero prefiere no compartirlo', points: 25 },
          { value: 'no_contact', label: 'No tiene contacto de ningún arrendador', points: 0 },
          { value: 'first', label: 'Es mi primer arriendo', points: 0 },
        ],
      },
    ],
  },
  {
    id: 'B',
    title: 'Tu capacidad de pago',
    subtitle: 'Evaluamos tu estabilidad financiera de forma justa',
    icon: 'wallet',
    maxPoints: 300,
    questions: [
      {
        id: 'b1',
        text: '¿Qué porcentaje del ingreso total del hogar representaría el arriendo que busca?',
        hint: 'Lo calculamos automáticamente dividiendo el canon entre tu ingreso total. Menos del 30% es ideal',
        options: [
          { value: 'lt20', label: 'Menos del 20%', points: 120 },
          { value: '20to30', label: 'Entre 20% y 30%', points: 100 },
          { value: '30to40', label: 'Entre 30% y 40%', points: 70 },
          { value: '40to50', label: 'Entre 40% y 50%', points: 30 },
          { value: 'gt50', label: 'Más del 50%', points: 0, penalty: -150 },
        ],
      },
      {
        id: 'b2',
        text: '¿De cuántas personas proviene el ingreso con el que pagarían el arriendo?',
        hint: 'Incluye pareja, familiares o compañeros que contribuirán al pago mensual del arriendo',
        options: [
          { value: '3plus', label: '3 o más personas', points: 80 },
          { value: '2', label: '2 personas', points: 60 },
          { value: '1', label: '1 persona', points: 30 },
          { value: 'none', label: 'Sin ingreso fijo actualmente', points: 0 },
        ],
      },
      {
        id: 'b3',
        text: '¿Cuál es su principal fuente de ingreso y desde hace cuánto tiempo?',
        hint: 'Elige la que más se parece a tu situación real',
        options: [
          { value: 'formal_2plus', label: 'Empleado formal (contrato) hace más de 2 años', points: 100 },
          { value: 'indie_2plus', label: 'Independiente / cuenta propia hace más de 2 años', points: 90 },
          { value: 'mixed', label: 'Mixto (formal + independiente)', points: 75 },
          { value: 'formal_lt2', label: 'Empleado formal (contrato) hace menos de 2 años', points: 70 },
          { value: 'gig_1plus', label: 'Plataformas digitales (Rappi, Uber, etc.) hace más de 1 año', points: 60 },
          { value: 'indie_lt2', label: 'Independiente / cuenta propia hace menos de 2 años', points: 55 },
          { value: 'gig_lt1', label: 'Plataformas digitales hace menos de 1 año', points: 35 },
          { value: 'none', label: 'Sin fuente de ingreso estable', points: 0 },
        ],
      },
    ],
  },
  {
    id: 'C',
    title: 'Estabilidad y comportamiento',
    subtitle: 'Tu estilo de vida nos dice mucho sobre ti',
    icon: 'shield',
    maxPoints: 200,
    questions: [
      {
        id: 'c1',
        text: '¿Cuántas veces se ha mudado en los últimos 3 años?',
        hint: 'Cuenta cada cambio de dirección de residencia',
        options: [
          { value: '0', label: 'Ninguna (sigo en el mismo lugar)', points: 70 },
          { value: '1', label: '1 vez', points: 55 },
          { value: '2', label: '2 veces', points: 35 },
          { value: '3', label: '3 veces', points: 15 },
          { value: '4plus', label: '4 o más veces', points: 0 },
        ],
      },
      {
        id: 'c2',
        text: '¿Cuál fue el motivo principal de la última mudanza?',
        hint: 'Si nunca se ha mudado, elige "Buscar un lugar mejor"',
        options: [
          { value: 'upgrade', label: 'Buscar un lugar mejor / mejora de vida', points: 60 },
          { value: 'price', label: 'Subida del precio del arriendo (IPC — el aumento legal anual)', points: 55 },
          { value: 'job', label: 'Cambio de trabajo o estudio', points: 45 },
          { value: 'contract_end', label: 'El contrato terminó y el arrendador decidió no renovar', points: 40 },
          { value: 'conflict', label: 'Conflicto con el arrendador', points: 15 },
          { value: 'eviction', label: 'Desalojo por incumplimiento de pago', points: 0, penalty: -80 },
          { value: 'first', label: 'Es mi primer arriendo', points: 60 },
        ],
      },
      {
        id: 'c3',
        text: '¿Tiene cuenta bancaria, Nequi, Daviplata u otra billetera digital activa?',
        hint: 'Nequi, Daviplata, bancolombia a la mano, etc. Lo que importa es que la uses regularmente',
        options: [
          { value: 'active', label: 'Sí, con movimientos regulares', points: 70 },
          { value: 'inactive', label: 'Sí, pero la uso muy poco', points: 35 },
          { value: 'none', label: 'No tengo ninguna', points: 0 },
        ],
      },
    ],
  },
  {
    id: 'D',
    title: 'Señales digitales',
    subtitle: 'Tu presencia y actividad en el mundo digital',
    icon: 'signal',
    maxPoints: 150,
    questions: [
      {
        id: 'd1',
        text: '¿Cómo llegó a Renty?',
        options: [
          { value: 'ref_tenant', label: 'Me recomendó alguien que arrienda a través de Renty', points: 70 },
          { value: 'ref_landlord', label: 'Me recomendó un arrendador que usa Renty', points: 60 },
          { value: 'ref_friend', label: 'Me lo recomendó un amigo o familiar', points: 40 },
          { value: 'search', label: 'Busqué en internet o redes sociales', points: 20 },
          { value: 'ad', label: 'Vi publicidad de Renty', points: 15 },
        ],
      },
      {
        id: 'd2',
        text: '¿Tiene reporte activo en Datacrédito o Cifin actualmente?',
        hint: 'Datacrédito y Cifin son centrales de riesgo que registran tus deudas. Puedes consultarlo gratis en midatacredito.com',
        options: [
          { value: 'clean', label: 'No tengo reportes negativos activos', points: 30 },
          { value: 'resolved', label: 'Tuve reportes pero ya los pagué y regularicé', points: 22 },
          { value: 'unknown', label: 'No sé / nunca lo he consultado', points: 15 },
          { value: 'financial', label: 'Sí, tengo reporte activo por deuda financiera', points: 12 },
          { value: 'rent_debt', label: 'Sí, tengo reporte activo por deuda de arriendo', points: 0, penalty: -80 },
        ],
      },
      {
        id: 'd3',
        text: '¿Cuántas personas vivirían en el inmueble?',
        hint: 'Incluyendo al solicitante',
        options: [
          { value: '1', label: 'Solo yo', points: 50 },
          { value: '2', label: 'Yo y 1 persona más', points: 45 },
          { value: '3', label: 'Yo y 2 personas más', points: 35 },
          { value: '4plus', label: '4 o más personas en total', points: 20 },
        ],
      },
    ],
  },
];

/** Determine b1 option value from the rent/income ratio */
export function ratioToB1Value(ratio: number): string {
  if (ratio < 0.2) return 'lt20';
  if (ratio < 0.3) return '20to30';
  if (ratio < 0.4) return '30to40';
  if (ratio < 0.5) return '40to50';
  return 'gt50';
}

/** All question IDs in order */
export const ALL_QUESTION_IDS = MODULES.flatMap((m) => m.questions.map((q) => q.id));

/** Total number of questions */
export const TOTAL_QUESTIONS = ALL_QUESTION_IDS.length;

/** Return IDs of unanswered questions. */
export function getUnansweredQuestions(answers: Answers): string[] {
  return ALL_QUESTION_IDS.filter((id) => !answers[id]);
}

/** Find the module index (0-based) that contains a given question ID. */
export function getModuleIndexForQuestion(questionId: string): number {
  return MODULES.findIndex((m) => m.questions.some((q) => q.id === questionId));
}

/** Get the label text for a given answer value. */
export function getAnswerLabel(questionId: string, value: string): string | null {
  for (const mod of MODULES) {
    for (const q of mod.questions) {
      if (q.id === questionId) {
        return q.options.find((o) => o.value === value)?.label ?? null;
      }
    }
  }
  return null;
}

/** Get the question text for a given question ID. */
export function getQuestionText(questionId: string): string | null {
  for (const mod of MODULES) {
    for (const q of mod.questions) {
      if (q.id === questionId) return q.text;
    }
  }
  return null;
}
