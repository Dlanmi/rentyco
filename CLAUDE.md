# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Renty is a rental marketplace for Colombia (Bogotá primary, multi-city). It features property listings with an alternative tenant scoring system (Renty Score). The platform serves tenants, landlords, and admins. All UI copy is in Spanish.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server on localhost:3000 |
| `npm run build` | Production build |
| `npm run lint` | ESLint (`next lint`) |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run test` | Run Vitest once |
| `npm run test:watch` | Vitest in watch mode |

Run a single test file: `npx vitest run tests/unit/some-file.test.ts`

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19 and TypeScript 5.7
- **Styling:** Tailwind CSS v4 via PostCSS — no CSS modules
- **UI primitives:** Radix UI (unstyled) — wrapped in `src/components/ui/`
- **Database & Auth:** Supabase (PostgreSQL + Auth with email OTP and Google OAuth)
- **File storage:** Cloudflare R2 (S3 API) — presigned uploads from client
- **Animations:** GSAP 3 — all animations respect `prefers-reduced-motion`
- **Validation:** Zod schemas in server actions
- **URL state:** `nuqs` for typed search params
- **Blog:** Markdown files in `content/blog/`, compiled with `next-mdx-remote`
- **Testing:** Vitest (unit tests in `tests/unit/`)
- **Icons:** Lucide React
- **Maps:** Leaflet + react-leaflet

## Architecture

### Routing (App Router)

All pages live under `src/app/`. Key routes:

- `/` — Landing page (composed of section components)
- `/renty-score` — Renty Score info page
- `/renty-score/formulario` — Interactive score wizard (12 questions, auth-aware)
- `/[city]/arriendos` — Marketplace listings grid (filters, sort, pagination)
- `/[city]/arriendos/[slug]` — Listing detail (gallery, map, landlord card)
- `/cuenta/*` — Authenticated user area (dashboard with score, favorites, messages)
- `/admin/*` — Admin dashboard (listings CRUD)
- `/blog/[slug]` — Blog posts (MDX from markdown)
- `/entrar` — Login (email OTP / Google)
- `/og/[slug]` — Dynamic OG image generation (`@vercel/og`)

### Data Flow

- **Server Actions** (`src/app/actions/`) — All mutations (auth, listings, uploads, favorites, inquiries, profile, renty-score). Validated with Zod.
- **Repository pattern** (`src/lib/db/`) — Database queries separated into repository files (`listings.repository.ts`, `profiles.repository.ts`, `cities.repository.ts`, `favorites.repository.ts`, `inquiries.repository.ts`).
- **No REST API routes** — uses Server Actions and Server Components for data fetching.

### Supabase Clients

Four client variants in `src/lib/supabase/`:

- `server.ts` — For RSC, Route Handlers, and Server Actions (reads cookies)
- `browser.ts` — Browser singleton (no SSR)
- `build.ts` — Build-time safe client (no cookies/auth)
- Middleware client — Created inline in `src/middleware.ts` to refresh auth cookies

### Auth

- `src/lib/auth.ts` — Helpers: `getCurrentUser()`, `requireUser()`, `requireAdmin()`, `requireOwner()`
- `src/middleware.ts` — Refreshes auth cookies on every request; gates `/cuenta/*` and `/admin/*`
- Roles: `tenant`, `landlord`, `admin`

### Image Upload Pipeline

1. Client calls server action → generates presigned R2 PUT URL
2. Client uploads directly to R2
3. Server extracts metadata (dimensions, blurhash via `sharp`)
4. Database stores `listing_images` row with R2 key, blurhash, dimensions

### Renty Score

The scoring system lives in `src/lib/renty-score/`:
- `types.ts` — TypeScript types (ScoreModule, BasicData, Answers, ScoreResult, ScoreColor)
- `questions.ts` — 4 modules (A-D), 12 questions, point values, penalties
- `calculate.ts` — `calculateScore(answers)` produces total + per-module scores + color

The wizard (`src/components/renty-score/`) is auth-aware:
- Guest: CTAs point to `/entrar` to create account
- Authenticated: CTAs point to marketplace or improvement tips based on score color
- Scores are saved to `renty_scores` table; a DB trigger auto-syncs to `profiles`

### Components

- `src/components/ui/` — Reusable primitives (Button, Dialog, Sheet, Tabs, etc.)
- `src/components/sections/` — Landing page sections (Hero, Problem, Steps, etc.)
- `src/components/marketplace/` — Listing cards, filters, gallery, map, etc.
- `src/components/renty-score/` — Score wizard (RentyScoreWizard, QuestionStep, ScoreResult, ScoreGauge)
- `src/components/layout/` — Navbar, Footer, global GSAP bindings
- `src/components/admin/` — Admin listing form, image uploader
- `src/components/account/` — Account dashboard sidebar

### Styling Conventions

- Use `cn()` from `src/lib/cn.ts` (clsx + tailwind-merge) to compose class names
- Design tokens defined as CSS custom properties in `src/app/globals.css` `:theme` block
- Brand colors: Deep Teal (`#0D6B58`), Warm Coral (`#E8634A`), Sand (`#FAF7F2`)
- Fonts: DM Sans (body), DM Serif Display (display headings)

### SEO

- `src/lib/seo.ts` — `buildMetadata()` for Next.js Metadata, `buildWebPageSchema()` / `buildArticleSchema()` for JSON-LD
- `src/lib/site.ts` — Site constants (URL, name, social links)

## Environment Variables

Public vars use `NEXT_PUBLIC_` prefix. Key vars (see `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase connection
- `NEXT_PUBLIC_SITE_URL` — Canonical site URL
- `R2_*` — Cloudflare R2 credentials (server-only)
- `NEXT_PUBLIC_CDN_BASE` — R2 public CDN URL

## Database

Migrations in `supabase/migrations/`. Key tables: `profiles` (includes renty_score fields), `listings`, `listing_images`, `cities`, `neighborhoods`, `favorites`, `inquiries`, `renty_scores`, `waitlist` (legacy).

A PostgreSQL trigger (`sync_renty_score_to_profile`) auto-updates `profiles.renty_score`, `profiles.renty_score_color`, and `profiles.renty_score_date` whenever a row is inserted into `renty_scores` with a `user_id`.

## Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

## Brand Reference

See `BRAND_DECISIONS.md` for brand voice (Directo, Cercano, Empoderador, Honesto), target user persona, and design system details.
