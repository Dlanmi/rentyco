'use client';

import { useState, useTransition, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, FieldLabel, FieldError } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Chip } from '@/components/ui/Chip';
import { getAmenitiesForType } from '@/types/domain';
import { createListing, updateListing, publishListing, archiveListing, searchLandlords } from '@/app/actions/listings';
import type { Neighborhood, PropertyType } from '@/types/domain';

const PROPERTY_TYPES: { value: PropertyType; label: string; emoji: string; desc: string }[] = [
  { value: 'apartamento',   label: 'Apartamento',   emoji: '🏢', desc: 'Unidad en edificio' },
  { value: 'casa',          label: 'Casa',           emoji: '🏠', desc: 'Vivienda independiente' },
  { value: 'apartaestudio', label: 'Apartaestudio',  emoji: '🏙️', desc: 'Espacio compacto todo-en-uno' },
  { value: 'habitacion',    label: 'Habitación',     emoji: '🛏️', desc: 'Cuarto en vivienda compartida' },
  { value: 'estudio',       label: 'Estudio',        emoji: '📐', desc: 'Espacio abierto sin divisiones' },
];

export interface ListingFormInitial {
  id?: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  citySlug: string;
  neighborhoodSlug: string | null;
  priceCop: number;
  adminFeeCop: number | null;
  depositCop: number | null;
  bedrooms: number;
  bathrooms: number;
  areaM2: number;
  floor: number | null;
  parking: number;
  isFurnished: boolean;
  amenities: string[];
  rules: string | null;
  lat: number | null;
  lng: number | null;
  estrato: number | null;
  antiguedad: number | null;
  status?: string;
}

const EMPTY: ListingFormInitial = {
  title: '', description: '', propertyType: 'apartamento', citySlug: 'bogota',
  neighborhoodSlug: null, priceCop: 0, adminFeeCop: null, depositCop: null,
  bedrooms: 1, bathrooms: 1, areaM2: 40, floor: null, parking: 0,
  isFurnished: false, amenities: [], rules: null, lat: null, lng: null,
  estrato: null, antiguedad: null,
};

// Fields that are relevant per type
const SHOW_BEDROOMS: PropertyType[] = ['apartamento', 'casa'];
const SHOW_FLOOR: PropertyType[] = ['apartamento', 'apartaestudio', 'estudio'];
const SHOW_PARKING: PropertyType[] = ['apartamento', 'casa', 'apartaestudio'];
const SHOW_ADMIN_FEE: PropertyType[] = ['apartamento', 'apartaestudio', 'estudio'];
const SHOW_DEPOSIT: PropertyType[] = ['apartamento', 'casa', 'apartaestudio', 'estudio'];

