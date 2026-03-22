-- currencies: Supported currencies with exchange rates and display formatting.
-- See README.md for full design rationale.

CREATE TABLE currencies (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  symbol          TEXT NOT NULL,
  decimal_places  INTEGER NOT NULL DEFAULT 2,
  exchange_rate   NUMERIC NOT NULL DEFAULT 1.0,
  is_base         BOOLEAN NOT NULL DEFAULT FALSE,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_currencies_is_active ON currencies (is_active);
