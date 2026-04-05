# RENTY — Brand & Strategy Decisions
## Based on research from 4 independent agents (April 2026)

---

## POSITIONING

**Single most defensible position:** Renty is the first platform that measures rental trustworthiness by behavior, not wealth. While FincaRaíz and MetroCuadrado are classifieds (no transaction layer), and Houm focuses on property management for landlords, nobody is building a *tenant reputation system* that unlocks access for the 57% of Colombian renters stuck in verbal/informal contracts.

**Primary user archetype:** María, 34, lives in estrato 3 in Bogotá. Works in a small business (informal or semi-formal). Has paid rent on time for 8+ years but has no written contract, no codeudor with property, and is reported in DataCrédito for a small old debt. When she tries to move, she gets rejected everywhere. She has Nequi, uses WhatsApp, and is tired of the system treating her like a risk.

**Core emotional promise:** "Tu historial habla por ti" — Your history speaks for you.

**Tagline options:**
1. "Arrienda con tu historial, no con el de otros" (Rent with your history, not someone else's)
2. "Tu pago puntual es tu mejor garantía" (Your on-time payment is your best guarantee)  
3. "El arriendo sin barreras" (Renting without barriers) ← SELECTED: simple, clear, aspirational

**Brand feel:** Like Nubank meets a warm Colombian neighborhood. Modern tech that feels human. Trustworthy but not corporate. Accessible but not cheap. Think: a friend who happens to be really good with technology helping you find a home.

**Must NOT feel like:** A traditional inmobiliaria. A bank. A government website. A Silicon Valley startup. Cold. Complicated. Exclusionary.

---

## VOICE (Colombian Spanish)

**4 principles:**
1. **Directo** — Say it simply. No jargon, no legal-speak.
   - ✅ "Así funciona" / ❌ "A continuación detallamos el proceso"
2. **Cercano** — Talk like a neighbor, not a corporation.
   - ✅ "Sabemos lo difícil que es" / ❌ "Entendemos la problemática del sector"  
3. **Empoderador** — Make the user feel capable, not pitied.
   - ✅ "Tu historial vale" / ❌ "Te ayudamos porque no tienes codeudor"
4. **Honesto** — Real numbers, real stories, no hype.
   - ✅ "57 de cada 100 contratos son verbales" / ❌ "Millones de colombianos sufren"

**Banned words:** trámite engorroso, problemática, solución integral, innovador, disruptivo, líder del mercado, cutting-edge, revolucionario

---

## DESIGN SYSTEM

**Colors:**
- Primary: Deep Teal #0D6B58 (trust + growth, distinctive vs. competitor blue/red)
- Primary Light: #E8F5F0
- Secondary: Warm Coral #E8634A (energy, CTAs, accent)
- Background: Warm Sand #FAF7F2
- Background Alt: #F0EDE5
- Surface: #FFFFFF
- Text Primary: #1C1917 (warm near-black)
- Text Secondary: #57534E
- Text Muted: #A8A29E
- Border: #E7E5E4
- Success: #16A34A
- Warning: #F59E0B
- Dark mode bg: #1C1917
- Dark mode surface: #292524

**Typography:**
- Headings: Plus Jakarta Sans (700, 600)
- Body: DM Sans (400, 500)
- Accent/Hero: DM Serif Display (400)
- Mono/Stats: JetBrains Mono (500)

**Spacing:** 4px base, scale: 4/8/12/16/20/24/32/40/48/64/80/96/120/160

**Border radius:** 8px default, 12px cards, 16px large cards, 9999px pills

**Animations:**
- Scroll reveals: 0.6s, ease: power2.out, y: 24px
- Stagger: 0.1-0.15s between items
- Counters: 1.5s, power2.out
- Hover: 0.2s transform, 0.3s colors
- All behind gsap.matchMedia() + prefers-reduced-motion

---

## MARKET DATA FOR COPY (all sourced)

| Stat | Value | Source |
|------|-------|--------|
| Hogares arrendando | 7.3 millones (40.3%) | DANE/Portafolio |
| Mercado total | COP $63 billones/año | Fedelonjas |
| Contratos verbales | 57 de cada 100 | Fedelonjas |
| Verbales en estrato 1-3 | 95% | Fedelonjas |
| Empleo informal | 55.8% (12.6M) | DANE |
| Venezolanos en Colombia | 2.85 millones | Migración Colombia |
| Venezolanos que arriendan | 92.4% | BID |
| Discriminación migrantes | 24.5% menos elegidos | BID |
| Tiempo para arrendar Bogotá | 3.9 meses promedio | CienCuadras |
| Renta promedio Bogotá | COP $1,770,000 | Infobae |
| Usuarios Nequi | 22 millones | ValoraAnalitik |
| Crecimiento transferencias digitales | +231% H2 2024 | FintechNews |

---

## SITE ARCHITECTURE

1. **/** — Home (landing, full story, waitlist CTA)
2. **/como-funciona** — How it works (detailed process)
3. **/inquilinos** — For renters
4. **/arrendadores** — For landlords  
5. **/renty-score** — The scoring system explained
6. **/blog** — Blog index with category filter
7. **/blog/[slug]** — Individual post
8. **/lista-de-espera** — Dedicated waitlist page
9. **/nosotros** — About/team
10. **/legal/terminos** — Terms of service
11. **/legal/privacidad** — Privacy policy (Ley 1581 compliant)
12. **/legal/datos** — Data treatment policy

---

## COMPETITOR GAPS TO EXPLOIT

- FincaRaíz/MetroCuadrado: Pure classifieds, no tenant scoring, no transaction layer, no guarantee alternative
- Houm: Focused on landlord management, not tenant empowerment
- Aptuno: Low growth, survival mode
- Nobody is building for the 57% informal contract segment
- Nobody has a QuintoAndar-style guarantee replacement for Colombia
- QuintoAndar proved the model works at $5.1B valuation — but they can't expand to Colombia easily (regulatory)
