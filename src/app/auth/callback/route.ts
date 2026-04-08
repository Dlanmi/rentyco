import { NextResponse, type NextRequest } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { sanitizeRedirectPath } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = sanitizeRedirectPath(searchParams.get('next'));

  if (code) {
    const supabase = await getServerSupabase();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // Sync Google avatar to profiles if missing
        const { data: { user } } = await supabase.auth.getUser();
        let redirectPath = next;
        if (user) {
          const avatarUrl =
            user.user_metadata?.avatar_url ??
            user.user_metadata?.picture ??
            null;
          const fullName =
            user.user_metadata?.full_name ??
            user.user_metadata?.name ??
            null;

          // Upsert profile data from provider
          const patch: Record<string, string> = {};
          if (avatarUrl) patch.avatar_url = avatarUrl;
          if (fullName) patch.full_name = fullName;
          if (Object.keys(patch).length > 0) {
            await supabase
              .from('profiles')
              .update(patch)
              .eq('id', user.id);
          }

          // Check if new user (role still default 'tenant' and no explicit choice yet)
          // Redirect to onboarding if this is their first login
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, updated_at, created_at')
            .eq('id', user.id)
            .maybeSingle();
          if (profile) {
            // If profile was just created (within last 30s), go to onboarding
            const created = new Date(profile.created_at).getTime();
            const now = Date.now();
            if (now - created < 30_000 && profile.role === 'tenant') {
              redirectPath = `/bienvenido?next=${encodeURIComponent(next)}`;
            }
          }
        }
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/entrar?error=auth`);
}
