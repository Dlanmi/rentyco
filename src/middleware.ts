import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refreshes Supabase auth cookies on every request and gates protected routes.
 * Gate: `/cuenta/*` and `/admin/*` require a logged-in user.
 * Role checks (admin) happen in the route's server layout to avoid a profiles
 * lookup in middleware (edge-runtime friendly).
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, still let requests through.
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session if expired — required for Server Components.
  // Must run on ALL routes because public pages (listing detail, marketplace)
  // also read auth state via getCurrentUser() for favorites, ownership, etc.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtected = pathname.startsWith('/cuenta') || pathname.startsWith('/admin');

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/entrar';
    loginUrl.searchParams.set('next', pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image (build assets)
     * - favicon.ico, og/*, robots.txt, sitemap.xml (public metadata)
     * - any file with an extension (static files)
     */
    '/((?!_next/static|_next/image|favicon.ico|og/|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};
