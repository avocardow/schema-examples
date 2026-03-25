-- coupons: Discount codes with configurable duration and redemption limits.
-- See README.md for full design rationale.

CREATE TYPE discount_type AS ENUM (
  'percentage', 'fixed_amount'
);

CREATE TYPE coupon_duration AS ENUM (
  'once', 'repeating', 'forever'
);

CREATE TABLE coupons (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code               TEXT UNIQUE,
  name               TEXT NOT NULL,
  discount_type      discount_type NOT NULL,
  discount_value     INTEGER NOT NULL,
  currency           TEXT,
  duration           coupon_duration NOT NULL DEFAULT 'once',
  duration_in_months INTEGER,
  max_redemptions    INTEGER,
  times_redeemed     INTEGER NOT NULL DEFAULT 0,
  is_active          BOOLEAN NOT NULL DEFAULT TRUE,
  valid_from         TIMESTAMPTZ,
  valid_until        TIMESTAMPTZ,
  metadata           JSONB,
  provider_type      TEXT,
  provider_id        TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coupons_is_active ON coupons (is_active);
CREATE INDEX idx_coupons_provider ON coupons (provider_type, provider_id);
