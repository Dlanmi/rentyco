-- Phase 1: Add accepts_renty_score flag for marketplace filter
ALTER TABLE listings
  ADD COLUMN accepts_renty_score BOOLEAN NOT NULL DEFAULT false;

-- Partial index: only true rows matter for filtered queries
CREATE INDEX idx_listings_accepts_renty_score
  ON listings (accepts_renty_score)
  WHERE accepts_renty_score = true;

COMMENT ON COLUMN listings.accepts_renty_score IS
  'Set by admin when landlord does not require codeudor. Controls badge visibility and filter.';
