import type { Answers, ScoreResult, ScoreColor, VerificationStatus } from './types';
import { MODULES } from './questions';
import { calculateConsistency } from './consistency';
import { calculateTrustFactor, EMPTY_VERIFICATIONS } from './trust-factor';

export const ALGORITHM_VERSION = '2.0';

function getColor(score: number): { color: ScoreColor; label: string; message: string } {
  if (score >= 750) {
    return {
      color: 'verde',
      label: 'Excelente',
      message: '¡Felicidades! Tu perfil es sólido. Procedes directamente a buscar tu próximo hogar con Renty.',
    };
  }
  if (score >= 600) {
    return {
      color: 'amarillo',
      label: 'Buen camino',
      message: 'Estás en buen camino. Verifica tu información para desbloquear todo el potencial de tu score.',
    };
  }
  if (score >= 400) {
    return {
      color: 'naranja',
      label: 'En construcción',
      message: 'Tu historial está creciendo. Cada verificación que completes acerca tu score a su verdadero potencial.',
    };
  }
  return {
    color: 'rojo',
    label: 'Necesita mejorar',
    message: 'Tu perfil necesita fortalecerse. Completa las verificaciones para demostrar tu verdadero potencial como inquilino.',
  };
}

/**
 * Calculate the Renty Score using the two-layer model:
 *   1. Declared score = modules + consistency + penalties (from questionnaire)
 *   2. Final score = declared × trust factor (from verifications)
 *
 * At wizard completion (no verifications), trust factor = 0.5.
 * Color thresholds apply to the FINAL score.
 */
export function calculateScore(
  answers: Answers,
  verifications: VerificationStatus = EMPTY_VERIFICATIONS,
): ScoreResult {
  let penalties = 0;
  const moduleScores = { A: 0, B: 0, C: 0, D: 0 };

  for (const mod of MODULES) {
    for (const question of mod.questions) {
      const selected = answers[question.id];
      if (!selected) continue;
      const option = question.options.find((o) => o.value === selected);
      if (!option) continue;
      moduleScores[mod.id] += option.points;
      if (option.penalty) penalties += option.penalty;
    }
  }

  const { score: consistencyScore, inconsistencies } = calculateConsistency(answers);

  const rawDeclared =
    moduleScores.A +
    moduleScores.B +
    moduleScores.C +
    moduleScores.D +
    consistencyScore +
    penalties;
  const scoreDeclared = Math.max(0, Math.min(1000, rawDeclared));

  const trustFactorBreakdown = calculateTrustFactor(verifications, scoreDeclared);
  const total = Math.max(0, Math.min(1000, Math.round(scoreDeclared * trustFactorBreakdown.factor)));

  const { color, label, message } = getColor(total);

  return {
    total,
    scoreDeclared,
    trustFactor: trustFactorBreakdown.factor,
    trustFactorBreakdown,
    scoreA: moduleScores.A,
    scoreB: moduleScores.B,
    scoreC: moduleScores.C,
    scoreD: moduleScores.D,
    penalties,
    consistencyScore,
    inconsistencies,
    color,
    label,
    message,
  };
}
