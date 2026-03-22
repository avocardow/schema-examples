-- tax_rates: Tax rates by country and region, with support for compound taxes and category overrides.
-- See README.md for full design rationale.

CREATE TABLE tax_rates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  country         TEXT NOT NULL,
  region          TEXT,
  rate            NUMERIC NOT NULL,
  category        TEXT,
  is_compound     BOOLEAN NOT NULL DEFAULT FALSE,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  priority        INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tax_rates_country_region ON tax_rates (country, region);
CREATE INDEX idx_tax_rates_category ON tax_rates (category);
CREATE INDEX idx_tax_rates_is_active ON tax_rates (is_active);
