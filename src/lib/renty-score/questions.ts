import type { ScoreModule, Answers } from './types';

export const MODULES: ScoreModule[] = [
  {
    id: 'A',
    title: 'Tu historial de arriendo',
    subtitle: 'Queremos conocer tu experiencia como inquilino',
    icon: 'home',
    maxPoints: 335,
    questions: [
      {
        id: 'a1',
        text: '¿Cuántos años en total lleva viviendo en arriendo?',
        hint: 'Suma todos los lugares donde ha arrendado, no solo el actual',
        options: [
          { value: 'first', label: 'Es mi primer arriendo', points: 0 },
          { value: 'lt1', label: 'Menos de 1 año', points: 29 },
          { value: '1to3', label: '1 a 3 años', points: 67 },
          { value: '3to6', label: '3 a 6 años', points: 105 },
          { value: '6to10', label: '6 a 10 años', points: 134 },
          { value: 'gt10', label: 'Más de 10 años', points: 153 },
        ],
      },
      {
        id: 'a2',
        text: 'En los últimos 2 años, ¿cuántas veces llegó tarde al pago del arriendo?',
        hint: 'Tarde = más de 5 días después de la fecha acordada',
        options: [
          { value: 'none', label: 'Ninguna vez', points: 125 },
          { value: '1', label: '1 vez', points: 87 },
          { value: '2to3', label: '2 a 3 veces', points: 48 },
          { value: '4to6', label: '4 a 6 veces', points: 14 },
          { value: 'gt6', label: 'Más de 6 veces', points: 0 },
          { value: 'na', label: 'No aplica (primer arriendo)', points: 63 },
        ],
      },
      {
        id: 'a3',
        text: '¿Puede darnos el nombre y teléfono de su arrendador actual o del último lugar donde vivió?',
        hint: 'El contrato puede ser verbal, eso no importa',
        options: [
          { value: 'yes', label: 'Sí, acepta que lo llamemos', points: 57 },
          { value: 'has_but_no', label: 'Tiene el contacto pero prefiere no compartirlo', points: 24 },
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
    maxPoints: 285,
    questions: [
      {
        id: 'b1',
        text: '¿Qué porcentaje del ingreso total del hogar representaría el arriendo que busca?',
        hint: 'Lo calculamos automáticamente dividiendo el canon entre tu ingreso total. Menos del 30% es ideal',
        options: [
          { value: 'lt20', label: 'Menos del 20%', points: 114 },
          { value: '20to30', label: 'Entre 20% y 30%', points: 95 },
          { value: '30to40', label: 'Entre 30% y 40%', points: 67 },
          { value: '40to50', label: 'Entre 40% y 50%', points: 29 },
          { value: 'gt50', label: 'Más del 50%', points: 0, penalty: -150 },
        ],
      },
      {
        id: 'b2',
        text: '¿De cuántas personas proviene el ingreso con el que pagarían el arriendo?',
        hint: 'Incluye pareja, familiares o compañeros que contribuirán al pago mensual del arriendo',
        options: [
          { value: '3plus', label: '3 o más personas', points: 76 },
          { value: '2', label: '2 personas', points: 57 },
          { value: '1', label: '1 persona', points: 29 },
          { value: 'none', label: 'Sin ingreso fijo actualmente', points: 0 },
        ],
      },
      {
        id: 'b3',
        text: '¿Cuál es su principal fuente de ingreso y desde hace cuánto tiempo?',
        hint: 'Elige la que más se parece a tu situación real',
        options: [
          { value: 'formal_2plus', label: 'Empleado formal (contrato) hace más de 2 años', points: 95 },
          { value: 'indie_2plus', label: 'Independiente / cuenta propia hace más de 2 años', points: 86 },
          { value: 'mixed', label: 'Mixto (formal + independiente)', points: 71 },
          { value: 'formal_lt2', label: 'Empleado formal (contrato) hace menos de 2 años', points: 67 },
          { value: 'gig_1plus', label: 'Plataformas digitales (Rappi, Uber, etc.) hace más de 1 año', points: 57 },
          { value: 'indie_lt2', label: 'Independiente / cuenta propia hace menos de 2 años', points: 52 },
          { value: 'gig_lt1', label: 'Plataformas digitales hace menos de 1 año', points: 33 },
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
    maxPoints: 190,
    questions: [
      {
        id: 'c1',
        text: '¿Cuántas veces se ha mudado en los últimos 3 años?',
        hint: 'Cuenta cada cambio de dirección de residencia',
        options: [
          { value: '0', label: 'Ninguna (sigo en el mismo lugar)', points: 66 },
          { value: '1', label: '1 vez', points: 52 },
          { value: '2', label: '2 veces', points: 33 },
          { value: '3', label: '3 veces', points: 14 },
          { value: '4plus', label: '4 o más veces', points: 0 },
        ],
      },
      {
        id: 'c2',
        text: '¿Cuál fue el motivo principal de la última mudanza?',
        hint: 'Si nunca se ha mudado, elige "Buscar un lugar mejor"',
        options: [
          { value: 'upgrade', label: 'Buscar un lugar mejor / mejora de vida', points: 57 },
          { value: 'price', label: 'Subida del precio del arriendo (IPC — el aumento legal anual)', points: 52 },
          { value: 'job', label: 'Cambio de trabajo o estudio', points: 43 },
          { value: 'contract_end', label: 'El contrato terminó y el arrendador decidió no renovar', points: 38 },
          { value: 'conflict', label: 'Conflicto con el arrendador', points: 14 },
          { value: 'eviction', label: 'Desalojo por incumplimiento de pago', points: 0, penalty: -80 },
          { value: 'first', label: 'Es mi primer arriendo', points: 57 },
        ],
      },
      {
        id: 'c3',
        text: '¿Tiene cuenta bancaria, Nequi, Daviplata u otra billetera digital activa?',
        hint: 'Nequi, Daviplata, bancolombia a la mano, etc. Lo que importa es que la uses regularmente',
        options: [
          { value: 'active', label: 'Sí, con movimientos regulares', points: 67 },
          { value: 'inactive', label: 'Sí, pero la uso muy poco', points: 34 },
          { value: 'none', label: 'No tengo ninguna', points: 0 },
        ],
      },
    ],
  },
  {
    id: 'D',
    title: 'Transparencia y verificabilidad',
    subtitle: 'Tu disposición a verificar tu información genera confianza',
    icon: 'shield-check',
    maxPoints: 140,
    questions: [
      {
        id: 'd1',
        text: '¿Está dispuesto(a) a verificar su identidad con un documento oficial (cédula)?',
        hint: 'La verificación de identidad aumenta la confianza de los arrendadores. Es voluntaria y sus datos están protegidos bajo la Ley 1581',
        options: [
          { value: 'yes_now', label: 'Sí, puedo verificar ahora mismo', points: 55 },
          { value: 'yes_later', label: 'Sí, pero prefiero hacerlo después', points: 37 },
          { value: 'maybe', label: 'Lo pensaré', points: 14 },
          { value: 'no', label: 'No, prefiero no verificar mi identidad', points: 0 },
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
        text: '¿Puede proporcionar un soporte de sus ingresos para verificación?',
        hint: 'Puede ser un certificado laboral, extracto bancario de los últimos 3 meses, declaración de renta, o comprobante de pago. Es voluntario',
        options: [
          { value: 'cert_lab', label: 'Sí, tengo certificado laboral vigente', points: 55 },
          { value: 'extractos', label: 'Sí, puedo mostrar extractos bancarios recientes', points: 50 },
          { value: 'renta', label: 'Sí, tengo declaración de renta del último año', points: 46 },
          { value: 'otro', label: 'Sí, tengo otro comprobante (recibos, contratos, etc.)', points: 32 },
          { value: 'no_now', label: 'No tengo soportes en este momento, pero puedo conseguirlos', points: 14 },
          { value: 'no', label: 'No puedo o prefiero no proporcionar soportes', points: 0 },
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

/** Get the label text for a given answer value, optionally for a specific algorithm version. */
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
