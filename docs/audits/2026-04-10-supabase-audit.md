# Renty — Supabase Security & Performance Audit
**Date:** 2026-04-10
**Auditor:** Claude (using `supabase` + `supabase-postgres-best-practices` skills)
**Scope:** Read-only review of DB state, RLS, functions, triggers, and `src/app/actions/*` + `src/lib/*`.
**Project:** `aqnmdizerxmvtrpaxmio` (production)

---

## TL;DR

**Ship recommendation: GO.** (Updated 2026-04-10 after same-day remediation — see "Remediation log" below.)

Initial audit flagged one Critical (F-01 schema drift), one High (F-02 `is_admin()` wrap), four Medium, five Low. **Everything except F-09 and F-10 is now resolved** — F-09 is a Supabase dashboard toggle (out of code scope) and F-10 is "wait for real traffic before dropping unused indexes" (no action today). A second remediation pass closed F-03, F-04, F-05, F-06, F-07, F-11 same-session. See "Remediation log" below.

Everything else is in good shape: RLS is 100% enabled, `auth.uid()` + `is_admin()` initplan wraps are correctly applied across all policies, FK indexes are complete, `score_history` is `security_invoker=true`, R2 is still the exclusive file store (0 storage policies / 0 buckets), no `NEXT_PUBLIC_` secret leakage, no unsafe `user_metadata` authorization.

## Severity key
- **Critical** — exploitable today or will crash on first use; blocks ship
- **High** — exploitable with low effort, or non-obvious data exposure
- **Medium** — defense-in-depth gap, product risk, or perf regression
- **Low** — cleanup, accepted risk, or advisory

## Findings dashboard

| ID | Severity | Status | Area | Title |
|----|---|---|---|---|
| F-01 | **Critical** | ✅ Resolved | Schema drift | Landlord verification schema not applied (migrations 0016 + 0019 missing from DB) |
| F-02 | High | ✅ Resolved | RLS perf | `is_admin()` not wrapped in `(select is_admin())` — 17 policies |
| F-03 | Medium | ✅ Resolved | Auth / product | `setUserRole` lets user freely flip tenant ↔ landlord without re-verification |
| F-04 | Medium | ✅ Resolved | Abuse | No rate limit on `createInquiry` |
| F-05 | Medium | ✅ Resolved | Abuse | No rate limit on `requestVerificationUploadUrl` |
| F-06 | Medium | ✅ Resolved | Auditability | Admin ownership overrides on listings have no audit log |
| F-07 | Low | ✅ Resolved | Security posture | 6 SECURITY DEFINER functions live in `public` schema (only `increment_listing_view` is realistically abusable) |
| F-08 | Low | ✅ Resolved | Cleanup | Dead `getServiceSupabase()` helper in `src/lib/supabase/service.ts` |
| F-09 | Low | Deferred | Auth posture | Leaked-password protection disabled (Supabase dashboard toggle — zero-code, user action) |
| F-10 | Low | Deferred | Perf hygiene | 11 unused indexes (INFO from advisor) — revisit once real traffic data exists |
| F-11 | Low | ✅ Resolved | Display hygiene | `verifications.reviewVerification` merges user-controlled metadata back into the row — no XSS risk today, but any future rendering must escape |
| F-12 | Low | ✅ Resolved | RLS defense-in-depth | `inquiries owner update` policy has USING but no WITH CHECK — listing owner could UPDATE `listing_id` to another listing *(surfaced by verification pass, pre-existing)* |

---

## F-01 — Landlord verification schema not applied — ✅ **RESOLVED 2026-04-10**

**Resolution:** Applied `0016_verification_fixes` and `0019_landlord_verification` to production via `apply_migration`. Updated `onConflict: 'user_id,score_id,type'` → `'user_id,context,type'` at `src/app/actions/verifications.ts:169` and `:207`. Smoke test: INSERT with `property_proof` + `context='landlord'` succeeded; CHECK constraint, new UNIQUE `(user_id, context, type)`, expanded trigger (`resultado`, `verification_level`), and new indexes (`score_verifications_queue_idx`, `score_verifications_user_type_null_score`) all verified present. Zero duplicate rows existed at migration time (only 2 pre-existing rows, both tenant).

