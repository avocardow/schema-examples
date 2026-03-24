-- companies: Organizations that contacts belong to, with address and firmographic data.
-- See README.md for full design rationale.

CREATE TABLE companies (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  domain          TEXT UNIQUE,
  industry        TEXT,
  employee_count  INTEGER,
  annual_revenue  NUMERIC,
  phone           TEXT,
  address_street  TEXT,
  address_city    TEXT,
  address_state   TEXT,
  address_country TEXT,
  address_zip     TEXT,
  website         TEXT,
  description     TEXT,
  owner_id        UUID REFERENCES users (id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_companies_owner_id ON companies (owner_id);
CREATE INDEX idx_companies_industry ON companies (industry);
