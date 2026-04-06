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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
      {items.map((i) => {
        const IconComp = ICONS[i.key] ?? CheckCircle2;
        return (
          <div key={i.key} className="flex items-center gap-2.5 rounded-xl border border-border bg-white px-4 py-3">
            <span className="flex h-5 w-5 shrink-0 text-teal">
              <IconComp className="h-5 w-5" />
            </span>
            <span className="font-body text-[14px] text-ink">{i.label}</span>
          </div>
        );
      })}
    </div>
  );
}