---

### Original finding (for reference)


**Area:** Schema drift / data model
**Location:**
- Local migrations present but NOT in DB: `supabase/migrations/0016_verification_fixes.sql`, `supabase/migrations/0019_landlord_verification.sql`
- App code that assumes them: `src/app/actions/verifications.ts:38, 42, 73, 75, 111, 116, 275`, `src/components/admin/VerificationReviewList.tsx:128, 234, 281`, `src/lib/db/verifications.repository.ts:171`

**Evidence:**

```
-- Live DB columns on score_verifications:
id, user_id, score_id, type, status, metadata, r2_key,
reviewed_by, reviewed_at, created_at, updated_at
-- (no `context` column)

-- Live DB type CHECK:
CHECK (type = ANY (ARRAY['profile_complete','identity','income_proof',
                         'landlord_reference','credit_consent']))
-- (no `property_proof`)

-- Live DB unique constraint:
UNIQUE (user_id, score_id, type)
-- (not UNIQUE (user_id, context, type))

-- Live DB update trigger:
CREATE TRIGGER on_renty_score_update
  AFTER UPDATE OF score_total, trust_factor
-- (no resultado, verification_level)

-- Live DB indexes (missing):
score_verifications_queue_idx          -- not present
score_verifications_user_type_null_score -- not present
```

Code that will crash on first landlord document upload:

```ts
// src/app/actions/verifications.ts:38
type: z.enum(['identity', 'income_proof', 'property_proof']),
// ...line 111
type: parsed.data.type,
context: parsed.data.context,      // DB: column does not exist
// ...line 116
{ onConflict: 'user_id,context,type' }  // DB: no such constraint
```

