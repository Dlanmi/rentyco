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
}

export type Answers = Record<string, string>;

export type ScoreColor = 'verde' | 'amarillo' | 'naranja' | 'rojo';

export interface ScoreResult {
  total: number;
  scoreA: number;
  scoreB: number;
  scoreC: number;
  scoreD: number;
  penalties: number;
  color: ScoreColor;
  label: string;
  message: string;
}
