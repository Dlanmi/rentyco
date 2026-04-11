# Renty

**El arriendo sin barreras.** Marketplace de arriendos para Colombia (Bogotá primero, multi-ciudad) que reemplaza el codeudor con un sistema de scoring alternativo basado en historial real de pago.

Copy de producto en español. Tres roles: `tenant`, `landlord`, `admin`.

## Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5.7
- **UI:** Tailwind CSS v4 (via PostCSS, sin `tailwind.config.ts` — tokens en `@theme` de `globals.css`)
- **Primitivos:** Radix UI (sin estilos) envueltos en `src/components/ui/`
- **Iconos:** Lucide React
- **Base de datos y auth:** Supabase (Postgres + Auth email OTP + Google OAuth)
- **Storage:** Cloudflare R2 (S3 API, presigned uploads desde el cliente)
- **Animaciones:** GSAP 3 (todas respetan `prefers-reduced-motion`)
- **Validación:** Zod en Server Actions
- **URL state:** nuqs (typed search params)
- **Mapas:** Leaflet + react-leaflet
- **Blog:** Markdown en `content/blog/` compilado con `next-mdx-remote`
- **OG images:** `@vercel/og` dinámicas en `/og/[slug]`
- **Tests:** Vitest

## Desarrollo

```bash
npm install
cp .env.example .env.local   # llenar credenciales
npm run dev                  # http://localhost:3000
```

## Comandos

| Comando | Uso |
|---------|-----|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run typecheck` | Verificar tipos (`tsc --noEmit`) |
| `npm run lint` | ESLint (`eslint .`) |
| `npm run test` | Vitest (una vez) |
| `npm run test:watch` | Vitest (watch) |

Correr un solo archivo de test: `npx vitest run tests/unit/some-file.test.ts`

## Estructura

```
src/
  app/
    page.tsx                    # Landing
    [city]/arriendos/           # Marketplace + listing detail
    renty-score/                # Info + wizard (/formulario)
    cuenta/                     # Dashboard de usuario (perfil, mi-score, favoritos, mensajes)
    admin/                      # Panel (listings CRUD, /verificaciones, /usuarios)
    auth/                       # OAuth callback + logout
    blog/                       # Posts MDX
    og/[slug]                   # OG images dinámicas
    actions/                    # Server Actions (mutaciones, validadas con Zod)
  components/
    ui/                         # Primitivos (Button, Dialog, Sheet, Tabs)
    sections/                   # Secciones del landing
    marketplace/                # Cards, filtros, galería, mapa, ContactModal, StickyMobileCTA
    renty-score/                # Wizard, ScoreGauge, VerificationChecklist, uploads
    layout/                     # Navbar, Footer, GSAP globals
    admin/                      # ListingForm, ImageUploader, VerificationReviewList, AdminSidebar
    account/                    # Sidebar, DashboardTabs
  lib/
    auth.ts                     # getCurrentUser, requireUser, requireAdmin, requireOwner
    db/                         # Repositorios (listings, profiles, cities, favorites, inquiries, renty-scores, verifications)
    supabase/                   # Cuatro clientes: server, browser, build, middleware
    r2/                         # Presigned PUT + metadata extraction (sharp, blurhash)
    renty-score/                # questions, calculate, consistency, trust-factor, types
    seo.ts                      # buildMetadata + JSON-LD (WebPage, Article)
    cn.ts                       # clsx + extendTailwindMerge (enseñado sobre @theme custom)
  middleware.ts                 # Refresca auth cookies + gatea /cuenta/* y /admin/*
