import { NextResponse } from 'next/server';

/**
 * OpenID Connect Discovery — proxies metadata for Supabase Auth.
 * Serves /.well-known/openid-configuration so AI agents can discover
 * how to authenticate with Rentyco's APIs.
 */
export function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aqnmdizerxmvtrpaxmio.supabase.co';

  const config = {
    issuer: 'https://rentyco.app',
    authorization_endpoint: `${supabaseUrl}/auth/v1/authorize`,
    token_endpoint: `${supabaseUrl}/auth/v1/token`,
    userinfo_endpoint: `${supabaseUrl}/auth/v1/user`,
    jwks_uri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
    grant_types_supported: ['authorization_code'],
    response_types_supported: ['code'],
    scopes_supported: ['openid', 'email', 'profile'],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256'],
  };

  return NextResponse.json(config, {
    headers: { 'Cache-Control': 'public, max-age=86400' },
  });
}
