import type { TrustFactorResult, VerificationComponent, VerificationStatus } from './types';

/**
 * Trust factor model:
 *   Factor = FLOOR + (VARIABLE × VerificationIndex)
 *   Score_final = Score_declared × Factor
 *
 * Without verification, factor = 0.5 (score is halved).
 * With full verification, factor = 1.0 (declared score is preserved).
 *
 * Verification weights reflect predictive value:
 *   Bank statement (40%) — real income + spending behavior
 *   Landlord reference (35%) — actual tenant behavior
 *   Identity (15%) — confirms person is who they say
 *   Employment proof (10%) — confirms income source
 */

const TRUST_FLOOR = 0.5;
const TRUST_VARIABLE = 0.5;

const COMPONENTS: { key: VerificationComponent['key']; label: string; weight: number }[] = [
  { key: 'bank_statement', label: 'Extracto bancario', weight: 0.40 },
  { key: 'landlord_reference', label: 'Referencia de arrendador', weight: 0.35 },
  { key: 'identity', label: 'Verificación de identidad', weight: 0.15 },
  { key: 'employment_proof', label: 'Certificado laboral', weight: 0.10 },
];

/** No verification — used at wizard completion time */
export const EMPTY_VERIFICATIONS: VerificationStatus = {
  bank_statement: 0,
  landlord_reference: 0,
  identity: 0,
  employment_proof: 0,
};

/**
 * Calculate the trust factor and per-component projected gains.
 *
 * The marginal gain of fully verifying component i is always:
 *   gain_i = scoreDeclared × TRUST_VARIABLE × weight_i × (1 - current_value_i)
 *
 * This is ORDER-INDEPENDENT — each component's value is fixed regardless
 * of which other components are verified.
 */
export function calculateTrustFactor(
  verifications: VerificationStatus,
  scoreDeclared: number,
): TrustFactorResult {
  const components: VerificationComponent[] = COMPONENTS.map(({ key, label, weight }) => {
    const value = verifications[key];
    const pointsIfVerified = Math.round(scoreDeclared * TRUST_VARIABLE * weight * (1 - value));
    return { key, label, weight, value, pointsIfVerified };
  });

  const verificationIndex = components.reduce((sum, c) => sum + c.weight * c.value, 0);
  const factor = TRUST_FLOOR + TRUST_VARIABLE * verificationIndex;

  return { factor, verificationIndex, components };
}

export { TRUST_FLOOR, TRUST_VARIABLE };
