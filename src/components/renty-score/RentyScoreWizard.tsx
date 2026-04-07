'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/cn';
import { MODULES, ratioToB1Value, getUnansweredQuestions, getModuleIndexForQuestion } from '@/lib/renty-score/questions';
import { calculateScore } from '@/lib/renty-score/calculate';
import { submitRentyScore } from '@/app/actions/renty-score';
import { trackScoreEvent } from '@/lib/renty-score/analytics';
import type { BasicData, Answers, ScoreResult as ScoreResultType } from '@/lib/renty-score/types';

const STORAGE_KEY = 'renty-score-progress';
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours
import { StepIndicator } from './StepIndicator';
import { BasicDataStep } from './BasicDataStep';
import { QuestionStep } from './QuestionStep';
import { ScoreResult } from './ScoreResult';

const TOTAL_STEPS = 6; // basic + 4 modules + result

interface WizardProps {
  isAuthed?: boolean;
  userName?: string;
  userRole?: string;
}

export function RentyScoreWizard({ isAuthed = false, userName, userRole }: WizardProps) {
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultTipo = (searchParams.get('tipo') as 'inquilino' | 'arrendador')
    || (userRole === 'landlord' ? 'arrendador' : 'inquilino');

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [basicData, setBasicData] = useState<BasicData>({
    nombre: userName ?? '',
    cedula: '',
    tipoUsuario: defaultTipo,
    inmuebleBusca: '',
    canonMensual: null,
    ingresoHogar: null,
  });
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<ScoreResultType | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [restored, setRestored] = useState(false);
  const autoCalculatedIds = useRef(new Set(['b1'])).current;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs to always have latest state in callbacks (avoids stale closures)
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const basicDataRef = useRef(basicData);
  basicDataRef.current = basicData;

  // Restore progress from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { step?: number; basicData?: BasicData; answers?: Answers; savedAt?: number };
        if (saved.savedAt && Date.now() - saved.savedAt < MAX_AGE_MS) {
          if (saved.basicData) setBasicData(saved.basicData);
          if (saved.answers) setAnswers(saved.answers);
          if (saved.step && saved.step > 0 && saved.step < 5) setStep(saved.step);
          setRestored(true);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch { /* incognito / SSR */ }
    trackScoreEvent('wizard_start');
  }, []);

  // Save progress to localStorage (debounced)
  useEffect(() => {
    if (step >= 5) return; // Don't save result step
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, basicData, answers, savedAt: Date.now() }));
      } catch { /* incognito / SSR */ }
    }, 300);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [step, basicData, answers]);

  // Track step changes
  useEffect(() => {
    if (step > 0) trackScoreEvent('step_enter', { step });
  }, [step]);

  // Auto-calculate b1 from ratio
  useEffect(() => {
    if (basicData.canonMensual && basicData.ingresoHogar) {
      const ratio = basicData.canonMensual / basicData.ingresoHogar;
      const b1Value = ratioToB1Value(ratio);
      setAnswers((prev) => ({ ...prev, b1: b1Value }));
    }
  }, [basicData.canonMensual, basicData.ingresoHogar]);

  const goTo = useCallback((nextStep: number) => {
    setStep((currentStep) => {
      setDirection(nextStep > currentStep ? 'forward' : 'back');
      return nextStep;
    });
    // Scroll to top of wizard
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleAnswer = useCallback((questionId: string, value: string) => {
    setValidationError(null);
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const handleFinish = useCallback(async () => {
    // Read latest state from refs to avoid stale closures
    const currentAnswers = answersRef.current;
    const currentBasicData = basicDataRef.current;

    // Validate all questions are answered
    const unanswered = getUnansweredQuestions(currentAnswers);
    if (unanswered.length > 0) {
      const moduleIdx = getModuleIndexForQuestion(unanswered[0]!);
      if (moduleIdx >= 0) goTo(moduleIdx + 1);
      setValidationError(`Faltan ${unanswered.length} pregunta${unanswered.length > 1 ? 's' : ''} por responder.`);
      return;
    }

    const scoreResult = calculateScore(currentAnswers);
    setResult(scoreResult);
    setStep(5);
    setDirection('forward');
    setSaving(true);

    // Clear progress immediately — score has been calculated
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ok */ }

    try {
      const res = await submitRentyScore({
        nombre: currentBasicData.nombre,
        cedula: currentBasicData.cedula,
        tipoUsuario: currentBasicData.tipoUsuario,
        inmuebleBusca: currentBasicData.inmuebleBusca || undefined,
        canonMensual: currentBasicData.canonMensual,
        ingresoHogar: currentBasicData.ingresoHogar,
        answers: currentAnswers,
        score: {
          total: scoreResult.total,
          scoreA: scoreResult.scoreA,
          scoreB: scoreResult.scoreB,
          scoreC: scoreResult.scoreC,
          scoreD: scoreResult.scoreD,
          penalties: scoreResult.penalties,
          color: scoreResult.color,
        },
      });
      if (res.success) {
        setSaved(true);
        trackScoreEvent('wizard_complete', { score: scoreResult.total, color: scoreResult.color });
      } else {
        setSaveError(res.error ?? 'Error guardando tu score.');
      }
    } catch {
      setSaveError('Error de conexión. Tu score se calculó pero no se pudo guardar.');
    } finally {
      setSaving(false);
    }
  }, [goTo]);

  return (
    <div ref={containerRef} className="mx-auto max-w-xl px-5 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal/10 px-4 py-1.5 text-xs font-semibold text-teal">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          Renty Score
        </div>
        <h1 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
          Descubre tu Renty Score
        </h1>
        <p className="mt-2 text-sm text-ink-muted sm:text-base">
          Responde estas preguntas y conoce tu puntaje en menos de 3 minutos
        </p>
      </div>

      {/* Step indicator */}
      <div className="mb-8">
        <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
      </div>

      {/* Restored from localStorage indicator */}
      {restored && step < 5 && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-teal/20 bg-teal-lighter/50 px-4 py-2.5 text-sm text-teal-dark">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Retomamos donde lo dejaste.
        </div>
      )}

      {/* Validation error */}
      {validationError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          {validationError}
        </div>
      )}

      {/* Wizard body — animated transitions */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <div
          key={step}
          className={cn(
            'animate-in duration-400 fill-mode-both',
            direction === 'forward' ? 'slide-in-from-right-4 fade-in' : 'slide-in-from-left-4 fade-in'
          )}
        >
          {step === 0 && (
            <BasicDataStep
              data={basicData}
              onChange={setBasicData}
              onNext={() => goTo(1)}
            />
          )}

          {step >= 1 && step <= 4 && (
            <QuestionStep
              key={MODULES[step - 1]!.id}
              module={MODULES[step - 1]!}
              answers={answers}
              onAnswer={handleAnswer}
              autoCalculatedIds={autoCalculatedIds}
              onNext={() => {
                if (step === 4) {
                  handleFinish();
                } else {
                  goTo(step + 1);
                }
              }}
              onBack={() => goTo(step - 1)}
            />
          )}

          {step === 5 && result && (
            <ScoreResult result={result} saving={saving} saved={saved} isAuthed={isAuthed} saveError={saveError} />
          )}
        </div>
      </div>

      {/* Trust footer */}
      <div className="mt-6 flex flex-col items-center gap-2 text-center text-xs text-ink-muted">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Datos encriptados
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Ley 1581 de 2012
          </span>
        </div>
        <p>Tu información es confidencial y solo se usa para calcular tu score.</p>
      </div>
    </div>
  );
}
