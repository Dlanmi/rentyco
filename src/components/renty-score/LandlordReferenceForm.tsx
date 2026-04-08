'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { submitLandlordReference } from '@/app/actions/verifications';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  existingStatus: string;
  existingData?: Record<string, string>;
  rejectionNote?: string;
}

export function LandlordReferenceForm({ existingStatus, existingData, rejectionNote }: Props) {
  const [name, setName] = useState(existingData?.landlord_name ?? '');
  const [phone, setPhone] = useState(existingData?.landlord_phone ?? '');
  const [address, setAddress] = useState(existingData?.previous_address ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isSubmitted = existingStatus === 'submitted' || existingStatus === 'contacted';

  if (success || isSubmitted) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 rounded-lg bg-teal-lighter/30 px-3 py-2 text-[13px] text-teal-dark">
          <CheckCircle2 className="h-4 w-4" />
          Referencia enviada. Nos pondremos en contacto con tu arrendador anterior.
        </div>
        {(existingData || success) && (
          <div className="rounded-lg bg-sand-dark/30 px-3 py-2 text-[12px] text-ink-muted">
            <div>{name || existingData?.landlord_name}</div>
            <div>{phone || existingData?.landlord_phone}</div>
            <div>{address || existingData?.previous_address}</div>
          </div>
        )}
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const result = await submitLandlordReference({
      landlordName: name.trim(),
      landlordPhone: phone.trim(),
      previousAddress: address.trim(),
    });

    setSaving(false);

    if (result.ok) {
      setSuccess(true);
    } else {
      setError(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {existingStatus === 'rejected' && (
        <div className="rounded-lg border border-error/20 bg-error/5 px-3 py-2 text-[13px] text-error">
          <span className="font-600">Referencia rechazada.</span>
          {rejectionNote && <span className="ml-1 text-ink-secondary">{rejectionNote}</span>}
          <span className="ml-1">Actualiza los datos y vuelve a enviar.</span>
        </div>
      )}

      <div>
        <label className="mb-1 block text-[12px] font-600 text-ink-secondary">
          Nombre del arrendador anterior
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Juan Pérez"
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-[14px] text-ink placeholder:text-ink-muted/50 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-[12px] font-600 text-ink-secondary">
          Teléfono
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ej: 3001234567"
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-[14px] text-ink placeholder:text-ink-muted/50 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-[12px] font-600 text-ink-secondary">
          Dirección del arriendo anterior
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Ej: Cra 7 #45-23, Chapinero, Bogotá"
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-[14px] text-ink placeholder:text-ink-muted/50 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30"
          required
        />
      </div>

      {error && <p className="text-[12px] text-error">{error}</p>}

      <Button type="submit" variant="primary" size="sm" loading={saving}>
        Enviar referencia
      </Button>
    </form>
  );
}
