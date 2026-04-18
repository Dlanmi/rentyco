---
name: renty-design
description: Use this skill to generate well-branded interfaces and assets for Renty (the Colombian rental-trust platform "El arriendo sin barreras"), either for production or throwaway prototypes, mocks, decks, and marketing artifacts. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill first — it contains the brand positioning, content voice, visual foundations, iconography rules, and an index of every other file.

Then explore the other available files:

- `colors_and_type.css` — the single import that sets up all tokens + base typography. Import this in any artifact.
- `fonts/` — DM Sans Regular/Bold + DM Serif Display TTFs (self-hosted).
- `assets/` — logos (wordmark, white wordmark, square mark, favicon), Colombia flag. Copy these into artifacts; do **not** redraw them.
- `preview/` — atomic design-system cards, one per token or component specimen. Good reference for "what should a Badge look like again?"
- `ui_kits/landing/` — marketing site kit: Navbar, Hero, Problem stats, 4-step Steps, Score (dark panel + radial gauge), Testimonial, Landlords, Waitlist, Footer.
- `ui_kits/app/` — product kit: marketplace grid + filter bar + listing card, score wizard + result, dashboard.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out (fonts, logos, icons) into the artifact's folder, link `colors_and_type.css`, and write static HTML files for the user to view.

If working on production code, copy the assets and read the rules here to become an expert in designing with the Renty brand. The upstream repo is `Dlanmi/rentyco` — use it as a source of truth for any component behavior question the DS doesn't cover.

**Language**: all user-facing copy is **Colombian Spanish, tú form, sentence case**. Never English in UI, never **usted**, never title case for headlines.

**Colors at a glance**: teal `#0D6B58` primary, coral `#E8634A` accent, sand `#FAF7F2` background, warm ink `#1C1917` text. Never pure black. Never pure white as page background (sand is the canvas; white is reserved for cards).

**Type at a glance**: DM Serif Display for editorial display headlines, DM Sans for everything UI/body, JetBrains Mono for eyebrows + stats + source citations. The mono eyebrow (`UPPERCASE 11px 0.12em tracking, teal or coral`) is the signature Renty detail — use it above every section H2.

If the user invokes this skill without any other guidance, ask them what they want to build or design (a landing section? a listing card? a slide? a pitch deck? a full prototype?), ask some scoping questions (variation count, target surface, scope of interaction), and then act as an expert Renty designer who outputs HTML artifacts *or* production code, depending on the need.
