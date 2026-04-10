-- ============================================================
-- F-06 + F-03: audit_log table for sensitive actions.
--
-- Records:
--  - Admin ownership overrides on listings (F-06)
--  - User-initiated role flips tenant↔landlord (F-03)
--
-- Schema: actor_id (who did it), action (enum-like string),
-- target_type + target_id (what was changed), before/after as
-- JSONB (for provenance), created_at.
--
-- RLS: INSERT allowed to authenticated (so server actions can
-- write on behalf of any caller); SELECT is admin-only. No
-- UPDATE or DELETE policies — audit records are immutable.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  action      text NOT NULL,
  target_type text NOT NULL,
  target_id   uuid,
  before      jsonb,
  after       jsonb,
  metadata    jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Keep `actor_id` nullable after user deletion but enforce NOT NULL on write.
ALTER TABLE public.audit_log ALTER COLUMN actor_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS audit_log_actor_created_idx
  ON public.audit_log (actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_log_target_idx
  ON public.audit_log (target_type, target_id);
CREATE INDEX IF NOT EXISTS audit_log_action_idx
  ON public.audit_log (action);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can insert a row — server actions write on behalf
-- of the current user; RLS must allow it.
DROP POLICY IF EXISTS "audit_log self insert" ON public.audit_log;
CREATE POLICY "audit_log self insert"
  ON public.audit_log FOR INSERT TO authenticated
  WITH CHECK (actor_id = (select auth.uid()));

-- Only admins can read.
DROP POLICY IF EXISTS "audit_log admin read" ON public.audit_log;
CREATE POLICY "audit_log admin read"
  ON public.audit_log FOR SELECT TO authenticated
  USING ((select is_admin()));
