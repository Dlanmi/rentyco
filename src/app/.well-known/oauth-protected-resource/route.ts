import { NextResponse } from 'next/server';

/**
 * RFC 9728 — OAuth Protected Resource Metadata.
 * Tells agents which authorization server issues tokens for Rentyco's protected APIs.
 */
export function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aqnmdizerxmvtrpaxmio.supabase.co';

  const metadata = {
    resource: 'https://rentyco.app',
    authorization_servers: [supabaseUrl],
    scopes_supported: ['openid', 'email', 'profile'],
    bearer_methods_supported: ['header'],
  };

  return NextResponse.json(metadata, {
    headers: { 'Cache-Control': 'public, max-age=86400' },
  });
}
