-- shipping_zones: Geographic zones used to determine shipping rates and delivery options.
-- See README.md for full design rationale.

CREATE TABLE shipping_zones (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  countries       TEXT[] NOT NULL,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shipping_zones_is_active ON shipping_zones (is_active);
