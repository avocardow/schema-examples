-- locale_settings: Locale-specific formatting preferences (dates, numbers, currency).
-- See README.md for full design rationale.

CREATE TABLE locale_settings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale_id           UUID UNIQUE NOT NULL REFERENCES locales(id) ON DELETE CASCADE,
  date_format         TEXT,
  time_format         TEXT,
  number_format       TEXT,
  currency_code       TEXT,
  currency_symbol     TEXT,
  first_day_of_week   INTEGER NOT NULL DEFAULT 1,
  measurement_system  TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
