# UI primitives

Todos los patrones visuales recurrentes viven aquí. Si un pattern se repite **3+ veces**, se promueve a primitive. Si necesitas un estilo que no existe, añade una variant a un primitive existente antes de crear uno nuevo.

Tokens de color/radius/shadow → `src/app/globals.css`. Bridge JS (edge/OG/confetti) → `src/lib/tokens.ts`.

## Guía de decisión

### Pills, chips, badges — ¿cuál uso?

| Pattern | Primitive | Cuándo |
|---|---|---|
| Kicker pequeño mono sobre un `<h2>` | `<Eyebrow>` | Signature de marca Renty. Siempre antes de un heading. |
| Estado no-interactivo (etiqueta) | `<Pill>` | `verificado`, `nuevo`, tag de ciudad en hero/card |
| Estado semántico de listing | `<StatusPill>` | `active` / `pending` / `paused` / `draft` / `archived` / `error` |
| Categoría en blog / rol | `<Badge>` | Acepta `tone` semántico + `size` |
| Filtro interactivo (click) | `<Chip>` | Filter bar, amenidades, toggles |
| Filtro con ✕ para quitar | `<Chip removable>` | Active filter chips |

### Inputs y controles

| Pattern | Primitive |
|---|---|
| Text / email / password | `<Input>` |
| Número con +/- steppers | `<NumField>` |
| Grupo de opciones excluyentes (chips) | `<SegmentedControl>` |
| On/off | `<Switch>` |
| Rango | `<Slider>` |

### Contenedores

| Pattern | Primitive |
|---|---|
| Card plana de contenido | `<Card>` |
| Card con elevación | `<Card elevated>` |
| Card sobre canvas dark | `<Card dark>` |
| Card con radius-hero y padding extra | `<Card hero>` |
| Section numerada de form | `<FormSection step={1} title="…">` |
| Texto largo (legal, blog) | `<Prose>` |

### Feedback

| Pattern | Primitive |
|---|---|
| Tip informativo en form | `<Callout variant="info">` |
| Advertencia bloqueante | `<Callout variant="warn">` |
| Éxito inline | `<Callout variant="success">` |
| Error inline | `<Callout variant="error">` |

### Iconos en cajas

| Pattern | Primitive |
|---|---|
| Icono dentro de cuadro redondeado coloreado | `<IconBox color="teal\|coral\|success\|warning\|error\|neutral" size="sm\|md\|lg\|xl">` |

### Botones

| Pattern | Primitive |
|---|---|
| CTA primario | `<Button variant="primary">` (teal) |
| CTA secundario | `<Button variant="secondary">` (coral) |
| CTA ghost light | `<Button variant="outline">` |
| CTA ghost sobre bg dark | `<Button variant="outline-light">` |
| CTA ghost coral outline | `<Button variant="coral-outline">` |
| Link-as-button | `<Button asChild><Link href="…">…</Link></Button>` |
| Solo icono | `<IconButton variant="primary\|secondary\|ghost\|subtle">` |

## Tokens rápidos

```
color: bg-teal bg-coral bg-sand text-ink text-ink-muted
       bg-score-low|mid|ok|high (+ -bg variants)
       bg-success|warning|error|info (con /10 /15 /20 alpha)
radius: rounded-field(12) rounded-card(16) rounded-hero(24) rounded-pill
shadow: shadow-card-sm shadow-card shadow-card-lg
        shadow-cta-teal shadow-cta-coral
motion: ease-out-expo  (timing dominante de la marca)
```

## Reglas (automatizadas via ESLint)

- ❌ Hex literals en `.tsx` → mover a `globals.css` o `tokens.ts`
- ❌ `style={{ fontSize: 14 }}` → usar clase `text-*`
- ❌ `bg-blue-50` / `text-red-500` / etc. → usar tokens semánticos (`bg-info/10`, `text-error`)
- ❌ `cubic-bezier(0.16, 1, 0.3, 1)` inline → usar `ease-out-expo`

Excepciones documentadas con pragma `/** @allow-hex */`: `tokens.ts`, `icons/*`, `LeafletMapInner`, `og/*`, gradientes de marca que no son mappeables.