supabase/migrations/            # SQL migrations 001-0024
content/blog/                   # Posts en Markdown con frontmatter
tests/unit/                     # Vitest
```

## Renty Score v2

Sistema de scoring de dos capas que reemplaza el codeudor. Vive en `src/lib/renty-score/`.

**Modelo:**
- `score_declared` — puntaje crudo de 12 preguntas en 4 módulos (0–950)
- `trust_factor` — multiplicador 0.5 → 1.0 según documentos verificados
- `score_total = score_declared × trust_factor` — el número que ven usuarios y landlords

**Módulos de preguntas:**
- **A. Historial de arriendo** (350) — experiencia, puntualidad, referencias
- **B. Capacidad de pago** (300) — ratio arriendo/ingreso, fuentes de ingreso
- **C. Estabilidad** (200) — mudanzas, comportamiento, bancarización
- **D. Señales digitales** (150) — referidos, reportes crediticios, ocupantes

**Flujo del wizard** (`/renty-score/formulario`):
1. `BasicDataStep` — nombre, cédula, tipo, inmueble, canon, ingreso
2. Cuatro steps de módulos (A–D), 3 preguntas cada uno, auto-advance
3. `ScoreResult` — gauge animado, breakdown por módulo, trust factor, CTAs según auth
4. `?recalcular=1` bypasea el redirect de página y el rate limit (para upgrades v1→v2)

**Verificación** (post-score):
1. Usuario ve `VerificationChecklist` en `/cuenta/mi-score` con 4 pasos
2. Cada paso: subir documento o llenar formulario → server action upserta `score_verifications`
3. Admin revisa en `/admin/verificaciones` → aprobar o rechazar con notas
4. La aprobación dispara un trigger de Postgres que recalcula `trust_factor` y lo sincroniza a `profiles`

**Version awareness:** `ScoreDetailView` detecta `algorithm_version` y muestra banner de upgrade para v1 o checklist completo para v2.

## Autenticación

- Email OTP + Google OAuth (Supabase Auth)
- `src/middleware.ts` refresca cookies en cada request y bloquea `/cuenta/*` y `/admin/*` para guests
- Helpers en `src/lib/auth.ts`: `getCurrentUser()`, `requireUser()`, `requireAdmin()`, `requireOwner()`
- Clientes Supabase en `src/lib/supabase/`:
  - `server.ts` — RSC, Server Actions, Route Handlers (lee cookies)
  - `browser.ts` — singleton del cliente
  - `build.ts` — build-time safe (sin cookies)
  - Middleware client creado inline en `src/middleware.ts`

## Pipeline de imágenes

1. Cliente llama server action → genera presigned PUT de R2
2. Cliente sube directo a R2
3. Servidor extrae dimensiones y `blurhash` con `sharp`
4. Se inserta fila en `listing_images` con el R2 key

## Base de datos

Migraciones en `supabase/migrations/` (001 a 0024 actualmente).

**Tablas principales:**
- `profiles` — usuarios (incluye campos de renty_score + trust_factor)
- `listings` / `listing_images` — inmuebles
- `cities` / `neighborhoods`
- `favorites` / `inquiries`
- `renty_scores` — historial completo de scores
- `score_verifications` — estado por tipo de verificación
- `waitlist` — legacy

**Triggers clave:**
- `on_renty_score_insert` — sincroniza score/color/trust_factor a `profiles` al insertar
- `on_renty_score_update` — idem cuando cambian `score_total`, `trust_factor`, `resultado` o `verification_level`

**Patrones RLS:**
- Llamadas a `auth.uid()` envueltas en `(select auth.uid())` para evaluación por-query
- Políticas admin + self consolidadas en una sola con OR (migración 0018)
- Vistas usan `security_invoker = true` (nunca SECURITY DEFINER en views)

## Estilos

- `cn()` en `src/lib/cn.ts` compone clases (clsx + tailwind-merge extendido)
- **Importante:** `cn.ts` enseña a `tailwind-merge` sobre los custom utilities del `@theme` (`text-label`, `font-600`, `font-heading`). Sin esta configuración, `tailwind-merge` interpreta mal esas clases y las elimina silenciosamente. Al agregar nuevos tokens en `globals.css`, actualiza también los `classGroups` en `cn.ts`.
- Tokens en `src/app/globals.css` dentro de `@theme`
- Colores de marca: Deep Teal `#0D6B58`, Warm Coral `#E8634A`, Sand `#FAF7F2`
- Tipografías: DM Sans (body), DM Serif Display (display)

## SEO y compartibles

- `src/lib/seo.ts` — `buildMetadata()` para Next.js Metadata + `buildWebPageSchema()` / `buildArticleSchema()` para JSON-LD
- `src/lib/site.ts` — constantes del sitio
- `/og/[slug]` — OG images dinámicas con `@vercel/og`
- `src/app/sitemap.ts` + `src/app/robots.ts` — generados en build

## Variables de entorno

Variables públicas usan prefix `NEXT_PUBLIC_`. Ver `.env.example` para la lista completa. Claves:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `R2_*` (server-only)
- `NEXT_PUBLIC_CDN_BASE`

## Path alias

`@/*` mapea a `./src/*` (configurado en `tsconfig.json`).

## Marca

Ver `BRAND_DECISIONS.md` para voz (Directo, Cercano, Empoderador, Honesto), persona target y sistema de diseño.

## Despliegue

Desplegado en Vercel. Push a `main` dispara deploy automático.

## Licencia

Privado. Todos los derechos reservados.
