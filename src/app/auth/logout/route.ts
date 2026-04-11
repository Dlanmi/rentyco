import { NextResponse, type NextRequest } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

async function handleLogout(request: NextRequest) {
  const supabase = await getServerSupabase();
  if (supabase) await supabase.auth.signOut();
  // 303 See Other forces the browser to follow with GET, even if the
  // original request was POST. Without this, Next.js defaults to 307
  // which preserves POST and crashes into 405 on the home page.
  return NextResponse.redirect(new URL('/', request.url), { status: 303 });
}

export const GET = handleLogout;
export const POST = handleLogout;
