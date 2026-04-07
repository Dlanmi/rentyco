import 'server-only';
import { getServerSupabase } from '@/lib/supabase/server';
import type { Inquiry } from '@/types/domain';

type DbInquiry = {
  id: string;
  listing_id: string;
  user_id: string;
  message: string;
  contact_phone: string | null;
  status: Inquiry['status'];
  created_at: string;
  updated_at: string;
};

function map(r: DbInquiry): Inquiry {
  return {
    id: r.id,
    listingId: r.listing_id,
    userId: r.user_id,
    message: r.message,
    contactPhone: r.contact_phone,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function listInquiriesForUser(userId: string): Promise<Inquiry[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('inquiries')
    .select('id, listing_id, user_id, message, contact_phone, status, created_at, updated_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return ((data ?? []) as DbInquiry[]).map(map);
}

export interface SenderProfile {
  fullName: string | null;
  avatarUrl: string | null;
  verified: boolean;
  rentyScore: number | null;
  rentyScoreColor: 'verde' | 'amarillo' | 'naranja' | 'rojo' | null;
  rentyScoreDate: string | null;
  memberSince: string;
}

export interface InquiryWithListing extends Inquiry {
  listing: {
    id: string;
    title: string;
    slug: string;
    citySlug: string;
    thumbnailUrl: string | null;
    priceCop: number;
    neighborhood: string | null;
  };
  senderName?: string | null;
  senderProfile?: SenderProfile | null;
}

export async function listInquiriesWithListingsForUser(userId: string): Promise<InquiryWithListing[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  // Use LEFT join (no !inner) so tenants can still see inquiries on soft-deleted listings
  const { data } = await supabase
    .from('inquiries')
    .select(
      `id, listing_id, user_id, message, contact_phone, status, created_at, updated_at,
       listings(id, title, slug, price_cop,
         cities(slug),
         neighborhoods(name),
         listing_images(r2_key, display_order))`
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  const { publicUrlFor } = await import('@/lib/r2/client');
  type Row = DbInquiry & {
    listings: {
      id: string; title: string; slug: string; price_cop: number;
      cities: { slug: string } | { slug: string }[];
      neighborhoods: { name: string } | { name: string }[] | null;
      listing_images: Array<{ r2_key: string; display_order: number }>;
    } | {
      id: string; title: string; slug: string; price_cop: number;
      cities: { slug: string } | { slug: string }[];
      neighborhoods: { name: string } | { name: string }[] | null;
      listing_images: Array<{ r2_key: string; display_order: number }>;
    }[];
  };
  return ((data ?? []) as Row[]).map((r) => {
    const l = Array.isArray(r.listings) ? r.listings[0] : r.listings;
    const c = l && (Array.isArray(l.cities) ? l.cities[0] : l.cities);
    const h = l && (Array.isArray(l.neighborhoods) ? l.neighborhoods?.[0] : l.neighborhoods);
    const img = l && (l.listing_images ?? []).slice().sort((a, b) => a.display_order - b.display_order)[0];
    return {
      ...map(r),
      listing: {
        id: l?.id ?? '',
        title: l?.title ?? '',
        slug: l?.slug ?? '',
        citySlug: c?.slug ?? 'bogota',
        thumbnailUrl: img ? publicUrlFor(img.r2_key) : null,
        priceCop: l?.price_cop ?? 0,
        neighborhood: h?.name ?? null,
      },
    };
  });
}

export async function listInquiriesWithListingsForOwner(ownerId: string): Promise<InquiryWithListing[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('inquiries')
    .select(
      `id, listing_id, user_id, message, contact_phone, status, created_at, updated_at,
       listings!inner(id, title, slug, price_cop, owner_id,
         cities!inner(slug),
         neighborhoods(name),
         listing_images(r2_key, display_order)),
       profiles!inquiries_user_id_fkey(full_name, avatar_url, verified, renty_score, renty_score_color, renty_score_date, created_at)`
    )
    .eq('listings.owner_id', ownerId)
    .order('created_at', { ascending: false });
  const { publicUrlFor } = await import('@/lib/r2/client');
  type Row = DbInquiry & {
    listings: {
      id: string; title: string; slug: string; price_cop: number;
      cities: { slug: string } | { slug: string }[];
      neighborhoods: { name: string } | { name: string }[] | null;
      listing_images: Array<{ r2_key: string; display_order: number }>;
    } | {
      id: string; title: string; slug: string; price_cop: number;
      cities: { slug: string } | { slug: string }[];
      neighborhoods: { name: string } | { name: string }[] | null;
      listing_images: Array<{ r2_key: string; display_order: number }>;
    }[];
    profiles: {
      full_name: string | null;
      avatar_url: string | null;
      verified: boolean;
      renty_score: number | null;
      renty_score_color: string | null;
      renty_score_date: string | null;
      created_at: string;
    } | {
      full_name: string | null;
      avatar_url: string | null;
      verified: boolean;
      renty_score: number | null;
      renty_score_color: string | null;
      renty_score_date: string | null;
      created_at: string;
    }[] | null;
  };
  return ((data ?? []) as Row[]).map((r) => {
    const l = Array.isArray(r.listings) ? r.listings[0] : r.listings;
    const c = l && (Array.isArray(l.cities) ? l.cities[0] : l.cities);
    const h = l && (Array.isArray(l.neighborhoods) ? l.neighborhoods?.[0] : l.neighborhoods);
    const img = l && (l.listing_images ?? []).slice().sort((a, b) => a.display_order - b.display_order)[0];
    const sender = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
    return {
      ...map(r),
      senderName: sender?.full_name ?? null,
      senderProfile: sender ? {
        fullName: sender.full_name,
        avatarUrl: sender.avatar_url,
        verified: sender.verified ?? false,
        rentyScore: sender.renty_score,
        rentyScoreColor: sender.renty_score_color as SenderProfile['rentyScoreColor'],
        rentyScoreDate: sender.renty_score_date,
        memberSince: sender.created_at,
      } : null,
      listing: {
        id: l?.id ?? '',
        title: l?.title ?? '',
        slug: l?.slug ?? '',
        citySlug: c?.slug ?? 'bogota',
        thumbnailUrl: img ? publicUrlFor(img.r2_key) : null,
        priceCop: l?.price_cop ?? 0,
        neighborhood: h?.name ?? null,
      },
    };
  });
}

export async function listInquiriesForOwner(ownerId: string): Promise<Inquiry[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('inquiries')
    .select('id, listing_id, user_id, message, contact_phone, status, created_at, updated_at, listings!inner(owner_id)')
    .eq('listings.owner_id', ownerId)
    .order('created_at', { ascending: false });
  return ((data ?? []) as DbInquiry[]).map(map);
}
