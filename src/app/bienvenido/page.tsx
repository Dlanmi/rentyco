'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { setUserRole } from '@/app/actions/profile';

const ROLES = [
  {
    value: 'tenant' as const,
    title: 'Busco arriendo',
    description: 'Quiero encontrar mi próximo hogar',
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
    features: ['Explorar arriendos verificados', 'Guardar favoritos', 'Contactar arrendadores', 'Obtener tu Renty Score'],
    cta: 'Empezar a buscar',
    redirectTo: '/bogota/arriendos',
  },
  {
    value: 'landlord' as const,
    title: 'Quiero publicar',
    description: 'Tengo un inmueble para arrendar',
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    features: ['Publicar tu inmueble gratis', 'Recibir consultas de inquilinos', 'Verificar inquilinos con Renty Score', 'Panel de gestión'],
    cta: 'Publicar mi inmueble',
    redirectTo: '/cuenta/publicaciones',
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<'tenant' | 'landlord' | null>(null);
  const [pending, start] = useTransition();

  function handleContinue() {
    if (!selected) return;
    const role = ROLES.find((r) => r.value === selected)!;
    start(async () => {
      const res = await setUserRole({ role: selected });
      if (res.ok) {
        router.push(role.redirectTo);
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sand px-6 py-16">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="font-heading text-[22px] font-800 tracking-tight text-ink">
            renty<span className="text-teal">.</span>
          </span>
          <h1 className="mt-6 font-display text-[32px] leading-tight text-ink sm:text-[40px]">
            Bienvenido a Renty
          </h1>
          <p className="mt-3 font-body text-[16px] text-ink-secondary">
            Cuéntanos qué te trae por aquí para personalizar tu experiencia
          </p>
        </div>

        {/* Role cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {ROLES.map((role) => {
            const isSelected = selected === role.value;
            return (
              <button
                key={role.value}
                type="button"
                onClick={() => setSelected(role.value)}
                className={`group relative flex flex-col rounded-2xl border-2 bg-white p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                  isSelected
                    ? 'border-teal shadow-lg shadow-teal/10'
                    : 'border-transparent shadow-sm hover:border-border'
                }`}
              >
                {/* Check indicator */}
                <div
                  className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full transition-all ${
                    isSelected ? 'bg-teal text-white' : 'border-2 border-border bg-white'
                  }`}
                >
                  {isSelected && (
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                {/* Icon */}
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-colors ${
                  isSelected ? 'bg-teal/10 text-teal' : 'bg-sand text-ink-muted group-hover:bg-teal-lighter group-hover:text-teal'
                }`}>
                  {role.icon}
                </div>

                {/* Title & description */}
                <h2 className="font-heading text-[18px] font-700 text-ink">{role.title}</h2>
                <p className="mt-1 font-body text-[14px] text-ink-secondary">{role.description}</p>

                {/* Features */}
                <ul className="mt-5 flex flex-col gap-2.5">
                  {role.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 font-body text-[13px] text-ink-secondary">
                      <svg className={`mt-0.5 h-4 w-4 shrink-0 ${isSelected ? 'text-teal' : 'text-ink-muted'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selected || pending}
            className="w-full max-w-xs rounded-xl bg-teal px-8 py-3.5 font-heading text-[15px] font-600 text-white transition-all hover:-translate-y-px hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none sm:w-auto"
          >
            {pending ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" /><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" /></svg>
                Configurando...
              </span>
            ) : selected ? (
              ROLES.find((r) => r.value === selected)!.cta
            ) : (
              'Selecciona una opción'
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push('/cuenta')}
            className="font-body text-[13px] text-ink-muted underline transition-colors hover:text-ink-secondary"
          >
            Decidir después
          </button>
        </div>
      </div>
    </div>
  );
}
