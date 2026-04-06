# Renty

**El arriendo sin barreras.** Plataforma de arriendos para Colombia que reemplaza el codeudor con un sistema de scoring alternativo basado en historial real de pago.

## Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Base de datos:** Supabase (PostgreSQL + Auth)
- **Almacenamiento:** Cloudflare R2
- **Estilos:** Tailwind CSS v4
- **Animaciones:** GSAP 3
- **Testing:** Vitest

## Desarrollo

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Iniciar servidor de desarrollo
npm run dev
```

El servidor corre en `http://localhost:3000`.

## Comandos

| Comando | Uso |
|---------|-----|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm run typecheck` | Verificar tipos (tsc) |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (una vez) |
| `npm run test:watch` | Vitest (watch) |

## Estructura

```
src/
  app/           # Rutas (App Router)
  components/    # Componentes React
    ui/          # Primitivos (Button, Dialog, Sheet...)
    sections/    # Secciones del landing
    marketplace/ # Listados, filtros, galeria
    renty-score/ # Wizard del Renty Score
    layout/      # Navbar, Footer, GSAP globals
    admin/       # Panel de administracion
    account/     # Dashboard de usuario
  lib/           # Utilidades y logica
    db/          # Repositorios (queries)
    supabase/    # Clientes Supabase (server, browser, build)
    renty-score/ # Logica del scoring (preguntas, calculo, tipos)
    r2/          # Cloudflare R2 (presigned uploads)
  app/actions/   # Server Actions (mutaciones)
supabase/
  migrations/    # Migraciones SQL
content/
  blog/          # Posts en Markdown
```

## Renty Score

Sistema de scoring alternativo (0-1000 pts) que evalua inquilinos en 4 modulos:

- **A. Historial de arriendo** (350 pts) — experiencia, puntualidad, referencias
- **B. Capacidad de pago** (300 pts) — ratio arriendo/ingreso, fuentes de ingreso
- **C. Estabilidad** (200 pts) — mudanzas, comportamiento, bancarizacion
- **D. Senales digitales** (150 pts) — referidos, reportes crediticios, ocupantes

Los scores se guardan en `renty_scores` (historial completo) y se sincronizan automaticamente a `profiles` via trigger de PostgreSQL.

## Base de datos

Migraciones en `supabase/migrations/`. Tablas principales:

- `profiles` — Usuarios (incluye renty_score, renty_score_color)
- `listings` / `listing_images` — Inmuebles publicados
- `cities` / `neighborhoods` — Ciudades y barrios
- `favorites` / `inquiries` — Favoritos y mensajes
- `renty_scores` — Historial completo de scores
- `waitlist` — Lista de espera (legacy)

## Despliegue

Desplegado en Vercel. Push a `main` dispara deploy automatico.

## Licencia

Privado. Todos los derechos reservados.
