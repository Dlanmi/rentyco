'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input, FieldLabel, FieldError } from '@/components/ui/Input';
import { updateProfile } from '@/app/actions/profile';

export function ProfileForm({
  initial,
  email,
}: {
  initial: { fullName: string | null; phone: string | null };
  email: string | undefined;
}) {
  const [fullName, setFullName] = useState(initial.fullName ?? '');
  const [phone, setPhone] = useState(initial.phone ?? '');
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const hasChanges = fullName !== (initial.fullName ?? '') || phone !== (initial.phone ?? '');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await updateProfile({ fullName, phone: phone || null });
      if (res.ok) toast.success('Perfil actualizado');
      else setError(res.message);
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="name" required>Nombre completo</FieldLabel>
          <Input
            id="name"
            required
            minLength={2}
            maxLength={80}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Tu nombre"
          />
        </div>
        <div>
          <FieldLabel>Email</FieldLabel>
          <Input value={email ?? ''} disabled className="bg-sand/50 text-ink-muted" />
        </div>
      </div>
      <div className="max-w-xs">
        <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
        <Input
          id="phone"
          type="tel"
          maxLength={30}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+57 300 123 4567"
        />
        <p className="mt-1.5 font-body text-[12px] text-ink-muted">
          Opcional. Solo visible para arrendadores que contactes.
        </p>
      </div>
      <FieldError>{error}</FieldError>
      <div className="flex items-center gap-3 border-t border-border pt-5">
        <Button type="submit" variant="primary" size="md" loading={pending} disabled={!hasChanges}>
          Guardar cambios
        </Button>
        {hasChanges && (
          <span className="font-body text-[12px] text-ink-muted">Tienes cambios sin guardar</span>
        )}
      </div>
    </form>
  );
}