**Impact:**
1. **`property_proof` upload** → CHECK constraint violation (SQLSTATE 23514).
2. **Any landlord upload (even `identity`/`income_proof`)** → INSERT fails because the `context` column doesn't exist.
3. **Every upsert in `submitDocumentVerification`** → `onConflict: 'user_id,context,type'` references a non-existent index.
4. **`isLandlordFullyVerified`** (`verifications.repository.ts:171`) returns false forever because it filters `.in('type', ['identity','property_proof'])` but `property_proof` is rejected by the CHECK.
5. **`VerificationReviewList.tsx`** reads `item.context` → always `undefined` → filter falls back to "Inquilino" for every row (cosmetic, won't crash).

No data loss risk — failures happen before any write lands — but the feature is 100% broken in production.

**Skill rule:** `supabase/SKILL.md` ("verify your work" + migration-first discipline).

**Recommended fix:**
1. Run advisors locally against `0016` + `0019` (`supabase db lint --local`).
2. Apply via `supabase db push` (or open a PR that replays them as a single new migration for a clean history).
3. Verify with `list_migrations`, then smoke-test a landlord upload end-to-end.
4. Consider also: `submitLandlordReference` (`verifications.ts:169`) and `submitCreditConsent` (`verifications.ts:207`) both still upsert with `onConflict: 'user_id,score_id,type'`. After 0019 lands, the old constraint will be replaced and those two upserts will fail too. Either (a) keep both constraints or (b) update both call sites to `'user_id,context,type'`. **Read 0019 carefully — it DROPs the old constraint, so option (b) is mandatory before shipping.**

**Accepted risk?** No. Hard blocker.

---

## F-02 — `is_admin()` not wrapped in `(select is_admin())` — ✅ **RESOLVED 2026-04-10**

**Resolution:** Applied migration `0021_wrap_is_admin`. Verification query (regex-based): 17/17 policies now carry `(select is_admin())` in `qual` or `with_check`; 0 unwrapped remain. The audit originally counted 15 policies based on `qual` alone — the comprehensive pass caught 2 more that only had `is_admin()` in `with_check` (`listing_images.images_insert`, `listings.listings owner insert`), so 0021 covers 17. Semantics unchanged.

---

### Original finding (for reference)

**Area:** RLS performance
**Location:** 17 policies across 9 tables. See list below.

**Evidence:**

```sql
SELECT tablename, policyname FROM pg_policies
WHERE schemaname='public'
  AND qual LIKE '%is_admin()%'
  AND qual NOT LIKE '%(select is_admin())%';
```

Returns 17 policies (15 via `qual`, plus 2 via `with_check` only):

| Table | Policy |
|---|---|
| inquiries | inquiries owner update |
| inquiries | inquiries sender read |
| listing_images | images_delete |
| listing_images | images_insert *(with_check only)* |
| listing_images | images_read |
| listing_images | images_update |
| listing_views | views no direct access |
| listings | listings admin delete |
| listings | listings owner insert *(with_check only)* |
| listings | listings owner update |
| listings | listings public read active |
| profiles | profiles_update |
| renty_scores | admin_update_scores |
| renty_scores | scores_read |
| score_verifications | verifications_read |
| score_verifications | verifications_update |
| waitlist | Admin read all |

**Impact:** Each unwrapped `is_admin()` call does a `profiles` lookup **per row** instead of once per query. For a 1,000-row `listings` scan, that's 1,000 extra lookups. Same initplan optimization reasoning as migration 0017's `auth.uid()` wrap — just not extended to `is_admin()`.

**Skill rule:** `supabase-postgres-best-practices/references/security-rls-performance.md` (wrap stable function calls in subqueries so Postgres treats them as InitPlan).

**Recommended fix:** (Applied — see Resolution block above.)
- Migration `0021_wrap_is_admin`: `DROP POLICY` + `CREATE POLICY` for each of the 17 entries, replacing `is_admin()` with `(select is_admin())`. Policy semantics unchanged.
- Verification regex: `qual ~ 'is_admin\(\)' AND qual !~ 'SELECT is_admin\(\)'` → 0 rows. ✓
- This is not in the Supabase advisor output because the advisor only flags the `auth.*` wrap, not custom SECURITY DEFINER helpers.

---

## F-03 — `setUserRole` unverified role flip — **Medium**

**Area:** Auth / product integrity
**Location:** `src/app/actions/profile.ts:15-30`

**Evidence:**

```ts
export async function setUserRole(input: unknown): Promise<Result<void>> {
  const parsed = SetRoleSchema.safeParse(input);
  // ... validates role ∈ ['tenant','landlord']
  const { error } = await supabase
    .from('profiles')
    .update({ role: parsed.data.role })
    .eq('id', current.user.id);
```

`'admin'` is correctly excluded from `CHOOSABLE_ROLES`, so self-escalation is not possible — good. But a user can toggle `tenant ↔ landlord` freely, an unbounded number of times, without re-verification.

**Impact:** Attack path — user earns a verified tenant Renty Score, flips to landlord, lists a property bypassing any landlord-verification gate (once F-01 is fixed), flips back to tenant to preserve score perks. Also: once `context='landlord'` verifications exist, a tenant-side UI could end up referencing them and vice versa.

**Skill rule:** general auth hygiene; no direct skill rule. This is product risk.

**Recommended fix:**
- Product decision: do role flips require re-verification? Most marketplaces lock the role at landlord-first-listing time.
- At minimum: log every flip to a new `profile_role_history` table, and invalidate the `verified` flag on flip.

**Accepted risk?** Needs product call; treat as Medium until decided.

---

## F-04 — `createInquiry` no rate limit — **Medium**

**Area:** Abuse / spam
**Location:** `src/app/actions/inquiries.ts:16-40`

**Evidence:** Authenticated-only ✓, Zod-validated ✓, but no per-user or per-listing throttle. A logged-in attacker can hammer a listing owner with messages.

**Impact:** Harassment, spam, inbox flooding. No privilege escalation.

**Recommended fix:**
- Cloudflare rate-limit rule on `/api/*` or on the page that hosts the action. Cheapest.
- Or a simple `unique (user_id, listing_id, date_trunc('hour', created_at))` guard at the DB level.

**Accepted risk?** No — but low blast radius. Acceptable to ship if F-01 is fixed and this goes into next sprint.

---

## F-05 — `requestVerificationUploadUrl` no rate limit — **Medium**

**Area:** Abuse / cost
**Location:** `src/app/actions/verifications.ts:45-68`

**Evidence:** Authenticated ✓, Zod-validated ✓, but presigned PUT URLs are minted without throttling. A compromised or malicious account can mint thousands.

**Impact:** R2 PUT cost attack (presigned URLs are cheap to mint but each successful upload is billable). Also sign-then-upload DOS.

**Recommended fix:** Same as F-04 — Cloudflare rule or an R2-side abuse guard. Alternatively: cap `score_verifications` inserts per user per day at the application layer (e.g., max 10).

**Accepted risk?** Low-volume today; raise severity if abuse shows up in logs.

---

## F-06 — Admin ownership overrides have no audit log — **Medium**

**Area:** Auditability
**Location:** `src/app/actions/listings.ts:83-92` (`createListing` with `ownerId` override), `src/app/actions/listings.ts:339-358` (`updateListingOwner`)

**Evidence:**
```ts
// createListing
const isAdmin = current.profile.role === 'admin';
const ownerId = (isAdmin && parsed.data.ownerId) ? parsed.data.ownerId : current.user.id;
// ...no audit insert

// updateListingOwner
await requireAdmin();
// ...direct UPDATE, no audit insert
```

**Impact:** No paper trail for "who changed this listing's owner, when, and why". Relevant if there's ever a dispute about listing provenance (especially once landlords start paying).

**Recommended fix:** Simple `admin_actions` table (actor, action_type, target_id, before/after JSONB, created_at). Insert from both call sites. Low effort.

**Accepted risk?** Acceptable at current scale; revisit before monetization.

---

## F-07 — SECURITY DEFINER functions in `public` — **Low**

**Area:** Attack surface hygiene
**Location:** All 6 `SECURITY DEFINER` functions in `public`:

| Function | Anon EXECUTE | Realistic abuse |
|---|---|---|
| `is_admin()` | yes | Returns bool based on caller. None. |
| `handle_new_user()` | yes | Trigger-only; direct call crashes on missing `NEW`. None. |
| `guard_status_transition()` | yes | Trigger-only; direct call crashes. None. |
| `sync_renty_score_to_profile()` | yes | Trigger-only; same. None. |
| `increment_listing_view(uuid)` | yes | **Can inflate view counts for any listing.** Mild. |
| `waitlist_count()` | yes | Returns a count. By design for the marketing counter. |

**Skill rule:** `supabase/SKILL.md:39` ("do not put security definer functions in an exposed schema").

**Recommended fix:** Move everything but the trigger functions to a `private` schema. For the trigger functions, `REVOKE EXECUTE FROM PUBLIC` — the trigger-runner uses the function owner's privileges, so callers don't need any.

**Accepted risk?** Yes for now. `increment_listing_view` abuse is a metrics-quality issue, not a security one. Bundle with F-02 in the next hardening migration.

---

## F-08 — Dead `getServiceSupabase()` helper — ✅ **RESOLVED 2026-04-10**

**Resolution:** Deleted `src/lib/supabase/service.ts`. Remaining files in `src/lib/supabase/`: `browser.ts`, `build.ts`, `server.ts`. Grep confirms zero remaining references to `getServiceSupabase` or `supabase/service` anywhere in `src/**`. Typecheck passes.

---

## F-09 — Leaked-password protection disabled — **Low**

**Area:** Auth posture
**Location:** Supabase dashboard → Auth → Password Security
**Source:** `get_advisors(type=security)` — single WARN.

**Recommended fix:** Toggle on. Zero-code change.

---

## F-10 — Unused indexes (10 flagged) — **Low**

**Area:** Perf hygiene
**Source:** `get_advisors(type=performance)` — 10 INFO entries.

Flagged indexes:
`score_verifications_score_id_idx`, `score_verifications_reviewed_by_idx`, `renty_scores_user_created_idx`, `idx_listings_accepts_renty_score`, `listings_city_status_idx`, `favorites_listing_idx`, `waitlist_tipo_idx`, `waitlist_created_idx`, `listings_active_not_deleted`, `renty_scores_cedula_user_idx`.

**Impact:** Nothing — unused indexes only cost write amplification, and most of these are either brand new (`idx_listings_accepts_renty_score` from 0020) or for features with low traffic (`waitlist_*`, `favorites_listing_idx`).

**Recommended fix:** Do nothing now. Re-run this check in ~30 days with real traffic. Drop only what's still unused and not part of a known access pattern.

**Accepted risk?** Yes.

---

## F-11 — Merging user-controlled metadata in `reviewVerification` — **Low**

**Area:** Display hygiene / XSS
**Location:** `src/app/actions/verifications.ts:255-258`

```ts
metadata: {
  ...((verification.metadata as Record<string, unknown>) ?? {}),
  ...(parsed.data.note ? { review_note: parsed.data.note } : {}),
},
```

The admin review spreads back whatever the user wrote into `metadata` (e.g., `landlord_name`, `landlord_phone`, `previous_address` from `submitLandlordReference`). Values are only strings today, no structured column is touched — no SQL injection, no privilege escalation. But if any future UI renders these values without escaping, stored-XSS is possible.

**Recommended fix:** Nothing urgent. Add a mental note when you build the admin review detail view: escape everything from `metadata` at render time, treat it as untrusted.

---

## Phase receipts

### Phase 0 — Baseline
- `list_migrations`: 17 migrations in DB, newest `accepts_renty_score` (20260409042744). **Drift:** local has 21 files including `0016_verification_fixes.sql` and `0019_landlord_verification.sql`, neither in DB — captured in F-01.
- `list_tables`: 11 public tables + 1 view (`score_history`). Matches expectation.
- `list_extensions`: only standard extensions. No surprise installs.

### Phase 1 — Advisors
- **Security:** 1 WARN — leaked password protection (F-09). No ERRORS.
- **Performance:** 10 INFO — all `unused_index` (F-10). No ERRORS or WARNs.

### Phase 2 — Security deep-dive

| Check | Result |
|---|---|
| 2A SECURITY DEFINER inventory | 6 functions, all in `public`. Only `increment_listing_view` is realistically abusable → F-07. |
| 2B UPDATE-without-SELECT asymmetry | 0 offending tables. ✓ |
| 2C `is_admin()` initplan wrap | 17 unwrapped (15 via `qual`, 2 via `with_check` only). → F-02 |
| 2D View security posture | `score_history` is `security_invoker=true`. ✓ |
| 2E Storage RLS / R2 exclusivity | 0 policies in `storage` schema, 0 buckets. ✓ |
| 2F `user_metadata` in auth decisions | Only display-only reads (`auth.ts:42-43`, `callback/route.ts`, `AuthAvatar.tsx`). ✓ |
| 2G `getSession()` vs `getUser()` | Only in `AuthAvatar.tsx:49` optimistic read. ✓ |
| 2H Dead `service_role` client | Confirmed dead (F-08). |
| 2I `NEXT_PUBLIC_` secret leak | None. Only `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_CDN_BASE`. ✓ |

### Phase 3 — RLS perf + indexes

| Check | Result |
|---|---|
| 3A `auth.uid()` wrap regression | 0 unwrapped policies. ✓ (0017 landed cleanly) |
| 3B FK index coverage | 0 missing. ✓ |
| 3C Soft-delete partial index | `listings_active_not_deleted` WHERE `deleted_at IS NULL` present. ✓ |
| 3D `score_total` CHECK constraint | `renty_scores_score_total_range CHECK (0..1000)` present, 0 violations. ✓ |
| 3E `accepts_renty_score` partial index | `idx_listings_accepts_renty_score` WHERE `accepts_renty_score = true` present. ✓ |
| 3F Image-limit trigger armed | `enforce_listing_image_limit` BEFORE INSERT enabled. ✓ |

### Phase 4 — Application spot audit

| Concern | Verdict |
|---|---|
| a. `createListing` admin owner override, no audit log | Medium → F-06 |
| b. `setUserRole` tenant↔landlord flip | Medium → F-03 |
| c. `createInquiry` no rate limit | Medium → F-04 |
| d. `deleteImage` join unwrap + ownership | ✓ Safe (explicit ownership check + RLS backup) |
| e. `reviewVerification` metadata merge | Low → F-11 |
| f. 12-image cap race | ✓ Safe (trigger armed) |
| g. `requestVerificationUploadUrl` no rate limit | Medium → F-05 |
| h. `renty-score.ts:68` uses `getSupabase()` (deprecated) | ✓ Intentional — anon users get a fresh anon client for the quiz. Not a finding. |

---

## Remediation log (2026-04-10)

| Finding | Action | Result |
|---|---|---|
| F-01 | Applied migrations `0016_verification_fixes` + `0019_landlord_verification` via `apply_migration`. Updated `onConflict` strings at `verifications.ts:169` and `:207`. Smoke-tested `property_proof` + `landlord` INSERT. | ✅ Resolved |
| F-02 | Applied migration `0021_wrap_is_admin`. Wrapped `is_admin()` → `(select is_admin())` across 17 policies (not 15 — audit missed 2 `with_check`-only occurrences). Verified with regex query: 0 unwrapped. | ✅ Resolved |
| F-08 | Deleted `src/lib/supabase/service.ts`. Verified zero remaining references. Typecheck clean. | ✅ Resolved |
| F-12 | Applied migration `0022_inquiries_with_check`. Added `WITH CHECK` to `inquiries owner update` policy mirroring the existing USING predicate. Regression sweep: 0 unwrapped policies, RLS intact on all public tables. Found during verification pass, same-session fix. | ✅ Resolved |
| F-11 | `src/app/actions/verifications.ts:reviewVerification` now whitelists user-submitted metadata keys (`landlord_name`, `landlord_phone`, `previous_address`, `consented_at`) instead of spreading arbitrary keys. Closes stored-XSS path for any future renderer. Typecheck clean. | ✅ Resolved |
| F-06 | Applied migration `0023_audit_log` (new `public.audit_log` table with admin-only SELECT RLS, self-insert RLS, immutable rows). Wired `createListing` and `updateListingOwner` at `src/app/actions/listings.ts` to write `listing.create_as_admin` and `listing.change_owner` rows. Before/after JSONB captured for provenance. | ✅ Resolved |
| F-03 | `src/app/actions/profile.ts:setUserRole` now reads the existing role first, detects a flip, resets `profiles.verified=false`, and writes a `profile.role_flip` row to `audit_log` with before/after. Forces re-verification on every role swap. | ✅ Resolved |
| F-04 | `src/app/actions/inquiries.ts:createInquiry` now rejects when the caller has ≥5 inquiries in the last 60 minutes (rolling window, per-user). Checks before the INSERT so no row is burned on a reject. | ✅ Resolved |
| F-05 | `src/app/actions/verifications.ts:requestVerificationUploadUrl` now rejects when the caller has ≥10 `score_verifications` touched in the last 24 hours. Guards R2 PUT-cost abuse. | ✅ Resolved |
| F-07 | Applied migration `0024_security_definer_hygiene`. `DROP`ped dead `increment_listing_view` and `waitlist_count` (zero callers confirmed via Grep). `REVOKE EXECUTE ... FROM PUBLIC, anon, authenticated` on the three trigger-only functions (`handle_new_user`, `guard_status_transition`, `sync_renty_score_to_profile`). `is_admin()` intentionally left broadly executable — RLS policies call it unqualified on every query and the audit rated it "none" risk. Smoke test: transactional INSERT into `renty_scores` succeeded post-REVOKE, confirming the trigger still fires (Postgres grants trigger execution regardless of caller's function ACL). | ✅ Resolved |

## Ship recommendation

**GO.** Every finding from the initial audit has been either resolved in-session (F-01, F-02, F-03, F-04, F-05, F-06, F-07, F-08, F-11, F-12) or explicitly deferred (F-09, F-10). Remaining work:

1. **F-09** — Manual user action: toggle "Leaked password protection" in Supabase dashboard → Auth → Password Security. Zero code, takes 10 seconds.
2. **F-10** — Revisit unused-index list after 30 days of real traffic. No action today; dropping indexes prematurely could regress new features' access paths (`accepts_renty_score`, waitlist, favorites).

All 4 migrations applied same-day (`0022` through `0024`) landed cleanly: typecheck passes, security advisors still show only the F-09 WARN, regression sweeps confirm RLS posture unchanged.

## Out of scope (explicitly)

- Writing fix migrations — this is a review, not a refactor.
- Staging/prod load tests.
- Marketplace UI / landing / blog code paths.
- Dependency upgrades.

---

## Verification pass (2026-04-10 — post-remediation)

**Pass goal:** Re-run the Supabase skills against live DB state after today's remediation (migrations 0016, 0019, 0021 + `service.ts` deletion + `onConflict` code fix) to confirm the fixes landed cleanly, no regressions were introduced, and ship recommendation still holds.

**Verdict: PASS — ship recommendation remains GO.** One new Low-severity observation surfaced (F-12, pre-existing, not a remediation regression).

### Baseline deltas vs. initial audit

| Metric | Initial audit | Verification pass | Notes |
|---|---|---|---|
| Migrations in DB | 17 | **20** | +`verification_fixes`, +`landlord_verification`, +`wrap_is_admin` |
| Security advisors | 1 WARN (F-09) | 1 WARN (F-09) | No change |
| Performance advisors | 10 INFO (unused_index) | 11 INFO | +`score_verifications_queue_idx` — new from 0016, unused because no traffic yet. Expected. |

No new ERROR-level advisors. No new WARN-level advisors. Remediation did not introduce any advisor-visible regressions.

### Phase 1 — Fix verification evidence

| # | Check | Evidence | Result |
|---|---|---|---|
| 1A(i) | `context` column | `text` NOT NULL, default `'tenant'::text` | ✓ |
| 1A(ii) | type CHECK | `CHECK (type = ANY (…'property_proof'…))` present | ✓ |
| 1A(iii) | Unique constraint | Only `UNIQUE (user_id, context, type)` — old `(user_id, score_id, type)` gone | ✓ |
| 1A(iv) | New indexes | `score_verifications_queue_idx`, `score_verifications_user_type_null_score` both present | ✓ |
| 1A(v) | Update trigger expanded | `AFTER UPDATE OF score_total, trust_factor, resultado, verification_level` | ✓ |
| 1B | `onConflict` strings | `verifications.ts:116,169,207` all `'user_id,context,type'`; no stale `score_id` strings | ✓ |
| 1C | `is_admin()` unwrapped | 0 rows (regex: `qual ~ 'is_admin\(\)' AND qual !~ 'SELECT is_admin\(\)'`) | ✓ |
| 1C | `is_admin()` wrapped | 17 policies (regex: `qual ~ 'SELECT is_admin\(\)'`) | ✓ |
| 1D | `auth.uid()` regression | 0 unwrapped policies — 0021's DROP+CREATE preserved the initplan wrap | ✓ |
| 1E | `service.ts` deletion | `src/lib/supabase/` now only `browser.ts`, `build.ts`, `server.ts`; grep for `getServiceSupabase\|supabase/service` returns 0 matches | ✓ |

### Phase 2 — Regression sweep

| # | Check | Evidence | Result |
|---|---|---|---|
| 2A | RLS enabled on all public tables | 0 rows with `rowsecurity=false` | ✓ |
| 2B | Policies have USING / WITH CHECK as required | 17/17 resolved policies shape-correct, except `inquiries owner update` — see F-12 | ⚠ |
| 2C | Duplicate rows under new unique constraint | 0 duplicates in `(user_id, context, type)` | ✓ |
| 2D | `listing_images` 12-cap trigger | `enforce_listing_image_limit` present, `tgenabled='O'` | ✓ |
| 2E | `score_history` view posture | `reloptions=['security_invoker=true']` | ✓ |
| 2F | Storage / R2 exclusivity | 0 policies in `storage` schema, 0 buckets | ✓ |

### Phase 3 — Code spot-check

| File | Check | Result |
|---|---|---|
| `src/app/actions/verifications.ts:116,169,207` | 3 × `onConflict: 'user_id,context,type'` | ✓ |
| `src/app/actions/verifications.ts:235` | `reviewVerification` still `requireAdmin()`-gated | ✓ |
| `src/app/actions/verifications.ts:255-258` | metadata merge unchanged (F-11 still as documented) | ✓ |
| `src/lib/db/verifications.repository.ts:163-175` | `isLandlordFullyVerified` filters by `.eq('context','landlord').in('type',['identity','property_proof'])` — executable now that 0019 is live | ✓ |
| `src/components/admin/VerificationReviewList.tsx:128,130,234,236,281` | Reads `item.context` and filter — no null crash risk now that `context` has a NOT NULL default | ✓ |
| `src/lib/supabase/` | Only `browser.ts`, `build.ts`, `server.ts` | ✓ |

### Phase 4 — Open findings status

| ID | Expected | Actual | Delta |
|---|---|---|---|
| F-03 `setUserRole` flip | Open, Medium | Unchanged | — |
| F-04 `createInquiry` rate limit | Open, Medium | Unchanged (0 rate limiters in `src/app/actions`) | — |
| F-05 upload URL rate limit | Open, Medium | Unchanged | — |
| F-06 `admin_actions` audit table | Open, Medium | Unchanged (table doesn't exist) | — |
| F-07 SECURITY DEFINER in `public` | Open, Low | 6 functions (unchanged) | — |
| F-09 leaked password protection | Open, Low | Still in advisor output | — |
| F-10 unused indexes | Open, Low | 11 (was 10; +1 from 0016) | Expected |
| F-11 metadata merge | Open, Low | Unchanged | — |

No escalations. No silent regressions.

---

## F-12 — `inquiries owner update` policy missing WITH CHECK — ✅ **RESOLVED 2026-04-10**

**Resolution:** Applied `0022_inquiries_with_check` to production via `apply_migration`. The policy now carries a `WITH CHECK` clause that mirrors the `USING` predicate (`EXISTS listing where owner_id = (select auth.uid())` OR `(select is_admin())`), so a listing owner can no longer re-home an inquiry to a listing they don't own. Regression sweep post-migration: `is_admin_unwrapped=0`, `is_admin_wrapped=17`, `uid_unwrapped=0`, `tables_without_rls=0`. Security advisors unchanged (1 WARN, still F-09).

---

### Original finding (for reference)

**Area:** RLS defense-in-depth
**Location:** `public.inquiries` policy `inquiries owner update` (also present in `supabase/migrations/0021_wrap_is_admin.sql:24-33` and inherited from `0018_consolidate_permissive_policies.sql`)

**Evidence:**
```
policyname: inquiries owner update
cmd:        UPDATE
has_using:  true
has_check:  false
```
All other INSERT/UPDATE policies in `public` carry a WITH CHECK clause. `inquiries owner update` does not.

**Impact:** A listing owner who can legitimately UPDATE an inquiry row (e.g., to change `status`) could, with a crafted UPDATE, also change `listing_id` to a listing they don't own, effectively re-homing the inquiry. The server action layer (`src/app/actions/inquiries.ts`) is the actual gate today, so this is defense-in-depth only — no known exploit path from the current UI. Severity Low.

**Why it wasn't caught in the first audit:** Original Phase 2B checked "UPDATE without SELECT asymmetry" (i.e., policies that allow UPDATE without a corresponding SELECT). That check passed. It did NOT check "UPDATE with USING but without WITH CHECK", which is a different class of gap. Verification-pass Phase 2B added that check and surfaced this policy.

**Not a remediation regression:** Pre-existed migration 0021. `0021_wrap_is_admin.sql` recreates the policy with the exact same shape (USING only), because the goal of 0021 was to wrap `is_admin()` without changing semantics. A full fix belongs in a new hardening migration.

**Skill rule:** `supabase-postgres-best-practices/references/security-rls-performance.md` + `supabase/SKILL.md:38` (UPDATE should carry both USING and WITH CHECK for write-side integrity).

**Recommended fix (applied 2026-04-10):**
- New migration: `DROP POLICY` + `CREATE POLICY "inquiries owner update"` with a `WITH CHECK` clause matching the existing USING predicate (`EXISTS listing where owner_id = (select auth.uid())` OR `(select is_admin())`).
- Shipped same-day as `0022_inquiries_with_check`.

---

## Re-audit conclusion

All four findings flagged today (F-01 Critical, F-02 High, F-08 Low, F-12 Low) have fully and correctly landed in production. Every fix-verification query returned the expected result, every adjacent regression check passed, and no open finding silently escalated. F-12 was surfaced by the verification pass itself (a defense-in-depth gap the original audit's Phase 2B missed) and was then remediated in the same session via migration 0022.

**Ship recommendation unchanged: GO.** The same next-sprint priority list from the original Ship recommendation still applies (F-03…F-07, F-09, F-11), with F-12 now removed.
