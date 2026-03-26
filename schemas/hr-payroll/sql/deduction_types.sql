-- deduction_types: Catalog of payroll deduction types with pre-tax classification.
-- See README.md for full design rationale.

CREATE TYPE deduction_category AS ENUM (
  'tax', 'retirement', 'insurance', 'garnishment', 'other'
);

CREATE TABLE deduction_types (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  code          TEXT NOT NULL UNIQUE,
  category      deduction_category NOT NULL,
  is_pretax     BOOLEAN NOT NULL DEFAULT FALSE,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  description   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deduction_types_category ON deduction_types (category);
CREATE INDEX idx_deduction_types_is_active ON deduction_types (is_active);
