-- earning_types: Classification of earning categories for payroll processing.
-- See README.md for full design rationale.

CREATE TYPE earning_category AS ENUM (
  'regular',
  'overtime',
  'bonus',
  'commission',
  'reimbursement',
  'other'
);

CREATE TABLE earning_types (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  code          TEXT NOT NULL UNIQUE,
  category      earning_category NOT NULL,
  is_taxable    BOOLEAN NOT NULL DEFAULT TRUE,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  description   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_earning_types_category ON earning_types (category);
CREATE INDEX idx_earning_types_is_active ON earning_types (is_active);
