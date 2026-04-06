'use client';

import { cn } from '@/lib/cn';

interface Props {
  /** 0 = basic data, 1-4 = modules A-D, 5 = result */
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = ['Datos', 'A', 'B', 'C', 'D', 'Score'];

export function StepIndicator({ currentStep, totalSteps }: Props) {
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: totalSteps }, (_, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;
        return (
          <div key={i} className="flex items-center">
            {/* Step circle */}
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300',
                isCompleted && 'bg-teal text-white',
                isActive && 'bg-teal text-white ring-4 ring-teal/20',
                !isCompleted && !isActive && 'bg-sand-dark text-ink-muted'
              )}
            >
              {isCompleted ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-[11px]">{STEP_LABELS[i]}</span>
              )}
            </div>
            {/* Connector line */}
            {i < totalSteps - 1 && (
              <div className="mx-1 h-0.5 w-4 sm:w-6">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    i < currentStep ? 'bg-teal' : 'bg-sand-dark'
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
