'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { OptionCard } from './OptionCard';
import type { ScoreModule, Answers } from '@/lib/renty-score/types';
import { TOTAL_QUESTIONS, MODULES } from '@/lib/renty-score/questions';

interface Props {
  module: ScoreModule;
  answers: Answers;
  onAnswer: (questionId: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  autoCalculatedIds?: Set<string>;
}

const MODULE_ICONS: Record<string, React.ReactNode> = {
  home: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  wallet: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
    </svg>
  ),
  shield: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  signal: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
};

export function QuestionStep({ module: mod, answers, onAnswer, onNext, onBack, autoCalculatedIds }: Props) {
  const [subStep, setSubStep] = useState(0);
  const question = mod.questions[subStep]!;
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ref to always have the latest onNext (avoids stale closure in timeouts).
  // Sync in an effect — React 19 forbids mutating refs during render.
  const onNextRef = useRef(onNext);
  useEffect(() => {
    onNextRef.current = onNext;
  });

  const isAutoCalculated = autoCalculatedIds?.has(question.id) && !!answers[question.id];

  // Calculate global question number
  const moduleIndex = MODULES.findIndex((m) => m.id === mod.id);
  const questionsBeforeModule = MODULES.slice(0, moduleIndex).reduce(
    (sum, m) => sum + m.questions.length,
    0
  );
  const globalQuestionNumber = questionsBeforeModule + subStep + 1;

  // Clear timer on unmount or substep change
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, [subStep]);

  // Auto-advance past auto-calculated questions
  useEffect(() => {
    if (isAutoCalculated) {
      advanceTimerRef.current = setTimeout(() => {
        if (subStep < mod.questions.length - 1) {
          setSubStep((s) => s + 1);
        } else {
          onNextRef.current();
        }
      }, 1500);
    }
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, [isAutoCalculated, subStep, mod.questions.length]);

  const handleSelect = useCallback(
    (value: string) => {
      // OptionCard's disabled prop already blocks clicks when auto-calculated.
      // No extra guard here — if the user CAN click, the answer should register.
      onAnswer(question.id, value);
      // Auto-advance after delay (800ms for mobile safety)
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = setTimeout(() => {
        if (subStep < mod.questions.length - 1) {
          setSubStep((s) => s + 1);
        } else {
          onNextRef.current();
        }
      }, 800);
    },
    [question.id, onAnswer, subStep, mod.questions.length]
  );

  const handleBack = () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    if (subStep > 0) {
      setSubStep((s) => s - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="space-y-6">
      {/* Module header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 text-teal">
          {MODULE_ICONS[mod.icon]}
        </div>
        <div>
          <h2 className="font-display text-lg text-ink">{mod.title}</h2>
          <p className="text-xs text-ink-muted">{mod.subtitle}</p>
        </div>
      </div>

      {/* Progress within module */}
      <div className="flex items-center justify-between text-xs text-ink-muted">
        <span>Pregunta {subStep + 1} de {mod.questions.length}</span>
        <span className="font-mono">{globalQuestionNumber} / {TOTAL_QUESTIONS}</span>
      </div>

      {/* Sub-step progress bar */}
      <div className="h-1 overflow-hidden rounded-full bg-sand-dark">
        <div
          className="h-full rounded-full bg-teal transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${((subStep + 1) / mod.questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div>
        <h3 className="text-[17px] font-medium leading-snug text-ink">
          {question.text}
        </h3>
        {question.hint && (
          <p className="mt-1.5 text-sm text-ink-muted">{question.hint}</p>
        )}
      </div>

      {/* Auto-calculated banner */}
      {isAutoCalculated && (
        <div className="flex items-center gap-2 rounded-xl border border-teal/20 bg-teal-lighter/50 px-4 py-3 text-sm text-teal-dark">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Calculado automáticamente a partir de tu canon e ingreso.
        </div>
      )}

      {/* Options */}
      <div className="space-y-2.5">
        {question.options.map((option, i) => (
          <OptionCard
            key={option.value}
            option={option}
            selected={answers[question.id] === option.value}
            onSelect={handleSelect}
            index={i}
            disabled={isAutoCalculated}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handleBack}
          className="flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-sand-dark hover:text-ink"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>

        {answers[question.id] && (
          <Button
            variant="ghost"
            size="md"
            onClick={() => {
              if (subStep < mod.questions.length - 1) {
                setSubStep((s) => s + 1);
              } else {
                onNext();
              }
            }}
          >
            Siguiente
            <svg className="ml-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
}
