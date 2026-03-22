-- locales: Supported languages/regions with directionality, plural rules, and enable state.
-- See README.md for full design rationale.

CREATE TYPE text_direction AS ENUM ('ltr', 'rtl');

CREATE TABLE locales (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  native_name     TEXT,
  text_direction  text_direction NOT NULL DEFAULT 'ltr',
  script          TEXT,
  plural_rule     TEXT,
  plural_forms    INTEGER NOT NULL DEFAULT 2,
  is_default      BOOLEAN NOT NULL DEFAULT FALSE,
  is_enabled      BOOLEAN NOT NULL DEFAULT TRUE,
  date_format     TEXT,
  time_format     TEXT,
  number_format   TEXT,
  currency_code   TEXT,
  currency_symbol TEXT,
  first_day_of_week INTEGER NOT NULL DEFAULT 1,
  measurement_system TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_locales_is_enabled ON locales (is_enabled);
