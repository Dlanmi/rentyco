import { createClient } from '@supabase/supabase-js';
import { WAITLIST_COUNT } from './waitlist';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface WaitlistEntry {
  tipo: 'inquilino' | 'arrendador';
  nombre: string;
  email: string;
  ciudad: string;
  arrienda_actualmente?: boolean;
  num_propiedades?: '1' | '2-5' | '6+';
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
}

export async function submitWaitlist(entry: WaitlistEntry): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    console.warn('Supabase not configured — form submission skipped');
    return { success: true };
  }

  const { error } = await supabase.from('waitlist').insert(entry);

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'Este email ya está en la lista de espera.' };
    }
    return { success: false, error: 'Hubo un error. Intenta de nuevo.' };
  }

  return { success: true };
}

export async function getWaitlistCount(): Promise<number> {
  if (!supabase) return WAITLIST_COUNT;

  const { data, error } = await supabase.rpc('waitlist_count');
  if (error) return WAITLIST_COUNT;
  return (data as number) || WAITLIST_COUNT;
}
