import type { Answers, ConsistencyResult, Inconsistency } from './types';

const CONSISTENCY_POOL = 50;

interface ConsistencyRule {
  rule: string;
  severity: 'alta' | 'media' | 'baja';
  deduction: number;
  explanation: string;
  test: (a: Answers) => boolean;
}

/** Safe accessor — returns '' for missing answers so .includes() is type-safe */
function v(answers: Answers, key: string): string {
  return answers[key] ?? '';
}

const RULES: ConsistencyRule[] = [
  {
    rule: 'pago_vs_deuda',
    severity: 'alta',
    deduction: 40,
    explanation: 'Indica nunca haber pagado tarde pero reporta deuda activa de arriendo',
    test: (a) => v(a, 'a2') === 'none' && v(a, 'd2') === 'rent_debt',
  },
  {
    rule: 'pago_vs_desalojo',
    severity: 'alta',
    deduction: 40,
    explanation: 'Indica nunca haber pagado tarde pero fue desalojado por incumplimiento',
    test: (a) => v(a, 'a2') === 'none' && v(a, 'c2') === 'eviction',
  },
  {
    rule: 'primer_arriendo_vs_mudanzas',
    severity: 'media',
    deduction: 25,
    explanation: 'Indica ser primer arrendatario pero reporta múltiples mudanzas',
    test: (a) => v(a, 'a1') === 'first' && ['2', '3', '4plus'].includes(v(a, 'c1')),
  },
  {
    rule: 'experiencia_vs_respuestas',
    severity: 'media',
    deduction: 25,
    explanation: 'Respuestas contradictorias sobre si es su primer arriendo',
    test: (a) => v(a, 'a1') !== 'first' && (v(a, 'a2') === 'na' || v(a, 'c2') === 'first'),
  },
  {
    rule: 'sin_ingreso_vs_ratio',
    severity: 'media',
    deduction: 25,
    explanation: 'Indica no tener ingreso fijo pero la relación arriendo/ingreso es baja',
    test: (a) => v(a, 'b2') === 'none' && ['lt20', '20to30'].includes(v(a, 'b1')),
  },
  {
    rule: 'sin_ingreso_vs_empleo',
    severity: 'alta',
    deduction: 35,
    explanation: 'Indica no tener ingreso fijo pero declara empleo formal o independiente estable',
    test: (a) =>
      v(a, 'b2') === 'none' &&
      ['formal_2plus', 'indie_2plus', 'mixed', 'formal_lt2'].includes(v(a, 'b3')),
  },
  {
    rule: 'sin_mudanzas_vs_motivo',
    severity: 'baja',
    deduction: 15,
    explanation: 'Indica nunca haberse mudado pero seleccionó un motivo de mudanza específico',
    test: (a) => v(a, 'c1') === '0' && !['upgrade', 'first'].includes(v(a, 'c2')),
  },
  {
    rule: 'sin_banco_vs_empleo_formal',
    severity: 'baja',
    deduction: 15,
    explanation:
      'Indica no tener cuenta bancaria ni billetera digital pero reporta ingreso formal de múltiples fuentes',
    test: (a) =>
      v(a, 'c3') === 'none' &&
      ['formal_2plus', 'formal_lt2', 'mixed'].includes(v(a, 'b3')) &&
      ['3plus', '2'].includes(v(a, 'b2')),
  },
];

/**
 * Calculate consistency score by detecting contradictions in answers.
 * Starts at CONSISTENCY_POOL (50) and deducts for each inconsistency found.
 * Floor at 0.
 */
export function calculateConsistency(answers: Answers): ConsistencyResult {
  const inconsistencies: Inconsistency[] = [];

  for (const rule of RULES) {
    if (rule.test(answers)) {
      inconsistencies.push({
        rule: rule.rule,
        severity: rule.severity,
        deduction: rule.deduction,
        explanation: rule.explanation,
      });
    }
  }

  const totalDeductions = inconsistencies.reduce((sum, i) => sum + i.deduction, 0);
  const score = Math.max(0, CONSISTENCY_POOL - totalDeductions);

  return { score, inconsistencies };
}

export { CONSISTENCY_POOL };
