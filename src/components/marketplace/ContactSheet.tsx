'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, FieldLabel, FieldError } from '@/components/ui/Input';
import { createInquiry } from '@/app/actions/inquiries';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export function ContactSheet({
  listingId,
  trigger,
  isAuthed,
}: {
  listingId: string;
  trigger: React.ReactNode;
  isAuthed: boolean;
}) {
  const router = useRouter();
  const [message, setMessage] = useState('Hola, me interesa este arriendo. ¿Podemos agendar una visita?');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  function handleTriggerClick() {
    if (!isAuthed) {
      router.push(`/entrar?next=${encodeURIComponent(location.pathname)}`);
      return;
    }
    setOpen(true);
  }

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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild onClick={handleTriggerClick}>
        {trigger}
      </SheetTrigger>
      <SheetContent className="max-h-[90vh]">
        <VisuallyHidden><SheetTitle>Contactar arrendador</SheetTitle></VisuallyHidden>
        <div className="flex items-center justify-between border-b border-border px-5 pb-3 pt-2">
          <h3 className="font-display text-[20px] text-ink">Contactar arrendador</h3>
          <SheetClose className="font-mono text-[12px] text-ink-muted underline">Cerrar</SheetClose>
        </div>

        {sent ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 text-teal">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h4 className="font-display text-[20px] text-ink">Mensaje enviado</h4>
            <p className="mt-2 font-body text-[14px] text-ink-muted">
              El arrendador lo recibirá en su bandeja. Te avisaremos cuando responda.
            </p>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-[12px] text-ink-muted">
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Tu información de contacto solo se comparte si el arrendador responde.
            </p>
            <Button onClick={() => { setSent(false); setOpen(false); }} variant="subtle" size="md" className="mt-5">
              Cerrar
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-4 p-5">
            <div>
              <FieldLabel htmlFor="msg" required>Mensaje</FieldLabel>
              <Textarea
                id="msg"
                required
                rows={5}
                minLength={10}
                maxLength={1000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div>
              <FieldLabel htmlFor="phone" hint="opcional">Teléfono de contacto</FieldLabel>
              <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+57 300 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <FieldError>{error}</FieldError>
            <Button type="submit" loading={pending} variant="primary" size="lg">
              Enviar mensaje
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