export function ListingForm({
  initial,
  neighborhoods,
  mode,
  isAdmin,
  currentOwnerId,
  currentOwnerName,
}: {
  initial?: ListingFormInitial;
  neighborhoods: Neighborhood[];
  mode: 'create' | 'edit';
  isAdmin?: boolean;
  currentOwnerId?: string;
  currentOwnerName?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ListingFormInitial>(initial ?? EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  // Admin owner selector state
  const [ownerQuery, setOwnerQuery] = useState('');
  const [ownerResults, setOwnerResults] = useState<{ id: string; fullName: string | null; role: string }[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<{ id: string; name: string } | null>(
    currentOwnerId ? { id: currentOwnerId, name: currentOwnerName ?? '' } : null
  );
  const [ownerDropdownOpen, setOwnerDropdownOpen] = useState(false);
  const ownerDebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleOwnerSearch = useCallback((q: string) => {
    setOwnerQuery(q);
    setOwnerDropdownOpen(true);
    clearTimeout(ownerDebounceRef.current);
    if (q.length < 2) { setOwnerResults([]); return; }
    ownerDebounceRef.current = setTimeout(async () => {
      const res = await searchLandlords(q);
      if (res.ok) setOwnerResults(res.data);
    }, 300);
  }, []);

  const type = form.propertyType;
  const amenities = getAmenitiesForType(type);

  // Group amenities by group
  const groupedAmenities = amenities.reduce<Record<string, typeof amenities>>((acc, a) => {
    (acc[a.group] ??= []).push(a);
    return acc;
  }, {});

  const GROUP_LABELS: Record<string, string> = {
    edificio: 'Edificio / Conjunto',
    interior: 'Interior',
    servicios: 'Servicios',
    exterior: 'Exterior',
    habitacion: 'Habitación',
  };

  function setField<K extends keyof ListingFormInitial>(key: K, value: ListingFormInitial[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAmenity(key: string) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(key)
        ? prev.amenities.filter((a) => a !== key)
        : [...prev.amenities, key],
    }));
  }

  function onTypeChange(newType: PropertyType) {
    setForm((prev) => ({
      ...prev,
      propertyType: newType,
      // Reset fields not relevant for new type
      bedrooms: SHOW_BEDROOMS.includes(newType) ? prev.bedrooms : (newType === 'habitacion' ? 1 : 0),
      floor: SHOW_FLOOR.includes(newType) ? prev.floor : null,
      parking: SHOW_PARKING.includes(newType) ? prev.parking : 0,
      adminFeeCop: SHOW_ADMIN_FEE.includes(newType) ? prev.adminFeeCop : null,
      // Filter out amenities not valid for new type
      amenities: prev.amenities.filter((a) =>
        getAmenitiesForType(newType).some((opt) => opt.value === a)
      ),
    }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = {
      ...(mode === 'edit' && initial?.id ? { id: initial.id } : {}),
      title: form.title, description: form.description, propertyType: form.propertyType,
      citySlug: form.citySlug, neighborhoodSlug: form.neighborhoodSlug,
      priceCop: Number(form.priceCop), adminFeeCop: form.adminFeeCop != null ? Number(form.adminFeeCop) : null,
      depositCop: form.depositCop != null ? Number(form.depositCop) : null,
      bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms), areaM2: Number(form.areaM2),
      floor: form.floor != null ? Number(form.floor) : null, parking: Number(form.parking),
      isFurnished: form.isFurnished, amenities: form.amenities,
      rules: form.rules || null, lat: form.lat != null ? Number(form.lat) : null,
      lng: form.lng != null ? Number(form.lng) : null,
      estrato: form.estrato, antiguedad: form.antiguedad,
      ownerId: selectedOwner?.id ?? null,
    };
    start(async () => {
      if (mode === 'create') {
        const res = await createListing(payload);
        if (res.ok) { toast.success('Borrador creado'); router.push(isAdmin ? `/admin/listings/${res.data.id}/editar` : `/cuenta/publicaciones/${res.data.id}/editar`); }
        else setError(res.message);
      } else {
        const res = await updateListing(payload);
        if (res.ok) toast.success('Cambios guardados');
        else setError(res.message);
      }
    });
  }

  function handlePublish() {
    if (!initial?.id) return;
    start(async () => {
      const res = await publishListing(initial.id!);
      if (res.ok) { toast.success('Arriendo publicado'); router.refresh(); }
      else toast.error(res.message);
    });
  }

  function handleArchive() {
    if (!initial?.id || !confirm('¿Archivar este arriendo?')) return;
    start(async () => {
      const res = await archiveListing(initial.id!);
      if (res.ok) { toast.success('Archivado'); router.refresh(); }
      else toast.error(res.message);
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {/* 1 — Tipo de inmueble */}
      <Section title="¿Qué vas a arrendar?" number="1">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {PROPERTY_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => onTypeChange(t.value)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center transition-all ${
                type === t.value
                  ? 'border-teal bg-teal/5 shadow-sm'
                  : 'border-border bg-white hover:border-ink/15'
              }`}
            >
              <span className="text-[24px]">{t.emoji}</span>
              <span className={`font-heading text-[13px] ${type === t.value ? 'font-700 text-teal-dark' : 'font-500 text-ink'}`}>
                {t.label}
              </span>
              <span className="font-mono text-[10px] text-ink-muted">{t.desc}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Admin: Owner selector */}
      {isAdmin && (
        <Section title="Arrendador" number="★">
          <div className="relative">
            <FieldLabel>Asignar propietario</FieldLabel>
            {selectedOwner ? (
              <div className="flex items-center gap-3 rounded-xl border border-teal/30 bg-teal/5 px-4 py-3">
                <div className="flex-1">
                  <span className="font-heading text-[14px] font-600 text-ink">{selectedOwner.name || 'Sin nombre'}</span>
                  <span className="ml-2 font-mono text-[11px] text-ink-muted">{selectedOwner.id.slice(0, 8)}…</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedOwner(null); setOwnerQuery(''); }}
                  className="font-mono text-[11px] text-coral hover:underline"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <>
                <Input
                  placeholder="Buscar por nombre…"
                  value={ownerQuery}
                  onChange={(e) => handleOwnerSearch(e.target.value)}
                  onFocus={() => ownerQuery.length >= 2 && setOwnerDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setOwnerDropdownOpen(false), 200)}
                />
                {ownerDropdownOpen && ownerResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-xl border border-border bg-white shadow-lg">
                    {ownerResults.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-sand"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSelectedOwner({ id: p.id, name: p.fullName ?? '' });
                          setOwnerDropdownOpen(false);
                          setOwnerQuery('');
                        }}
                      >
                        <span className="font-heading text-[13px] text-ink">{p.fullName || 'Sin nombre'}</span>
                        <span className={`ml-auto rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${
                          p.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-teal/10 text-teal-dark'
                        }`}>
                          {p.role}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
            <p className="mt-2 font-mono text-[11px] text-ink-muted">
              Si no seleccionas nadie, se asigna a tu cuenta.
            </p>
          </div>
        </Section>
      )}

      {/* 2 — Información */}
      <Section title="Información principal" number="2">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="title" required>Título del anuncio</FieldLabel>
            <Input
              id="title" required minLength={8} maxLength={140}
              value={form.title} onChange={(e) => setField('title', e.target.value)}
              placeholder={
                type === 'habitacion' ? 'Habitación privada en Chapinero con balcón'
                : type === 'casa' ? 'Casa de 3 pisos con jardín en Usaquén'
                : 'Apartamento moderno con vista al parque'
              }
            />
          </div>
          <div>
            <FieldLabel htmlFor="zona">Barrio</FieldLabel>
            <select
              id="zona"
              value={form.neighborhoodSlug ?? ''}
              onChange={(e) => setField('neighborhoodSlug', e.target.value || null)}
              className="h-11 w-full rounded-xl border border-border bg-white px-4 font-body text-[15px] text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
            >
              <option value="">Selecciona barrio</option>
              {neighborhoods.map((n) => (
                <option key={n.id} value={n.slug}>{n.name}</option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="estrato">Estrato</FieldLabel>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setField('estrato', form.estrato === n ? null : n)}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 font-heading text-[15px] font-600 transition-all ${
                    form.estrato === n
                      ? 'border-teal bg-teal text-white'
                      : 'border-border bg-white text-ink-secondary hover:border-ink/20'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="desc" required hint={`${form.description.length}/5000`}>Descripción</FieldLabel>
            <Textarea
              id="desc" required rows={5} minLength={40} maxLength={5000}
              value={form.description} onChange={(e) => setField('description', e.target.value)}
              placeholder={
                type === 'habitacion' ? 'Describe la habitación, la casa, los compañeros de vivienda y las reglas…'
                : 'Describe el inmueble, la zona y lo que lo hace especial…'
              }
            />
          </div>
        </div>
      </Section>

      {/* 3 — Características */}
      <Section title="Características" number="3">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SHOW_BEDROOMS.includes(type) && (
            <NumField label="Habitaciones" value={form.bedrooms} onChange={(v) => setField('bedrooms', v)} min={1} max={20} />
          )}
          <NumField label="Baños" value={form.bathrooms} onChange={(v) => setField('bathrooms', v)} min={1} max={20} />
          <NumField label="Área (m²)" value={form.areaM2} onChange={(v) => setField('areaM2', v)} min={10} max={2000} />
          {SHOW_FLOOR.includes(type) && (
            <NumField label="Piso" value={form.floor ?? 0} onChange={(v) => setField('floor', v)} min={-5} max={150} />
          )}
          {SHOW_PARKING.includes(type) && (
            <NumField label="Parqueaderos" value={form.parking} onChange={(v) => setField('parking', v)} min={0} max={10} />
          )}
          <NumField label="Antigüedad (años)" value={form.antiguedad ?? 0} onChange={(v) => setField('antiguedad', v || null)} min={0} max={100} />
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-sand/50 px-4 py-3">
          <div>
            <div className="font-heading text-[14px] text-ink">
              {type === 'habitacion' ? 'Habitación amoblada' : 'Inmueble amoblado'}
            </div>
            <div className="font-mono text-[11px] text-ink-muted">
              {type === 'habitacion' ? 'La habitación incluye cama, escritorio, etc.' : 'Incluye muebles y electrodomésticos'}
            </div>
          </div>
          <Switch checked={form.isFurnished} onCheckedChange={(c) => setField('isFurnished', c)} />
        </div>

        {type === 'habitacion' && (
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/50 px-4 py-3">
            <div className="font-heading text-[13px] font-600 text-blue-800">Tip para habitaciones</div>
            <div className="mt-1 font-body text-[12px] text-blue-700">
              Menciona en la descripción: cuántas personas viven en la casa, reglas de convivencia, y qué espacios se comparten.
            </div>
          </div>
        )}
      </Section>

      {/* 4 — Amenidades (adaptive) */}
      <Section title="Amenidades y servicios" number="4">
        {Object.entries(groupedAmenities).map(([group, items]) => (
          <div key={group} className="mb-4 last:mb-0">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
              {GROUP_LABELS[group] ?? group}
            </div>
            <div className="flex flex-wrap gap-2">
              {items.map((a) => (
                <Chip key={a.value} active={form.amenities.includes(a.value)} onClick={() => toggleAmenity(a.value)} type="button">
                  {a.label}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </Section>

      {/* 5 — Precio */}
      <Section title="Precio y costos" number="5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <FieldLabel htmlFor="price" required>
              {type === 'habitacion' ? 'Arriendo mensual por habitación' : 'Arriendo mensual'} (COP)
            </FieldLabel>
            <Input
              id="price" type="number" required min={200000} max={100000000}
              value={form.priceCop || ''} onChange={(e) => setField('priceCop', e.target.value ? Number(e.target.value) : 0)}
              placeholder={type === 'habitacion' ? '600000' : '1500000'}
            />
          </div>
          {SHOW_ADMIN_FEE.includes(type) && (
            <div>
              <FieldLabel htmlFor="admin">Administración (COP)</FieldLabel>
              <Input
                id="admin" type="number" min={0}
                value={form.adminFeeCop ?? ''} onChange={(e) => setField('adminFeeCop', e.target.value ? Number(e.target.value) : null)}
              />
            </div>
          )}
          {SHOW_DEPOSIT.includes(type) && (
            <div>
              <FieldLabel htmlFor="deposit">Depósito (COP)</FieldLabel>
              <Input
                id="deposit" type="number" min={0}
                value={form.depositCop ?? ''} onChange={(e) => setField('depositCop', e.target.value ? Number(e.target.value) : null)}
              />
            </div>
          )}
        </div>
        {type === 'habitacion' && (
          <p className="mt-3 font-body text-[12px] text-ink-muted">
            Si los servicios (agua, luz, internet) están incluidos, márcalo en amenidades arriba.
          </p>
        )}
      </Section>

      {/* 6 — Ubicación */}
      <Section title="Ubicación aproximada" number="6">
        <p className="mb-3 font-body text-[13px] text-ink-muted">
          Solo mostramos un radio aproximado — nunca la dirección exacta.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="lat">Latitud</FieldLabel>
            <Input id="lat" type="number" step="0.000001" value={form.lat ?? ''} onChange={(e) => setField('lat', e.target.value ? Number(e.target.value) : null)} placeholder="4.6533" />
          </div>
          <div>
            <FieldLabel htmlFor="lng">Longitud</FieldLabel>
            <Input id="lng" type="number" step="0.000001" value={form.lng ?? ''} onChange={(e) => setField('lng', e.target.value ? Number(e.target.value) : null)} placeholder="-74.0836" />
          </div>
        </div>
      </Section>

      {/* 7 — Reglas */}
      <Section title={type === 'habitacion' ? 'Reglas de convivencia' : 'Reglas del inmueble'} number="7">
        <Textarea
          rows={3} maxLength={2000}
          value={form.rules ?? ''} onChange={(e) => setField('rules', e.target.value)}
          placeholder={
            type === 'habitacion'
              ? 'Horarios de silencio, visitas, limpieza de zonas comunes…'
              : 'No fumadores, no mascotas, horario de mudanza…'
          }
        />
      </Section>

      <FieldError>{error}</FieldError>

      {/* Sticky footer */}
      <div className="sticky bottom-0 -mx-6 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-white/95 px-6 py-4 backdrop-blur-sm lg:mx-0 lg:rounded-2xl lg:border lg:px-6">
        <div className="flex items-center gap-2">
          {mode === 'edit' && initial?.status && (
            <>
              <span className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">Estado:</span>
              <StatusPill status={initial.status} />
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {mode === 'edit' && initial?.status !== 'archived' && (
            <Button type="button" variant="ghost" size="md" onClick={handleArchive} disabled={pending}>
              Archivar
            </Button>
          )}
          <Button type="submit" variant="subtle" size="md" loading={pending}>
            {mode === 'create' ? 'Crear borrador' : 'Guardar'}
          </Button>
          {mode === 'edit' && initial?.status !== 'active' && (
            <Button type="button" variant="primary" size="md" onClick={handlePublish} disabled={pending}>
              Publicar
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

function Section({ title, number, children }: { title: string; number: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal font-mono text-[13px] font-700 text-white">
          {number}
        </span>
        <h2 className="font-display text-[20px] text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function NumField({ label, value, onChange, min, max }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <Input type="number" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    active: { label: 'Activo', cls: 'bg-green-100 text-green-800' },
    pending_review: { label: 'En revisión', cls: 'bg-amber-100 text-amber-800' },
    draft: { label: 'Borrador', cls: 'bg-sand-dark text-ink-secondary' },
    paused: { label: 'Pausado', cls: 'bg-sand-dark text-ink-secondary' },
    archived: { label: 'Archivado', cls: 'bg-red-100 text-red-800' },
  };
  const s = map[status] ?? { label: status, cls: 'bg-sand-dark text-ink-muted' };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide ${s.cls}`}>
      {s.label}
    </span>
  );
}
