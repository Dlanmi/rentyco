'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getBrowserSupabase } from '@/lib/supabase/browser';
import { Avatar } from '@/components/ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

interface MiniProfile {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  role: 'tenant' | 'landlord' | 'admin';
}

const ROLE_LABEL: Record<string, string> = {
  tenant: 'Inquilino',
  landlord: 'Arrendador',
  admin: 'Administrador',
};

export function AuthAvatar() {
  const router = useRouter();
  const [profile, setProfile] = useState<MiniProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    let supabase: ReturnType<typeof getBrowserSupabase> | null = null;
    try {
      supabase = getBrowserSupabase();
    } catch {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        // getSession() reads from local storage — instant, no network.
        // Only call getUser() (network) if there's a session.
        const { data: { session } } = await supabase!.auth.getSession();
        if (cancel) return;
        if (!session?.user) {
          setProfile(null);
          return;
        }
        const user = session.user;
        const { data } = await supabase!
          .from('profiles')
          .select('id, full_name, avatar_url, role')
          .eq('id', user.id)
          .maybeSingle();
        if (cancel) return;
        setProfile({
          id: user.id,
          email: user.email ?? null,
          fullName: data?.full_name ?? user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
          avatarUrl:
            data?.avatar_url ??
            user.user_metadata?.avatar_url ??
            user.user_metadata?.picture ??
            null,
          role: data?.role ?? 'tenant',
        });
      } catch (e) {
        console.error('[AuthAvatar] failed to load profile:', e);
        if (!cancel) setProfile(null);
      } finally {
        if (!cancel) setLoading(false);
      }
    };
    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setProfile(null);
        setLoading(false);
      } else {
        load();
      }
    });
    return () => { cancel = true; sub.subscription.unsubscribe(); };
  }, []);

  async function handleLogout() {
    const supabase = getBrowserSupabase();
    await supabase.auth.signOut();
    setProfile(null);
    router.push('/');
    router.refresh();
  }

  if (loading) return <div className="h-9 w-9 rounded-full bg-sand-dark animate-pulse" />;

  if (!profile) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/entrar"
          className="rounded-[10px] px-4 py-2 font-heading text-[13px] font-500 text-ink-secondary no-underline transition-colors hover:text-ink"
        >
          Entrar
        </Link>
        <Link
          href="/entrar"
          className="hidden rounded-[10px] border border-ink bg-ink px-4 py-2 font-heading text-[13px] font-600 text-white no-underline transition-all hover:-translate-y-px hover:bg-ink-secondary hover:shadow-lg sm:inline-block"
        >
          Crear cuenta
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex items-center gap-2 rounded-full p-0.5 outline-none transition-all hover:bg-sand-dark/60 focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2">
        <Avatar src={profile.avatarUrl} name={profile.fullName ?? profile.email} size={38} className="ring-2 ring-white shadow-sm" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-70 p-0 overflow-hidden">
        {/* Header con foto + info */}
        <div className="flex items-center gap-3 border-b border-border bg-sand/50 px-4 py-3.5">
          <Avatar src={profile.avatarUrl} name={profile.fullName ?? profile.email} size={44} className="ring-2 ring-white shadow-sm shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="truncate font-heading text-[14px] font-600 text-ink">
              {profile.fullName ?? 'Sin nombre'}
            </div>
            <div className="truncate font-mono text-[11px] text-ink-muted">
              {profile.email}
            </div>
            <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-teal-lighter px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-teal-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" />
              {ROLE_LABEL[profile.role] ?? profile.role}
            </span>
          </div>
        </div>

        <div className="p-1.5">
          <DropdownMenuItem asChild>
            <Link href="/cuenta" className="no-underline gap-3">
              <MenuIcon d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 110 8 4 4 0 010-8z" />
              Mi cuenta
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/cuenta/favoritos" className="no-underline gap-3">
              <MenuIcon d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              Favoritos
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/cuenta/mensajes" className="no-underline gap-3">
              <MenuIcon d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              Mensajes
            </Link>
          </DropdownMenuItem>

          {(profile.role === 'landlord' || profile.role === 'admin') && (
            <>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem asChild>
                <Link href="/cuenta/publicaciones" className="no-underline gap-3">
                  <MenuIcon d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  Mis arriendos
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/cuenta/publicaciones/nuevo" className="no-underline gap-3 font-600 text-teal-dark">
                  <MenuIcon d="M12 5v14M5 12h14" className="text-teal" />
                  Publicar arriendo
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {profile.role === 'admin' && (
            <>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem asChild>
                <Link href="/admin" className="no-underline gap-3">
                  <MenuIcon d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" className="text-coral" />
                  <span className="font-600 text-ink">Panel admin</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem asChild>
            <Link href="/cuenta/perfil" className="no-underline gap-3 text-ink-muted">
              <MenuIcon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z M12 15a3 3 0 100-6 3 3 0 000 6z" />
              Configuración
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={handleLogout}
            className="gap-3 text-red-600 focus:bg-red-50 focus:text-red-700"
          >
            <MenuIcon d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" className="text-red-400" />
            Cerrar sesión
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MenuIcon({ d, className }: { d: string; className?: string }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 ${className ?? 'text-ink-muted'}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d={d} />
    </svg>
  );
}
