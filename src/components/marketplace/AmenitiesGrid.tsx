import {
  Wifi, Dumbbell, Waves, ArrowUpDown, ShieldCheck, Flame, Monitor, Building,
  Warehouse, Fence, Sun, CookingPot, WashingMachine, Snowflake, Fuel, Shirt,
  PawPrint, TreePine, Trees, Bath, UtensilsCrossed, Zap, CheckCircle2,
} from 'lucide-react';
import { AMENITY_OPTIONS } from '@/types/domain';
import type { LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  wifi: Wifi,
  gym: Dumbbell,
  pool: Waves,
  elevator: ArrowUpDown,
  security: ShieldCheck,
  bbq: Flame,
  coworking: Monitor,
  rooftop: Building,
  storage: Warehouse,
  balcony: Fence,
  terrace: Sun,
  kitchen: CookingPot,
  laundry: WashingMachine,
  ac: Snowflake,
  gas: Fuel,
  closets: Shirt,
  pets: PawPrint,
  garden: TreePine,
  patio: Trees,
  private_bath: Bath,
  kitchen_access: UtensilsCrossed,
  utils_included: Zap,
};

export function AmenitiesGrid({ amenities }: { amenities: string[] }) {
  const labels = new Map(AMENITY_OPTIONS.map((a) => [a.value, a.label]));
  const items = amenities.map((a) => ({ key: a, label: labels.get(a as never) ?? a }));
  if (!items.length) return null;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((i) => {
        const IconComp = ICONS[i.key] ?? CheckCircle2;
        return (
          <div
            key={i.key}
            className="flex items-center gap-3.5 rounded-xl border border-border bg-white px-4 py-3.5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-lighter text-teal">
              <IconComp className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
            <span className="font-body text-[14px] leading-snug text-ink">{i.label}</span>
          </div>
        );
      })}
    </div>
  );
}
