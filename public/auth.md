# auth.md

## Overview

Rentyco is a rental platform in Colombia that uses [Supabase Auth](https://supabase.com/auth) (OIDC-compatible) for user authentication.

## Authentication Methods

### Email OTP (Magic Link)
- Users sign in via a one-time password sent to their email address
- No password is stored or required
- Callback URL: `/auth/callback`

### Google OAuth 2.0
- Users can sign in with their Google account
- Uses OAuth 2.0 authorization code flow
- Callback URL: `/auth/callback`

## Discovery Endpoints

- **OpenID Connect**: `/.well-known/openid-configuration`
- **OAuth Protected Resource**: `/.well-known/oauth-protected-resource`

## Authorization Server

- **Issuer**: `https://aqnmdizerxmvtrpaxmio.supabase.co`
- **Authorization Endpoint**: `https://aqnmdizerxmvtrpaxmio.supabase.co/auth/v1/authorize`
- **Token Endpoint**: `https://aqnmdizerxmvtrpaxmio.supabase.co/auth/v1/token`
- **JWKS URI**: `https://aqnmdizerxmvtrpaxmio.supabase.co/auth/v1/.well-known/jwks.json`

## Protected Resources

The following routes require authentication:

| Path | Description | Required Role |
|------|-------------|---------------|
| `/cuenta/*` | User account portal (profile, favorites, messages, listings) | Authenticated user |
| `/admin/*` | Admin portal (listing moderation, verification audits) | Admin role |
| `/renty-score/formulario` | Renty Score assessment wizard | Authenticated user |

## Server Actions (Protected)

These server-side actions require an authenticated session:

- `createListing`, `updateListing`, `publishListing`, `deleteListing` — Listing management
- `toggleFavorite` — Save/unsave favorite listings
- `createInquiry`, `replyInquiry` — Messaging between tenants and landlords
- `calculateRentyScore`, `saveRentyScore` — Renty Score operations
- `updateProfile`, `updateRole` — Profile management
- `getPresignedUploadUrl` — File uploads via S3-compatible storage

## Public Endpoints (No Authentication Required)

- `POST /api/report` — Report suspicious or fraudulent listings (rate-limited)
- `GET /auth/callback` — OAuth/OTP callback handler
- `GET /auth/logout` — Sign out and redirect

## Contact

- Email: soporte@rentyco.app
- Security: security@rentyco.app
- Security Policy: `/.well-known/security.txt`
