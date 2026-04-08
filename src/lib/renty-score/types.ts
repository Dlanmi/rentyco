export interface QuestionOption {
  value: string;
  label: string;
  points: number;
  /** Flat penalty applied on top of points (negative number) */
  penalty?: number;
}

export interface Question {
  id: string;
  text: string;
  hint?: string;
  options: QuestionOption[];
}

export interface ScoreModule {
  id: 'A' | 'B' | 'C' | 'D';
  title: string;
  subtitle: string;
  icon: string;
  maxPoints: number;
  questions: Question[];
}

export interface BasicData {
  nombre: string;
  cedula: string;
  tipoUsuario: 'inquilino' | 'arrendador';
  inmuebleBusca: string;
  canonMensual: number | null;
  ingresoHogar: number | null;
  /** Number of people who would live in the property (informational, not scored) */
  ocupantes: number | null;
}

export type Answers = Record<string, string>;

export type ScoreColor = 'verde' | 'amarillo' | 'naranja' | 'rojo';

export type InconsistencySeverity = 'alta' | 'media' | 'baja';

export interface Inconsistency {
  rule: string;
  severity: InconsistencySeverity;
  deduction: number;
  explanation: string;
}

export interface ConsistencyResult {
  score: number;
  inconsistencies: Inconsistency[];
}

export type VerificationKey = 'bank_statement' | 'landlord_reference' | 'identity' | 'employment_proof';

export interface VerificationComponent {
  key: VerificationKey;
  label: string;
  weight: number;
  value: number;
  /** Points gained if this component goes from current value to 1.0 */
  pointsIfVerified: number;
}

export interface TrustFactorResult {
  /** Trust factor from 0.5 (no verification) to 1.0 (fully verified) */
  factor: number;
  /** Verification index from 0 to 1 */
  verificationIndex: number;
  components: VerificationComponent[];
}

/** Current verification status for each component (0 to 1) */
export interface VerificationStatus {
  bank_statement: number;
  landlord_reference: number;
  identity: number;
  employment_proof: number;
}

export interface ScoreResult {
  /** Final score = scoreDeclared × trustFactor — this is what matters */
  total: number;
  /** Raw score from questionnaire before trust factor */
  scoreDeclared: number;
  /** Trust factor 0.5–1.0 */
  trustFactor: number;
  trustFactorBreakdown: TrustFactorResult;
  scoreA: number;
  scoreB: number;
  scoreC: number;
  scoreD: number;
  penalties: number;
  consistencyScore: number;
  inconsistencies: Inconsistency[];
  color: ScoreColor;
  label: string;
  message: string;
}
