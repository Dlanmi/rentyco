import type { Answers, ScoreResult, ScoreColor } from './types';
import { MODULES } from './questions';

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
      message: 'Estás en buen camino. Haremos una verificación rápida con tu arrendador anterior para completar tu perfil.',
    };
  }
  if (score >= 400) {
    return {
      color: 'naranja',
      label: 'En construcción',
      message: 'Tu historial está creciendo. Te pediremos algunos documentos adicionales para verificar tu información.',
    };
  }
  return {
    color: 'rojo',
    label: 'Necesita mejorar',
    message: 'Tu perfil necesita fortalecerse. Te damos consejos concretos para mejorar tu score y volver a intentarlo.',
  };
}

export function calculateScore(answers: Answers): ScoreResult {
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

  const raw = moduleScores.A + moduleScores.B + moduleScores.C + moduleScores.D + penalties;
  const total = Math.max(0, Math.min(1000, raw));

  const { color, label, message } = getColor(total);

  return {
    total,
    scoreA: moduleScores.A,
    scoreB: moduleScores.B,
    scoreC: moduleScores.C,
    scoreD: moduleScores.D,
    penalties,
    color,
    label,
    message,
  };
}
