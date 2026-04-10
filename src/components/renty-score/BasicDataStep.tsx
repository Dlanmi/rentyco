'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import type { BasicData } from '@/lib/renty-score/types';

interface Props {
  data: BasicData;
  onChange: (data: BasicData) => void;
  onNext: () => void;
}

function formatCurrency(value: string): string {
  const num = value.replace(/\D/g, '');
  if (!num) return '';
  return Number(num).toLocaleString('es-CO');
}

function parseCurrency(value: string): number | null {
  const num = Number(value.replace(/\D/g, ''));
  return num > 0 ? num : null;
}

export function BasicDataStep({ data, onChange, onNext }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const ratio =
    data.canonMensual && data.ingresoHogar
      ? data.canonMensual / data.ingresoHogar
      : null;

  const ratioColor = ratio
    ? ratio < 0.3
      ? 'text-success'
      : ratio < 0.5
        ? 'text-warning'
        : 'text-error'
    : 'text-ink-muted';

  const ratioLabel = ratio
    ? ratio < 0.3
      ? 'Saludable'
      : ratio < 0.5
        ? 'Moderado'
        : 'Alto'
    : null;

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (data.nombre.trim().length < 2) e.nombre = 'Ingresa tu nombre completo';
    const cedulaDigits = data.cedula.replace(/\D/g, '');
    if (cedulaDigits.length < 6 || cedulaDigits.length > 10) {
      e.cedula = 'La cédula debe tener entre 6 y 10 dígitos';
    }
    if (!data.canonMensual || data.canonMensual <= 0) e.canonMensual = 'Ingresa el valor del arriendo que buscas';
    if (!data.ingresoHogar || data.ingresoHogar <= 0) e.ingresoHogar = 'Ingresa el ingreso total del hogar';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validate()) onNext();
  }

  return (
    <div className="space-y-5">
      {data.tipoUsuario === 'arrendador' && (
        <div className="rounded-xl border border-teal/20 bg-teal-lighter/50 px-4 py-3 text-sm text-teal-dark">
          Este formulario es opcional para arrendadores. Puedes conocer tu score y entender cómo evaluamos a los inquilinos.
        </div>
      )}

      {/* Tipo de usuario */}
      <div>
        <label className="mb-2 block text-sm font-medium text-ink">¿Eres inquilino o arrendador?</label>
        <div className="flex gap-2">
          {(['inquilino', 'arrendador'] as const).map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => onChange({ ...data, tipoUsuario: tipo })}
              className={cn(
                'flex-1 rounded-xl border-2 px-4 py-3.5 text-sm font-medium capitalize transition-[border-color,background-color,color]',
                data.tipoUsuario === tipo
                  ? 'border-teal bg-teal-lighter text-teal-dark'
                  : 'border-border bg-white text-ink-muted hover:border-teal/30'
              )}
            >
              {tipo}
            </button>
          ))}
        </div>
      </div>

      {/* Nombre */}
      <div>
        <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium text-ink">
          Nombre completo
        </label>
        <input
          id="nombre"
          type="text"
          autoComplete="name"
          value={data.nombre}
          onChange={(e) => onChange({ ...data, nombre: e.target.value })}
          className={cn(
            'w-full rounded-xl border-2 bg-white px-4 py-3.5 text-ink outline-none transition-colors',
            'placeholder:text-ink-muted/50 focus:border-teal',
            errors.nombre ? 'border-error' : 'border-border'
          )}
          placeholder="Ej: María García López…"
        />
        {errors.nombre && <p className="mt-1 text-sm text-error">{errors.nombre}</p>}
      </div>

      {/* Cédula */}
      <div>
        <label htmlFor="cedula" className="mb-1.5 block text-sm font-medium text-ink">
          Número de cédula
        </label>
        <input
          id="cedula"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          value={data.cedula}
          onChange={(e) => onChange({ ...data, cedula: e.target.value.replace(/\D/g, '') })}
          className={cn(
            'w-full rounded-xl border-2 bg-white px-4 py-3.5 text-ink outline-none transition-colors',
            'placeholder:text-ink-muted/50 focus:border-teal',
            errors.cedula ? 'border-error' : 'border-border'
          )}
          placeholder="Ej: 1234567890"
        />
        {errors.cedula && <p className="mt-1 text-sm text-error">{errors.cedula}</p>}
      </div>

      {/* Inmueble que busca */}
      <div>
        <label htmlFor="inmueble" className="mb-1.5 block text-sm font-medium text-ink">
          Inmueble que busca <span className="text-ink-muted">(opcional)</span>
        </label>
        <input
          id="inmueble"
          type="text"
          value={data.inmuebleBusca}
          onChange={(e) => onChange({ ...data, inmuebleBusca: e.target.value })}
          className="w-full rounded-xl border-2 border-border bg-white px-4 py-3.5 text-ink outline-none transition-colors placeholder:text-ink-muted/50 focus:border-teal"
          placeholder="Ej: Apartamento 2 habitaciones en Usaquén"
        />
      </div>

      {/* Ocupantes */}
      <div>
        <label htmlFor="ocupantes" className="mb-1.5 block text-sm font-medium text-ink">
          ¿Cuántas personas vivirían en el inmueble? <span className="text-ink-muted">(opcional)</span>
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Reducir ocupantes"
            onClick={() => onChange({ ...data, ocupantes: Math.max(1, (data.ocupantes ?? 1) - 1) })}
            disabled={!data.ocupantes || data.ocupantes <= 1}
            className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-border bg-white text-ink transition-colors hover:border-teal disabled:opacity-40"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" d="M5 12h14" />
            </svg>
          </button>
          <span className="min-w-[3ch] text-center text-lg font-medium text-ink">
            {data.ocupantes ?? 1}
          </span>
          <button
            type="button"
            aria-label="Aumentar ocupantes"
            onClick={() => onChange({ ...data, ocupantes: Math.min(10, (data.ocupantes ?? 1) + 1) })}
            disabled={data.ocupantes !== null && data.ocupantes >= 10}
            className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-border bg-white text-ink transition-colors hover:border-teal disabled:opacity-40"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <span className="text-sm text-ink-muted">personas (incluyéndote)</span>
        </div>
      </div>

      {/* Canon + Ingreso side by side */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="canon" className="mb-1.5 block text-sm font-medium text-ink">
            Canon mensual (COP)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-muted">$</span>
            <input
              id="canon"
              type="text"
              inputMode="numeric"
              value={data.canonMensual ? formatCurrency(String(data.canonMensual)) : ''}
              onChange={(e) => onChange({ ...data, canonMensual: parseCurrency(e.target.value) })}
              className={cn(
                'w-full rounded-xl border-2 bg-white py-3.5 pl-8 pr-4 text-ink outline-none transition-colors placeholder:text-ink-muted/50 focus:border-teal',
                errors.canonMensual ? 'border-error' : 'border-border'
              )}
              placeholder="2.000.000"
            />
          </div>
          {errors.canonMensual && <p className="mt-1 text-xs text-error">{errors.canonMensual}</p>}
        </div>
        <div>
          <label htmlFor="ingreso" className="mb-1.5 block text-sm font-medium text-ink">
            Ingreso total hogar (COP)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-muted">$</span>
            <input
              id="ingreso"
              type="text"
              inputMode="numeric"
              value={data.ingresoHogar ? formatCurrency(String(data.ingresoHogar)) : ''}
              onChange={(e) => onChange({ ...data, ingresoHogar: parseCurrency(e.target.value) })}
              className={cn(
                'w-full rounded-xl border-2 bg-white py-3.5 pl-8 pr-4 text-ink outline-none transition-colors placeholder:text-ink-muted/50 focus:border-teal',
                errors.ingresoHogar ? 'border-error' : 'border-border'
              )}
              placeholder="5.000.000"
            />
          </div>
          {errors.ingresoHogar && <p className="mt-1 text-xs text-error">{errors.ingresoHogar}</p>}
        </div>
      </div>

      {/* Ratio indicator */}
      {ratio !== null && (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-sand-dark/50 px-4 py-3">
          <div className={cn('text-2xl font-display font-bold', ratioColor)}>
            {Math.round(ratio * 100)}%
          </div>
          <div>
            <p className="text-sm font-medium text-ink">Ratio arriendo / ingreso</p>
            <p className={cn('text-xs font-medium', ratioColor)}>{ratioLabel}</p>
          </div>
        </div>
      )}

      <Button variant="primary" size="lg" className="mt-2 w-full" onClick={handleNext}>
        Continuar
        <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-ink-muted">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 7.636z" />
        </svg>
        Tus datos están protegidos bajo la Ley 1581 de 2012
      </p>
    </div>
  );
}
