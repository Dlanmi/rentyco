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
- `/renty-score/formulario` — Interactive score wizard (12 questions, auth-aware, `?recalcular=1` for v2 upgrade)
- `/cuenta/mi-score` — Score detail view (version-aware: v1 shows upgrade banner, v2 shows trust factor + verification checklist)
- `/[city]/arriendos` — Marketplace listings grid (filters, sort, pagination)
- `/[city]/arriendos/[slug]` — Listing detail (gallery, map, landlord card)
- `/cuenta/*` — Authenticated user area (dashboard with score, favorites, messages)
- `/admin/*` — Admin dashboard (listings CRUD, `/admin/verificaciones` for verification review queue)
- `/blog/[slug]` — Blog posts (MDX from markdown)
- `/entrar` — Login (email OTP / Google)
- `/og/[slug]` — Dynamic OG image generation (`@vercel/og`)

### Data Flow

- **Server Actions** (`src/app/actions/`) — All mutations (auth, listings, uploads, favorites, inquiries, profile, renty-score). Validated with Zod.
- **Repository pattern** (`src/lib/db/`) — Database queries separated into repository files (`listings.repository.ts`, `profiles.repository.ts`, `cities.repository.ts`, `favorites.repository.ts`, `inquiries.repository.ts`, `renty-scores.repository.ts`, `verifications.repository.ts`).
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
- `types.ts` — TypeScript types (ScoreModule, BasicData, Answers, ScoreResult, ScoreColor, VerificationStatus)
- `questions.ts` — 4 modules (A-D), 12 questions, point values, penalties
- `calculate.ts` — `calculateScore(answers)` produces declared score + trust factor + final score
- `consistency.ts` — Cross-answer consistency checks with severity-weighted deductions
- `trust-factor.ts` — `calculateTrustFactor(verificationStatus, scoreDeclared)` — maps verified documents to a 0.5–1.0 multiplier

**Two-layer scoring model (v2):**
- `score_declared` = raw score from answers (0–950)
- `trust_factor` = verification multiplier (0.5 base, up to 1.0 with full verification)
- `score_total` = `score_declared × trust_factor` (what users and landlords see)
- Algorithm versioning: `'1.0'` (legacy) vs `'2.0'` (current)

**Verification system** (`src/components/renty-score/`):
- VerificationChecklist — 4-step checklist (income_proof, landlord_reference, identity, credit_consent)
- VerificationUpload — presigned R2 upload for documents
- LandlordReferenceForm — collects previous landlord contact info
- CreditConsentStep — consent for credit bureau check
- Admin reviews at `/admin/verificaciones` → approval recalculates trust factor via DB trigger

**Wizard flow:** The wizard (`src/components/renty-score/RentyScoreWizard.tsx`) is auth-aware:
- Guest: CTAs point to `/entrar` to create account
- Authenticated: CTAs point to marketplace or improvement tips based on score color
- `?recalcular=1` bypasses both page redirect and rate limit for v1→v2 upgrades
- Scores saved to `renty_scores` with `algorithm_version: '2.0'`; DB trigger syncs to `profiles`

### Components

- `src/components/ui/` — Reusable primitives (Button, Dialog, Sheet, Tabs, etc.)
- `src/components/sections/` — Landing page sections (Hero, Problem, Steps, etc.)
- `src/components/marketplace/` — Listing cards, filters, gallery, map, etc.
- `src/components/renty-score/` — Score wizard, verification checklist, upload, landlord reference form, credit consent, ScoreDetailView, ScoreGauge
- `src/components/layout/` — Navbar, Footer, global GSAP bindings
- `src/components/admin/` — Admin listing form, image uploader, VerificationReviewList, AdminSidebar (with verification badge)
- `src/components/account/` — Account dashboard sidebar, DashboardTabs

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

Migrations in `supabase/migrations/`. Key tables: `profiles` (includes renty_score + trust_factor fields), `listings`, `listing_images`, `cities`, `neighborhoods`, `favorites`, `inquiries`, `renty_scores`, `score_verifications`, `waitlist` (legacy).

**Key triggers:**
- `on_renty_score_insert` — fires on INSERT to `renty_scores`, syncs score/color/date/trust_factor to `profiles`
- `on_renty_score_update` — fires on UPDATE OF `score_total`, `trust_factor`, `resultado`, `verification_level` on `renty_scores`
- Both call `sync_renty_score_to_profile()` (SECURITY DEFINER)

**RLS patterns:**
- All `auth.uid()` calls wrapped in `(select auth.uid())` for per-query (not per-row) evaluation
- Admin + self policies consolidated into single policies with OR clause (migration 0018)
- Views use `security_invoker = true` (never SECURITY DEFINER on views)

## Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

## Brand Reference

See `BRAND_DECISIONS.md` for brand voice (Directo, Cercano, Empoderador, Honesto), target user persona, and design system details.

## gstack

Skills installed at `.claude/skills/gstack/`. Available slash commands:

| Command | Purpose |
|---------|---------|
| `/browse` | Headless browser for QA testing and site dogfooding |
| `/gstack` | Alias for `/browse` |
| `/open-gstack-browser` | Launch visible AI-controlled Chromium browser |
| `/qa` | QA test a web app and fix bugs found |
| `/qa-only` | Report-only QA testing (no fixes) |
| `/design-review` | Visual QA: spacing, hierarchy, AI slop detection — then fixes |
| `/design-shotgun` | Generate multiple AI design variants with comparison board |
| `/design-html` | Production-quality HTML/CSS from approved mockups |
| `/design-consultation` | Full design system proposal (aesthetic, typography, color, motion) |
| `/ui-ux-pro-max` | UI/UX design intelligence (67 styles, 96 palettes, 57 font pairings) |
| `/benchmark` | Performance regression detection (Core Web Vitals, page load) |
| `/canary` | Post-deploy canary monitoring (console errors, perf regressions) |
| `/health` | Code quality dashboard (type checker, linter, tests, dead code) |
| `/review` | Pre-landing PR review (SQL safety, trust boundaries, side effects) |
| `/ship` | Ship workflow: tests, review, bump version, changelog, create PR |
| `/land-and-deploy` | Merge PR, wait for CI, verify production health |
| `/investigate` | Systematic debugging with root cause investigation |
| `/cso` | Chief Security Officer mode: infrastructure-first security audit |
| `/plan-ceo-review` | CEO/founder-mode plan review |
| `/plan-eng-review` | Eng manager-mode plan review |
| `/plan-design-review` | Designer's eye plan review |
| `/plan-devex-review` | Developer experience plan review |
| `/autoplan` | Auto-review pipeline (CEO + design + eng + DX reviews sequentially) |
| `/office-hours` | YC Office Hours simulation |
| `/retro` | Weekly engineering retrospective |
| `/devex-review` | Live developer experience audit |
| `/document-release` | Post-ship documentation update |
| `/codex` | OpenAI Codex CLI wrapper (review, challenge, pair modes) |
| `/pair-agent` | Pair a remote AI agent with your browser |
| `/setup-browser-cookies` | Import cookies from real browser into headless session |
| `/setup-deploy` | Configure deployment settings |
| `/checkpoint` | Save/resume working state checkpoints |
| `/learn` | Manage project learnings across sessions |
| `/freeze` | Restrict edits to a specific directory |
| `/unfreeze` | Clear freeze boundary |
| `/guard` | Full safety mode (destructive warnings + directory scoping) |
| `/careful` | Safety guardrails for destructive commands |
| `/gstack-upgrade` | Upgrade gstack to latest version |

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health
