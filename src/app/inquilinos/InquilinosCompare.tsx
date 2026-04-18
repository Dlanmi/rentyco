'use client';

import { useState } from 'react';

/**
 * Toggle between "Sistema tradicional" and "Con Renty".
 * Desktop shows both columns side-by-side; toggle adds a subtle visual emphasis.
 * Mobile only shows one column at a time (driven by `active`).
 */
interface Row {
  t: string;
  d: string;
}
const trad: Row[] = [
  { t: 'Exige codeudor con finca raíz', d: '82% de inmobiliarias en Bogotá y Medellín.' },
  { t: 'Rechaza ingresos informales', d: 'Aunque factures más que un empleado formal.' },
  { t: 'Se basa solo en DataCrédito', d: 'Un reporte de hace 7 años pesa más que 9 de buen pago.' },
  { t: 'Hasta 3.9 meses de espera', d: 'Recogiendo papeles, fiadores, certificaciones.' },
  { t: 'Tu historial de pago no cuenta', d: 'Si no firmaste contrato, "no arrendaste".' },
];
const renty: Row[] = [
  { t: 'Tu historial es tu codeudor', d: 'Pagos puntuales = acceso. Sin finca raíz ajena.' },
  { t: 'Leemos ingresos reales', d: 'Nequi, Rappi, facturación electrónica, cuentas de ahorro.' },
  { t: 'Score propio, no solo bureaus', d: '12 factores que miden comportamiento, no solo deuda.' },
  { t: '3 minutos, sin papeles', d: 'Respondes 12 preguntas desde tu celular.' },
  { t: 'Arriendo verbal también cuenta', d: 'Verificamos por transferencias, no por contrato.' },
];

function Cross({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.4} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
function Check({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.4} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function InquilinosCompare() {
  const [side, setSide] = useState<'trad' | 'renty'>('trad');

  return (
    <>
      {/* Toggle */}
      <div className="mb-10 flex justify-center">
        <div className="inline-flex rounded-full bg-sand-dark p-1" role="tablist" aria-label="Comparar sistemas">
          <button
            type="button"
            role="tab"
            aria-selected={side === 'trad'}
            onClick={() => setSide('trad')}
            className={`rounded-full px-6 py-3 font-heading text-[13px] font-500 transition-colors duration-200 sm:px-7 ${
              side === 'trad' ? 'bg-ink text-white' : 'text-ink-muted'
            }`}
          >
            Sistema tradicional
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={side === 'renty'}
            onClick={() => setSide('renty')}
            className={`rounded-full px-6 py-3 font-heading text-[13px] font-500 transition-colors duration-200 sm:px-7 ${
              side === 'renty' ? 'bg-teal text-white' : 'text-ink-muted'
            }`}
          >
            Con Renty
          </button>
        </div>
      </div>

      {/* Two columns — both visible on lg, only `side` on mobile */}
      <div className="mx-auto grid max-w-[1040px] grid-cols-1 overflow-hidden rounded-3xl border border-border bg-white shadow-sm lg:grid-cols-2">
        {/* Trad side */}
        <div
          className={`bg-sand p-7 sm:p-10 ${side === 'trad' ? '' : 'hidden lg:block'} lg:border-r lg:border-border`}
        >
          <div className="mb-5 font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-ink-subtle">
            Sistema tradicional
          </div>
          <h3 className="m-0 mb-6 font-display text-[26px] font-400 leading-[1.2] text-ink-muted [letter-spacing:-0.01em]">
            Midiendo lo que tienes.
          </h3>
          <ul className="grid list-none gap-0 p-0">
            {trad.map((r, i) => (
              <li
                key={i}
                className="flex items-start gap-3.5 border-t border-border py-4 first:border-t-0 first:pt-0"
              >
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-coral-light text-coral-dark">
                  <Cross className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <strong className="mb-1 block font-heading text-[14px] font-600 text-ink">{r.t}</strong>
                  <span className="font-body text-[13px] text-ink-muted">{r.d}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Renty side */}
        <div
          className={`relative bg-white p-7 sm:p-10 ${side === 'renty' ? '' : 'hidden lg:block'}`}
        >
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-teal" />
          <div className="mb-5 font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-teal">
            Con Renty
          </div>
          <h3 className="m-0 mb-6 font-display text-[26px] font-400 leading-[1.2] text-ink [letter-spacing:-0.01em]">
            Midiendo cómo pagas.
          </h3>
          <ul className="grid list-none gap-0 p-0">
            {renty.map((r, i) => (
              <li
                key={i}
                className="flex items-start gap-3.5 border-t border-border py-4 first:border-t-0 first:pt-0"
              >
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-teal-lighter text-teal">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <strong className="mb-1 block font-heading text-[14px] font-600 text-ink">{r.t}</strong>
                  <span className="font-body text-[13px] text-ink-muted">{r.d}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
