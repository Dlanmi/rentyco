'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Textarea, Input, FieldLabel, FieldError } from '@/components/ui/Input';
import { createInquiry } from '@/app/actions/inquiries';

export function ContactModal({
  listingId,
  isAuthed,
  hasScore,
  trigger,
}: {
  listingId: string;
  isAuthed: boolean;
  hasScore: boolean;
  trigger: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('Hola, me interesa este arriendo. ¿Podemos agendar una visita?');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await createInquiry({ listingId, message, contactPhone: phone || undefined });
      if (res.ok) {
        setSent(true);
        toast.success('¡Mensaje enviado!');
      } else {
        setError(res.message);
      }
    });
  }

  const nextUrl = encodeURIComponent(pathname);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div role="button" tabIndex={0} onClick={() => setOpen(true)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(true); }} className="contents">
        {trigger}
      </div>

      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Teal accent strip */}
        <div className="h-1.5 bg-gradient-to-r from-teal to-teal-light" />

        <div className="p-6">
          {/* Close button */}
          <DialogClose className="absolute right-3 top-4 flex h-10 w-10 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-sand-dark hover:text-ink">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </DialogClose>

          {!isAuthed ? (
            /* ── State A: Not authenticated ── */
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-lighter">
                <svg className="h-8 w-8 text-teal" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <DialogTitle className="text-center">Crea tu cuenta para contactar</DialogTitle>
              <DialogDescription className="text-center">
                Crea tu cuenta para contactar arrendadores y aplicar con tu Renty Score — sin codeudor ni aseguradora.
              </DialogDescription>
              <div className="mt-6 flex flex-col gap-2.5">
                <Button variant="primary" size="lg" className="w-full" asChild>
                  <Link href={`/entrar?next=${nextUrl}`}>Continuar con Google</Link>
                </Button>
                <Button variant="ghost" size="md" className="w-full" asChild>
                  <Link href={`/entrar?next=${nextUrl}`}>Usar correo electrónico</Link>
                </Button>
              </div>
            </div>
          ) : !hasScore ? (
            /* ── State B: Authenticated but no score ── */
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-lighter">
                <svg className="h-8 w-8 text-teal" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <DialogTitle className="text-center">Destaca con tu Renty Score</DialogTitle>
              <DialogDescription className="text-center">
                Tu Renty Score le muestra al arrendador que eres un inquilino confiable — es tu mejor carta de presentación. Responde 12 preguntas y obtén tu puntaje en menos de 3 minutos.
              </DialogDescription>
              <div className="mt-6 flex flex-col gap-2.5">
                <Button variant="primary" size="lg" className="w-full" asChild>
                  <Link href="/renty-score/formulario">Calcular mi score</Link>
                </Button>
                <Button variant="ghost" size="md" className="w-full" asChild>
                  <Link href="/renty-score">¿Qué es el Renty Score?</Link>
                </Button>
              </div>
            </div>
          ) : sent ? (
            /* ── State C: Success ── */
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal/10">
                <svg className="h-8 w-8 text-teal" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <DialogTitle className="text-center">Mensaje enviado</DialogTitle>
              <DialogDescription className="text-center">
                El arrendador recibirá tu mensaje junto con tu Renty Score. Te avisaremos cuando responda.
              </DialogDescription>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-[12px] text-ink-muted">
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Tu información de contacto solo se comparte si el arrendador responde.
              </p>
              <Button
                onClick={() => { setSent(false); setOpen(false); }}
                variant="subtle"
                size="md"
                className="mt-6 w-full"
              >
                Cerrar
              </Button>
            </div>
          ) : (
            /* ── State D: Contact form ── */
            <>
              <DialogTitle>Contactar arrendador</DialogTitle>
              <div className="mt-2 h-1 w-12 rounded-full bg-teal" />

              <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-4">
                <div>
                  <FieldLabel htmlFor="contact-msg" required>Mensaje</FieldLabel>
                  <Textarea
                    id="contact-msg"
                    required
                    rows={4}
                    minLength={10}
                    maxLength={1000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="contact-phone" hint="opcional">Teléfono de contacto</FieldLabel>
                  <Input
                    id="contact-phone"
                    type="tel"
                    placeholder="+57 300 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <FieldError>{error}</FieldError>
                <Button type="submit" loading={pending} variant="primary" size="lg" className="w-full">
                  Enviar mensaje
                </Button>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
