-- affiliates: Partner accounts enrolled in referral programs.
-- See README.md for full design rationale.

CREATE TYPE affiliate_status AS ENUM ('pending', 'active', 'suspended', 'rejected');

CREATE TABLE affiliates (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id             UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  user_id                UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referral_code          TEXT UNIQUE NOT NULL,
  coupon_code            TEXT,
  status                 affiliate_status NOT NULL DEFAULT 'pending',
  custom_commission_rate NUMERIC,
  payout_method          TEXT,
  payout_email           TEXT,
  metadata               JSONB DEFAULT '{}',
  referred_by            UUID REFERENCES affiliates(id) ON DELETE SET NULL,
  approved_at            TIMESTAMPTZ,
  suspended_at           TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (program_id, user_id)
);

CREATE INDEX idx_affiliates_user_id ON affiliates (user_id);
CREATE INDEX idx_affiliates_status ON affiliates (status);
CREATE INDEX idx_affiliates_referred_by ON affiliates (referred_by);
