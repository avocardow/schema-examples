-- promo_codes: Discount codes applicable to event ticket purchases.
-- See README.md for full design rationale.

CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');

CREATE TABLE promo_codes (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            UUID NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  code                TEXT NOT NULL,
  discount_type       discount_type NOT NULL,
  discount_value      INTEGER NOT NULL,
  currency            TEXT,
  max_uses            INTEGER,
  times_used          INTEGER NOT NULL DEFAULT 0,
  max_uses_per_order  INTEGER NOT NULL DEFAULT 1,
  valid_from          TIMESTAMPTZ,
  valid_until         TIMESTAMPTZ,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, code)
);

CREATE INDEX idx_promo_codes_is_active ON promo_codes (is_active);
